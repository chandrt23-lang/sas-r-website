"use client";

import { useState } from "react";
import { contentData, FunctionItem } from "../../data/functions";

export default function FunctionsPage() {
  const [selected, setSelected] = useState<FunctionItem>(
    contentData.find((item) => item.id === "strip-trimws") || contentData[0]
  );
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>("Character Functions");
  const [copied, setCopied] = useState<string | null>(null);

  const categories = ["Character Functions", "Numeric Functions", "Date Formats"];

  const filtered = contentData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeBlock = ({ code, lang, id, minHeight }: { code: string; lang: string; id: string; minHeight?: string }) => (
    <div className="code-wrapper">
      <div className="code-header">
        <div className="code-header-dots">
          <div className="code-dot code-dot-red" />
          <div className="code-dot code-dot-yellow" />
          <div className="code-dot code-dot-green" />
        </div>
        <span className="code-lang">{lang}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="copy-btn"
          style={{ position: "static" }}
        >
          {copied === id ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="code-block" style={{ minHeight: minHeight || "80px" }}>
        {code.trim()}
      </pre>
    </div>
  );

  const SectionLabel = ({ text }: { text: string }) => (
    <div style={{
      fontSize: "11px", fontWeight: 600, color: "var(--muted)",
      letterSpacing: "0.08em", textTransform: "uppercase" as const,
      marginBottom: "8px",
    }}>
      {text}
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>

      {/* ── Sidebar ── */}
      <div className="sidebar" style={{ width: "272px", padding: "24px 14px", overflowY: "auto", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>

        {/* Logo */}
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{
            marginBottom: "20px", padding: "10px 14px", borderRadius: "10px",
            background: "var(--accent-glow)", border: "1px solid var(--accent)",
            cursor: "pointer", transition: "all 0.2s ease",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--accent)", letterSpacing: "-0.01em" }}>
              SAS ↔ R Hub
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
              Clinical Programming Reference
            </div>
          </div>
        </a>

        {/* Search */}
        <input
          type="text"
          placeholder="Search functions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
          style={{ marginBottom: "16px" }}
        />

        {/* Category Nav */}
        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: "8px" }}>
            {/* Category Header */}
            <div
              onClick={() => setOpenCategory(openCategory === cat ? null : cat)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: openCategory === cat ? "var(--accent)" : "var(--muted)",
                background: openCategory === cat ? "var(--accent-glow)" : "transparent",
                border: openCategory === cat ? "1px solid var(--accent)" : "1px solid transparent",
                transition: "all 0.15s ease",
                userSelect: "none",
              }}
              onMouseEnter={e => {
                if (openCategory !== cat) {
                  e.currentTarget.style.background = "var(--sidebar-hover)";
                  e.currentTarget.style.color = "var(--foreground)";
                }
              }}
              onMouseLeave={e => {
                if (openCategory !== cat) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--muted)";
                }
              }}
            >
              <span>{cat}</span>
              <svg
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{
                  transition: "transform 0.2s ease",
                  transform: openCategory === cat ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Category Items */}
            {openCategory === cat && (
              <div style={{ marginTop: "4px", paddingLeft: "4px" }}>
                {filtered
                  .filter(item => item.category === cat)
                  .map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className={`sidebar-item ${selected.id === item.id ? "active" : ""}`}
                    >
                      {item.title}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, padding: "0 48px 60px", maxWidth: "860px", overflowY: "auto" }}>

        {/* ── Sticky Title ── */}
        <div className="sticky-title">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              {selected.title}
            </h1>
            <span className="tag">{selected.category}</span>
          </div>
        </div>

        {/* ── Overview ── */}
        <div className="section-card">
          <SectionLabel text="Overview" />
          <p style={{ margin: 0, lineHeight: 1.8 }}>{selected.overview}</p>
        </div>

        {/* ── Behavior Difference ── */}
        {selected.behavior && (
          <div className="behavior-box" style={{ marginTop: "16px" }}>
            <strong style={{ display: "block", marginBottom: "8px", color: "var(--warning-text)", fontSize: "13px" }}>
              ⚠ Behavior Difference
            </strong>
            <p style={{ margin: 0, lineHeight: 1.75 }}>{selected.behavior}</p>
          </div>
        )}

        {/* ── Syntax Comparison ── */}
        <div className="section-card">
          <SectionLabel text="Syntax Comparison" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <SectionLabel text="SAS" />
              {selected.sas?.trim() ? (
                <CodeBlock code={selected.sas} lang="SAS" id="sas-syntax" />
              ) : (
                <div className="code-wrapper">
                  <pre className="code-block" style={{ color: "var(--muted)", minHeight: "80px" }}>
                    — No SAS syntax provided —
                  </pre>
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <SectionLabel text="R" />
              {selected.r?.trim() ? (
                <CodeBlock code={selected.r} lang="R" id="r-syntax" />
              ) : (
                <div className="code-wrapper">
                  <pre className="code-block" style={{ color: "var(--muted)", minHeight: "80px" }}>
                    — No R equivalent provided —
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Details ── */}
        <div className="section-card">
          <SectionLabel text="Details" />
          <p style={{ margin: 0, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{selected.details}</p>
        </div>

        {/* ── Example ── */}
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              padding: "14px 20px",
              borderRadius: "10px",
              background: "var(--card-bg)",
              border: "1px solid var(--accent)",
              marginBottom: "0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{ fontWeight: 600, fontSize: "15px" }}>Example</span>
              <span className="tag">Code</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ flex: 1, minWidth: "280px" }}>
                <SectionLabel text="SAS Example" />
                {selected.exampleSAS?.trim() ? (
                  <CodeBlock code={selected.exampleSAS} lang="SAS" id="ex-sas" minHeight="100px" />
                ) : (
                  <div className="code-wrapper">
                    <pre className="code-block" style={{ color: "var(--muted)", minHeight: "100px" }}>
                      — Example not available —
                    </pre>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: "280px" }}>
                <SectionLabel text="R Example" />
                {selected.exampleR?.trim() ? (
                  <CodeBlock code={selected.exampleR} lang="R" id="ex-r" minHeight="100px" />
                ) : (
                  <div className="code-wrapper">
                    <pre className="code-block" style={{ color: "var(--muted)", minHeight: "100px" }}>
                      — Example not available —
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Output Dataset */}
            {selected.outputTable?.trim() && (
              <div style={{ marginTop: "20px" }}>
                <SectionLabel text="Output Dataset" />
                <div className="code-wrapper">
                  <pre className="code-block">{selected.outputTable}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="footer">
          © {new Date().getFullYear()} SAS ↔ R Hub — Educational resource for Clinical Programmers
        </div>
      </div>
    </div>
  );
}