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

  // ── Simple syntax highlighter ──
  const highlight = (code: string, lang: string): string => {
    const escape = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let escaped = escape(code);

    if (lang === "SAS") {
      // Comments first
      escaped = escaped.replace(
        /(\/\*[\s\S]*?\*\/)/g,
        '<span style="color:#6a9955;font-style:italic">$1</span>'
      );
      // Strings
      escaped = escaped.replace(
        /(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g,
        '<span style="color:#ce9178">$1</span>'
      );
      // Keywords
      const sasKeywords = [
        "data","run","proc","set","merge","by","if","then","else","end",
        "output","keep","drop","rename","where","in","not","and","or",
        "length","format","informat","label","array","do","to","until","while",
        "retain","call","input","put","select","when","otherwise","quit",
        "class","var","ways","types","id","tables","model","weight","freq",
        "sort","sql","create","table","as","from","join","left","right",
        "inner","full","outer","on","order","group","having","union",
        "coalesce","case","between","distinct","insert","into","delete","update",
        "nodupkey","nodup","options","libname","filename","title","footnote",
        "msglevel","noprint","missing","sum","mean","std","min","max","n",
        "median","q1","q3","ifc","cats","cat","catt","catx","strip","trim",
        "upcase","lowcase","compress","substr","index","scan","tranwrd",
        "intck","intnx","today","date","datepart","timepart",
        "year","month","day","mdy","abs","int","round","ceil","floor","mod",
        "log","exp","sqrt","yymmdd10","ddmmyy10","date9","datetime",
      ];
      const sasRegex = new RegExp(`\\b(${sasKeywords.join("|")})\\b`, "gi");
      escaped = escaped.replace(
        sasRegex,
        '<span style="color:#569cd6;font-weight:500">$1</span>'
      );
      // Macro variables
      escaped = escaped.replace(
        /(%\w+|&\w+)/g,
        '<span style="color:#c586c0">$1</span>'
      );
    } else {
      // R — Comments first
      escaped = escaped.replace(
        /(#.*$)/gm,
        '<span style="color:#6a9955;font-style:italic">$1</span>'
      );
      // Strings
      escaped = escaped.replace(
        /(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g,
        '<span style="color:#ce9178">$1</span>'
      );
      // Keywords
      const rKeywords = [
        "library","require","function","if","else","for","while","repeat",
        "return","next","break","TRUE","FALSE","NULL","NA","Inf","NaN",
        "in","is","as","do","try","stop","warning","message","print","cat",
        "c","list","data.frame","tibble","vector","matrix","array",
        "left_join","right_join","inner_join","full_join","anti_join",
        "semi_join","cross_join","join_by","closest","between",
        "filter","select","mutate","arrange","group_by","summarise",
        "summarize","rename","pivot_longer","pivot_wider","bind_rows",
        "bind_cols","distinct","slice","pull","case_when","if_else",
        "replace_na","coalesce","n","mean","sd","median","min","max",
        "sum","abs","round","ceiling","floor","sqrt","log","exp",
        "as.numeric","as.character","as.Date","as.integer","as.factor",
        "str","head","tail","dim","nrow","ncol","length","names","colnames",
        "rownames","which","any","all","is.na","is.null","is.numeric",
        "paste","paste0","sprintf","gsub","sub","grep","grepl","trimws",
        "toupper","tolower","nchar","substr","strsplit","format","Sys.Date",
        "difftime","seq","seq_len","seq_along","rep","unique","table",
        "setdiff","intersect","union","match","order","sort",
        "read.csv","write.csv","readRDS","saveRDS",
      ];
      const rRegex = new RegExp(`\\b(${rKeywords.join("|")})\\b`, "g");
      escaped = escaped.replace(
        rRegex,
        '<span style="color:#569cd6;font-weight:500">$1</span>'
      );
      // Assignment operator
      escaped = escaped.replace(
        /(&lt;-)/g,
        '<span style="color:#c586c0">$1</span>'
      );
      // Pipe operator
      escaped = escaped.replace(
        /(%&gt;%)/g,
        '<span style="color:#c586c0">$1</span>'
      );
    }

    return escaped;
  };

  const CodeBlock = ({
    code,
    lang,
    id,
    minHeight,
  }: {
    code: string;
    lang: string;
    id: string;
    minHeight?: string;
  }) => (
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
      <div style={{ overflowX: "auto", background: "var(--code-bg)" }}>
        <pre
          style={{
            minHeight: minHeight || "auto",
            margin: 0,
            padding: "16px",
            background: "var(--code-bg)",
            color: "var(--code-text)",
            fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
            fontSize: "13px",
            lineHeight: "1.65",
            overflowX: "visible",
            whiteSpace: "pre",
            border: "none",
            borderRadius: 0,
          }}
          dangerouslySetInnerHTML={{ __html: highlight(code.trim(), lang) }}
        />
      </div>
    </div>
  );

  const SectionLabel = ({ text }: { text: string }) => (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 600,
        color: "var(--muted)",
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        marginBottom: "8px",
      }}
    >
      {text}
    </div>
  );

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* ── Sidebar ── */}
      <div
        className="sidebar"
        style={{
          width: "272px",
          padding: "24px 14px",
          overflowY: "auto",
          position: "sticky",
          top: 0,
          height: "100vh",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <a href="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              marginBottom: "20px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "var(--accent-glow)",
              border: "1px solid var(--accent)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "15px",
                color: "var(--accent)",
                letterSpacing: "-0.01em",
              }}
            >
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
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ marginBottom: "16px" }}
        />

        {/* Category Nav */}
        {categories.map((cat) => (
          <div key={cat} style={{ marginBottom: "8px" }}>
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
                border:
                  openCategory === cat
                    ? "1px solid var(--accent)"
                    : "1px solid transparent",
                transition: "all 0.15s ease",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (openCategory !== cat) {
                  e.currentTarget.style.background = "var(--sidebar-hover)";
                  e.currentTarget.style.color = "var(--foreground)";
                }
              }}
              onMouseLeave={(e) => {
                if (openCategory !== cat) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--muted)";
                }
              }}
            >
              <span>{cat}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: "transform 0.2s ease",
                  transform:
                    openCategory === cat ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {openCategory === cat && (
              <div style={{ marginTop: "4px", paddingLeft: "4px" }}>
                {filtered
                  .filter((item) => item.category === cat)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className={`sidebar-item ${
                        selected.id === item.id ? "active" : ""
                      }`}
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
      <div
        style={{
          flex: 1,
          padding: "0 48px 60px",
          maxWidth: "860px",
          overflowY: "auto",
        }}
      >
        {/* ── Sticky Title ── */}
        <div className="sticky-title">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
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
            <strong
              style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--warning-text)",
                fontSize: "13px",
              }}
            >
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
                  <pre
                    style={{
                      color: "var(--muted)",
                      minHeight: "80px",
                      padding: "16px",
                      margin: 0,
                      background: "var(--code-bg)",
                      fontSize: "13px",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
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
                  <pre
                    style={{
                      color: "var(--muted)",
                      minHeight: "80px",
                      padding: "16px",
                      margin: 0,
                      background: "var(--code-bg)",
                      fontSize: "13px",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
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
          <p style={{ margin: 0, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
            {selected.details}
          </p>
        </div>

        {/* ── Example ── */}
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              padding: "14px 20px",
              borderRadius: "10px",
              background: "var(--card-bg)",
              border: "1px solid var(--accent)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "15px" }}>Example</span>
              <span className="tag">Code</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ flex: 1, minWidth: "280px" }}>
                <SectionLabel text="SAS Example" />
                {selected.exampleSAS?.trim() ? (
                  <CodeBlock
                    code={selected.exampleSAS}
                    lang="SAS"
                    id="ex-sas"
                    minHeight="100px"
                  />
                ) : (
                  <div className="code-wrapper">
                    <pre
                      style={{
                        color: "var(--muted)",
                        minHeight: "100px",
                        padding: "16px",
                        margin: 0,
                        background: "var(--code-bg)",
                        fontSize: "13px",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      — Example not available —
                    </pre>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: "280px" }}>
                <SectionLabel text="R Example" />
                {selected.exampleR?.trim() ? (
                  <CodeBlock
                    code={selected.exampleR}
                    lang="R"
                    id="ex-r"
                    minHeight="100px"
                  />
                ) : (
                  <div className="code-wrapper">
                    <pre
                      style={{
                        color: "var(--muted)",
                        minHeight: "100px",
                        padding: "16px",
                        margin: 0,
                        background: "var(--code-bg)",
                        fontSize: "13px",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
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
          © {new Date().getFullYear()} SAS ↔ R Hub — Educational resource for
          Clinical Programmers
        </div>
      </div>
    </div>
  );
}