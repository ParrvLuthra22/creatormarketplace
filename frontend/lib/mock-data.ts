// ─── Types ────────────────────────────────────────────────────────────────────

export interface Creator {
  id: string;
  name: string;
  handle: string;
  niche: string[];
  platforms: string[];
  followers: number;
  engagement: number;
  avgViews: number;
  gradient: string;
  verified: boolean;
  bio: string;
  location: string;
  contentStyle: string[];
  audienceAge: string;
  audienceGender: string;
  pricing: { post: number; story: number; reel: number };
}

export interface Campaign {
  id: string;
  title: string;
  brief: string;
  status: "active" | "pending" | "completed" | "draft";
  creators: string[]; // creator ids
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  niche: string[];
  deliverables: string[];
}

export interface Message {
  id: string;
  from: "brand" | "creator";
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  creatorId: string;
  unread: number;
  messages: Message[];
}

export interface ActivityItem {
  id: string;
  type: "accepted" | "message" | "completed" | "invited" | "payment";
  text: string;
  timestamp: string;
  creatorId?: string;
}

// ─── Mock Brand ───────────────────────────────────────────────────────────────

export const mockBrand = {
  id: "b1",
  name: "Aether Collective",
  industry: "Lifestyle & Apparel",
  website: "aethercollective.com",
  bio: "Premium minimalist lifestyle brand for the modern creative.",
  plan: "Growth",
  avatarInitials: "AC",
};

// ─── Mock Creators ────────────────────────────────────────────────────────────

export const mockCreators: Creator[] = [
  {
    id: "c1",
    name: "Alex Rivera",
    handle: "@alexrivera",
    niche: ["Tech", "Gadgets"],
    platforms: ["YouTube", "Instagram"],
    followers: 2400000,
    engagement: 8.2,
    avgViews: 180000,
    gradient: "linear-gradient(135deg,#27272a,#18181b)",
    verified: true,
    bio: "Tech enthusiast and early adopter. Helping millions discover what's next.",
    location: "San Francisco, CA",
    contentStyle: ["Review", "Tutorial", "Vlog"],
    audienceAge: "22–34",
    audienceGender: "68% Male",
    pricing: { post: 4500, story: 1200, reel: 3800 },
  },
  {
    id: "c2",
    name: "Maya Chen",
    handle: "@mayachen",
    niche: ["Sustainability", "Lifestyle"],
    platforms: ["Instagram", "TikTok"],
    followers: 890000,
    engagement: 12.1,
    avgViews: 95000,
    gradient: "linear-gradient(135deg,#334155,#0f172a)",
    verified: true,
    bio: "Living sustainably and sharing the journey — beauty, home, and conscious choices.",
    location: "Portland, OR",
    contentStyle: ["Aesthetic", "Tutorial", "Vlog"],
    audienceAge: "25–38",
    audienceGender: "78% Female",
    pricing: { post: 2200, story: 600, reel: 1800 },
  },
  {
    id: "c3",
    name: "Jordan Wolf",
    handle: "@jordanwolf",
    niche: ["Fitness", "Wellness"],
    platforms: ["Instagram", "YouTube", "TikTok"],
    followers: 5100000,
    engagement: 6.8,
    avgViews: 320000,
    gradient: "linear-gradient(135deg,#404040,#171717)",
    verified: true,
    bio: "5× national fitness champion. Transforming bodies and mindsets at scale.",
    location: "Miami, FL",
    contentStyle: ["Tutorial", "Comedy", "Vlog"],
    audienceAge: "18–32",
    audienceGender: "55% Male",
    pricing: { post: 8500, story: 2200, reel: 7000 },
  },
  {
    id: "c4",
    name: "Sam Torres",
    handle: "@samtorres",
    niche: ["Food", "Culture"],
    platforms: ["Instagram", "YouTube"],
    followers: 1800000,
    engagement: 9.4,
    avgViews: 140000,
    gradient: "linear-gradient(135deg,#44403c,#1c1917)",
    verified: true,
    bio: "Culinary storyteller. Street food, fine dining, and everything in between.",
    location: "New York, NY",
    contentStyle: ["Review", "Vlog", "Aesthetic"],
    audienceAge: "24–42",
    audienceGender: "60% Female",
    pricing: { post: 3200, story: 900, reel: 2800 },
  },
  {
    id: "c5",
    name: "Morgan Lee",
    handle: "@morganlee",
    niche: ["Finance", "Business"],
    platforms: ["LinkedIn", "YouTube", "Instagram"],
    followers: 3200000,
    engagement: 7.5,
    avgViews: 210000,
    gradient: "linear-gradient(135deg,#292524,#0c0a09)",
    verified: true,
    bio: "Ex-Goldman analyst breaking down personal finance for the next generation.",
    location: "Chicago, IL",
    contentStyle: ["Tutorial", "Review"],
    audienceAge: "26–40",
    audienceGender: "58% Male",
    pricing: { post: 5800, story: 1500, reel: 4800 },
  },
  {
    id: "c6",
    name: "Casey Park",
    handle: "@caseypark",
    niche: ["Art", "Design"],
    platforms: ["Instagram", "TikTok"],
    followers: 1100000,
    engagement: 11.3,
    avgViews: 88000,
    gradient: "linear-gradient(135deg,#1e293b,#0f172a)",
    verified: false,
    bio: "Graphic designer and illustrator. Making beautiful things and teaching others to do the same.",
    location: "Los Angeles, CA",
    contentStyle: ["Tutorial", "Aesthetic", "Vlog"],
    audienceAge: "20–32",
    audienceGender: "65% Female",
    pricing: { post: 2600, story: 700, reel: 2200 },
  },
  {
    id: "c7",
    name: "Taylor Kim",
    handle: "@taylorkim",
    niche: ["Travel", "Lifestyle"],
    platforms: ["Instagram", "YouTube", "TikTok"],
    followers: 4700000,
    engagement: 5.9,
    avgViews: 280000,
    gradient: "linear-gradient(135deg,#3f3f46,#18181b)",
    verified: true,
    bio: "87 countries, 0 bucket list items left. Redefining what it means to travel.",
    location: "Nomadic",
    contentStyle: ["Vlog", "Aesthetic", "Review"],
    audienceAge: "22–38",
    audienceGender: "52% Female",
    pricing: { post: 7200, story: 1900, reel: 6000 },
  },
  {
    id: "c8",
    name: "Riley Nash",
    handle: "@rileynash",
    niche: ["Gaming", "Tech"],
    platforms: ["YouTube", "TikTok", "Instagram"],
    followers: 6800000,
    engagement: 4.2,
    avgViews: 450000,
    gradient: "linear-gradient(135deg,#1e3a5f,#0f172a)",
    verified: true,
    bio: "Professional streamer and content creator. Making gaming culture mainstream.",
    location: "Austin, TX",
    contentStyle: ["Review", "Comedy", "Tutorial"],
    audienceAge: "16–28",
    audienceGender: "74% Male",
    pricing: { post: 11000, story: 3000, reel: 9000 },
  },
  {
    id: "c9",
    name: "Priya Mehta",
    handle: "@priyamehta",
    niche: ["Beauty", "Fashion"],
    platforms: ["Instagram", "YouTube", "TikTok"],
    followers: 2900000,
    engagement: 10.8,
    avgViews: 220000,
    gradient: "linear-gradient(135deg,#3b2f2f,#1a1010)",
    verified: true,
    bio: "Beauty founder, content creator, and unfiltered advocate for self-expression.",
    location: "London, UK",
    contentStyle: ["Tutorial", "Review", "Aesthetic"],
    audienceAge: "18–34",
    audienceGender: "88% Female",
    pricing: { post: 6500, story: 1700, reel: 5500 },
  },
  {
    id: "c10",
    name: "Zach Monroe",
    handle: "@zachmonroe",
    niche: ["Fitness", "Nutrition"],
    platforms: ["Instagram", "TikTok"],
    followers: 780000,
    engagement: 14.2,
    avgViews: 98000,
    gradient: "linear-gradient(135deg,#2d3a2a,#111b0e)",
    verified: false,
    bio: "Sports nutritionist and functional fitness coach. Science-backed content only.",
    location: "Denver, CO",
    contentStyle: ["Tutorial", "Review"],
    audienceAge: "24–38",
    audienceGender: "60% Male",
    pricing: { post: 1800, story: 500, reel: 1500 },
  },
  {
    id: "c11",
    name: "Luna Vasquez",
    handle: "@lunavasquez",
    niche: ["Parenting", "Lifestyle"],
    platforms: ["Instagram", "YouTube"],
    followers: 1400000,
    engagement: 13.5,
    avgViews: 110000,
    gradient: "linear-gradient(135deg,#3a2f4a,#1a1128)",
    verified: true,
    bio: "Mom of 3, brand builder, and advocate for conscious parenting.",
    location: "Dallas, TX",
    contentStyle: ["Vlog", "Tutorial", "Aesthetic"],
    audienceAge: "28–42",
    audienceGender: "85% Female",
    pricing: { post: 3000, story: 800, reel: 2500 },
  },
  {
    id: "c12",
    name: "Kai Nakamura",
    handle: "@kainakamura",
    niche: ["Music", "Lifestyle"],
    platforms: ["Instagram", "TikTok", "YouTube"],
    followers: 3600000,
    engagement: 8.9,
    avgViews: 260000,
    gradient: "linear-gradient(135deg,#2a2a3a,#0f0f1a)",
    verified: true,
    bio: "Multi-platinum producer and creative director. Music is a lifestyle.",
    location: "Tokyo, Japan",
    contentStyle: ["Vlog", "Tutorial", "Aesthetic"],
    audienceAge: "18–30",
    audienceGender: "50% Male",
    pricing: { post: 7800, story: 2000, reel: 6500 },
  },
];

// ─── Mock Campaigns ───────────────────────────────────────────────────────────

export const mockCampaigns: Campaign[] = [
  {
    id: "camp1",
    title: "Summer Capsule Collection Launch",
    brief:
      "Introduce our new summer capsule to audiences who value minimalist, quality-first fashion. Authentic lifestyle content that fits naturally into existing feeds.",
    status: "active",
    creators: ["c1", "c2", "c7"],
    budget: 18000,
    spent: 11200,
    startDate: "2026-04-01",
    endDate: "2026-05-31",
    niche: ["Lifestyle", "Fashion"],
    deliverables: ["1 feed post", "2 stories", "1 reel"],
  },
  {
    id: "camp2",
    title: "Wellness Partnership Q2",
    brief:
      "Position Aether Collective as the go-to apparel brand for fitness and wellness creators. Focus on movement, recovery, and daily rituals.",
    status: "active",
    creators: ["c3", "c10"],
    budget: 24000,
    spent: 8400,
    startDate: "2026-03-15",
    endDate: "2026-06-15",
    niche: ["Fitness", "Wellness"],
    deliverables: ["2 feed posts", "4 stories", "1 reel"],
  },
  {
    id: "camp3",
    title: "Spring Editorial Collab",
    brief: "High-concept editorial content for our spring editorial campaign.",
    status: "completed",
    creators: ["c6", "c9"],
    budget: 12000,
    spent: 12000,
    startDate: "2026-02-01",
    endDate: "2026-03-28",
    niche: ["Art", "Fashion"],
    deliverables: ["3 feed posts", "1 reel"],
  },
  {
    id: "camp4",
    title: "Tech Collab Pilot",
    brief: "Pilot campaign exploring crossover between tech and lifestyle audiences.",
    status: "pending",
    creators: ["c8"],
    budget: 15000,
    spent: 0,
    startDate: "2026-05-10",
    endDate: "2026-06-30",
    niche: ["Tech", "Lifestyle"],
    deliverables: ["2 feed posts", "1 integration"],
  },
  {
    id: "camp5",
    title: "Creator Ambassador Program",
    brief: "Long-term ambassador partnerships with top-performing creators.",
    status: "draft",
    creators: [],
    budget: 60000,
    spent: 0,
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    niche: ["Lifestyle"],
    deliverables: ["Monthly content package"],
  },
];

// ─── Mock Conversations ───────────────────────────────────────────────────────

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    creatorId: "c2",
    unread: 2,
    messages: [
      { id: "m1", from: "brand", text: "Hey Maya! Loved your latest post on sustainable fashion. We'd love to collaborate on our summer capsule.", timestamp: "10:24 AM" },
      { id: "m2", from: "creator", text: "Hi! Thanks so much — I'm definitely a fan of Aether's aesthetic. Tell me more about the campaign brief.", timestamp: "10:31 AM" },
      { id: "m3", from: "brand", text: "We're looking for 1 feed post + 2 stories showcasing the capsule naturally in your daily routine. Budget is $2,200 for the package.", timestamp: "10:35 AM" },
      { id: "m4", from: "creator", text: "That works for me! Can you send over the product specs and any mood board you have?", timestamp: "11:02 AM" },
      { id: "m5", from: "creator", text: "Also — do you have a preference on posting dates?", timestamp: "11:03 AM" },
    ],
  },
  {
    id: "conv2",
    creatorId: "c3",
    unread: 0,
    messages: [
      { id: "m1", from: "brand", text: "Jordan, we're huge fans. Excited to kick off the wellness campaign.", timestamp: "Yesterday" },
      { id: "m2", from: "creator", text: "Let's go! I'll need the apparel samples by end of next week to hit the timeline.", timestamp: "Yesterday" },
      { id: "m3", from: "brand", text: "Samples are shipping tomorrow — tracking number incoming.", timestamp: "Yesterday" },
    ],
  },
  {
    id: "conv3",
    creatorId: "c1",
    unread: 1,
    messages: [
      { id: "m1", from: "brand", text: "Alex, we have a tech × lifestyle pitch we think you'll love.", timestamp: "Mon" },
      { id: "m2", from: "creator", text: "Interested — what's the scope?", timestamp: "Mon" },
      { id: "m3", from: "brand", text: "2 posts, integration-style, with your honest review angle. $4,500 total.", timestamp: "Mon" },
      { id: "m4", from: "creator", text: "Rate works. Send the brief and I'll review by Friday.", timestamp: "Tue" },
    ],
  },
  {
    id: "conv4",
    creatorId: "c7",
    unread: 0,
    messages: [
      { id: "m1", from: "creator", text: "Just posted the summer reel! Check out the stats so far — 280K views in 4 hours 🔥", timestamp: "2d ago" },
      { id: "m2", from: "brand", text: "This is incredible. The engagement is off the charts. Thank you Taylor!", timestamp: "2d ago" },
      { id: "m3", from: "creator", text: "Love the collection. Happy to do a part 2 if you want.", timestamp: "2d ago" },
    ],
  },
  {
    id: "conv5",
    creatorId: "c9",
    unread: 0,
    messages: [
      { id: "m1", from: "brand", text: "Thanks for wrapping the spring editorial, Priya. The content was stunning.", timestamp: "1w ago" },
      { id: "m2", from: "creator", text: "It was a dream collab. Payment arrived — all confirmed ✓", timestamp: "1w ago" },
    ],
  },
  {
    id: "conv6",
    creatorId: "c6",
    unread: 0,
    messages: [
      { id: "m1", from: "brand", text: "Casey! Your editorial pieces were everything. Let's stay in touch for future collabs.", timestamp: "1w ago" },
      { id: "m2", from: "creator", text: "Absolutely! I'll keep Aether top of mind for anything editorial.", timestamp: "1w ago" },
    ],
  },
];

// ─── Mock Activity ────────────────────────────────────────────────────────────

export const mockActivity: ActivityItem[] = [
  { id: "a1", type: "accepted", text: "Jordan Wolf accepted your wellness campaign invitation.", timestamp: "2 min ago", creatorId: "c3" },
  { id: "a2", type: "message", text: "New message from @mayachen about Summer Capsule.", timestamp: "18 min ago", creatorId: "c2" },
  { id: "a3", type: "payment", text: "Payment of $3,200 sent to @samtorres for food campaign.", timestamp: "1 hr ago", creatorId: "c4" },
  { id: "a4", type: "completed", text: "Spring Editorial Collab marked as completed.", timestamp: "3 hr ago" },
  { id: "a5", type: "invited", text: "You invited @rileynash to Tech Collab Pilot.", timestamp: "Yesterday", creatorId: "c8" },
  { id: "a6", type: "accepted", text: "Maya Chen accepted your Summer Capsule proposal.", timestamp: "Yesterday", creatorId: "c2" },
  { id: "a7", type: "message", text: "New message from @alexrivera regarding the campaign brief.", timestamp: "2 days ago", creatorId: "c1" },
  { id: "a8", type: "payment", text: "Payment of $5,600 processed to @jordanwolf.", timestamp: "3 days ago", creatorId: "c3" },
];

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export const mockStats = {
  activeCampaigns: { value: 4, trend: 12, up: true },
  creatorsEngaged: { value: 23, trend: 8, up: true },
  pendingResponses: { value: 7, trend: 5, up: false },
  totalSpend: { value: 19600, trend: 24, up: true },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function getCreatorById(id: string): Creator | undefined {
  return mockCreators.find((c) => c.id === id);
}
