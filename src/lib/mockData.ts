// Mock data for demo purposes (remove when backend is ready)
import type { InvestorProfile, StartupProfile } from './api';

export const mockProfiles: (InvestorProfile | StartupProfile)[] = [
  {
    id: 1,
    user_id: 101,
    name: "TechVision AI",
    pitch: "Revolutionizing healthcare with AI diagnostics. We're building advanced AI models to detect diseases early through medical imaging. Our technology has achieved 95% accuracy in clinical trials.",
    industry: "Healthcare",
    stage: "Series A",
    location: "San Francisco, CA",
    website: "https://techvision.ai",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=1000&fit=crop"
    ],
    created_at: new Date().toISOString()
  } as StartupProfile,
  {
    id: 2,
    user_id: 102,
    name: "GreenEnergy Solutions",
    pitch: "Sustainable energy for tomorrow. Developing next-gen solar panels with 40% more efficiency. Already deployed in 500+ homes across California with amazing results.",
    industry: "Clean Energy",
    stage: "Seed",
    location: "Austin, TX",
    website: "https://greenenergy.io",
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=1000&fit=crop"
    ],
    created_at: new Date().toISOString()
  } as StartupProfile,
  {
    id: 3,
    user_id: 103,
    name: "EduTech Pro",
    pitch: "Personalized learning for every student. AI-powered education platform that adapts to each student's learning style. Used by 10,000+ students with 80% improvement in test scores.",
    industry: "Education",
    stage: "Pre-seed",
    location: "Boston, MA",
    website: "https://edutech.pro",
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=1000&fit=crop"
    ],
    created_at: new Date().toISOString()
  } as StartupProfile,
  {
    id: 4,
    user_id: 104,
    name: "FinanceFlow",
    pitch: "Making financial planning accessible to all. All-in-one financial management platform for small businesses. Automated bookkeeping, invoicing, and financial insights in one place.",
    industry: "FinTech",
    stage: "Series A",
    location: "New York, NY",
    website: "https://financeflow.app",
    images: [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=1000&fit=crop"
    ],
    created_at: new Date().toISOString()
  } as StartupProfile,
  {
    id: 5,
    user_id: 105,
    name: "Sarah Chen",
    bio: "Angel investor focusing on early-stage tech. Former VP at Google. Invested in 15+ startups including 2 unicorns. Passionate about AI, healthcare, and climate tech.",
    focus_areas: ["AI/ML", "Healthcare", "Climate Tech"],
    investment_range: "$50K - $500K",
    location: "Palo Alto, CA",
    website: "https://sarahchen.vc",
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop"
    ],
    created_at: new Date().toISOString()
  } as InvestorProfile
];
