from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Cookie, Response, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import razorpay
from passlib.context import CryptContext
import httpx
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay configuration
razorpay_key_id = os.environ.get('RAZORPAY_KEY_ID', '')
razorpay_key_secret = os.environ.get('RAZORPAY_KEY_SECRET', '')
razorpay_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret)) if razorpay_key_id and razorpay_key_secret else None

# JWT configuration
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'your-super-secret-jwt-key-change-in-production')
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============ MODELS ============

class User(BaseModel):
    user_id: str
    email: EmailStr
    name: str
    role: str  # job_seeker, recruiter, admin
    picture: Optional[str] = None
    created_at: datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str  # job_seeker, recruiter

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class JobSeekerProfile(BaseModel):
    user_id: str
    skills: List[str] = []
    experience_years: int = 0
    location: str = ""
    resume_url: Optional[str] = None
    preferred_job_types: List[str] = []
    preferred_salary_min: Optional[int] = None
    preferred_salary_max: Optional[int] = None
    bio: Optional[str] = None

class RecruiterProfile(BaseModel):
    user_id: str
    company_name: str
    company_website: Optional[str] = None
    company_description: Optional[str] = None
    subscription_plan: str = "free"  # free, basic, premium, enterprise
    subscription_status: str = "inactive"  # active, inactive, expired
    subscription_start: Optional[datetime] = None
    subscription_end: Optional[datetime] = None
    jobs_posted_this_month: int = 0

class Job(BaseModel):
    job_id: str
    recruiter_id: str
    title: str
    description: str
    company_name: str
    location: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    job_type: str  # full_time, part_time, contract, remote
    required_skills: List[str] = []
    experience_required: int = 0
    status: str = "pending"  # pending, approved, rejected, closed
    posted_at: datetime
    approved_at: Optional[datetime] = None

class JobCreate(BaseModel):
    title: str
    description: str
    company_name: str
    location: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    job_type: str
    required_skills: List[str] = []
    experience_required: int = 0

class Application(BaseModel):
    application_id: str
    job_id: str
    job_seeker_id: str
    recruiter_id: str
    status: str = "pending"  # pending, shortlisted, rejected, accepted
    cover_letter: Optional[str] = None
    applied_at: datetime
    updated_at: datetime

class ApplicationCreate(BaseModel):
    job_id: str
    cover_letter: Optional[str] = None

class Message(BaseModel):
    message_id: str
    sender_id: str
    receiver_id: str
    content: str
    application_id: Optional[str] = None
    created_at: datetime
    read: bool = False

class MessageCreate(BaseModel):
    receiver_id: str
    content: str
    application_id: Optional[str] = None

class Payment(BaseModel):
    payment_id: str
    user_id: str
    amount: int
    subscription_plan: str
    razorpay_order_id: str
    razorpay_payment_id: Optional[str] = None
    status: str
    created_at: datetime

# ============ AUTH HELPERS ============

async def get_current_user(request: Request, session_token: Optional[str] = Cookie(None)) -> User:
    """Extract user from session_token cookie or Authorization header"""
    token = session_token
    
    # Fallback to Authorization header if cookie not present
    if not token:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Check if it's a JWT token (for email/password auth)
    if token.startswith('eyJ'):
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload.get('user_id')
            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
            if not user_doc:
                raise HTTPException(status_code=401, detail="User not found")
            
            return User(**user_doc)
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
    
    # Otherwise, check session in database (for OAuth)
    session_doc = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user_doc)

async def get_current_recruiter(request: Request, session_token: Optional[str] = Cookie(None)) -> User:
    user = await get_current_user(request, session_token)
    if user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: Recruiters only")
    return user

async def get_current_admin(request: Request, session_token: Optional[str] = Cookie(None)) -> User:
    user = await get_current_user(request, session_token)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied: Admins only")
    return user

# ============ AUTH ENDPOINTS ============

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register new user with email/password"""
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = pwd_context.hash(user_data.password)
    
    # Create user
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "role": user_data.role,
        "password_hash": hashed_password,
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create profile based on role
    if user_data.role == "job_seeker":
        profile_doc = {
            "user_id": user_id,
            "skills": [],
            "experience_years": 0,
            "location": "",
            "resume_url": None,
            "preferred_job_types": [],
            "preferred_salary_min": None,
            "preferred_salary_max": None,
            "bio": None
        }
        await db.job_seeker_profiles.insert_one(profile_doc)
    elif user_data.role == "recruiter":
        profile_doc = {
            "user_id": user_id,
            "company_name": "",
            "company_website": None,
            "company_description": None,
            "subscription_plan": "free",
            "subscription_status": "inactive",
            "subscription_start": None,
            "subscription_end": None,
            "jobs_posted_this_month": 0
        }
        await db.recruiter_profiles.insert_one(profile_doc)
    
    # Create JWT token
    token_data = {"user_id": user_id}
    token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {"token": token, "user": User(**{k: v for k, v in user_doc.items() if k != "password_hash"})}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    """Login with email/password"""
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(credentials.password, user_doc.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    token_data = {"user_id": user_doc["user_id"]}
    token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    user_doc.pop("_id", None)
    user_doc.pop("password_hash", None)
    
    return {"token": token, "user": User(**user_doc)}

@api_router.get("/auth/session")
async def get_session_data(request: Request):
    """Exchange session_id for user data (OAuth flow)"""
    session_id = request.headers.get('X-Session-ID')
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            response.raise_for_status()
            oauth_data = response.json()
    except Exception as e:
        logger.error(f"OAuth session exchange failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check if user exists
    user_doc = await db.users.find_one({"email": oauth_data["email"]}, {"_id": 0})
    
    if user_doc:
        user_id = user_doc["user_id"]
        # Update user info
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": oauth_data["name"], "picture": oauth_data["picture"]}}
        )
    else:
        # Create new user with job_seeker role by default
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": oauth_data["email"],
            "name": oauth_data["name"],
            "role": "job_seeker",  # Default role
            "picture": oauth_data["picture"],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_doc)
        
        # Create job seeker profile
        profile_doc = {
            "user_id": user_id,
            "skills": [],
            "experience_years": 0,
            "location": "",
            "resume_url": None,
            "preferred_job_types": [],
            "preferred_salary_min": None,
            "preferred_salary_max": None,
            "bio": None
        }
        await db.job_seeker_profiles.insert_one(profile_doc)
    
    # Create session
    session_token = oauth_data["session_token"]
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0, "password_hash": 0})
    
    return {"session_token": session_token, "user": user_doc}

@api_router.get("/auth/me")
async def get_current_user_info(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get current user info"""
    user = await get_current_user(request, session_token)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response, session_token: Optional[str] = Cookie(None)):
    """Logout user"""
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    
    response.delete_cookie("session_token")
    return {"message": "Logged out successfully"}

# ============ PROFILE ENDPOINTS ============

@api_router.get("/profile/job-seeker/{user_id}")
async def get_job_seeker_profile(user_id: str):
    profile = await db.job_seeker_profiles.find_one({"user_id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@api_router.put("/profile/job-seeker")
async def update_job_seeker_profile(profile_data: JobSeekerProfile, request: Request, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(request, session_token)
    if user.role != "job_seeker":
        raise HTTPException(status_code=403, detail="Access denied")
    
    profile_dict = profile_data.model_dump()
    await db.job_seeker_profiles.update_one(
        {"user_id": user.user_id},
        {"$set": profile_dict},
        upsert=True
    )
    return {"message": "Profile updated successfully"}

@api_router.get("/profile/recruiter/{user_id}")
async def get_recruiter_profile(user_id: str):
    profile = await db.recruiter_profiles.find_one({"user_id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@api_router.put("/profile/recruiter")
async def update_recruiter_profile(profile_data: RecruiterProfile, request: Request, session_token: Optional[str] = Cookie(None)):
    user = await get_current_recruiter(request, session_token)
    
    profile_dict = profile_data.model_dump()
    await db.recruiter_profiles.update_one(
        {"user_id": user.user_id},
        {"$set": profile_dict},
        upsert=True
    )
    return {"message": "Profile updated successfully"}

# ============ JOB ENDPOINTS ============

@api_router.get("/jobs")
async def get_jobs(
    status: Optional[str] = "approved",
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    skills: Optional[str] = None,
    salary_min: Optional[int] = None
):
    """Get all jobs with filters"""
    query = {}
    if status:
        query["status"] = status
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if job_type:
        query["job_type"] = job_type
    if skills:
        skill_list = [s.strip() for s in skills.split(",")]
        query["required_skills"] = {"$in": skill_list}
    if salary_min:
        query["salary_min"] = {"$gte": salary_min}
    
    jobs = await db.jobs.find(query, {"_id": 0}).sort("posted_at", -1).to_list(100)
    return jobs

@api_router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    job = await db.jobs.find_one({"job_id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@api_router.post("/jobs")
async def create_job(job_data: JobCreate, request: Request, session_token: Optional[str] = Cookie(None)):
    """Create a new job (requires active subscription)"""
    user = await get_current_recruiter(request, session_token)
    
    # Check recruiter subscription
    profile = await db.recruiter_profiles.find_one({"user_id": user.user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")
    
    # Define job limits per plan
    plan_limits = {
        "free": 1,
        "basic": 10,
        "premium": 50,
        "enterprise": 999
    }
    
    subscription_plan = profile.get("subscription_plan", "free")
    subscription_status = profile.get("subscription_status", "inactive")
    jobs_posted = profile.get("jobs_posted_this_month", 0)
    job_limit = plan_limits.get(subscription_plan, 0)
    
    # Check if subscription is active (except for free plan's first job)
    if subscription_plan != "free" and subscription_status != "active":
        raise HTTPException(
            status_code=402,
            detail="Your subscription has expired. Please renew to post more jobs."
        )
    
    # Check job posting limit
    if jobs_posted >= job_limit:
        raise HTTPException(
            status_code=402,
            detail=f"You have reached your job posting limit ({job_limit} jobs/month) for the {subscription_plan} plan. Please upgrade your subscription."
        )
    
    # Increment jobs posted count
    await db.recruiter_profiles.update_one(
        {"user_id": user.user_id},
        {"$inc": {"jobs_posted_this_month": 1}}
    )
    
    # Create job
    job_id = f"job_{uuid.uuid4().hex[:12]}"
    job_doc = {
        "job_id": job_id,
        "recruiter_id": user.user_id,
        **job_data.model_dump(),
        "status": "pending",
        "posted_at": datetime.now(timezone.utc).isoformat(),
        "approved_at": None
    }
    
    await db.jobs.insert_one(job_doc)
    job_doc.pop("_id", None)
    
    return job_doc

@api_router.get("/jobs/recruiter/my-jobs")
async def get_my_jobs(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get jobs posted by current recruiter"""
    user = await get_current_recruiter(request, session_token)
    jobs = await db.jobs.find({"recruiter_id": user.user_id}, {"_id": 0}).sort("posted_at", -1).to_list(100)
    return jobs

@api_router.put("/jobs/{job_id}")
async def update_job(job_id: str, job_data: JobCreate, request: Request, session_token: Optional[str] = Cookie(None)):
    user = await get_current_recruiter(request, session_token)
    
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["recruiter_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.jobs.update_one(
        {"job_id": job_id},
        {"$set": job_data.model_dump()}
    )
    return {"message": "Job updated successfully"}

@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, request: Request, session_token: Optional[str] = Cookie(None)):
    user = await get_current_recruiter(request, session_token)
    
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["recruiter_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.jobs.update_one(
        {"job_id": job_id},
        {"$set": {"status": "closed"}}
    )
    return {"message": "Job closed successfully"}

# ============ APPLICATION ENDPOINTS ============

@api_router.post("/applications")
async def apply_to_job(application_data: ApplicationCreate, request: Request, session_token: Optional[str] = Cookie(None)):
    """Apply to a job"""
    user = await get_current_user(request, session_token)
    if user.role != "job_seeker":
        raise HTTPException(status_code=403, detail="Only job seekers can apply")
    
    # Check if job exists
    job = await db.jobs.find_one({"job_id": application_data.job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check if already applied
    existing = await db.applications.find_one({
        "job_id": application_data.job_id,
        "job_seeker_id": user.user_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
    
    # Create application
    application_id = f"app_{uuid.uuid4().hex[:12]}"
    application_doc = {
        "application_id": application_id,
        "job_id": application_data.job_id,
        "job_seeker_id": user.user_id,
        "recruiter_id": job["recruiter_id"],
        "status": "pending",
        "cover_letter": application_data.cover_letter,
        "applied_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.applications.insert_one(application_doc)
    application_doc.pop("_id", None)
    
    return application_doc

@api_router.get("/applications/my-applications")
async def get_my_applications(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get applications by current job seeker"""
    user = await get_current_user(request, session_token)
    if user.role != "job_seeker":
        raise HTTPException(status_code=403, detail="Access denied")
    
    applications = await db.applications.find({"job_seeker_id": user.user_id}, {"_id": 0}).sort("applied_at", -1).to_list(100)
    
    # Enrich with job details
    for app in applications:
        job = await db.jobs.find_one({"job_id": app["job_id"]}, {"_id": 0})
        if job:
            app["job"] = job
    
    return applications

@api_router.get("/applications/job/{job_id}")
async def get_job_applications(job_id: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Get all applications for a specific job"""
    user = await get_current_recruiter(request, session_token)
    
    # Verify job belongs to recruiter
    job = await db.jobs.find_one({"job_id": job_id})
    if not job or job["recruiter_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    applications = await db.applications.find({"job_id": job_id}, {"_id": 0}).sort("applied_at", -1).to_list(100)
    
    # Enrich with job seeker details
    for app in applications:
        seeker = await db.users.find_one({"user_id": app["job_seeker_id"]}, {"_id": 0, "password_hash": 0})
        profile = await db.job_seeker_profiles.find_one({"user_id": app["job_seeker_id"]}, {"_id": 0})
        if seeker:
            app["job_seeker"] = seeker
        if profile:
            app["profile"] = profile
    
    return applications

@api_router.put("/applications/{application_id}/status")
async def update_application_status(application_id: str, status: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Update application status (recruiter only)"""
    user = await get_current_recruiter(request, session_token)
    
    application = await db.applications.find_one({"application_id": application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if application["recruiter_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.applications.update_one(
        {"application_id": application_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Application status updated"}

# ============ MESSAGING ENDPOINTS ============

@api_router.post("/messages")
async def send_message(message_data: MessageCreate, request: Request, session_token: Optional[str] = Cookie(None)):
    """Send a message"""
    user = await get_current_user(request, session_token)
    
    message_id = f"msg_{uuid.uuid4().hex[:12]}"
    message_doc = {
        "message_id": message_id,
        "sender_id": user.user_id,
        "receiver_id": message_data.receiver_id,
        "content": message_data.content,
        "application_id": message_data.application_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "read": False
    }
    
    await db.messages.insert_one(message_doc)
    message_doc.pop("_id", None)
    
    return message_doc

@api_router.get("/messages/conversation/{other_user_id}")
async def get_conversation(other_user_id: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Get messages between current user and another user"""
    user = await get_current_user(request, session_token)
    
    messages = await db.messages.find({
        "$or": [
            {"sender_id": user.user_id, "receiver_id": other_user_id},
            {"sender_id": other_user_id, "receiver_id": user.user_id}
        ]
    }, {"_id": 0}).sort("created_at", 1).to_list(1000)
    
    # Mark messages as read
    await db.messages.update_many(
        {"sender_id": other_user_id, "receiver_id": user.user_id, "read": False},
        {"$set": {"read": True}}
    )
    
    return messages

@api_router.get("/messages/conversations")
async def get_conversations(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get all conversations for current user"""
    user = await get_current_user(request, session_token)
    
    # Get unique users who have messaged with current user
    pipeline = [
        {"$match": {"$or": [{"sender_id": user.user_id}, {"receiver_id": user.user_id}]}},
        {"$sort": {"created_at": -1}},
        {"$group": {
            "_id": {
                "$cond": [
                    {"$eq": ["$sender_id", user.user_id]},
                    "$receiver_id",
                    "$sender_id"
                ]
            },
            "last_message": {"$first": "$$ROOT"}
        }}
    ]
    
    conversations = await db.messages.aggregate(pipeline).to_list(100)
    
    # Enrich with user details
    result = []
    for conv in conversations:
        other_user_id = conv["_id"]
        other_user = await db.users.find_one({"user_id": other_user_id}, {"_id": 0, "password_hash": 0})
        if other_user:
            result.append({
                "user": other_user,
                "last_message": conv["last_message"]
            })
    
    return result

# ============ AI JOB MATCHING ============

@api_router.get("/ai/job-recommendations")
async def get_job_recommendations(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get AI-powered job recommendations"""
    user = await get_current_user(request, session_token)
    if user.role != "job_seeker":
        raise HTTPException(status_code=403, detail="Only for job seekers")
    
    # Get user profile
    profile = await db.job_seeker_profiles.find_one({"user_id": user.user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Get all approved jobs
    jobs = await db.jobs.find({"status": "approved"}, {"_id": 0}).to_list(100)
    
    if not jobs:
        return []
    
    # Use AI to match jobs
    try:
        llm_key = os.environ.get('EMERGENT_LLM_KEY')
        chat = LlmChat(
            api_key=llm_key,
            session_id=f"job_match_{user.user_id}",
            system_message="You are an AI job matching assistant. Analyze the user's profile and available jobs, then recommend the top 5 most suitable jobs. Return only job_ids as a comma-separated list."
        ).with_model("openai", "gpt-5.2")
        
        profile_summary = f"Skills: {', '.join(profile.get('skills', []))}. Experience: {profile.get('experience_years', 0)} years. Location: {profile.get('location', 'any')}. Preferred job types: {', '.join(profile.get('preferred_job_types', []))}."
        jobs_summary = "\n".join([f"Job ID: {j['job_id']}, Title: {j['title']}, Skills: {', '.join(j['required_skills'])}, Location: {j['location']}, Type: {j['job_type']}" for j in jobs[:20]])
        
        user_message = UserMessage(text=f"User profile: {profile_summary}\n\nAvailable jobs:\n{jobs_summary}\n\nRecommend top 5 job IDs (comma-separated).")
        response = await chat.send_message(user_message)
        
        # Parse job IDs from response
        recommended_ids = [jid.strip() for jid in response.split(",")]
        recommended_jobs = [j for j in jobs if j["job_id"] in recommended_ids]
        
        return recommended_jobs[:5]
    except Exception as e:
        logger.error(f"AI job matching failed: {e}")
        # Fallback to simple matching
        user_skills = set(profile.get('skills', []))
        matched_jobs = []
        for job in jobs:
            job_skills = set(job.get('required_skills', []))
            match_score = len(user_skills & job_skills)
            if match_score > 0:
                matched_jobs.append((match_score, job))
        
        matched_jobs.sort(reverse=True, key=lambda x: x[0])
        return [j[1] for j in matched_jobs[:5]]

# ============ SUBSCRIPTION & PAYMENT ENDPOINTS ============

@api_router.post("/subscriptions/create-order")
async def create_subscription_order(plan: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Create a Razorpay order for subscription"""
    user = await get_current_recruiter(request, session_token)
    
    # Define subscription plans (amount in paise)
    plans = {
        "basic": {"amount": 99900, "duration": 30, "jobs_limit": 10},  # ₹999/month
        "premium": {"amount": 249900, "duration": 30, "jobs_limit": 50},  # ₹2499/month
        "enterprise": {"amount": 499900, "duration": 30, "jobs_limit": 999}  # ₹4999/month
    }
    
    if plan not in plans:
        raise HTTPException(status_code=400, detail="Invalid subscription plan")
    
    plan_details = plans[plan]
    
    # Check if Razorpay is configured
    if not razorpay_client:
        # Demo mode - return mock order
        logger.warning("Razorpay not configured - running in demo mode")
        order_id = f"order_demo_{uuid.uuid4().hex[:12]}"
        return {
            "order_id": order_id,
            "amount": plan_details["amount"],
            "currency": "INR",
            "key_id": "demo_key",
            "demo_mode": True
        }
    
    try:
        # Create Razorpay order
        order_data = {
            "amount": plan_details["amount"],
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "user_id": user.user_id,
                "plan": plan
            }
        }
        
        order = razorpay_client.order.create(data=order_data)
        
        # Save order in database
        payment_doc = {
            "payment_id": f"pay_{uuid.uuid4().hex[:12]}",
            "user_id": user.user_id,
            "amount": plan_details["amount"],
            "subscription_plan": plan,
            "razorpay_order_id": order["id"],
            "razorpay_payment_id": None,
            "status": "created",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.payments.insert_one(payment_doc)
        
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": razorpay_key_id,
            "demo_mode": False
        }
    except Exception as e:
        logger.error(f"Razorpay order creation failed: {e}")
        # Fallback to demo mode
        order_id = f"order_demo_{uuid.uuid4().hex[:12]}"
        return {
            "order_id": order_id,
            "amount": plan_details["amount"],
            "currency": "INR",
            "key_id": "demo_key",
            "demo_mode": True
        }

@api_router.post("/subscriptions/verify-payment")
async def verify_subscription_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    """Verify Razorpay payment and activate subscription"""
    user = await get_current_recruiter(request, session_token)
    
    # Handle demo mode
    if razorpay_order_id.startswith('order_demo_'):
        # Find payment record
        payment = await db.payments.find_one({"razorpay_order_id": razorpay_order_id})
        if not payment:
            # Create demo payment record
            payment = {
                "user_id": user.user_id,
                "subscription_plan": "basic",
                "amount": 99900
            }
        
        plan = payment.get("subscription_plan", "basic")
        
        # Activate subscription
        subscription_start = datetime.now(timezone.utc)
        subscription_end = subscription_start + timedelta(days=30)
        
        await db.recruiter_profiles.update_one(
            {"user_id": user.user_id},
            {
                "$set": {
                    "subscription_plan": plan,
                    "subscription_status": "active",
                    "subscription_start": subscription_start.isoformat(),
                    "subscription_end": subscription_end.isoformat(),
                    "jobs_posted_this_month": 0
                }
            }
        )
        
        # Update payment status
        await db.payments.update_one(
            {"razorpay_order_id": razorpay_order_id},
            {
                "$set": {
                    "status": "success_demo",
                    "razorpay_payment_id": razorpay_payment_id
                }
            }
        )
        
        return {
            "message": "Subscription activated successfully (demo mode)",
            "plan": plan,
            "valid_until": subscription_end.isoformat()
        }
    
    # Real Razorpay verification
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Payment gateway not configured")
    
    try:
        # Verify signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Find payment record
        payment = await db.payments.find_one({"razorpay_order_id": razorpay_order_id})
        if not payment:
            raise HTTPException(status_code=404, detail="Payment record not found")
        
        plan = payment["subscription_plan"]
        
        # Activate subscription
        subscription_start = datetime.now(timezone.utc)
        subscription_end = subscription_start + timedelta(days=30)
        
        await db.recruiter_profiles.update_one(
            {"user_id": user.user_id},
            {
                "$set": {
                    "subscription_plan": plan,
                    "subscription_status": "active",
                    "subscription_start": subscription_start.isoformat(),
                    "subscription_end": subscription_end.isoformat(),
                    "jobs_posted_this_month": 0
                }
            }
        )
        
        # Update payment status
        await db.payments.update_one(
            {"razorpay_order_id": razorpay_order_id},
            {
                "$set": {
                    "status": "success",
                    "razorpay_payment_id": razorpay_payment_id
                }
            }
        )
        
        return {
            "message": "Subscription activated successfully",
            "plan": plan,
            "valid_until": subscription_end.isoformat()
        }
        
    except razorpay.errors.SignatureVerificationError as e:
        logger.error(f"Payment signature verification failed: {e}")
        raise HTTPException(status_code=400, detail="Payment verification failed")
    except Exception as e:
        logger.error(f"Payment verification error: {e}")
        raise HTTPException(status_code=500, detail="Payment verification error")

# ============ ADMIN ENDPOINTS ============

@api_router.get("/admin/users")
async def get_all_users(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get all users (admin only)"""
    await get_current_admin(request, session_token)
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return users

@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Delete a user (admin only)"""
    await get_current_admin(request, session_token)
    await db.users.delete_one({"user_id": user_id})
    return {"message": "User deleted"}

@api_router.get("/admin/jobs")
async def get_all_jobs_admin(status: Optional[str] = None, request: Request = None, session_token: Optional[str] = Cookie(None)):
    """Get all jobs (admin only)"""
    await get_current_admin(request, session_token)
    query = {}
    if status:
        query["status"] = status
    jobs = await db.jobs.find(query, {"_id": 0}).sort("posted_at", -1).to_list(1000)
    return jobs

@api_router.put("/admin/jobs/{job_id}/approve")
async def approve_job(job_id: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Approve a job (admin only)"""
    await get_current_admin(request, session_token)
    
    await db.jobs.update_one(
        {"job_id": job_id},
        {"$set": {"status": "approved", "approved_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Job approved"}

@api_router.put("/admin/jobs/{job_id}/reject")
async def reject_job(job_id: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Reject a job (admin only)"""
    await get_current_admin(request, session_token)
    
    await db.jobs.update_one(
        {"job_id": job_id},
        {"$set": {"status": "rejected"}}
    )
    return {"message": "Job rejected"}

@api_router.get("/admin/analytics")
async def get_analytics(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get platform analytics (admin only)"""
    await get_current_admin(request, session_token)
    
    total_users = await db.users.count_documents({})
    total_job_seekers = await db.users.count_documents({"role": "job_seeker"})
    total_recruiters = await db.users.count_documents({"role": "recruiter"})
    total_jobs = await db.jobs.count_documents({})
    approved_jobs = await db.jobs.count_documents({"status": "approved"})
    pending_jobs = await db.jobs.count_documents({"status": "pending"})
    total_applications = await db.applications.count_documents({})
    pending_applications = await db.applications.count_documents({"status": "pending"})
    
    return {
        "users": {
            "total": total_users,
            "job_seekers": total_job_seekers,
            "recruiters": total_recruiters
        },
        "jobs": {
            "total": total_jobs,
            "approved": approved_jobs,
            "pending": pending_jobs
        },
        "applications": {
            "total": total_applications,
            "pending": pending_applications
        }
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
