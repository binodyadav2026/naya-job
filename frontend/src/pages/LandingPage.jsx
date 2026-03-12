import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, MessageSquare, Search, Zap, Star, ArrowRight, CheckCircle, ChevronRight, MapPin, IndianRupee, X, Bell, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

const STATS = [
  { value: '2.4L+', label: 'Active Jobs' },
  { value: '18L+', label: 'Job Seekers' },
  { value: '85K+', label: 'Companies' },
  { value: '92%', label: 'Placement Rate' },
];

const FEATURED_JOBS = [
  { title: 'Sales Executive', company: 'Reliance Retail', location: 'Mumbai', salary: '₹25,000–35,000/mo', type: 'Full-time', logo: 'RR', color: '#1E40AF' },
  { title: 'Delivery Partner', company: 'Zomato', location: 'Delhi', salary: '₹18,000–28,000/mo', type: 'Part-time', logo: 'Z', color: '#E23744' },
  { title: 'Customer Support', company: 'Airtel', location: 'Bangalore', salary: '₹20,000–30,000/mo', type: 'Full-time', logo: 'A', color: '#E40000' },
  { title: 'Field Agent', company: 'HDFC Bank', location: 'Pune', salary: '₹22,000–32,000/mo', type: 'Full-time', logo: 'H', color: '#004C8F' },
];

const CATEGORIES = [
  { icon: '🏪', label: 'Retail & Sales', count: '45,200+' },
  { icon: '🚚', label: 'Delivery', count: '32,100+' },
  { icon: '🏦', label: 'Banking & Finance', count: '28,400+' },
  { icon: '📞', label: 'Customer Support', count: '41,700+' },
  { icon: '🏗️', label: 'Construction', count: '19,300+' },
  { icon: '🍽️', label: 'Hospitality', count: '23,600+' },
  { icon: '🏥', label: 'Healthcare', count: '16,800+' },
  { icon: '🎓', label: 'Education', count: '12,400+' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Got placed at Amazon', city: 'Mumbai', rating: 5, text: 'Found a job within 3 days! The AI matching showed me exactly the right roles for my skills.' },
  { name: 'Rahul Verma', role: 'Recruiter at Delhivery', city: 'Delhi', rating: 5, text: 'Best platform for blue collar hiring. We filled 50 positions in under 2 weeks.' },
  { name: 'Anita Patel', role: 'Customer Support at Jio', city: 'Ahmedabad', rating: 5, text: 'Easy to use, even on phone. Got called for interview within hours of applying.' },
];

const BRANDS = ['Zomato', 'Reliance', 'HDFC Bank', 'Jio', 'Airtel', 'Flipkart', 'Amazon', 'PhonePe'];

const TRENDING = [
  { rank: 1, label: 'Jobs for Freshers', count: 48200, delta: '+1,240 today', emoji: '🎓', color: '#1E40AF', light: '#EFF6FF', accent: '#3B82F6', size: 'big' },
  { rank: 2, label: 'Work From Home', count: 32100, delta: '+890 today', emoji: '🏠', color: '#7C3AED', light: '#F5F3FF', accent: '#A78BFA', size: 'big' },
  { rank: 3, label: 'Part Time Jobs', count: 21500, delta: '+430 today', emoji: '⏰', color: '#0891B2', light: '#E0F2FE', accent: '#38BDF8', size: 'small' },
  { rank: 4, label: 'Jobs for Women', count: 19800, delta: '+610 today', emoji: '👩‍💼', color: '#BE185D', light: '#FDF2F8', accent: '#F472B6', size: 'small' },
  { rank: 5, label: 'Full Time Jobs', count: 61400, delta: '+2,100 today', emoji: '💼', color: '#059669', light: '#F0FDF4', accent: '#34D399', size: 'small' },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('seeker');
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hoveredTrend, setHoveredTrend] = useState(null);
  const [liveCount, setLiveCount] = useState(847);

  useEffect(() => {
    const iv = setInterval(() => setLiveCount(c => c + Math.floor(Math.random() * 3) + 1), 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: white;
          border-bottom: 1px solid #E8EDF5;
          transition: box-shadow 0.3s;
        }
        .nav-root.scrolled { box-shadow: 0 4px 24px rgba(30,64,175,0.08); }
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; height: 68px; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(30,64,175,0.3); }
        .nav-links { display: flex; align-items: center; gap: 36px; }
        .nav-link { font-size: 14px; font-weight: 600; color: #475569; text-decoration: none; transition: color 0.2s; position: relative; }
        .nav-link:hover { color: #1E40AF; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; right: 0; height: 2px; background: #1E40AF; border-radius: 2px; transform: scaleX(0); transition: transform 0.2s; }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-badge { background: #EFF6FF; color: #1E40AF; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid #BFDBFE; }
        .btn-ghost { font-size: 14px; font-weight: 600; color: #475569; background: none; border: none; cursor: pointer; padding: 8px 16px; border-radius: 8px; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-ghost:hover { background: #F1F5F9; color: #1E40AF; }
        .btn-nav-cta { background: linear-gradient(135deg, #1E40AF 0%, #2563EB 100%); color: white; border: none; border-radius: 10px; padding: 10px 22px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(30,64,175,0.25); font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(30,64,175,0.35); }

        .hero-section { padding-top: 68px; background: white; position: relative; overflow: hidden; }
        .hero-bg-shape { position: absolute; top: 0; right: 0; width: 52%; height: 100%; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 60%, #BFDBFE 100%); clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%); }
        .hero-bg-dots { position: absolute; top: 0; right: 0; width: 52%; height: 100%; background-image: radial-gradient(circle, #93C5FD 1px, transparent 1px); background-size: 26px 26px; opacity: 0.3; clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%); }
        .hero-inner { max-width: 1200px; margin: 0 auto; padding: 80px 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; position: relative; z-index: 2; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 20px; padding: 6px 14px; margin-bottom: 22px; }
        .hero-dot { width: 7px; height: 7px; background: #22C55E; border-radius: 50%; }
        .hero-h1 { font-size: 50px; font-weight: 800; color: #0F172A; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 18px; }
        .hero-h1 .blue { color: #1E40AF; }
        .hero-sub { font-size: 16px; color: #64748B; line-height: 1.75; margin-bottom: 28px; max-width: 420px; }
        .hero-search { display: flex; overflow: hidden; border: 1.5px solid #E2E8F0; border-radius: 12px; background: white; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: border-color 0.2s, box-shadow 0.2s; }
        .hero-search:focus-within { border-color: #3B82F6; box-shadow: 0 4px 20px rgba(59,130,246,0.15); }
        .hero-search input { flex: 1; border: none; outline: none; padding: 14px 18px; font-size: 14px; color: #0F172A; background: transparent; font-family: 'Plus Jakarta Sans', sans-serif; }
        .hero-search input::placeholder { color: #94A3B8; }
        .hero-search-btn { background: linear-gradient(135deg, #1E40AF, #2563EB); color: white; border: none; padding: 0 22px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; align-items: center; gap: 6px; }
        .hero-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; }
        .hero-tag { background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 20px; padding: 5px 14px; font-size: 12px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; }
        .hero-tag:hover { background: #EFF6FF; border-color: #93C5FD; color: #1E40AF; }
        .btn-blue { background: linear-gradient(135deg, #1E40AF, #2563EB); color: white; border: none; border-radius: 10px; padding: 13px 26px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 6px 20px rgba(30,64,175,0.28); }
        .btn-blue:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(30,64,175,0.38); }
        .btn-outline { background: white; color: #1E40AF; border: 2px solid #BFDBFE; border-radius: 10px; padding: 11px 22px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-outline:hover { background: #EFF6FF; border-color: #3B82F6; }

        .hero-card { background: linear-gradient(135deg, #1E40AF 0%, #1D4ED8 100%); border-radius: 20px; padding: 28px; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 60px rgba(30,64,175,0.35); margin-top: 28px; }
        .hero-card::before { content: ''; position: absolute; top: -60px; right: -60px; width: 180px; height: 180px; background: rgba(255,255,255,0.07); border-radius: 50%; }
        .hero-float { position: absolute; background: white; border-radius: 14px; padding: 11px 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); display: flex; align-items: center; gap: 10px; z-index: 5; }
        .hero-float-1 { top: 12px; right: 20px; animation: float1 3s ease-in-out infinite; }
        .hero-float-2 { bottom: 32px; left: -16px; animation: float2 3.5s ease-in-out infinite; }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        .score-bar-bg { background: rgba(255,255,255,0.2); border-radius: 20px; height: 6px; margin-top: 8px; }
        .score-bar-fill { background: #4ADE80; height: 6px; border-radius: 20px; }

        .trust-bar { background: white; border-top: 1px solid #E8EDF5; border-bottom: 1px solid #E8EDF5; padding: 16px 28px; }
        .trust-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 40px; justify-content: center; }
        .trust-label { font-size: 11px; font-weight: 700; color: #94A3B8; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; }
        .trust-div { width: 1px; height: 18px; background: #E2E8F0; }
        .trust-brands { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; justify-content: center; }
        .trust-brand { font-size: 13px; font-weight: 800; color: #CBD5E1; }

        .section { padding: 80px 28px; }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .section-eyebrow { font-size: 12px; font-weight: 700; color: #1E40AF; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
        .section-h2 { font-size: 36px; font-weight: 800; color: #0F172A; letter-spacing: -0.8px; }
        .section-head-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 36px; }
        .see-all { font-size: 14px; font-weight: 700; color: #1E40AF; text-decoration: none; display: flex; align-items: center; gap: 4px; }
        .see-all:hover { text-decoration: underline; }

        .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .cat-card { background: white; border: 1.5px solid #E8EDF5; border-radius: 14px; padding: 22px 16px; text-align: center; cursor: pointer; transition: all 0.22s; position: relative; overflow: hidden; }
        .cat-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #EFF6FF, #DBEAFE); opacity: 0; transition: opacity 0.22s; }
        .cat-card:hover { border-color: #3B82F6; transform: translateY(-3px); box-shadow: 0 10px 32px rgba(30,64,175,0.1); }
        .cat-card:hover::before { opacity: 1; }
        .cat-icon { font-size: 28px; margin-bottom: 10px; position: relative; z-index: 1; }
        .cat-label { font-weight: 700; color: #0F172A; font-size: 14px; margin-bottom: 4px; position: relative; z-index: 1; }
        .cat-count { font-size: 12px; font-weight: 600; color: #3B82F6; position: relative; z-index: 1; }

        .jobs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .job-card { background: white; border: 1.5px solid #E8EDF5; border-radius: 14px; padding: 20px; transition: all 0.22s; cursor: pointer; }
        .job-card:hover { border-color: #3B82F6; box-shadow: 0 8px 28px rgba(30,64,175,0.1); transform: translateY(-2px); }
        .job-logo { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; color: white; flex-shrink: 0; }
        .badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
        .badge-blue { background: #EFF6FF; color: #1E40AF; }
        .badge-green { background: #F0FDF4; color: #16A34A; }

        .tab-switch { display: flex; background: #F1F5F9; border-radius: 10px; padding: 4px; gap: 4px; width: fit-content; margin: 0 auto 48px; }
        .tab-btn { padding: 10px 28px; border-radius: 8px; border: none; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; background: transparent; color: #64748B; font-family: 'Plus Jakarta Sans', sans-serif; }
        .tab-btn.active { background: white; color: #1E40AF; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .feat-row { display: flex; gap: 16px; align-items: flex-start; padding: 16px; border-radius: 12px; transition: background 0.2s; }
        .feat-row:hover { background: #F8FAFC; }
        .feat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .feat-title { font-weight: 700; color: #0F172A; font-size: 15px; margin-bottom: 3px; }
        .feat-desc { font-size: 14px; color: #64748B; line-height: 1.6; }
        .feat-visual { background: white; border-radius: 20px; border: 1.5px solid #E8EDF5; padding: 26px; box-shadow: 0 20px 60px rgba(30,64,175,0.07); }

        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; position: relative; }
        .step-conn { position: absolute; top: 27px; height: 2px; background: linear-gradient(90deg, #3B82F6, #BFDBFE); }
        .step-circle { width: 54px; height: 54px; border-radius: 50%; border: 2.5px solid #DBEAFE; background: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; font-size: 22px; position: relative; box-shadow: 0 4px 16px rgba(30,64,175,0.1); }
        .step-num { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; background: #1E40AF; border-radius: 50%; color: white; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; }

        .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .testi-card { background: white; border: 1.5px solid #E8EDF5; border-radius: 16px; padding: 24px; transition: box-shadow 0.2s; }
        .testi-card:hover { box-shadow: 0 8px 32px rgba(30,64,175,0.08); }
        .testi-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, #1E40AF, #3B82F6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 16px; flex-shrink: 0; }

        .cta-section { background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #2563EB 100%); position: relative; overflow: hidden; }
        .cta-section::before { content: ''; position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; background: rgba(255,255,255,0.05); border-radius: 50%; }
        .cta-inner { max-width: 680px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
        .btn-cta-white { background: white; color: #1E40AF; border: none; border-radius: 10px; padding: 14px 30px; font-weight: 800; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 8px 32px rgba(0,0,0,0.15); transition: all 0.2s; }
        .btn-cta-white:hover { transform: translateY(-2px); }
        .btn-cta-ghost { background: rgba(255,255,255,0.12); color: white; border: 2px solid rgba(255,255,255,0.3); border-radius: 10px; padding: 12px 26px; font-weight: 700; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .btn-cta-ghost:hover { background: rgba(255,255,255,0.2); }

        .footer-root { background: #0F172A; padding: 56px 28px 28px; }
        .footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
        .footer-link { color: #64748B; font-size: 14px; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: #93C5FD; }
        .footer-bottom { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }

        /* ── TRENDING SECTION ── */
        .trending-section { background: #0B0F1A; padding: 80px 28px; position: relative; overflow: hidden; }
        .trending-section::before { content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(30,64,175,0.18) 0%, transparent 70%); pointer-events: none; }
        .trending-ticker { display: flex; align-items: center; gap: 12px; margin-bottom: 52px; overflow: hidden; }
        .ticker-live { display: flex; align-items: center; gap: 6px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); border-radius: 20px; padding: 5px 12px; flex-shrink: 0; }
        .ticker-dot { width: 7px; height: 7px; background: #EF4444; border-radius: 50%; animation: pulse-red 1.5s ease-in-out infinite; }
        @keyframes pulse-red { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        .ticker-scroll { display: flex; gap: 28px; animation: tickerMove 22s linear infinite; white-space: nowrap; }
        .ticker-scroll:hover { animation-play-state: paused; }
        @keyframes tickerMove { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .ticker-item { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; flex-shrink: 0; }
        .ticker-item span.hi { color: #4ADE80; }

        .trending-mosaic { display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: auto auto; gap: 16px; }
        .trend-card {
          position: relative; border-radius: 20px; cursor: pointer;
          overflow: hidden; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
          text-decoration: none; display: block;
          border: 1.5px solid rgba(255,255,255,0.06);
        }
        .trend-card:hover { transform: translateY(-6px) scale(1.02); }
        .trend-card.big { grid-row: span 1; min-height: 240px; }
        .trend-card.small { min-height: 180px; }
        .trend-card-inner { position: relative; width: 100%; height: 100%; padding: 28px; display: flex; flex-direction: column; justify-content: space-between; }
        .trend-bg { position: absolute; inset: 0; }
        .trend-glow { position: absolute; bottom: -40px; right: -40px; width: 180px; height: 180px; border-radius: 50%; opacity: 0.15; transition: opacity 0.3s, transform 0.3s; }
        .trend-card:hover .trend-glow { opacity: 0.3; transform: scale(1.2); }
        .trend-grid-pattern { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 24px 24px; }
        .trend-rank { font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; opacity: 0.55; color: white; }
        .trend-label { font-size: 22px; font-weight: 800; color: white; line-height: 1.2; margin-top: 8px; }
        .trend-card.small .trend-label { font-size: 18px; }
        .trend-count { font-size: 13px; font-weight: 700; margin-top: 6px; }
        .trend-bottom { display: flex; align-items: center; justify-content: space-between; }
        .trend-delta { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.1); border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #4ADE80; }
        .trend-arrow-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; transition: background 0.2s; font-size: 14px; }
        .trend-card:hover .trend-arrow-btn { background: rgba(255,255,255,0.25); }
        .trend-emoji { font-size: 52px; position: absolute; right: 24px; top: 50%; transform: translateY(-50%); opacity: 0.18; transition: opacity 0.3s, transform 0.3s; pointer-events: none; }
        .trend-card.small .trend-emoji { font-size: 38px; }
        .trend-card:hover .trend-emoji { opacity: 0.35; transform: translateY(-55%) scale(1.1) rotate(5deg); }
        .trend-view-all { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 4px; }
        .trend-view-all:hover { color: white; }

        /* live counter shimmer */
        .live-num { display: inline-block; animation: numPop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes numPop { 0%{transform:scale(0.8);opacity:0.5} 100%{transform:scale(1);opacity:1} }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(15,23,42,0.65); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 24px; animation: overlayIn 0.25s ease; }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        .modal-box { background: white; border-radius: 24px; padding: 44px 40px; max-width: 600px; width: 100%; box-shadow: 0 40px 100px rgba(0,0,0,0.2); animation: modalUp 0.35s cubic-bezier(0.34,1.56,0.64,1); position: relative; }
        @keyframes modalUp { from{opacity:0;transform:scale(0.88) translateY(24px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .modal-close { position: absolute; top: 18px; right: 18px; width: 32px; height: 32px; border-radius: 50%; background: #F1F5F9; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748B; transition: all 0.2s; }
        .modal-close:hover { background: #E2E8F0; color: #0F172A; }
        .modal-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; }
        .modal-card { border-radius: 18px; overflow: hidden; cursor: pointer; position: relative; height: 196px; transition: transform 0.25s, box-shadow 0.25s; border: 2.5px solid transparent; text-decoration: none; display: block; }
        .modal-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(30,64,175,0.22); border-color: #3B82F6; }
        .modal-card-bg { position: absolute; inset: 0; }
        .modal-card-overlay { position: absolute; inset: 0; }
        .modal-card-deco { position: absolute; right: 0; bottom: 0; width: 55%; height: 80%; border-radius: 60px 0 0 0; }
        .modal-card-head { position: absolute; width: 40px; height: 40px; background: rgba(255,255,255,0.25); border-radius: 50%; }
        .modal-card-body { position: absolute; width: 64px; height: 70px; background: rgba(255,255,255,0.15); border-radius: 32px 32px 0 0; }
        .modal-card-arrow { position: absolute; top: 14px; right: 14px; z-index: 2; width: 30px; height: 30px; background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; transition: background 0.2s; }
        .modal-card:hover .modal-card-arrow { background: rgba(255,255,255,0.3); }
        .modal-card-content { position: absolute; bottom: 16px; left: 18px; right: 18px; z-index: 2; }
        .modal-card-title { font-size: 19px; font-weight: 800; color: white; line-height: 1.2; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .modal-card-hindi { font-size: 12px; color: rgba(255,255,255,0.65); font-weight: 500; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .f1{animation:fadeUp 0.55s 0.05s both} .f2{animation:fadeUp 0.55s 0.15s both} .f3{animation:fadeUp 0.55s 0.25s both} .f4{animation:fadeUp 0.55s 0.35s both} .f5{animation:fadeUp 0.55s 0.45s both}
      `}</style>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}><X size={15} /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={14} color="white" />
              </div>
              <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 15 }}>Naya<span style={{ color: '#1E40AF' }}>Job</span></span>
            </div>

            <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 6, letterSpacing: '-0.5px' }}>What do you want to do?</div>
            <div style={{ fontSize: 14, color: '#64748B', marginBottom: 28 }}>Choose your path — get started in seconds, for free.</div>

            <div className="modal-cards">
              {/* Job Seeker */}
              <Link to="/register?role=seeker" className="modal-card">
                <div className="modal-card-bg" style={{ background: 'linear-gradient(140deg, #1E3A8A 0%, #1E40AF 100%)' }} />
                <div className="modal-card-deco" style={{ background: 'rgba(99,152,255,0.2)' }}>
                  <div className="modal-card-head" style={{ top: '14%', left: '50%', transform: 'translateX(-50%)' }} />
                  <div className="modal-card-body" style={{ top: '40%', left: '50%', transform: 'translateX(-50%)' }} />
                </div>
                <div className="modal-card-overlay" style={{ background: 'linear-gradient(135deg, rgba(30,58,138,0.97) 35%, rgba(30,64,175,0.3) 100%)' }} />
                <div className="modal-card-arrow"><ArrowRight size={13} /></div>
                <div className="modal-card-content">
                  <div style={{ fontSize: 26, marginBottom: 6 }}>👨‍💼</div>
                  <div className="modal-card-title">I want<br />a job</div>
                  <div className="modal-card-hindi">मुझे नौकरी चाहिए</div>
                </div>
              </Link>

              {/* Recruiter */}
              <Link to="/register?role=recruiter" className="modal-card">
                <div className="modal-card-bg" style={{ background: 'linear-gradient(140deg, #1D4ED8 0%, #2563EB 100%)' }} />
                <div className="modal-card-deco" style={{ background: 'rgba(147,197,253,0.18)' }}>
                  <div className="modal-card-head" style={{ top: '14%', left: '50%', transform: 'translateX(-50%)' }} />
                  <div className="modal-card-body" style={{ top: '40%', left: '50%', transform: 'translateX(-50%)' }} />
                </div>
                <div className="modal-card-overlay" style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.97) 35%, rgba(37,99,235,0.3) 100%)' }} />
                <div className="modal-card-arrow"><ArrowRight size={13} /></div>
                <div className="modal-card-content">
                  <div style={{ fontSize: 26, marginBottom: 6 }}>🏢</div>
                  <div className="modal-card-title">I want to<br />hire people</div>
                  <div className="modal-card-hindi">मुझे लोग काम पे रखने है</div>
                </div>
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: '#F1F5F9' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>Trusted by 18L+ users across India</span>
              <div style={{ flex: 1, height: 1, background: '#F1F5F9' }} />
            </div>
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <header className={`nav-root ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            <div className="nav-logo-icon"><Briefcase size={18} color="white" /></div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>Naya<span style={{ color: '#1E40AF' }}>Job</span></span>
          </a>
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <Link to="/jobs" className="nav-link">Browse Jobs</Link>
            <span className="nav-badge">🇮🇳 For India</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/login" className="btn-ghost" data-testid="header-login-btn">Sign In</Link>
            <button className="btn-nav-cta" onClick={() => setShowModal(true)} data-testid="header-register-btn">
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>






      {/* ── HERO ── */}
      <section className="hero-section" data-testid="hero-section">
        <div className="hero-bg-shape" />
        <div className="hero-bg-dots" />
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow f1">
              <span className="hero-dot" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1E40AF' }}>India's fastest growing job platform · 2.4L+ live jobs</span>
            </div>
            <h1 className="hero-h1 f2">Find Your<br /><span className="blue">Dream Job</span><br />in Minutes</h1>
            <p className="hero-sub f3">AI-powered matching for every Indian professional. From freshers to veterans — the right job, right near you.</p>
            <div className="hero-search f4">
              <Search size={15} color="#94A3B8" style={{ marginLeft: 16 }} />
              <input type="text" placeholder="Job title, skill, or company..." />
              <button className="hero-search-btn">Search <ArrowRight size={13} /></button>
            </div>
            <div className="hero-tags f4">
              {['Sales', 'Delivery', 'IT Support', 'Banking', 'BPO'].map(t => <span key={t} className="hero-tag">{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }} className="f5">
              <button className="btn-blue" onClick={() => setShowModal(true)} data-testid="hero-get-started-btn">Find My Job <ArrowRight size={14} /></button>
              <Link to="/jobs" className="btn-outline" data-testid="hero-browse-jobs-btn">Browse Jobs</Link>
            </div>
          </div>

          {/* Right */}
          <div style={{ position: 'relative' }} className="f3">
            <div className="hero-float hero-float-1">
              <div style={{ width: 34, height: 34, background: '#DCFCE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎉</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>Priya got hired!</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>Sales Exec @ Reliance</div>
              </div>
            </div>
            <div className="hero-card">
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Your AI Match Score</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: 'white', marginBottom: 8 }}>94%</div>
              <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '94%' }} /></div>
              <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[{ v: '12', l: 'Applied' }, { v: '5', l: 'Shortlisted' }, { v: '3', l: 'Interviews' }].map(s => (
                  <div key={s.l} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Bell size={14} color="#4ADE80" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Interview at HDFC · Tomorrow 11AM</span>
              </div>
            </div>
            <div className="hero-float hero-float-2">
              <div style={{ width: 8, height: 8, background: '#22C55E', borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>{liveCount} new jobs today</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>in your area</div>
              </div>
            </div>
          </div>
        </div>
      </section>


{/* ABROAD JOBS SECTION */}

<section className="py-20 bg-blue-50 border-y">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

    {/* LEFT SIDE TEXT */}
    <div>

      <span className="text-sm font-semibold text-blue-600">
        GLOBAL OPPORTUNITIES
      </span>

      <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
        Work Abroad & Build Your Global Career
      </h2>

      <p className="text-slate-600 mb-6 text-lg">
        Explore verified job opportunities in countries like Dubai, Canada,
        Germany, Singapore, and Australia. Start your international career today.
      </p>

      <Link to="/abroad-jobs">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow">
          Explore Foreign Jobs
        </button>
      </Link>

      <div className="flex gap-6 mt-8 text-sm text-slate-500">

        <div>
          <p className="text-xl font-bold text-slate-900">15K+</p>
          <p>International Jobs</p>
        </div>

        <div>
          <p className="text-xl font-bold text-slate-900">40+</p>
          <p>Countries</p>
        </div>

        <div>
          <p className="text-xl font-bold text-slate-900">2K+</p>
          <p>Hiring Companies</p>
        </div>

      </div>

    </div>

    {/* RIGHT SIDE VISUAL */}

    <div className="flex justify-center">
      <img
        src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff"
        alt="Abroad jobs"
        className="rounded-2xl shadow-xl w-[420px]"
      />
    </div>

  </div>
</section>



      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        <div className="trust-inner">
          <span className="trust-label">Hiring partners</span>
          <div className="trust-div" />
          <div className="trust-brands">{BRANDS.map(b => <span key={b} className="trust-brand">{b}</span>)}</div>
        </div>
      </div>

      {/* ── TRENDING SEARCHES (UNIQUE) ── */}
      <section className="trending-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#3B82F6', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>What's Hot</div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: '-0.8px', margin: 0 }}>
                Popular <span style={{ color: '#60A5FA' }}>Searches</span> Right Now
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 20, padding: '8px 16px' }}>
              <span style={{ width: 8, height: 8, background: '#4ADE80', borderRadius: '50%', display: 'inline-block', animation: 'pulse-red 1.5s infinite' }} />
              <span style={{ color: '#4ADE80', fontWeight: 700, fontSize: 13 }}>
                <span className="live-num" key={liveCount}>{liveCount.toLocaleString()}</span> people searching now
              </span>
            </div>
          </div>

          {/* Live ticker */}
          <div className="trending-ticker">
            <div className="ticker-live">
              <span className="ticker-dot" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#EF4444', letterSpacing: '1px' }}>LIVE</span>
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="ticker-scroll">
                {[...Array(2)].map((_, ri) =>
                  ['Rahul applied to Sales Exec in Mumbai', 'Priya got shortlisted at Zomato', '47 new IT jobs added in Bangalore', 'Sanjay got hired at HDFC Bank', '120 Work-from-Home jobs posted today', 'Meera got her first interview call', '230 Delivery jobs open in Delhi', 'Anil accepted offer at Reliance'].map((t, i) => (
                    <span key={`${ri}-${i}`} className="ticker-item">
                      <span style={{ color: '#3B82F6' }}>●</span> {t}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Mosaic Grid */}
          <div className="trending-mosaic">
            {/* BIG CARD 1 — spans 2 columns */}
            {(() => {
              const t = TRENDING[0];
              return (
                <Link to="/jobs" key={t.rank} className="trend-card big" style={{ gridColumn: 'span 2' }}
                  onMouseEnter={() => setHoveredTrend(t.rank)} onMouseLeave={() => setHoveredTrend(null)}>
                  <div className="trend-bg" style={{ background: `linear-gradient(135deg, ${t.color} 0%, #1D4ED8 100%)` }} />
                  <div className="trend-grid-pattern" />
                  <div className="trend-glow" style={{ background: t.accent }} />
                  <span className="trend-emoji">{t.emoji}</span>
                  <div className="trend-card-inner" style={{ position: 'relative', zIndex: 1 }}>
                    <div>
                      <div className="trend-rank">🔥 Trending at #{t.rank}</div>
                      <div className="trend-label">{t.label}</div>
                      <div className="trend-count" style={{ color: t.accent }}>{t.count.toLocaleString()}+ open positions</div>
                    </div>
                    <div className="trend-bottom">
                      <div className="trend-delta">↑ {t.delta}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="trend-view-all">View all <ChevronRight size={14} /></span>
                        <div className="trend-arrow-btn"><ArrowRight size={16} /></div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* BIG CARD 2 */}
            {(() => {
              const t = TRENDING[1];
              return (
                <Link to="/jobs" key={t.rank} className="trend-card big"
                  onMouseEnter={() => setHoveredTrend(t.rank)} onMouseLeave={() => setHoveredTrend(null)}>
                  <div className="trend-bg" style={{ background: `linear-gradient(135deg, ${t.color} 0%, #4C1D95 100%)` }} />
                  <div className="trend-grid-pattern" />
                  <div className="trend-glow" style={{ background: t.accent }} />
                  <span className="trend-emoji">{t.emoji}</span>
                  <div className="trend-card-inner" style={{ position: 'relative', zIndex: 1 }}>
                    <div>
                      <div className="trend-rank">🔥 Trending at #{t.rank}</div>
                      <div className="trend-label">{t.label}</div>
                      <div className="trend-count" style={{ color: t.accent }}>{t.count.toLocaleString()}+ open positions</div>
                    </div>
                    <div className="trend-bottom">
                      <div className="trend-delta">↑ {t.delta}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="trend-view-all">View all <ChevronRight size={14} /></span>
                        <div className="trend-arrow-btn"><ArrowRight size={16} /></div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })()}


          


          







            {/* 3 SMALL CARDS */}
            {TRENDING.slice(2).map(t => (
              <Link to="/jobs" key={t.rank} className="trend-card small"
                onMouseEnter={() => setHoveredTrend(t.rank)} onMouseLeave={() => setHoveredTrend(null)}>
                <div className="trend-bg" style={{ background: `linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)`, border: `1.5px solid ${t.color}30` }} />
                <div className="trend-grid-pattern" />
                <div className="trend-glow" style={{ background: t.color }} />
                <span className="trend-emoji">{t.emoji}</span>
                <div className="trend-card-inner" style={{ position: 'relative', zIndex: 1 }}>
                  <div>
                    <div className="trend-rank" style={{ color: t.accent }}>Trending #{t.rank}</div>
                    <div className="trend-label" style={{ fontSize: 17 }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4, fontWeight: 600 }}>{t.count.toLocaleString()}+ jobs</div>
                  </div>
                  <div className="trend-bottom">
                    <div className="trend-delta" style={{ fontSize: 10 }}>↑ {t.delta}</div>
                    <div className="trend-arrow-btn" style={{ width: 30, height: 30 }}><ArrowRight size={13} /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section" style={{ background: '#F7F9FC' }}>
        <div className="section-inner">
          <div className="section-head-row">
            <div><div className="section-eyebrow">Browse by Category</div><div className="section-h2">Jobs for Every Skill</div></div>
            <Link to="/jobs" className="see-all">View all <ChevronRight size={16} /></Link>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(c => (
              <div key={c.label} className="cat-card">
                <div className="cat-icon">{c.icon}</div>
                <div className="cat-label">{c.label}</div>
                <div className="cat-count">{c.count} jobs</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ── */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-inner">
          <div className="section-head-row">
            <div><div className="section-eyebrow">Hot Right Now</div><div className="section-h2">Featured Jobs</div></div>
            <Link to="/jobs" className="see-all">See all <ChevronRight size={16} /></Link>
          </div>
          <div className="jobs-grid">
            {FEATURED_JOBS.map(job => (
              <div key={job.title} className="job-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="job-logo" style={{ background: job.color }}>{job.logo}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 15 }}>{job.title}</div>
                      <div style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>{job.company}</div>
                    </div>
                  </div>
                  <span className={`badge ${job.type === 'Full-time' ? 'badge-blue' : 'badge-green'}`}>{job.type}</span>
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748B', fontSize: 13 }}><MapPin size={12} /> {job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#16A34A', fontSize: 13, fontWeight: 700 }}><IndianRupee size={12} /> {job.salary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="section" style={{ background: '#F7F9FC' }} data-testid="features-section">
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div className="section-eyebrow">Why NayaJob</div>
            <div className="section-h2" style={{ marginBottom: 10 }}>Built for Bharat's Workforce</div>
            <p style={{ color: '#64748B', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>Tools for job seekers and recruiters — all in one place, all for free.</p>
          </div>
          <div className="tab-switch">
            <button className={`tab-btn ${activeTab === 'seeker' ? 'active' : ''}`} onClick={() => setActiveTab('seeker')}>For Job Seekers</button>
            <button className={`tab-btn ${activeTab === 'recruiter' ? 'active' : ''}`} onClick={() => setActiveTab('recruiter')}>For Recruiters</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, alignItems: 'center' }}>
            <div>
              {(activeTab === 'seeker' ? [
                { icon: <Zap size={19} color="#1E40AF" />, bg: '#EFF6FF', title: 'AI Job Matching', desc: 'Instantly matched to roles that fit your skills, location, and salary expectations.' },
                { icon: <Search size={19} color="#0891B2" />, bg: '#E0F2FE', title: 'Smart Filters', desc: 'Filter by city, salary, work type, experience, and industry.' },
                { icon: <TrendingUp size={19} color="#16A34A" />, bg: '#F0FDF4', title: 'Application Tracker', desc: 'Know your real-time status — applied, shortlisted, or hired.' },
                { icon: <MessageSquare size={19} color="#D97706" />, bg: '#FFFBEB', title: 'Direct Chat with HR', desc: 'Message recruiters in-app without sharing your personal number.' },
              ] : [
                { icon: <Users size={19} color="#7C3AED" />, bg: '#F5F3FF', title: 'Verified Candidate Pool', desc: '18L+ job seekers filtered by skill, location, and availability.' },
                { icon: <Zap size={19} color="#1E40AF" />, bg: '#EFF6FF', title: 'AI Shortlisting', desc: 'Ranked candidates by fit score — time only on the best.' },
                { icon: <MessageSquare size={19} color="#0891B2" />, bg: '#E0F2FE', title: 'Bulk Messaging', desc: 'Reach hundreds of candidates with personalized interview invites.' },
                { icon: <TrendingUp size={19} color="#16A34A" />, bg: '#F0FDF4', title: 'Hiring Analytics', desc: 'Track job performance, funnel metrics, and time-to-hire.' },
              ]).map(f => (
                <div key={f.title} className="feat-row">
                  <div className="feat-icon" style={{ background: f.bg }}>{f.icon}</div>
                  <div><div className="feat-title">{f.title}</div><div className="feat-desc">{f.desc}</div></div>
                </div>
              ))}
            </div>
            <div className="feat-visual">
              <div style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', borderRadius: 14, padding: '20px 22px', color: 'white', marginBottom: 16 }}>
                <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 4 }}>AI Match Score</div>
                <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>94%</div>
                <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '94%' }} /></div>
              </div>
              {[{ l: 'Jobs Applied', v: '12', c: '#1E40AF' }, { l: 'Shortlisted', v: '5', c: '#16A34A' }, { l: 'Interviews', v: '3', c: '#D97706' }].map(r => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontSize: 14 }}>{r.l}</span>
                  <span style={{ fontWeight: 800, color: r.c, fontSize: 20 }}>{r.v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, background: '#F0FDF4', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={16} color="#16A34A" />
                <span style={{ color: '#16A34A', fontWeight: 600, fontSize: 13 }}>Interview scheduled at HDFC Bank!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="section" style={{ background: 'white' }} data-testid="how-it-works-section">
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="section-eyebrow">Simple Process</div>
            <div className="section-h2">Get Hired in 3 Steps</div>
          </div>
          <div className="steps-grid">
            <div className="step-conn" style={{ left: 'calc(33.33% + 27px)', width: 'calc(33.33% - 54px)' }} />
            <div className="step-conn" style={{ left: 'calc(66.66% + 27px)', width: 'calc(33.33% - 54px)' }} />
            {[
              { e: '👤', n: '01', t: 'Create Profile', d: 'Sign up in 2 minutes. Add skills, experience, and preferred job types.' },
              { e: '⚡', n: '02', t: 'Get AI-Matched', d: 'Our system finds the best-fit jobs near you — no endless scrolling.' },
              { e: '🎉', n: '03', t: 'Apply & Get Hired', d: 'One-tap apply. Chat with HR directly. Get your offer letter fast.' },
            ].map((s, i) => (
              <div key={s.t} style={{ textAlign: 'center' }}>
                <div className="step-circle">
                  <span style={{ fontSize: 22 }}>{s.e}</span>
                  <div className="step-num">{i + 1}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#CBD5E1', letterSpacing: '1px', marginBottom: 10 }}>STEP {s.n}</div>
                <h3 style={{ fontWeight: 800, color: '#0F172A', fontSize: 17, marginBottom: 10 }}>{s.t}</h3>
                <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7, maxWidth: 210, margin: '0 auto' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: '#F7F9FC' }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div className="section-eyebrow">Success Stories</div>
            <div className="section-h2">People Love NayaJob</div>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="testi-card">
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#FBBF24" color="#FBBF24" />)}
                </div>
                <p style={{ color: '#334155', fontSize: 14, lineHeight: 1.75, marginBottom: 18 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="testi-avatar">{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: '#64748B', fontSize: 12 }}>{t.role} · {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section section" data-testid="cta-section">
        <div className="cta-inner">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '5px 14px', marginBottom: 22 }}>
            <Shield size={12} color="rgba(255,255,255,0.75)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>100% Free · No hidden charges · Verified companies</span>
          </div>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: 'white', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 14 }}>Your next job is<br />one click away.</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>Join 18 lakh+ job seekers already using NayaJob to find better opportunities faster.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            <button className="btn-cta-white" onClick={() => setShowModal(true)} data-testid="cta-register-btn">Create Free Account <ArrowRight size={14} /></button>
            <Link to="/jobs" className="btn-cta-ghost">Browse Jobs</Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {['No registration fee', 'Instant job alerts', '100% verified companies'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}><CheckCircle size={13} /> {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-root">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={14} color="white" />
              </div>
              <span style={{ fontWeight: 800, color: 'white', fontSize: 17 }}>Naya<span style={{ color: '#60A5FA' }}>Job</span></span>
            </div>
            <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7, maxWidth: 220 }}>Connecting India's workforce with the right opportunities through smart technology.</p>
          </div>
          {[
            { title: 'Job Seekers', links: ['Browse Jobs', 'Create Profile', 'Job Alerts', 'Resume Tips'] },
            { title: 'Recruiters', links: ['Post a Job', 'Find Talent', 'Pricing', 'Bulk Hiring'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 18 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map(l => <li key={l}><a href="#" className="footer-link">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p style={{ color: '#475569', fontSize: 13 }}>© 2025 NayaJob. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 22 }}>
            {['Privacy Policy', 'Terms of Service', 'Grievance Policy'].map(l => (
              <a key={l} href="#" style={{ color: '#475569', fontSize: 13, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}