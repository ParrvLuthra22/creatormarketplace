import '../src/config/env';
import connectDB from '../src/config/db';
import User from '../src/models/User';
import CreatorProfile from '../src/models/CreatorProfile';

// Cloudinary's public demo cloud — real, publicly hosted, no account/config
// needed. Deliberately reused across all 20 creators; this is throwaway
// demo/test data, not meant to look like distinct real photos.
const PLACEHOLDER_PHOTO = 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill,g_face/sample.jpg';

interface MockCreator {
    fullName: string;
    handle: string;
    niches: string[];
    followers: number; // 10K-500K
    engagement: string;
    location: string;
    bio: string;
}

const MOCK_CREATORS: MockCreator[] = [
    { fullName: 'Ananya Iyer', handle: 'ananya.frames', niches: ['Photography', 'Travel'], followers: 184_000, engagement: '4.8%', location: 'Bengaluru, India', bio: 'Travel and street photography — 30 countries and counting.' },
    { fullName: 'Rohan Mehta', handle: 'rohantalkstech', niches: ['Tech'], followers: 412_000, engagement: '3.9%', location: 'Mumbai, India', bio: 'Smartphone and gadget reviews, no sponsored fluff.' },
    { fullName: 'Kavya Reddy', handle: 'kavya.styled', niches: ['Fashion', 'Beauty'], followers: 276_000, engagement: '6.1%', location: 'Hyderabad, India', bio: 'Everyday styling for real budgets, not runway prices.' },
    { fullName: 'Aditya Rao', handle: 'adityalifts', niches: ['Fitness'], followers: 98_000, engagement: '7.4%', location: 'Pune, India', bio: 'Strength training and mobility for beginners.' },
    { fullName: 'Meera Joshi', handle: 'meerainthekitchen', niches: ['Food'], followers: 231_000, engagement: '5.2%', location: 'Ahmedabad, India', bio: 'Regional Indian recipes, tested and simplified.' },
    { fullName: 'Vikram Malhotra', handle: 'vikramexplores', niches: ['Travel'], followers: 156_000, engagement: '4.3%', location: 'Delhi, India', bio: 'Budget backpacking across South and Southeast Asia.' },
    { fullName: 'Ishaan Bhatt', handle: 'ishaanplays', niches: ['Gaming'], followers: 389_000, engagement: '5.9%', location: 'Chandigarh, India', bio: 'Competitive FPS and the occasional co-op chaos.' },
    { fullName: 'Priya Nambiar', handle: 'priyareadswrites', niches: ['Education', 'Lifestyle'], followers: 67_000, engagement: '8.1%', location: 'Kochi, India', bio: 'Study systems, note-taking, and slow mornings.' },
    { fullName: 'Arjun Nair', handle: 'arjun.finds', niches: ['Finance'], followers: 143_000, engagement: '4.6%', location: 'Bengaluru, India', bio: 'Personal finance for first-time earners.' },
    { fullName: 'Riya Malhotra', handle: 'riyapaints', niches: ['Art'], followers: 52_000, engagement: '9.0%', location: 'Jaipur, India', bio: 'Watercolor process videos and art supply reviews.' },
    { fullName: 'Kiara Deshmukh', handle: 'kiaramoves', niches: ['Fitness', 'Lifestyle'], followers: 219_000, engagement: '6.5%', location: 'Nagpur, India', bio: 'Dance-based cardio and flexibility routines.' },
    { fullName: 'Sana Iqbal', handle: 'sana.sustainably', niches: ['Sustainability', 'Lifestyle'], followers: 84_000, engagement: '7.8%', location: 'Lucknow, India', bio: 'Low-waste swaps that actually stick.' },
    { fullName: 'Karan Kapoor', handle: 'karanshoots', niches: ['Photography'], followers: 128_000, engagement: '4.1%', location: 'Chennai, India', bio: 'Portrait and event photography behind-the-scenes.' },
    { fullName: 'Tara Singh', handle: 'tarasings', niches: ['Music'], followers: 305_000, engagement: '5.5%', location: 'Amritsar, India', bio: 'Indie covers and original songwriting.' },
    { fullName: 'Naina Chopra', handle: 'nainaparents', niches: ['Parenting'], followers: 76_000, engagement: '6.9%', location: 'Gurugram, India', bio: 'Toddler routines and honest new-parent takes.' },
    { fullName: 'Yusuf Khan', handle: 'yusufonwheels', niches: ['Travel', 'Sports'], followers: 197_000, engagement: '4.9%', location: 'Hyderabad, India', bio: 'Motorcycle touring across the Himalayas and beyond.' },
    { fullName: 'Simran Kaur', handle: 'simranteaches', niches: ['Education'], followers: 118_000, engagement: '7.2%', location: 'Ludhiana, India', bio: 'Spoken English and interview prep, one video at a time.' },
    { fullName: 'Aryan Kapoor', handle: 'aryanlaughs', niches: ['Comedy'], followers: 445_000, engagement: '6.3%', location: 'Mumbai, India', bio: 'Sketch comedy about Indian family group chats.' },
    { fullName: 'Divya Rajan', handle: 'divyabeauty', niches: ['Beauty'], followers: 264_000, engagement: '5.8%', location: 'Coimbatore, India', bio: 'Skincare routines for humid climates.' },
    { fullName: 'Nikhil Verma', handle: 'nikhilbuilds', niches: ['Tech', 'Education'], followers: 92_000, engagement: '8.4%', location: 'Indore, India', bio: 'DIY electronics and beginner coding projects.' },
];

async function seedMockCreators() {
    await connectDB();

    console.log(`\n🌱 Seeding ${MOCK_CREATORS.length} mock creators...\n`);

    let created = 0;
    let skipped = 0;

    for (const mock of MOCK_CREATORS) {
        const email = `${mock.handle}@mock.creatorlyff.dev`;
        const existing = await User.findOne({ email });

        if (existing) {
            console.log(`⏭️  Skipped ${mock.fullName} (${email}) — already exists.`);
            skipped += 1;
            continue;
        }

        const user = await User.create({
            fullName: mock.fullName,
            email,
            password: 'MockCreatorSeed123!', // demo-only account, not meant for real login
            accountType: 'Creator',
            emailVerified: true,
        });

        await CreatorProfile.create({
            userId: user._id,
            instagramHandle: mock.handle,
            profilePhoto: PLACEHOLDER_PHOTO,
            bio: mock.bio,
            location: mock.location,
            niches: mock.niches,
            availability: 'available',
            followers: mock.followers >= 1000 ? `${Math.round(mock.followers / 1000)}K` : String(mock.followers),
            engagement: mock.engagement,
            combinedFollowerCount: mock.followers,
            instagramFollowerCount: mock.followers,
            primaryPlatform: 'instagram',
            pricing: {
                starting: Math.round(mock.followers * 0.15),
                per: 'post',
            },
        });

        console.log(`✅ Created ${mock.fullName} — @${mock.handle} (${mock.niches.join(', ')}, ${mock.followers.toLocaleString()} followers)`);
        created += 1;
    }

    console.log(`\n📊 Done — ${created} created, ${skipped} skipped.\n`);
}

seedMockCreators()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Mock creator seed failed:', error);
        process.exit(1);
    });
