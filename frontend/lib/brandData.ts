// Dummy data for Brand Dashboard

export interface CreatorHired {
    id: number;
    name: string;
    amount: number;
    date: string;
    niche: string;
    avatar?: string;
}

export interface Proposal {
    id: number;
    creatorId: number;
    creatorName: string;
    creatorAvatar?: string;
    status: 'Sent' | 'Viewed' | 'Accepted' | 'Declined';
    budget: number;
    sentDate: string;
    niche: string;
}

export interface BrandStats {
    totalRevenue: number;
    creatorsHired: CreatorHired[];
    pendingProposals: Proposal[];
}

export const brandDummyData: BrandStats = {
    totalRevenue: 124500,
    creatorsHired: [
        {
            id: 1,
            name: "Priya Sharma",
            amount: 15000,
            date: "2026-01-15",
            niche: "Fashion",
            avatar: "PS"
        },
        {
            id: 2,
            name: "Arjun Mehta",
            amount: 20000,
            date: "2026-01-10",
            niche: "Tech",
            avatar: "AM"
        },
        {
            id: 3,
            name: "Zara Khan",
            amount: 18000,
            date: "2026-01-08",
            niche: "Beauty",
            avatar: "ZK"
        },
        {
            id: 4,
            name: "Rohan Verma",
            amount: 12000,
            date: "2026-01-05",
            niche: "Fitness",
            avatar: "RV"
        },
        {
            id: 5,
            name: "Ananya Desai",
            amount: 16500,
            date: "2025-12-28",
            niche: "Food",
            avatar: "AD"
        },
        {
            id: 6,
            name: "Kabir Singh",
            amount: 14000,
            date: "2025-12-20",
            niche: "Travel",
            avatar: "KS"
        },
        {
            id: 7,
            name: "Meera Patel",
            amount: 13000,
            date: "2025-12-15",
            niche: "Lifestyle",
            avatar: "MP"
        },
        {
            id: 8,
            name: "Vikram Joshi",
            amount: 16000,
            date: "2025-12-10",
            niche: "Gaming",
            avatar: "VJ"
        }
    ],
    pendingProposals: [
        {
            id: 1,
            creatorId: 9,
            creatorName: "Simran Kaur",
            creatorAvatar: "SK",
            status: "Sent",
            budget: 18000,
            sentDate: "2026-01-28",
            niche: "Fashion"
        },
        {
            id: 2,
            creatorId: 10,
            creatorName: "Aditya Rao",
            creatorAvatar: "AR",
            status: "Viewed",
            budget: 22000,
            sentDate: "2026-01-27",
            niche: "Tech"
        },
        {
            id: 3,
            creatorId: 11,
            creatorName: "Nisha Gupta",
            creatorAvatar: "NG",
            status: "Sent",
            budget: 15000,
            sentDate: "2026-01-26",
            niche: "Beauty"
        }
    ]
};
