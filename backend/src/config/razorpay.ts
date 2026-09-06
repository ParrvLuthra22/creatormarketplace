import Razorpay from 'razorpay';

/**
 * Razorpay is intentionally disabled while CreatorLyff is in its beta/
 * validation phase — the pricing page shows "Join beta waitlist" instead of a
 * real checkout, and every route in routes/payments.ts is unmounted in
 * server.ts (guarded to no-op if `razorpay` below is null). This isn't a
 * missing integration; it's a deliberate decision confirmed with the team
 * to not take payments yet.
 *
 * To enable it later:
 *   1. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET / RAZORPAY_WEBHOOK_SECRET /
 *      RAZORPAY_PLAN_BASIC / RAZORPAY_PLAN_PRO in the environment (see
 *      backend/.env.example).
 *   2. Flip `hasValidCredentials` below back to the real check (currently
 *      forced to `false`) and uncomment the `new Razorpay(...)` block.
 *   3. Re-mount routes/payments.ts in server.ts (`app.use('/api/payments', ...)`)
 *      and remove the "Join beta waitlist" stub CTAs on the pricing page.
 */

// Check if Razorpay credentials are configured
const keyId = process.env.RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

// Only initialize Razorpay if valid credentials are provided
// Valid test keys start with 'rzp_test_', live keys start with 'rzp_live_'
const hasValidCredentials = false; // Force disabled for now
// keyId.startsWith('rzp_test_') || keyId.startsWith('rzp_live_');

let razorpay: Razorpay | null = null;

/*
if (hasValidCredentials) {
    razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
    console.log('✅ Razorpay initialized successfully');
} else {
    // console.warn('⚠️  Razorpay credentials not configured. Payment features will be disabled.');
    // console.warn('   Add valid credentials to .env to enable payments.');
}
*/

export default razorpay;
