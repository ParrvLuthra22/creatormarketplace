import '../src/config/env';
import connectDB from '../src/config/db';
import User from '../src/models/User';

async function seedAdmins() {
    const emails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map(email => email.trim().toLowerCase())
        .filter(Boolean);

    if (emails.length === 0) {
        console.warn('ADMIN_EMAILS is empty. No admins seeded.');
        return;
    }

    await connectDB();

    for (const email of emails) {
        const user = await User.findOne({ email });
        if (!user) {
            console.warn(`Admin seed skipped: no user found for ${email}`);
            continue;
        }

        user.isAdmin = true;
        await user.save();
        console.log(`Admin enabled for ${email}`);
    }
}

seedAdmins()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Admin seed failed:', error);
        process.exit(1);
    });
