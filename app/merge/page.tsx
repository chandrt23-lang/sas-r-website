"use client";

import { useState } from "react";
import { joinsData, JoinItem } from "../../data/joins";

export default function MergePage() {
  const [selected, setSelected] = useState<JoinItem>(
    joinsData.find((item) => item.id === "full-join") || joinsData[0]
  );
  const [search, setSearch] = useState("");
  const [example1Open, setExample1Open] = useState(true);
  const [example2Open, setExample2Open] = useState(true);
  const [watchOutOpen, setWatchOutOpen] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = joinsData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeBlock = ({ code, lang, id }: { code: string; lang: string; id: string }) => (
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
      <pre className="code-block">{code.trim()}</pre>
    </div>
  );

  const Collapsible = ({
    title, isOpen, onToggle, children, badge,
  }: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    badge?: string;
  }) => (
    <div style={{ marginTop: "20px" }}>
      <div
        className={`collapsible-header ${isOpen ? "open" : ""}`}
        onClick={onToggle}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>{title}</span>
          {badge && <span className="tag">{badge}</span>}
        </div>
        <svg
          className={`chevron ${isOpen ? "open" : ""}`}
          width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {isOpen && <div className="collapsible-content">{children}</div>}
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
          placeholder="Search joins..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
          style={{ marginBottom: "16px" }}
        />

        {/* Nav label */}
        <div style={{
          fontSize: "10px", fontWeight: 600, color: "var(--muted)",
          letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: "6px", paddingLeft: "12px",
        }}>
          Merge / Joins
        </div>

        {/* Nav items */}
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => {
              setSelected(item);
              setExample1Open(true);
              setExample2Open(true);
              setWatchOutOpen(true);
            }}
            className={`sidebar-item ${selected.id === item.id ? "active" : ""}`}
          >
            {item.title}
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
              <CodeBlock code={selected.sas} lang="SAS" id="sas-syntax" />
            </div>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <SectionLabel text="R" />
              <CodeBlock code={selected.r} lang="R" id="r-syntax" />
            </div>
          </div>
        </div>

        {/* ── Details ── */}
        <div className="section-card">
          <SectionLabel text="Details" />
          <p style={{ margin: 0, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{selected.details}</p>
        </div>

        {/* ════════════════════════════════════════
            EXAMPLE 1 — Collapsible
        ════════════════════════════════════════ */}
        <Collapsible
          title={selected.example1Title || "Example"}
          isOpen={example1Open}
          onToggle={() => setExample1Open(!example1Open)}
          badge="Example 1"
        >
          {selected.example1Desc && (
            <p style={{ marginTop: 0, marginBottom: "20px", color: "var(--muted)", lineHeight: 1.75 }}>
              {selected.example1Desc}
            </p>
          )}

          {selected.example1Input && (
            <div style={{ marginBottom: "20px" }}>
              <SectionLabel text="Input Datasets" />
              <div className="code-wrapper">
                <pre className="code-block">{selected.example1Input}</pre>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <SectionLabel text="SAS Code" />
              <CodeBlock code={selected.exampleSAS} lang="SAS" id="ex1-sas" />
            </div>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <SectionLabel text="R Code" />
              <CodeBlock code={selected.exampleR} lang="R" id="ex1-r" />
            </div>
          </div>

          {selected.outputTable1 && (
            <div style={{ marginTop: "20px" }}>
              <SectionLabel text="Output Dataset" />
              <div className="code-wrapper">
                <pre className="code-block">{selected.outputTable1}</pre>
              </div>
            </div>
          )}

          {selected.outputNote1 && (
            <div className="note-box" style={{ marginTop: "16px" }}>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: "var(--note-text)" }}>
                📝 <strong>Note: </strong>{selected.outputNote1}
              </p>
            </div>
          )}
        </Collapsible>

        {/* ════════════════════════════════════════
            EXAMPLE 2 — Collapsible
        ════════════════════════════════════════ */}
        {selected.example2Title && (
          <Collapsible
            title={selected.example2Title}
            isOpen={example2Open}
            onToggle={() => setExample2Open(!example2Open)}
            badge="Example 2"
          >
            {selected.example2Desc && (
              <p style={{ marginTop: 0, marginBottom: "20px", color: "var(--muted)", lineHeight: 1.75 }}>
                {selected.example2Desc}
              </p>
            )}

            {selected.example2Input && (
              <div style={{ marginBottom: "20px" }}>
                <SectionLabel text="Input Datasets" />
                <div className="code-wrapper">
                  <pre className="code-block">{selected.example2Input}</pre>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {selected.example2SAS && (
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <SectionLabel text="SAS Code" />
                  <CodeBlock code={selected.example2SAS} lang="SAS" id="ex2-sas" />
                </div>
              )}
              {selected.example2R && (
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <SectionLabel text="R Code" />
                  <CodeBlock code={selected.example2R} lang="R" id="ex2-r" />
                </div>
              )}
            </div>

            {selected.outputTable2 && (
              <div style={{ marginTop: "20px" }}>
                <SectionLabel text="Output Dataset" />
                <div className="code-wrapper">
                  <pre className="code-block">{selected.outputTable2}</pre>
                </div>
              </div>
            )}

            {selected.outputNote2 && (
              <div className="note-box" style={{ marginTop: "16px" }}>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: "var(--note-text)" }}>
                  📝 <strong>Note: </strong>{selected.outputNote2}
                </p>
              </div>
            )}
          </Collapsible>
        )}

        {/* ════════════════════════════════════════
            WATCH OUT — Collapsible
        ════════════════════════════════════════ */}
        {selected.watchOut && (
          <Collapsible
            title="Watch Out"
            isOpen={watchOutOpen}
            onToggle={() => setWatchOutOpen(!watchOutOpen)}
            badge="⚠ Common Pitfall"
          >
            {/* SAS Section */}
            <div style={{ marginBottom: "28px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--watchout-text)", marginBottom: "12px", marginTop: 0 }}>
                SAS — Silent Variable Overwrite
              </h4>
              <p style={{ marginBottom: "12px", lineHeight: 1.75 }}>
                When two datasets share a variable name that is <strong>not</strong> the BY variable,
                SAS silently overwrites the value from the left dataset with the value from the right
                dataset — no error is thrown and nothing appears in the log by default.
              </p>
              <p style={{ marginBottom: "12px", lineHeight: 1.75 }}>
                In the example below, both DM and VS contain a variable called <strong>COUNTRY</strong>.
                After the merge, the value of <strong>COUNTRY</strong> from VS overwrites the one from DM silently.
              </p>
              <SectionLabel text="❌ Problem — variable gets overwritten silently" />
              <CodeBlock
                code={`data ADVS;\n  merge DM VS(in=b);\n  by SUBJID;\n  if b;\nrun;\n\n/* Both DM and VS have COUNTRY variable.\n   VS.COUNTRY silently overwrites DM.COUNTRY.\n   No error is thrown — you will not notice this without checking the log. */`}
                lang="SAS" id="wo-sas-problem"
              />
              <div style={{ marginTop: "16px" }}>
                <SectionLabel text="✅ Fix — use OPTIONS MSGLEVEL=I to catch it in the log" />
                <CodeBlock
                  code={`options msglevel=i;\n\ndata ADVS;\n  merge DM VS(in=b);\n  by SUBJID;\n  if b;\nrun;\n\n/* SAS Log will now show:\n   INFO: Variable COUNTRY is in both datasets.\n   Values from VS will overwrite values from DM. */`}
                  lang="SAS" id="wo-sas-fix"
                />
              </div>
              <div style={{ marginTop: "16px" }}>
                <SectionLabel text="✅ Best Practice — keep only required variables using KEEP=" />
                <CodeBlock
                  code={`data ADVS;\n  merge DM(in=b keep=SUBJID AGE SEX)\n        VS(in=b keep=SUBJID VISIT VSDTC VSTEST VSORRES);\n  by SUBJID;\n  if b;\nrun;\n\n/* COUNTRY is excluded from both datasets before merging.\n   No risk of overwrite — only the variables you need are brought in. */`}
                  lang="SAS" id="wo-sas-best"
                />
              </div>
            </div>

            {/* R Section */}
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--watchout-text)", marginBottom: "12px", marginTop: 0 }}>
                R — Unexpected .x and .y Suffix Clash
              </h4>
              <p style={{ marginBottom: "12px", lineHeight: 1.75 }}>
                In R, when both datasets share a variable name that is <strong>not</strong> in
                the <strong>by</strong> argument, dplyr automatically renames the conflicting columns
                by adding <strong>.x</strong> (from the left dataset) and <strong>.y</strong> (from the right dataset) suffixes.
              </p>
              <p style={{ marginBottom: "12px", lineHeight: 1.75 }}>
                This means <strong>COUNTRY</strong> from DM becomes <strong>COUNTRY.x</strong> and{" "}
                <strong>COUNTRY</strong> from VS becomes <strong>COUNTRY.y</strong> — causing unexpected columns in your output.
              </p>
              <SectionLabel text="❌ Problem — unexpected .x and .y columns appear" />
              <CodeBlock
                code={`library(dplyr)\n\nADVS <- right_join(DM, VS, by = "SUBJID")\n\n# Output contains:\n# COUNTRY.x  (COUNTRY from DM)\n# COUNTRY.y  (COUNTRY from VS)\n# This is unexpected and will cause issues downstream`}
                lang="R" id="wo-r-problem"
              />
              <div style={{ marginTop: "16px" }}>
                <SectionLabel text="✅ Best Practice — use select() to keep only required variables" />
                <CodeBlock
                  code={`library(dplyr)\n\nADVS <- right_join(\n  DM %>% select(SUBJID, AGE, SEX),\n  VS %>% select(SUBJID, VISIT, VSDTC, VSTEST, VSORRES),\n  by = "SUBJID"\n)\n\n# COUNTRY is excluded from both datasets before joining.\n# No .x or .y suffix clash — only the variables you need are brought in.`}
                  lang="R" id="wo-r-best"
                />
              </div>
            </div>

            {/* Key Takeaway */}
            <div className="conclusion-box">
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                {`Key Takeaway:\n• Always keep only the required variables before merging in both SAS and R\n• In SAS — use KEEP= option in the MERGE statement to select only needed variables\n• In R — use select() before passing datasets into any join function\n• In SAS — use OPTIONS MSGLEVEL=I to catch silent variable overwrites in the log\n• In R — watch for unexpected .x and .y suffixes in your output column names\n• This best practice applies to all join types — Full Join, Left Join, Right Join and Inner Join`}
              </p>
            </div>
          </Collapsible>
        )}

        {/* ── Conclusion ── */}
        {selected.conclusion && (
          <div style={{ marginTop: "32px" }}>
            <SectionLabel text="Conclusion" />
            <div className="conclusion-box">
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                {selected.conclusion}
              </p>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="footer">
          © {new Date().getFullYear()} SAS ↔ R Hub — Educational resource for Clinical Programmers
        </div>
      </div>
    </div>
  );
}