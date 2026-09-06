import { createInterface } from 'readline/promises';
import crypto from 'crypto';
import '../src/config/env';
import connectDB from '../src/config/db';
import User from '../src/models/User';

const rl = createInterface({ input: process.stdin, output: process.stdout });

async function confirm(question: string): Promise<boolean> {
    const answer = await rl.question(`${question} (y/N) `);
    return answer.trim().toLowerCase() === 'y';
}

function generatePassword(): string {
    // 16 random bytes, base64url-encoded — short enough to read/type, long
    // enough to be a real secret. Printed once, never persisted anywhere else.
    return crypto.randomBytes(16).toString('base64url');
}

async function seedAdmins() {
    const emails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map(email => email.trim().toLowerCase())
        .filter(Boolean);

    if (emails.length === 0) {
        console.warn('⚠️  ADMIN_EMAILS is empty in the environment. Nothing to do — set it in backend/.env and re-run.');
        return;
    }

    console.log(`\n🔐 CreatorLyff admin seed`);
    console.log(`   Target emails (${emails.length}): ${emails.join(', ')}\n`);

    const proceed = await confirm('Grant admin access to these accounts?');
    if (!proceed) {
        console.log('Aborted — no changes made.');
        return;
    }

    await connectDB();

    let granted = 0;
    let alreadyAdmin = 0;
    let created = 0;
    let skipped = 0;

    for (const email of emails) {
        const existing = await User.findOne({ email });

        if (existing) {
            if (existing.isAdmin) {
                console.log(`⏭️  ${email} is already an admin.`);
                alreadyAdmin += 1;
                continue;
            }

            existing.isAdmin = true;
            await existing.save();
            console.log(`✅ Admin granted to existing user: ${email} (${existing.accountType})`);
            granted += 1;
            continue;
        }

        console.log(`\n❓ No account exists for ${email}.`);
        const shouldCreate = await confirm(`   Create a new admin account for ${email}?`);
        if (!shouldCreate) {
            console.log(`   Skipped ${email}.`);
            skipped += 1;
            continue;
        }

        const fullName = (await rl.question('   Full name for this account: ')).trim() || email.split('@')[0];
        let accountType = (await rl.question("   Account type — 'Brand' or 'Creator' [Brand]: ")).trim();
        if (accountType !== 'Creator') accountType = 'Brand';

        const password = generatePassword();
        const user = await User.create({
            fullName,
            email,
            password,
            accountType,
            isAdmin: true,
            emailVerified: true, // operator-created — skip the verification email flow
        });

        console.log(`✅ Created new admin: ${email}`);
        console.log(`   Generated password (shown once — share securely): ${password}`);
        created += 1;
    }

    console.log('\n📊 Summary');
    console.log(`   Granted to existing users: ${granted}`);
    console.log(`   Already admin:             ${alreadyAdmin}`);
    console.log(`   New accounts created:      ${created}`);
    console.log(`   Skipped:                   ${skipped}\n`);
}

seedAdmins()
    .then(() => {
        rl.close();
        process.exit(0);
    })
    .catch(error => {
        console.error('Admin seed failed:', error);
        rl.close();
        process.exit(1);
    });
