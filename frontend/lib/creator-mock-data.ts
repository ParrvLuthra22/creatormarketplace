// ─── Extended creator profile (Alex Rivera, logged-in creator) ────────────────

export const creatorProfile = {
  id: "c1",
  name: "Alex Rivera",
  handle: "alexrivera",
  displayHandle: "@alexrivera",
  bio: "Tech enthusiast and early adopter. I help 2.4M+ followers discover what's next in consumer tech, software, and digital culture — through honest reviews, deep dives, and creator-first storytelling.",
  location: "San Francisco, CA",
  gradient: "linear-gradient(135deg,#27272a,#18181b)",
  coverGradient:
    "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 40%, #0d2137 70%, #162032 100%)",
  verified: true,
  niche: ["Tech", "Gadgets", "Software"],
  platforms: [
    { name: "YouTube", connected: true, followers: 1800000, engagement: 6.1, avgViews: 220000 },
    { name: "Instagram", connected: true, followers: 2400000, engagement: 8.2, avgViews: 180000 },
    { name: "TikTok", connected: false, followers: 0, engagement: 0, avgViews: 0 },
    { name: "X", connected: true, followers: 340000, engagement: 3.8, avgViews: 0 },
    { name: "LinkedIn", connected: false, followers: 0, engagement: 0, avgViews: 0 },
    { name: "Snapchat", connected: false, followers: 0, engagement: 0, avgViews: 0 },
  ],
  contentStyle: ["Review", "Tutorial", "Vlog"],
  responseRate: 94,
  avgTurnaround: 5,
  profileCompletionPct: 80,
  profileCompletionMissing: ["Audience demographics", "2 portfolio samples"],
  audienceAge: [
    { label: "18–24", pct: 38 },
    { label: "25–34", pct: 32 },
    { label: "35–44", pct: 15 },
    { label: "13–17", pct: 8 },
    { label: "45+", pct: 7 },
  ],
  audienceGender: [
    { label: "Male", pct: 62, color: "var(--accent)" },
    { label: "Female", pct: 33, color: "var(--border-strong)" },
    { label: "Non-binary", pct: 5, color: "var(--text-tertiary)" },
  ],
  audienceLocations: [
    { country: "United States", flag: "🇺🇸", pct: 38 },
    { country: "United Kingdom", flag: "🇬🇧", pct: 14 },
    { country: "Canada", flag: "🇨🇦", pct: 11 },
    { country: "Germany", flag: "🇩🇪", pct: 8 },
    { country: "Australia", flag: "🇦🇺", pct: 7 },
  ],
  pricing: {
    public: true,
    openToNegotiation: true,
    rates: [
      { platform: "Instagram", type: "Feed Post", rate: 4500 },
      { platform: "Instagram", type: "Story (×3)", rate: 1200 },
      { platform: "Instagram", type: "Reel", rate: 3800 },
      { platform: "YouTube", type: "Dedicated Video", rate: 18000 },
      { platform: "YouTube", type: "Integration", rate: 8500 },
      { platform: "X", type: "Post", rate: 800 },
    ],
  },
  pastCollabs: [
    { brand: "Vercel", year: 2025, campaign: "Developer Spotlight" },
    { brand: "Figma", year: 2025, campaign: "Design × Tech Series" },
    { brand: "Linear", year: 2024, campaign: "Dev Tools Review" },
    { brand: "Notion", year: 2024, campaign: "Productivity Creators" },
    { brand: "Raycast", year: 2025, campaign: "Power User Series" },
  ],
};

// ─── Creator stats ─────────────────────────────────────────────────────────────

export const creatorStats = {
  inboundRequests: { value: 12, trend: 3, up: true },
  activeDeals: { value: 3, trend: 1, up: true },
  monthEarnings: { value: 8400, trend: 18, up: true },
  profileViews: { value: 2847, trend: 24, up: true },
};

// ─── Portfolio items ───────────────────────────────────────────────────────────

export interface PortfolioItem {
  id: string;
  title: string;
  platform: string;
  type: "video" | "image";
  views: number;
  likes: number;
  gradient: string;
  span: "wide" | "tall" | "square";
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "p1",
    title: "Unboxing Apple Vision Pro — Honest 30-day review",
    platform: "YouTube",
    type: "video",
    views: 2800000,
    likes: 124000,
    gradient: "linear-gradient(135deg,#1a1a2e,#16213e)",
    span: "wide",
  },
  {
    id: "p2",
    title: "Minimal Tech Setup 2026",
    platform: "Instagram",
    type: "image",
    views: 0,
    likes: 420000,
    gradient: "linear-gradient(135deg,#2d2d2d,#111)",
    span: "tall",
  },
  {
    id: "p3",
    title: "M4 MacBook Pro — Is It Worth It?",
    platform: "YouTube",
    type: "video",
    views: 1400000,
    likes: 68000,
    gradient: "linear-gradient(135deg,#0f3460,#1a1a2e)",
    span: "square",
  },
  {
    id: "p4",
    title: "Behind the Algorithm — How I grew to 2.4M",
    platform: "YouTube",
    type: "video",
    views: 890000,
    likes: 45000,
    gradient: "linear-gradient(135deg,#1e293b,#0f172a)",
    span: "wide",
  },
  {
    id: "p5",
    title: "Top 5 Dev Tools I Can't Live Without",
    platform: "Instagram",
    type: "image",
    views: 0,
    likes: 340000,
    gradient: "linear-gradient(135deg,#292524,#111)",
    span: "square",
  },
  {
    id: "p6",
    title: "Day in the Life: Tech Creator in SF",
    platform: "YouTube",
    type: "video",
    views: 3100000,
    likes: 188000,
    gradient: "linear-gradient(135deg,#1a2a1a,#0f1f0f)",
    span: "tall",
  },
];

// ─── Collab requests ───────────────────────────────────────────────────────────

export type RequestStatus = "new" | "negotiating" | "declined" | "archived";

export interface CollabRequest {
  id: string;
  brandName: string;
  brandIndustry: string;
  brandGradient: string;
  campaignTitle: string;
  brief: string;
  budgetMin: number;
  budgetMax: number;
  deliverables: string[];
  deadline: string;
  status: RequestStatus;
  receivedAt: string;
}

export const collabRequests: CollabRequest[] = [
  {
    id: "req1",
    brandName: "Aether Collective",
    brandIndustry: "Lifestyle & Apparel",
    brandGradient: "linear-gradient(135deg,#2a2a3a,#111)",
    campaignTitle: "Summer Capsule — Tech Creator Collab",
    brief:
      "We're launching a minimalist summer capsule and want to partner with tech creators who embody the aesthetic. Looking for authentic lifestyle content that integrates our pieces naturally into your everyday setup.",
    budgetMin: 4000,
    budgetMax: 6000,
    deliverables: ["1 YouTube integration", "2 Instagram posts", "3 Stories"],
    deadline: "2026-06-01",
    status: "new",
    receivedAt: "2 hours ago",
  },
  {
    id: "req2",
    brandName: "Vercel",
    brandIndustry: "Developer Tools",
    brandGradient: "linear-gradient(135deg,#1a1a1a,#000)",
    campaignTitle: "Developer Spotlight Series",
    brief:
      "Showcase how you use Vercel in your workflow. We want genuine, technical deep-dives from creators who actually use the product. Full creative control — just honest perspective.",
    budgetMin: 7000,
    budgetMax: 10000,
    deliverables: ["1 YouTube dedicated video (15-20 min)", "1 X thread"],
    deadline: "2026-05-28",
    status: "new",
    receivedAt: "5 hours ago",
  },
  {
    id: "req3",
    brandName: "Notion",
    brandIndustry: "Productivity",
    brandGradient: "linear-gradient(135deg,#2d2d2d,#111)",
    campaignTitle: "Productivity Creators Q2",
    brief:
      "We want to partner with creators who actively use Notion in their workflow — content creation, project management, life admin. Show how you actually use it, messy and real.",
    budgetMin: 3500,
    budgetMax: 5000,
    deliverables: ["1 YouTube tutorial (8-12 min)", "2 Instagram Stories"],
    deadline: "2026-06-15",
    status: "negotiating",
    receivedAt: "Yesterday",
  },
  {
    id: "req4",
    brandName: "Spotify",
    brandIndustry: "Music & Podcasting",
    brandGradient: "linear-gradient(135deg,#1a3a1a,#0f1f0f)",
    campaignTitle: "Music × Tech Creators",
    brief:
      "Exploring how tech creators use Spotify in their lives. Looking for natural integrations — playlists for focus, podcasts for learning, etc.",
    budgetMin: 6000,
    budgetMax: 9000,
    deliverables: ["1 Instagram Reel", "5 Stories", "1 Spotify-native content piece"],
    deadline: "2026-05-20",
    status: "declined",
    receivedAt: "3 days ago",
  },
  {
    id: "req5",
    brandName: "Linear",
    brandIndustry: "Project Management",
    brandGradient: "linear-gradient(135deg,#1e293b,#0f172a)",
    campaignTitle: "Dev Tool Review Series",
    brief:
      "An honest review and workflow walkthrough of Linear. We trust your voice and won't script the content — just show how you'd genuinely use it.",
    budgetMin: 2500,
    budgetMax: 4000,
    deliverables: ["1 YouTube video", "1 Twitter thread"],
    deadline: "2026-05-10",
    status: "archived",
    receivedAt: "2 weeks ago",
  },
];

// ─── Active deals ──────────────────────────────────────────────────────────────

export type DealStage =
  | "Brief"
  | "Creation"
  | "Review"
  | "Approved"
  | "Posted"
  | "Paid";

export interface DealDeliverable {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface ActiveDeal {
  id: string;
  brandName: string;
  brandGradient: string;
  campaignTitle: string;
  value: number;
  stage: DealStage;
  paymentStatus: "pending" | "processing" | "paid";
  deliverables: DealDeliverable[];
  deadline: string;
  brief: string;
}

export const activeDeals: ActiveDeal[] = [
  {
    id: "deal1",
    brandName: "Aether Collective",
    brandGradient: "linear-gradient(135deg,#2a2a3a,#111)",
    campaignTitle: "Summer Capsule — Tech Creator",
    value: 4500,
    stage: "Review",
    paymentStatus: "pending",
    deadline: "2026-06-01",
    brief:
      "Authentic lifestyle content integrating Aether's summer capsule into your everyday tech setup.",
    deliverables: [
      { id: "d1a", title: "YouTube integration (3-5 min segment)", dueDate: "May 20", completed: true },
      { id: "d1b", title: "Instagram post — setup/flat lay", dueDate: "May 22", completed: true },
      { id: "d1c", title: "Instagram post — lifestyle wear", dueDate: "May 24", completed: false },
      { id: "d1d", title: "3× Instagram Stories", dueDate: "May 25", completed: false },
    ],
  },
  {
    id: "deal2",
    brandName: "Figma",
    brandGradient: "linear-gradient(135deg,#2d1f3d,#111)",
    campaignTitle: "Design × Tech Series",
    value: 8500,
    stage: "Creation",
    paymentStatus: "pending",
    deadline: "2026-05-30",
    brief:
      "Show how designers and developers actually use Figma together. Focus on real workflow, not polished demos.",
    deliverables: [
      { id: "d2a", title: "YouTube dedicated video (15-20 min)", dueDate: "May 28", completed: false },
      { id: "d2b", title: "Instagram carousel (10 slides)", dueDate: "May 29", completed: false },
      { id: "d2c", title: "X thread (10 tweets)", dueDate: "May 29", completed: false },
    ],
  },
  {
    id: "deal3",
    brandName: "Raycast",
    brandGradient: "linear-gradient(135deg,#3d2f1f,#111)",
    campaignTitle: "Power User Series — Season 2",
    value: 3200,
    stage: "Approved",
    paymentStatus: "processing",
    deadline: "2026-05-15",
    brief:
      "Show your Raycast setup and extensions workflow. How does it actually save you time?",
    deliverables: [
      { id: "d3a", title: "YouTube short (2-3 min)", dueDate: "May 12", completed: true },
      { id: "d3b", title: "Instagram Reel", dueDate: "May 13", completed: true },
      { id: "d3c", title: "2× Instagram Stories", dueDate: "May 14", completed: true },
    ],
  },
];

// ─── Earnings ──────────────────────────────────────────────────────────────────

export const earningsData = {
  totalEarned: 84200,
  pendingPayouts: 12800,
  thisMonth: 8400,
};

export const monthlyEarnings = [
  { month: "Nov", amount: 6200 },
  { month: "Dec", amount: 14800 },
  { month: "Jan", amount: 7400 },
  { month: "Feb", amount: 9600 },
  { month: "Mar", amount: 11200 },
  { month: "Apr", amount: 8400 },
];

export type TransactionStatus = "paid" | "pending" | "processing";

export interface Transaction {
  id: string;
  date: string;
  brandName: string;
  campaign: string;
  amount: number;
  status: TransactionStatus;
}

export const transactions: Transaction[] = [
  { id: "t1", date: "Apr 22", brandName: "Aether Collective", campaign: "Summer Capsule", amount: 4500, status: "pending" },
  { id: "t2", date: "Apr 18", brandName: "Figma", campaign: "Design × Tech Series", amount: 8500, status: "processing" },
  { id: "t3", date: "Apr 10", brandName: "Raycast", campaign: "Power User S2", amount: 3200, status: "paid" },
  { id: "t4", date: "Mar 28", brandName: "Vercel", campaign: "Dev Spotlight", amount: 9000, status: "paid" },
  { id: "t5", date: "Mar 15", brandName: "Notion", campaign: "Productivity Q1", amount: 4200, status: "paid" },
  { id: "t6", date: "Feb 20", brandName: "Linear", campaign: "Dev Tools Review", amount: 3500, status: "paid" },
  { id: "t7", date: "Feb 08", brandName: "Spotify", campaign: "Music × Tech", amount: 7200, status: "paid" },
  { id: "t8", date: "Jan 25", brandName: "Canva", campaign: "Creator Tools", amount: 5800, status: "paid" },
  { id: "t9", date: "Jan 12", brandName: "Raycast", campaign: "Power User S1", amount: 2800, status: "paid" },
  { id: "t10", date: "Dec 28", brandName: "Framer", campaign: "No-Code Series", amount: 6400, status: "paid" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function formatCurrencyShort(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}
