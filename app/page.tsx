"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── Nav Bar ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border)",
          background: "var(--background)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "0 40px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "16px",
            color: "var(--accent)",
            letterSpacing: "-0.01em",
          }}
        >
          SAS ↔ R Hub
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/functions" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "7px 18px",
                fontSize: "13px",
                fontWeight: 500,
                background: "transparent",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--foreground)";
              }}
            >
              Functions
            </button>
          </Link>
          <Link href="/merge" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "7px 18px",
                fontSize: "13px",
                fontWeight: 500,
                background: "var(--accent)",
                color: "white",
                border: "1px solid var(--accent)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Merge / Joins
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          padding: "80px 40px 60px",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 14px",
            borderRadius: "20px",
            background: "var(--accent-glow)",
            border: "1px solid var(--accent)",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--accent)",
            marginBottom: "28px",
            letterSpacing: "0.03em",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          Clinical Programming Reference
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: "0 0 24px",
          }}
        >
          SAS ↔ R{" "}
          <span style={{ color: "var(--accent)" }}>Hub</span>
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            lineHeight: 1.75,
            color: "var(--muted)",
            maxWidth: "640px",
            margin: "0 auto 40px",
          }}
        >
          An educational platform designed to help clinical programmers understand
          functional similarities and differences between{" "}
          <strong style={{ color: "var(--foreground)" }}>SAS</strong> and{" "}
          <strong style={{ color: "var(--foreground)" }}>R</strong> — with
          practical examples and real-world clinical dataset scenarios.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/merge" style={{ textDecoration: "none" }}>
  <button
    style={{
      padding: "13px 28px",
      fontSize: "15px",
      fontWeight: 600,
      background: "transparent",
      color: "var(--foreground)",
      border: "1px solid var(--border)",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      letterSpacing: "-0.01em",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.borderColor = "var(--accent)";
      e.currentTarget.style.color = "var(--accent)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.borderColor = "var(--border)";
      e.currentTarget.style.color = "var(--foreground)";
    }}
  >
    Explore Merge / Joins →
  </button>
</Link>
          <Link href="/functions" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "13px 28px",
                fontSize: "15px",
                fontWeight: 600,
                background: "transparent",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--foreground)";
              }}
            >
              Explore Functions →
            </button>
          </Link>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto 60px",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1px",
            background: "var(--border)",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          {[
            { value: "13+", label: "Join Types" },
            { value: "3", label: "Function Categories" },
            { value: "SAS & R", label: "Side by Side" },
            { value: "Clinical", label: "Real Examples" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "var(--card-bg)",
                padding: "24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--accent)",
                  letterSpacing: "-0.02em",
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto 80px",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          What's Inside
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>

          {/* Merge / Joins Card */}
          <Link href="/merge" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "28px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                height: "100%",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px var(--accent-glow)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--accent-glow)",
                  border: "1px solid var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  marginBottom: "16px",
                }}
              >
                🔗
              </div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  margin: "0 0 10px",
                  letterSpacing: "-0.01em",
                }}
              >
                Merge / Joins
              </h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7, margin: "0 0 20px" }}>
                Full, Left, Right, Inner, Anti, Semi, Cross, Self, Non-Equi,
                Rolling, Nested joins — all with SAS and R examples side by side.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {["Full Join", "Left Join", "Anti Join", "Rolling Join", "+9 more"].map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* Functions Card */}
          <Link href="/functions" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "28px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                height: "100%",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px var(--accent-glow)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--accent-glow)",
                  border: "1px solid var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  marginBottom: "16px",
                }}
              >
                ƒ
              </div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  margin: "0 0 10px",
                  letterSpacing: "-0.01em",
                }}
              >
                Functions
              </h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7, margin: "0 0 20px" }}>
                Character, Numeric and Date functions — with syntax comparison,
                behavior differences and clinical programming examples.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {["Character", "Numeric", "Date Formats"].map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 40px",
          textAlign: "center",
          fontSize: "13px",
          color: "var(--muted)",
        }}
      >
        © {new Date().getFullYear()} SAS ↔ R Hub — Educational resource for Clinical Programmers
      </footer>
    </div>
  );
}