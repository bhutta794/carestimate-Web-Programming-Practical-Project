"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main style={{ background: "#F5F5F7", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .auth-card {
          background: #fff;
          border: 1px solid #E8E8EC;
          border-radius: 24px;
          padding: 2.75rem 2.5rem;
          width: 100%;
          max-width: 440px;
          animation: fadeUp 0.35s ease;
        }

        /* Tag */
        .auth-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 9999px;
          background: #EEF3FF; color: #0057FF;
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 1rem;
        }
        .auth-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: #0057FF; }

        .auth-title {
          font-size: 28px; font-weight: 800;
          letter-spacing: -0.04em; color: #111111;
          line-height: 1.1; margin-bottom: 0.375rem;
        }
        .auth-sub {
          font-size: 14px; color: #9999AA; font-weight: 400;
          margin-bottom: 2rem;
        }

        /* Error */
        .auth-error {
          background: #FEF2F2; border: 1px solid #FECACA;
          color: #DC2626; border-radius: 12px;
          padding: 0.75rem 1rem; font-size: 13px; font-weight: 500;
          margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 8px;
        }
        .auth-error-icon { flex-shrink: 0; }

        /* Form */
        .auth-field { margin-bottom: 1.125rem; }
        .auth-label {
          display: block; font-size: 13px; font-weight: 600;
          color: #333340; margin-bottom: 0.5rem; letter-spacing: -0.01em;
        }
        .auth-input {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid #E8E8EC; border-radius: 12px;
          font-size: 14px; font-weight: 400; color: #111111;
          font-family: inherit; background: #FAFAFA;
          outline: none; transition: border-color 0.15s, background 0.15s;
        }
        .auth-input::placeholder { color: #BCBCC8; }
        .auth-input:focus {
          border-color: #0057FF; background: #fff;
          box-shadow: 0 0 0 3px rgba(0,87,255,0.08);
        }

        /* Submit */
        .auth-btn {
          width: 100%; margin-top: 0.5rem;
          padding: 13px; border-radius: 12px;
          background: #0057FF; border: none;
          color: #fff; font-size: 14px; font-weight: 700;
          font-family: inherit; cursor: pointer; letter-spacing: -0.01em;
          transition: opacity 0.15s, transform 0.1s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.88; }
        .auth-btn:active:not(:disabled) { transform: scale(0.99); }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          animation: spin 0.65s linear infinite;
        }

        /* Divider */
        .auth-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 1.5rem 0; color: #BCBCC8; font-size: 12px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .auth-divider::before, .auth-divider::after {
          content: ''; flex: 1; height: 1px; background: #E8E8EC;
        }

        /* Footer link */
        .auth-footer {
          text-align: center; font-size: 13px; color: #9999AA; font-weight: 400;
          margin-top: 1.5rem;
        }
        .auth-link {
          color: #0057FF; font-weight: 600; text-decoration: none;
        }
        .auth-link:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-tag">
            <div className="auth-tag-dot" />
            CarEstimate
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to your account to continue</p>

          {error && (
            <div className="auth-error">
              <svg className="auth-error-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5"/>
                <path d="M8 4.5V8.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="0.75" fill="#DC2626"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="auth-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                placeholder="Your password"
                className="auth-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <p className="auth-footer">
            No account?{" "}
            <Link href="/register" className="auth-link">Create one →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}