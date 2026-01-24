#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import time

class JobSiteAPITester:
    def __init__(self, base_url="https://jobhub-31.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                try:
                    error_data = response.json()
                    details += f", Error: {error_data.get('detail', 'Unknown error')}"
                except:
                    details += f", Response: {response.text[:100]}"

            self.log_test(name, success, details)
            
            if success:
                try:
                    return response.json()
                except:
                    return {}
            return None

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return None

    def test_auth_flow(self):
        """Test authentication endpoints"""
        print("\n🔐 Testing Authentication...")
        
        # Test registration
        timestamp = int(time.time())
        test_user_data = {
            "email": f"testuser{timestamp}@example.com",
            "password": "TestPass123!",
            "name": "Test User",
            "role": "job_seeker"
        }
        
        response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if response and 'token' in response:
            self.token = response['token']
            self.user = response['user']
            
            # Test login
            login_data = {
                "email": test_user_data["email"],
                "password": test_user_data["password"]
            }
            
            login_response = self.run_test(
                "User Login",
                "POST",
                "auth/login",
                200,
                data=login_data
            )
            
            # Test get current user
            self.run_test(
                "Get Current User",
                "GET",
                "auth/me",
                200
            )
            
            return True
        
        return False

    def test_job_seeker_profile(self):
        """Test job seeker profile endpoints"""
        if not self.user or self.user['role'] != 'job_seeker':
            return
            
        print("\n👤 Testing Job Seeker Profile...")
        
        # Get profile
        self.run_test(
            "Get Job Seeker Profile",
            "GET",
            f"profile/job-seeker/{self.user['user_id']}",
            200
        )
        
        # Update profile
        profile_data = {
            "user_id": self.user['user_id'],
            "skills": ["Python", "JavaScript", "React"],
            "experience_years": 3,
            "location": "New York, NY",
            "bio": "Experienced software developer",
            "preferred_job_types": ["full_time", "remote"],
            "preferred_salary_min": 80000,
            "preferred_salary_max": 120000
        }
        
        self.run_test(
            "Update Job Seeker Profile",
            "PUT",
            "profile/job-seeker",
            200,
            data=profile_data
        )

    def test_recruiter_endpoints(self):
        """Test recruiter-specific endpoints"""
        print("\n🏢 Testing Recruiter Endpoints...")
        
        # Create recruiter user
        timestamp = int(time.time())
        recruiter_data = {
            "email": f"recruiter{timestamp}@example.com",
            "password": "TestPass123!",
            "name": "Test Recruiter",
            "role": "recruiter"
        }
        
        response = self.run_test(
            "Recruiter Registration",
            "POST",
            "auth/register",
            200,
            data=recruiter_data
        )
        
        if response and 'token' in response:
            recruiter_token = response['token']
            recruiter_user = response['user']
            
            # Switch to recruiter token
            old_token = self.token
            old_user = self.user
            self.token = recruiter_token
            self.user = recruiter_user
            
            # Test recruiter profile
            profile_data = {
                "user_id": recruiter_user['user_id'],
                "company_name": "Test Company",
                "company_website": "https://testcompany.com",
                "company_description": "A test company for testing purposes",
                "credits": 5  # Give some credits for testing
            }
            
            self.run_test(
                "Update Recruiter Profile",
                "PUT",
                "profile/recruiter",
                200,
                data=profile_data
            )
            
            # Test job creation (should fail without credits initially)
            job_data = {
                "title": "Software Developer",
                "description": "Looking for a skilled software developer",
                "company_name": "Test Company",
                "location": "San Francisco, CA",
                "salary_min": 90000,
                "salary_max": 130000,
                "job_type": "full_time",
                "required_skills": ["Python", "JavaScript"],
                "experience_required": 2
            }
            
            # This should fail due to insufficient credits
            self.run_test(
                "Create Job (No Credits)",
                "POST",
                "jobs",
                402,
                data=job_data
            )
            
            # Test payment intent creation
            payment_response = self.run_test(
                "Create Payment Intent",
                "POST",
                "payments/create-intent?credits=5",
                200
            )
            
            # Test get my jobs
            self.run_test(
                "Get My Jobs",
                "GET",
                "jobs/recruiter/my-jobs",
                200
            )
            
            # Restore original token
            self.token = old_token
            self.user = old_user

    def test_job_endpoints(self):
        """Test job-related endpoints"""
        print("\n💼 Testing Job Endpoints...")
        
        # Test get all jobs (public)
        self.run_test(
            "Get All Jobs",
            "GET",
            "jobs",
            200
        )
        
        # Test job search with filters
        self.run_test(
            "Search Jobs by Location",
            "GET",
            "jobs?location=New York",
            200
        )
        
        self.run_test(
            "Search Jobs by Skills",
            "GET",
            "jobs?skills=Python,JavaScript",
            200
        )

    def test_ai_recommendations(self):
        """Test AI job recommendations"""
        if not self.user or self.user['role'] != 'job_seeker':
            return
            
        print("\n🤖 Testing AI Recommendations...")
        
        # Test AI job recommendations
        self.run_test(
            "Get AI Job Recommendations",
            "GET",
            "ai/job-recommendations",
            200
        )

    def test_application_flow(self):
        """Test job application workflow"""
        if not self.user or self.user['role'] != 'job_seeker':
            return
            
        print("\n📝 Testing Application Flow...")
        
        # Get available jobs first
        jobs_response = self.run_test(
            "Get Jobs for Application",
            "GET",
            "jobs?status=approved",
            200
        )
        
        # Test get my applications
        self.run_test(
            "Get My Applications",
            "GET",
            "applications/my-applications",
            200
        )

    def test_admin_endpoints(self):
        """Test admin endpoints"""
        print("\n👑 Testing Admin Endpoints...")
        
        # Create admin user
        timestamp = int(time.time())
        admin_data = {
            "email": f"admin{timestamp}@example.com",
            "password": "TestPass123!",
            "name": "Test Admin",
            "role": "admin"
        }
        
        # Note: Admin users might need to be created differently in production
        # For testing, we'll try to register as admin
        response = self.run_test(
            "Admin Registration (May Fail)",
            "POST",
            "auth/register",
            200,
            data=admin_data
        )
        
        if response and 'token' in response:
            admin_token = response['token']
            
            # Switch to admin token
            old_token = self.token
            self.token = admin_token
            
            # Test admin endpoints
            self.run_test(
                "Get Analytics",
                "GET",
                "admin/analytics",
                200
            )
            
            self.run_test(
                "Get All Users",
                "GET",
                "admin/users",
                200
            )
            
            self.run_test(
                "Get All Jobs (Admin)",
                "GET",
                "admin/jobs",
                200
            )
            
            # Restore original token
            self.token = old_token

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting JobConnect API Test Suite")
        print(f"Testing against: {self.base_url}")
        
        # Test authentication first
        if not self.test_auth_flow():
            print("❌ Authentication failed, stopping tests")
            return False
        
        # Test job seeker features
        self.test_job_seeker_profile()
        self.test_ai_recommendations()
        self.test_application_flow()
        
        # Test job endpoints
        self.test_job_endpoints()
        
        # Test recruiter features
        self.test_recruiter_endpoints()
        
        # Test admin features
        self.test_admin_endpoints()
        
        # Print summary
        print(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = JobSiteAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_reports/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_tests': tester.tests_run,
            'passed_tests': tester.tests_passed,
            'success_rate': tester.tests_passed / tester.tests_run if tester.tests_run > 0 else 0,
            'results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())