export interface BrandWork {
    brandName: string;
    contentType: "Reel" | "Story" | "Post";
    videoUrl?: string; // Using placeholder or color blocks for now if no video
    thumbnailUrl?: string;
    instagramLink: string;
}

export interface Pricing {
    starting: number;
    per: string;
}

export interface Creator {
    id: string;
    name: string;
    username: string;
    handle: string; // @username
    photo: string;
    niches: string[];
    followers: string;
    engagement: string;
    contentFormats: ("Reel" | "Story" | "Post")[];
    pricing: Pricing;
    availability: "available" | "limited" | "unavailable";
    brandWork: BrandWork[];
}

export const CREATORS: Creator[] = [
    {
        id: "1",
        name: "Priya Sharma",
        username: "priyacreates",
        handle: "@priyacreates",
        photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=FFCBDD&color=D63384&size=200",
        niches: ["Fashion", "Lifestyle", "Beauty"],
        followers: "45.2K",
        engagement: "4.5%",
        contentFormats: ["Reel", "Story", "Post"],
        pricing: {
            starting: 12000,
            per: "Reel"
        },
        availability: "available",
        brandWork: [
            {
                brandName: "Nykaa",
                contentType: "Reel",
                instagramLink: "#",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            },
            {
                brandName: "Myntra",
                contentType: "Post",
                instagramLink: "#",
                thumbnailUrl: "https://placehold.co/600x400/orange/white?text=Myntra+Collab"
            }
        ]
    },
    {
        id: "2",
        name: "Arjun Mehta",
        username: "arjunfit",
        handle: "@arjunfit",
        photo: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=FFE8CC&color=FD7E14&size=200",
        niches: ["Fitness", "Wellness"],
        followers: "32K",
        engagement: "3.2%",
        contentFormats: ["Reel", "Story"],
        pricing: {
            starting: 15000,
            per: "Reel"
        },
        availability: "limited",
        brandWork: [
            {
                brandName: "Cult.fit",
                contentType: "Reel",
                instagramLink: "#",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
        ]
    },
    {
        id: "3",
        name: "Zara Khan",
        username: "zarastyle",
        handle: "@zarastyle",
        niches: ["Beauty", "Fashion"],
        photo: "https://ui-avatars.com/api/?name=Zara+Khan&background=E0E7FF&color=4F46E5&size=200",
        followers: "28.5K",
        engagement: "5.8%",
        contentFormats: ["Reel", "Post"],
        pricing: {
            starting: 8000,
            per: "Reel"
        },
        availability: "available",
        brandWork: []
    },
    {
        id: "4",
        name: "Rahul Verma",
        username: "techrahul",
        handle: "@techrahul",
        photo: "https://ui-avatars.com/api/?name=Rahul+Verma&background=D1FAE5&color=059669&size=200",
        niches: ["Tech", "Reviews"],
        followers: "67K",
        engagement: "4.1%",
        contentFormats: ["Reel", "Post"],
        pricing: {
            starting: 18000,
            per: "Reel"
        },
        availability: "available",
        brandWork: [
            {
                brandName: "Samsung",
                contentType: "Reel",
                instagramLink: "#",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
        ]
    },
    {
        id: "5",
        name: "Anjali Desai",
        username: "foodwithanjali",
        handle: "@foodwithanjali",
        photo: "https://ui-avatars.com/api/?name=Anjali+Desai&background=FEF3C7&color=D97706&size=200",
        niches: ["Food", "Travel"],
        followers: "51K",
        engagement: "6.2%",
        contentFormats: ["Reel", "Story", "Post"],
        pricing: {
            starting: 14000,
            per: "Reel"
        },
        availability: "limited",
        brandWork: []
    },
    {
        id: "6",
        name: "Kabir Singh",
        username: "kabircomedy",
        handle: "@kabircomedy",
        photo: "https://ui-avatars.com/api/?name=Kabir+Singh&background=DBEAFE&color=2563EB&size=200",
        niches: ["Comedy", "Entertainment"],
        followers: "89K",
        engagement: "7.5%",
        contentFormats: ["Reel", "Story"],
        pricing: {
            starting: 22000,
            per: "Reel"
        },
        availability: "available",
        brandWork: [
            {
                brandName: "Swiggy",
                contentType: "Reel",
                instagramLink: "#",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
        ]
    },
    {
        id: "7",
        name: "Meera Patel",
        username: "meerafinance",
        handle: "@meerafinance",
        photo: "https://ui-avatars.com/api/?name=Meera+Patel&background=E9D5FF&color=9333EA&size=200",
        niches: ["Finance", "Education"],
        followers: "23K",
        engagement: "3.8%",
        contentFormats: ["Post", "Story"],
        pricing: {
            starting: 7000,
            per: "Post"
        },
        availability: "available",
        brandWork: []
    },
    {
        id: "8",
        name: "Vikram Rao",
        username: "viktravel",
        handle: "@viktravel",
        photo: "https://ui-avatars.com/api/?name=Vikram+Rao&background=CFFAFE&color=0891B2&size=200",
        niches: ["Travel", "Photography"],
        followers: "41K",
        engagement: "5.1%",
        contentFormats: ["Reel", "Post"],
        pricing: {
            starting: 13000,
            per: "Reel"
        },
        availability: "limited",
        brandWork: [
            {
                brandName: "MakeMyTrip",
                contentType: "Post",
                instagramLink: "#",
                thumbnailUrl: "https://placehold.co/600x400/cyan/white?text=MakeMyTrip"
            }
        ]
    },
    {
        id: "9",
        name: "Shreya Gupta",
        username: "shreyabeauty",
        handle: "@shreyabeauty",
        photo: "https://ui-avatars.com/api/?name=Shreya+Gupta&background=FCE7F3&color=DB2777&size=200",
        niches: ["Beauty", "Skincare"],
        followers: "38K",
        engagement: "4.9%",
        contentFormats: ["Reel", "Story", "Post"],
        pricing: {
            starting: 11000,
            per: "Reel"
        },
        availability: "available",
        brandWork: []
    },
    {
        id: "10",
        name: "Aditya Kumar",
        username: "adifitness",
        handle: "@adifitness",
        photo: "https://ui-avatars.com/api/?name=Aditya+Kumar&background=FEE2E2&color=DC2626&size=200",
        niches: ["Fitness", "Nutrition"],
        followers: "55K",
        engagement: "5.5%",
        contentFormats: ["Reel", "Story"],
        pricing: {
            starting: 16000,
            per: "Reel"
        },
        availability: "available",
        brandWork: [
            {
                brandName: "MyProtein",
                contentType: "Reel",
                instagramLink: "#",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
        ]
    },
    {
        id: "11",
        name: "Pooja Jain",
        username: "poojastyle",
        handle: "@poojastyle",
        photo: "https://ui-avatars.com/api/?name=Pooja+Jain&background=FEF9C3&color=CA8A04&size=200",
        niches: ["Fashion", "Luxury"],
        followers: "72K",
        engagement: "6.8%",
        contentFormats: ["Reel", "Post"],
        pricing: {
            starting: 25000,
            per: "Reel"
        },
        availability: "limited",
        brandWork: [
            {
                brandName: "Gucci",
                contentType: "Post",
                instagramLink: "#",
                thumbnailUrl: "https://placehold.co/600x400/yellow/black?text=Gucci"
            }
        ]
    },
    {
        id: "12",
        name: "Rohan Das",
        username: "rohantech",
        handle: "@rohantech",
        photo: "https://ui-avatars.com/api/?name=Rohan+Das&background=DBEAFE&color=1E40AF&size=200",
        niches: ["Tech", "AI"],
        followers: "61K",
        engagement: "4.7%",
        contentFormats: ["Reel", "Post", "Story"],
        pricing: {
            starting: 19000,
            per: "Reel"
        },
        availability: "available",
        brandWork: []
    }
];
