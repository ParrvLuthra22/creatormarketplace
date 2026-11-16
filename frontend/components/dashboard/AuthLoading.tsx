/**
 * Full-screen placeholder shown while a dashboard layout waits for
 * `/api/auth/me` to resolve (or for a wrong-role redirect to land).
 *
 * Why this exists: the API lives on a different site than the frontend in
 * production, so the auth cookie is invisible to Next.js middleware and the
 * session can only be verified client-side. Rendering the dashboard shell
 * before that check finishes would flash it at logged-out visitors and fire
 * child queries that 401.
 */
export default function AuthLoading() {
  return (
    <div
      className="min-h-screen grid place-items-center bg-(--bg-primary)"
      role="status"
      aria-label="Checking your session"
    >
      <div className="h-8 w-8 rounded-full border-2 border-(--border) border-t-(--accent) animate-spin" />
    </div>
  );
}
