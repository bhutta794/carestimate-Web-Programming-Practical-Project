import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const brands = [
    "Toyota", "BMW", "Mercedes-Benz", "Audi", "Tesla",
    "Porsche", "Ford", "Volkswagen", "Lexus", "Volvo", "Hyundai", "Mazda",
  ];

  const features = [
    {
      tag: "Valuation",
      headline: "Your car's real market value — in seconds.",
      body: "Our AI engine processes millions of live listings, regional demand signals, and historical depreciation data to give you a precise, defensible number.",
      stat: "180+",
      statLabel: "Models covered",
    },
    {
      tag: "Listing",
      headline: "List once. Reach verified buyers everywhere.",
      body: "One submission puts your vehicle in front of thousands of qualified buyers. No spam, no cold calls — only serious offers.",
      stat: "Free",
      statLabel: "To list",
    },
    {
      tag: "Data",
      headline: "Six pricing factors. Zero guesswork.",
      body: "Year, mileage, condition, brand equity, regional demand, and service history — every variable is weighted in your final report.",
      stat: "100%",
      statLabel: "Data-driven",
    },
  ];

  const reviews = [
    { name: "Stefan M.", location: "Sofia, BG", text: "Got a valuation in under a minute. Dealer tried to offer me 20% less — I showed them the report and walked away with the right price." },
    { name: "Andreea P.", location: "Bucharest, RO", text: "Super clean interface. Listed my BMW 3 Series and had serious inquiries within the day. Sold within a week." },
    { name: "Tomáš K.", location: "Prague, CZ", text: "Finally a car pricing tool that doesn't feel like it was built in 2008. The breakdown by factor is genuinely useful." },
  ];

  return (
    <main style={{ background: "#ffffff", color: "#111111", fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blue: #0057FF;
          --blue-light: #EEF3FF;
          --blue-mid: #D0DEFF;
          --surface: #F5F5F7;
          --border: #E8E8EC;
          --text-1: #111111;
          --text-2: #555560;
          --text-3: #9999AA;
          --radius-pill: 9999px;
          --radius-card: 24px;
          --radius-inner: 16px;
        }

        a { text-decoration: none; color: inherit; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 2.5rem; height: 68px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-logo-mark {
          width: 30px; height: 30px; border-radius: 8px;
          background: var(--blue);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nav-logo-mark svg { display: block; }
        .nav-logo-word {
          font-size: 16px; font-weight: 800; letter-spacing: -0.04em; color: var(--text-1);
          line-height: 1;
        }
        .nav-logo-word span { color: var(--blue); }
        .nav-links { display: flex; align-items: center; gap: 0.25rem; }
        .nav-link {
          padding: 8px 16px; border-radius: var(--radius-pill);
          font-size: 14px; font-weight: 500; color: var(--text-2);
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover { background: var(--surface); color: var(--text-1); }
        .nav-cta {
          padding: 10px 22px; border-radius: var(--radius-pill);
          background: var(--blue); color: #fff;
          font-size: 14px; font-weight: 600; transition: opacity 0.15s;
        }
        .nav-cta:hover { opacity: 0.88; }
        .nav-ghost {
          padding: 9px 20px; border-radius: var(--radius-pill);
          border: 1.5px solid var(--border); color: var(--text-1);
          font-size: 14px; font-weight: 500; margin-right: 0.25rem;
          transition: border-color 0.15s;
        }
        .nav-ghost:hover { border-color: #aaa; }

        .hero-wrap {
          max-width: 1280px; margin: 0 auto;
          padding: 136px 2.5rem 80px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5rem; align-items: center;
        }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 14px; border-radius: var(--radius-pill);
          background: var(--blue-light); color: var(--blue);
          font-size: 12px; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; margin-bottom: 1.5rem;
        }
        .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); }
        .hero-h1 {
          font-size: clamp(40px, 4.5vw, 62px); font-weight: 800;
          line-height: 1.07; letter-spacing: -0.04em; color: var(--text-1);
          margin-bottom: 1.5rem;
        }
        .hero-h1 em { font-style: normal; color: var(--blue); }
        .hero-p {
          font-size: 18px; font-weight: 400; line-height: 1.7;
          color: var(--text-2); margin-bottom: 2.5rem; max-width: 440px;
        }
        .hero-btns { display: flex; gap: 0.75rem; }
        .btn-primary {
          display: inline-block; padding: 15px 28px;
          border-radius: var(--radius-pill); background: var(--blue);
          color: #fff; font-size: 15px; font-weight: 600;
          transition: opacity 0.15s, transform 0.12s;
        }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-secondary {
          display: inline-block; padding: 14px 28px;
          border-radius: var(--radius-pill); border: 1.5px solid var(--border);
          color: var(--text-1); font-size: 15px; font-weight: 500;
          transition: border-color 0.15s, transform 0.12s;
        }
        .btn-secondary:hover { border-color: #999; transform: translateY(-1px); }

        .hero-visual { position: relative; }
        .hero-card {
          background: #fff; border-radius: var(--radius-card);
          border: 1px solid var(--border);
          box-shadow: 0 12px 48px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .hero-car-img { width: 100%; height: 210px; object-fit: cover; display: block; }
        .hero-card-body { padding: 1.5rem; }
        .hero-label { font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px; }
        .hero-car-name { font-size: 17px; font-weight: 700; color: var(--text-1); margin-bottom: 1rem; letter-spacing: -0.02em; }
        .hero-price-row { display: flex; justify-content: space-between; align-items: flex-end; }
        .hero-price-label { font-size: 11px; color: var(--text-3); margin-bottom: 3px; }
        .hero-price { font-size: 30px; font-weight: 800; color: var(--blue); letter-spacing: -0.04em; }
        .hero-badge {
          padding: 7px 13px; border-radius: var(--radius-pill);
          background: #E8F5E9; color: #2E7D32;
          font-size: 12px; font-weight: 700;
        }
        .float-card {
          position: absolute; background: #fff;
          border-radius: var(--radius-inner); border: 1px solid var(--border);
          box-shadow: 0 4px 24px rgba(0,0,0,0.09);
        }
        .float-top {
          top: -18px; left: -20px;
          padding: 12px 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .float-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--blue-light);
          display: flex; align-items: center; justify-content: center; font-size: 17px;
        }
        .float-title { font-size: 13px; font-weight: 600; color: var(--text-1); }
        .float-sub { font-size: 11px; color: var(--text-3); margin-top: 1px; }
        .float-bottom {
          bottom: -18px; right: -20px;
          padding: 14px 18px;
          background: var(--blue);
          box-shadow: 0 4px 20px rgba(0,87,255,0.3);
        }
        .float-num { font-size: 22px; font-weight: 800; color: #fff; }
        .float-lbl { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 1px; }

        .stats-bar {
          background: var(--surface);
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          padding: 2.5rem;
        }
        .stats-inner {
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4,1fr);
        }
        .stat-cell {
          text-align: center; padding: 0 1.5rem;
          border-right: 1px solid var(--border);
        }
        .stat-cell:last-child { border-right: none; }
        .stat-num { font-size: clamp(28px,3.5vw,44px); font-weight: 800; letter-spacing: -0.04em; color: var(--text-1); display: block; }
        .stat-label { font-size: 13px; color: var(--text-3); margin-top: 4px; }

        .section { padding: 6rem 2.5rem; max-width: 1280px; margin: 0 auto; }
        .section-tag { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--blue); margin-bottom: 1.25rem; }
        .section-h2 { font-size: clamp(32px,4vw,50px); font-weight: 800; letter-spacing: -0.04em; line-height: 1.07; color: var(--text-1); margin-bottom: 1.25rem; max-width: 580px; }
        .section-p { font-size: 17px; color: var(--text-2); line-height: 1.7; max-width: 500px; margin-bottom: 3rem; }

        .feature-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; }
        .feature-card {
          background: var(--surface); border-radius: var(--radius-card);
          padding: 2rem; border: 1.5px solid transparent;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .feature-card:hover { border-color: var(--blue-mid); box-shadow: 0 4px 24px rgba(0,87,255,0.07); }
        .fc-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--blue); margin-bottom: 1rem; }
        .fc-title { font-size: 19px; font-weight: 700; color: var(--text-1); line-height: 1.35; margin-bottom: 0.75rem; letter-spacing: -0.02em; }
        .fc-body { font-size: 14px; color: var(--text-2); line-height: 1.7; margin-bottom: 1.75rem; }
        .fc-stat { font-size: 38px; font-weight: 800; color: var(--blue); letter-spacing: -0.04em; }
        .fc-stat-label { font-size: 12px; color: var(--text-3); margin-top: 2px; }

        .reviews-section { padding: 6rem 2.5rem; }
        .reviews-inner { max-width: 1280px; margin: 0 auto; }
        .reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; margin-top: 3rem; }
        .review-card {
          background: var(--surface); border-radius: var(--radius-card);
          padding: 2rem; border: 1px solid var(--border);
        }
        .review-stars { color: #F59E0B; font-size: 13px; letter-spacing: 3px; margin-bottom: 1rem; }
        .review-text { font-size: 15px; color: var(--text-2); line-height: 1.7; margin-bottom: 1.5rem; }
        .review-author { display: flex; align-items: center; gap: 10px; }
        .review-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--blue-light); color: var(--blue);
          font-size: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .review-name { font-size: 14px; font-weight: 600; color: var(--text-1); }
        .review-loc { font-size: 12px; color: var(--text-3); }

        .brands-section {
          padding: 3rem 2.5rem;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
        }
        .brands-label { text-align: center; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); margin-bottom: 2rem; }
        .brands-row { display: flex; gap: 2.5rem; justify-content: center; flex-wrap: wrap; align-items: center; }
        .brand-name { font-size: 15px; font-weight: 600; color: #ccc; }

        .cta-section { padding: 4rem 2.5rem; }
        .cta-inner {
          max-width: 1280px; margin: 0 auto;
          background: var(--blue); border-radius: 28px;
          padding: 5rem 4rem;
          display: flex; justify-content: space-between; align-items: center;
          gap: 3rem; flex-wrap: wrap;
        }
        .cta-h2 { font-size: clamp(30px,3.5vw,48px); font-weight: 800; letter-spacing: -0.04em; line-height: 1.07; color: #fff; max-width: 500px; }
        .cta-p { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.6; margin-top: 1rem; max-width: 400px; }
        .btn-white {
          display: inline-block; padding: 15px 30px;
          border-radius: var(--radius-pill); background: #fff;
          color: var(--blue); font-size: 15px; font-weight: 700;
          transition: opacity 0.15s, transform 0.12s; flex-shrink: 0;
        }
        .btn-white:hover { opacity: 0.92; transform: translateY(-1px); }

        .footer { border-top: 1px solid var(--border); padding: 2rem 2.5rem; }
        .footer-inner { max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .footer-logo { font-size: 16px; font-weight: 800; letter-spacing: -0.03em; }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-link { font-size: 13px; color: var(--text-3); transition: color 0.15s; }
        .footer-link:hover { color: var(--text-1); }
        .footer-copy { font-size: 13px; color: var(--text-3); }

        @media (max-width: 900px) {
          .hero-wrap { grid-template-columns: 1fr; padding-top: 110px; }
          .hero-visual { display: none; }
          .feature-grid, .steps-grid, .reviews-grid { grid-template-columns: 1fr; }
          .stats-inner { grid-template-columns: repeat(2,1fr); }
          .stat-cell:nth-child(2) { border-right: none; }
          .cta-inner { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 11L4.5 5H11.5L14 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="4.5" cy="11.5" r="1.5" fill="white"/>
              <circle cx="11.5" cy="11.5" r="1.5" fill="white"/>
              <path d="M2 11H14" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="nav-logo-word">Car<span>Estimate</span></span>
        </a>
        <div className="nav-links">
          <Link href="/buy" className="nav-link">Browse</Link>
          {session ? (
            <>
              <Link href="/sell" className="nav-link">List your car</Link>
              <Link href="/api/auth/signout" className="nav-ghost">Log out</Link>
            </>
          ) : (
            <>
              <Link href="/api/auth/signin" className="nav-ghost">Log in</Link>
              <Link href="/register" className="nav-cta">Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="hero-wrap">
        <div>
          <div className="hero-tag">
            <div className="hero-dot" />
            AI-Powered Valuation
          </div>
          <h1 className="hero-h1">
            Know exactly<br />what your car<br />is <em>worth.</em>
          </h1>
          <p className="hero-p">
            Professional-grade automotive valuations powered by real-time market data. Precise, transparent, and free to get started.
          </p>
          <div className="hero-btns">
            {session ? (
              <Link href="/sell" className="btn-primary">List your vehicle →</Link>
            ) : (
              <>
                <Link href="/register" className="btn-primary">Get your free valuation →</Link>
                <Link href="/buy" className="btn-secondary">Browse listings</Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div style={{ position: "relative", maxWidth: "420px", margin: "0 auto", padding: "24px" }}>
            <div className="float-card float-top">
              <div className="float-icon">🤖</div>
              <div>
                <div className="float-title">AI Valuation</div>
                <div className="float-sub">Updated live · 2s ago</div>
              </div>
            </div>

            <div className="hero-card">
              <img
                className="hero-car-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCILVvA9yhQo8M6Tg2c-SW7cgKf4XXTNs5u3pqR_BEdY7lNJqqHFXHUEeL4BDb_klfaz2rr8Fuol4hFxnatY8fXoD71peZOR_7A7IvuR77OXiTARtGzJ_45qv4j0zd39tsLcHf4js6sBuuHkycFmx5gBuQYrWhhextFzFAdUEs2soSFOaxQE5EjRNkIaRjNSWrqNJ1GaT9lki7VzXUVkm5qW_Z2NM_kkOI5-GmUkGX4CBeP3t7sleORRnZq1U4WhVYzZ_urYdq4wtY9"
                alt="Sample vehicle"
              />
              <div className="hero-card-body">
                <div className="hero-label">Valuation Report</div>
                <div className="hero-car-name">Tesla Model S · 2022</div>
                <div className="hero-price-row">
                  <div>
                    <div className="hero-price-label">Estimated market value</div>
                    <div className="hero-price">€54,200</div>
                  </div>
                  <div className="hero-badge">+4.2% vs avg</div>
                </div>
              </div>
            </div>

            <div className="float-card float-bottom">
              <div className="float-num">18+</div>
              <div className="float-lbl">Brands supported</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stats-inner">
          {[
            { num: "18+", label: "Global brands" },
            { num: "180+", label: "Models covered" },
            { num: "< 60s", label: "Avg. valuation time" },
            { num: "Free", label: "To list your vehicle" },
          ].map((s) => (
            <div key={s.label} className="stat-cell">
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="section">
        <div className="section-tag">What we offer</div>
        <h2 className="section-h2">Everything you need to sell smarter.</h2>
        <p className="section-p">From instant AI valuations to a marketplace of verified buyers — CarEstimate handles the entire selling journey.</p>
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.tag} className="feature-card">
              <div className="fc-tag">{f.tag}</div>
              <div className="fc-title">{f.headline}</div>
              <div className="fc-body">{f.body}</div>
              <div className="fc-stat">{f.stat}</div>
              <div className="fc-stat-label">{f.statLabel}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <div className="reviews-inner">
          <div className="section-tag">Testimonials</div>
          <h2 className="section-h2">Trusted by sellers across Europe.</h2>
          <div className="reviews-grid">
            {reviews.map((r) => (
              <div key={r.name} className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">
                  <div className="review-avatar">{r.name.split(" ").map(w => w[0]).join("")}</div>
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-loc">{r.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="brands-section">
        <div className="brands-label">Brands we support</div>
        <div className="brands-row">
          {brands.map((b) => (
            <span key={b} className="brand-name">{b}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!session && (
        <div className="cta-section">
          <div className="cta-inner">
            <div>
              <h2 className="cta-h2">Ready to get your car's real value?</h2>
              <p className="cta-p">Join thousands of sellers across Europe who got the right price — the first time.</p>
            </div>
            <Link href="/register" className="btn-white">Create free account →</Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 11L4.5 5H11.5L14 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="4.5" cy="11.5" r="1.5" fill="white"/>
                <circle cx="11.5" cy="11.5" r="1.5" fill="white"/>
                <path d="M2 11H14" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="footer-logo">Car<span style={{ color: "var(--blue)" }}>Estimate</span></span>
          </div>
          <div className="footer-links">
            {["Privacy", "Terms", "Contact", "FAQ"].map((l) => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
          <span className="footer-copy">© 2024 CarEstimate</span>
        </div>
      </footer>
    </main>
  );
}