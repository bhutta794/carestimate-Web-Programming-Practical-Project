"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const CarLogo = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 11L4.5 5H11.5L14 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="4.5" cy="11.5" r="1.5" fill="white"/>
      <circle cx="11.5" cy="11.5" r="1.5" fill="white"/>
      <path d="M2 11H14" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );

  return (
    <>
      <style>{`
        .ce-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 2rem; height: 64px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid #E8E8EC;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Logo */
        .ce-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; flex-shrink: 0;
        }
        .ce-logo-mark {
          width: 30px; height: 30px; border-radius: 8px;
          background: #0057FF;
          display: flex; align-items: center; justify-content: center;
        }
        .ce-logo-word {
          font-size: 16px; font-weight: 800;
          letter-spacing: -0.04em; color: #111111; line-height: 1;
        }
        .ce-logo-word span { color: #0057FF; }

        /* Desktop links */
        .ce-links {
          display: flex; align-items: center; gap: 2px;
        }
        .ce-link {
          padding: 7px 14px; border-radius: 9999px;
          font-size: 14px; font-weight: 500; color: #555560;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .ce-link:hover { background: #F5F5F7; color: #111111; }

        /* Buttons */
        .ce-btn-ghost {
          padding: 8px 18px; border-radius: 9999px;
          border: 1.5px solid #E8E8EC; color: #111111;
          font-size: 14px; font-weight: 500;
          text-decoration: none; background: transparent;
          cursor: pointer; font-family: inherit;
          transition: border-color 0.15s;
          margin-right: 4px;
        }
        .ce-btn-ghost:hover { border-color: #aaa; }

        .ce-btn-primary {
          padding: 9px 20px; border-radius: 9999px;
          background: #0057FF; color: #fff;
          font-size: 14px; font-weight: 600;
          text-decoration: none; border: none;
          cursor: pointer; font-family: inherit;
          transition: opacity 0.15s;
        }
        .ce-btn-primary:hover { opacity: 0.88; }

        /* Avatar */
        .ce-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: #0057FF; color: #fff;
          font-size: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ce-user-row {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 10px 4px 4px;
          border-radius: 9999px; border: 1.5px solid #E8E8EC;
          margin-right: 6px;
        }
        .ce-user-name { font-size: 13px; font-weight: 600; color: #111111; }

        /* Logout btn (text) */
        .ce-btn-logout {
          background: none; border: none; cursor: pointer;
          font-size: 14px; font-weight: 500; color: #9999AA;
          font-family: inherit; padding: 7px 12px; border-radius: 9999px;
          transition: background 0.15s, color 0.15s;
        }
        .ce-btn-logout:hover { background: #FEF2F2; color: #DC2626; }

        /* Mobile toggle */
        .ce-hamburger {
          display: none; background: none; border: none; cursor: pointer;
          padding: 6px; border-radius: 8px; color: #555560;
          transition: background 0.15s;
        }
        .ce-hamburger:hover { background: #F5F5F7; }

        /* Mobile drawer */
        .ce-drawer {
          position: fixed; top: 64px; left: 0; right: 0; z-index: 99;
          background: #fff; border-bottom: 1px solid #E8E8EC;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          padding: 1rem;
        }
        .ce-drawer-link {
          display: block; padding: 11px 14px; border-radius: 10px;
          font-size: 15px; font-weight: 500; color: #111111;
          text-decoration: none;
          transition: background 0.15s;
        }
        .ce-drawer-link:hover { background: #F5F5F7; }
        .ce-drawer-divider { height: 1px; background: #E8E8EC; margin: 8px 0; }
        .ce-drawer-user {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; margin-bottom: 4px;
        }
        .ce-drawer-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: #0057FF; color: #fff;
          font-size: 14px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ce-drawer-uname { font-size: 14px; font-weight: 700; color: #111111; }
        .ce-drawer-email { font-size: 12px; color: #9999AA; margin-top: 1px; }
        .ce-drawer-logout {
          display: block; width: 100%; padding: 12px;
          border-radius: 10px; background: #FEF2F2;
          color: #DC2626; font-size: 14px; font-weight: 600;
          text-align: center; border: none; cursor: pointer;
          font-family: inherit; transition: background 0.15s;
        }
        .ce-drawer-logout:hover { background: #FEE2E2; }
        .ce-drawer-cta {
          display: block; width: 100%; padding: 13px;
          border-radius: 10px; background: #0057FF;
          color: #fff; font-size: 14px; font-weight: 700;
          text-align: center; text-decoration: none;
          margin-top: 6px;
        }

        @media (max-width: 768px) {
          .ce-desktop { display: none !important; }
          .ce-hamburger { display: flex; }
          .ce-nav { padding: 0 1.25rem; }
        }
        @media (min-width: 769px) {
          .ce-hamburger { display: none; }
          .ce-drawer { display: none; }
        }
      `}</style>

      <nav className="ce-nav">
        {/* Logo */}
        <Link href="/" className="ce-logo">
          <div className="ce-logo-mark">
            <CarLogo size={16} />
          </div>
          <span className="ce-logo-word">Car<span>Estimate</span></span>
        </Link>

        {/* Desktop center links */}
        <div className="ce-links ce-desktop">
          <Link href="/buy" className="ce-link">Browse</Link>
          <Link href="/sell" className="ce-link">Sell</Link>
        </div>

        {/* Desktop right actions */}
        <div className="ce-desktop" style={{ display: "flex", alignItems: "center" }}>
          {session ? (
            <>
              <div className="ce-user-row">
                <div className="ce-avatar">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="ce-user-name">{session.user?.name?.split(" ")[0]}</span>
              </div>
              <button className="ce-btn-logout" onClick={() => signOut()}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="ce-btn-ghost">Log in</Link>
              <Link href="/register" className="ce-btn-primary">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="ce-hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {isOpen ? (
              <path d="M4 4L16 16M4 16L16 4" stroke="#555560" strokeWidth="1.8" strokeLinecap="round"/>
            ) : (
              <path d="M3 5H17M3 10H17M3 15H17" stroke="#555560" strokeWidth="1.8" strokeLinecap="round"/>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="ce-drawer">
          <Link href="/buy" className="ce-drawer-link" onClick={() => setIsOpen(false)}>Browse</Link>
          <Link href="/sell" className="ce-drawer-link" onClick={() => setIsOpen(false)}>Sell</Link>

          <div className="ce-drawer-divider" />

          {session ? (
            <>
              <div className="ce-drawer-user">
                <div className="ce-drawer-avatar">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="ce-drawer-uname">{session.user?.name}</div>
                  <div className="ce-drawer-email">{session.user?.email}</div>
                </div>
              </div>
              <button className="ce-drawer-logout" onClick={() => { signOut(); setIsOpen(false); }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="ce-drawer-link" onClick={() => setIsOpen(false)}
                style={{ textAlign: "center", marginBottom: "4px" }}>
                Log in
              </Link>
              <Link href="/register" className="ce-drawer-cta" onClick={() => setIsOpen(false)}>
                Get started
              </Link>
            </>
          )}
        </div>
      )}

      {/* Spacer */}
      <div style={{ height: "64px" }} />
    </>
  );
}