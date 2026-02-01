// Dummy data for Creator Dashboard

export interface Proposal {
    id: number;
    brandName: string;
    brandLogo: string;
    title: string;
    budget: number;
    deliverables: string;
    deadline: string;
    status: 'new' | 'accepted' | 'declined';
    description?: string;
    usageRights?: string;
}

export interface Brand {
    id: number;
    name: string;
    logo: string;
    industry: string;
    activelyHiring: boolean;
    description?: string;
}

export interface CreatorStats {
    totalEarnings: number;
    pendingProposals: number;
    profileViews: number;
    proposals: Proposal[];
    brands: Brand[];
}

export const creatorDummyData: CreatorStats = {
    totalEarnings: 45000,
    pendingProposals: 4,
    profileViews: 127,
    proposals: [
        {
            id: 1,
            brandName: "FitLife Nutrition",
            brandLogo: "FL",
            title: "Protein Shake Campaign",
            budget: 15000,
            deliverables: "2 Reels, 3 Stories",
            deadline: "2026-02-15",
            status: "new",
            description: "Promote our new protein shake line with engaging fitness content. Focus on post-workout recovery and taste.",
            usageRights: "Instagram only, 6 months"
        },
        {
            id: 2,
            brandName: "StyleHub Fashion",
            brandLogo: "SH",
            title: "Summer Collection Launch",
            budget: 12000,
            deliverables: "3 Reels, 2 Posts",
            deadline: "2026-02-20",
            status: "new",
            description: "Showcase our summer collection with vibrant, trendy content. Highlight versatility and comfort.",
            usageRights: "All platforms, 1 year"
        },
        {
            id: 3,
            brandName: "TechGear Pro",
            brandLogo: "TG",
            title: "Wireless Earbuds Review",
            budget: 18000,
            deliverables: "1 Reel, 5 Stories",
            deadline: "2026-02-10",
            status: "new",
            description: "Honest review of our new wireless earbuds. Focus on sound quality, battery life, and design.",
            usageRights: "Instagram & YouTube, perpetual"
        },
        {
            id: 4,
            brandName: "GlowSkin Beauty",
            brandLogo: "GS",
            title: "Skincare Routine Series",
            budget: 20000,
            deliverables: "4 Reels, 4 Posts",
            deadline: "2026-02-25",
            status: "new",
            description: "Create a morning and evening skincare routine featuring our products. Educational and authentic.",
            usageRights: "All platforms, 2 years"
        },
        {
            id: 5,
            brandName: "FoodieBox",
            brandLogo: "FB",
            title: "Meal Kit Unboxing",
            budget: 10000,
            deliverables: "2 Reels, 3 Stories",
            deadline: "2026-01-30",
            status: "accepted",
            description: "Unbox and cook a meal from our subscription service. Show the convenience and quality.",
            usageRights: "Instagram only, 3 months"
        },
        {
            id: 6,
            brandName: "ActiveWear Co",
            brandLogo: "AW",
            title: "Yoga Collection Feature",
            budget: 14000,
            deliverables: "3 Reels",
            deadline: "2026-01-25",
            status: "accepted",
            description: "Feature our new yoga collection in action. Focus on flexibility, comfort, and style.",
            usageRights: "Instagram & TikTok, 1 year"
        },
        {
            id: 7,
            brandName: "UrbanCafe",
            brandLogo: "UC",
            title: "Coffee Shop Vlog",
            budget: 8000,
            deliverables: "1 Reel, 2 Posts",
            deadline: "2026-01-20",
            status: "declined",
            description: "Visit our cafe and create content about the ambiance and specialty drinks.",
            usageRights: "Instagram only, 6 months"
        }
    ],
    brands: [
        {
            id: 1,
            name: "FitLife Nutrition",
            logo: "FL",
            industry: "Health & Fitness",
            activelyHiring: true,
            description: "Leading nutrition brand focused on fitness enthusiasts"
        },
        {
            id: 2,
            name: "StyleHub Fashion",
            logo: "SH",
            industry: "Fashion",
            activelyHiring: true,
            description: "Trendy fashion brand for young professionals"
        },
        {
            id: 3,
            name: "TechGear Pro",
            logo: "TG",
            industry: "Technology",
            activelyHiring: true,
            description: "Premium tech accessories and gadgets"
        },
        {
            id: 4,
            name: "GlowSkin Beauty",
            logo: "GS",
            industry: "Beauty & Skincare",
            activelyHiring: true,
            description: "Natural and organic skincare products"
        },
        {
            id: 5,
            name: "TravelVista",
            logo: "TV",
            industry: "Travel & Tourism",
            activelyHiring: false,
            description: "Curated travel experiences worldwide"
        },
        {
            id: 6,
            name: "HomeDecor Plus",
            logo: "HD",
            industry: "Home & Lifestyle",
            activelyHiring: true,
            description: "Modern home decor and furniture"
        }
    ]
};
