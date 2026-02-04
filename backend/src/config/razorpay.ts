import Razorpay from 'razorpay';

// Check if Razorpay credentials are configured
const keyId = process.env.RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

// Only initialize Razorpay if valid credentials are provided
// Valid test keys start with 'rzp_test_', live keys start with 'rzp_live_'
const hasValidCredentials = keyId.startsWith('rzp_test_') || keyId.startsWith('rzp_live_');

let razorpay: Razorpay | null = null;

if (hasValidCredentials) {
    razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
    console.log('✅ Razorpay initialized successfully');
} else {
    console.warn('⚠️  Razorpay credentials not configured. Payment features will be disabled.');
    console.warn('   Add valid credentials to .env to enable payments.');
}

export default razorpay;
