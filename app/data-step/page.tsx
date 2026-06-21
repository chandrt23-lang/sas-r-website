"use client";

import { useState } from "react";
import { dataStepsData, DataStepItem } from "../../data/dataStep";

export default function DataStepPage() {
  const [selected, setSelected] = useState<DataStepItem>(
    dataStepsData.find((item) => item.id === "proc-sort") || dataStepsData[0]
  );
  const [search, setSearch] = useState("");
  const [example1Open, setExample1Open] = useState(true);
  const [example2Open, setExample2Open] = useState(true);
  const [example3Open, setExample3Open] = useState(true);
  const [example4Open, setExample4Open] = useState(true);
  const [watchOutOpen, setWatchOutOpen] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = dataStepsData.filter((item) =>
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
        "msglevel","noprint","missing","out","descending","first","last",
        "sum","mean","std","min","max","n","median","q1","q3",
        "ifc","cats","cat","catt","catx","strip","trim",
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
        /(%\w+)/g,
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
        "summarize","ungroup","rename","pivot_longer","pivot_wider",
        "bind_rows","bind_cols","distinct","slice","slice_head","slice_tail",
        "pull","case_when","if_else","replace_na","coalesce",
        "row_number","n","mean","sd","median","min","max",
        "sum","abs","round","ceiling","floor","sqrt","log","exp",
        "as.numeric","as.character","as.Date","as.integer","as.factor",
        "str","head","tail","dim","nrow","ncol","length","names","colnames",
        "rownames","which","any","all","is.na","is.null","is.numeric",
        "paste","paste0","sprintf","gsub","sub","grep","grepl","trimws",
        "toupper","tolower","nchar","substr","strsplit","format","Sys.Date",
        "difftime","seq","seq_len","seq_along","rep","unique","table",
        "desc","across","everything","starts_with","ends_with","contains",
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

// Replace |> visually as %>%
escaped = escaped.replace(
  /(\|&gt;)/g,
  '<span style="color:#c586c0">%&gt;%</span>'
);

// Keep original %>% highlighting
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
            overflowX: "auto",
            whiteSpace: "pre",
            border: "none",
            borderRadius: 0,
          }}
          dangerouslySetInnerHTML={{ __html: highlight(code.trim(), lang) }}
        />
      </div>
    </div>
  );

  const Collapsible = ({
    title,
    isOpen,
    onToggle,
    children,
    badge,
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
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {isOpen && <div className="collapsible-content">{children}</div>}
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

        <input
          type="text"
          placeholder="Search data steps..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ marginBottom: "16px" }}
        />

        <div
          style={{
            fontSize: "10px",
            fontWeight: 600,
            color: "var(--muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "6px",
            paddingLeft: "12px",
          }}
        >
          DATA STEPS
        </div>

        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelected(item);
              setExample1Open(true);
              setExample2Open(true);
              setExample3Open(true);
              setExample4Open(true);
              setWatchOutOpen(true);
            }}
            className={`sidebar-item ${selected.id === item.id ? "active" : ""}`}
          >
            {item.title}
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
          <p style={{ margin: 0, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
            {selected.details}
          </p>
        </div>

        {/* ════════════════════════════════════════
            EXAMPLE 1
        ════════════════════════════════════════ */}
        <Collapsible
          title={selected.example1Title || "Example 1"}
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
            EXAMPLE 2
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
            EXAMPLE 3
        ════════════════════════════════════════ */}
        {selected.example3Title && (
          <Collapsible
            title={selected.example3Title}
            isOpen={example3Open}
            onToggle={() => setExample3Open(!example3Open)}
            badge="Example 3"
          >
            {selected.example3Desc && (
              <p style={{ marginTop: 0, marginBottom: "20px", color: "var(--muted)", lineHeight: 1.75 }}>
                {selected.example3Desc}
              </p>
            )}
            {selected.example3Input && (
              <div style={{ marginBottom: "20px" }}>
                <SectionLabel text="Input Datasets" />
                <div className="code-wrapper">
                  <pre className="code-block">{selected.example3Input}</pre>
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {selected.example3SAS && (
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <SectionLabel text="SAS Code" />
                  <CodeBlock code={selected.example3SAS} lang="SAS" id="ex3-sas" />
                </div>
              )}
              {selected.example3R && (
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <SectionLabel text="R Code" />
                  <CodeBlock code={selected.example3R} lang="R" id="ex3-r" />
                </div>
              )}
            </div>
            {selected.outputTable3 && (
              <div style={{ marginTop: "20px" }}>
                <SectionLabel text="Output Dataset" />
                <div className="code-wrapper">
                  <pre className="code-block">{selected.outputTable3}</pre>
                </div>
              </div>
            )}
            {selected.outputNote3 && (
              <div className="note-box" style={{ marginTop: "16px" }}>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: "var(--note-text)" }}>
                  📝 <strong>Note: </strong>{selected.outputNote3}
                </p>
              </div>
            )}
          </Collapsible>
        )}

        {/* ════════════════════════════════════════
            EXAMPLE 4
        ════════════════════════════════════════ */}
        {selected.example4Title && (
          <Collapsible
            title={selected.example4Title}
            isOpen={example4Open}
            onToggle={() => setExample4Open(!example4Open)}
            badge="Example 4"
          >
            {selected.example4Desc && (
              <p style={{ marginTop: 0, marginBottom: "20px", color: "var(--muted)", lineHeight: 1.75 }}>
                {selected.example4Desc}
              </p>
            )}
            {selected.example4Input && (
              <div style={{ marginBottom: "20px" }}>
                <SectionLabel text="Input Datasets" />
                <div className="code-wrapper">
                  <pre className="code-block">{selected.example4Input}</pre>
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {selected.example4SAS && (
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <SectionLabel text="SAS Code" />
                  <CodeBlock code={selected.example4SAS} lang="SAS" id="ex4-sas" />
                </div>
              )}
              {selected.example4R && (
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <SectionLabel text="R Code" />
                  <CodeBlock code={selected.example4R} lang="R" id="ex4-r" />
                </div>
              )}
            </div>
            {selected.outputTable4 && (
              <div style={{ marginTop: "20px" }}>
                <SectionLabel text="Output Dataset" />
                <div className="code-wrapper">
                  <pre className="code-block">{selected.outputTable4}</pre>
                </div>
              </div>
            )}
            {selected.outputNote4 && (
              <div className="note-box" style={{ marginTop: "16px" }}>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: "var(--note-text)" }}>
                  📝 <strong>Note: </strong>{selected.outputNote4}
                </p>
              </div>
            )}
          </Collapsible>
        )}
    {
    /* ════════════════════════════════════════
    EXAMPLE 6
════════════════════════════════════════ */}
{selected.example6Title && (
  <Collapsible
    title={selected.example6Title}
    isOpen={example4Open}
    onToggle={() => setExample4Open(!example4Open)}
    badge="Example 5"
  >
    {selected.example6Desc && (
      <p style={{ marginTop: 0, marginBottom: "20px", color: "var(--muted)", lineHeight: 1.75 }}>
        {selected.example6Desc}
      </p>
    )}

    {selected.example6Input && (
      <div style={{ marginBottom: "20px" }}>
        <SectionLabel text="Input Datasets" />
        <div className="code-wrapper">
          <pre className="code-block">{selected.example6Input}</pre>
        </div>
      </div>
    )}

    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {selected.example6SAS && (
        <div style={{ flex: 1, minWidth: "280px" }}>
          <SectionLabel text="SAS Code" />
          <CodeBlock code={selected.example6SAS} lang="SAS" id="ex5-sas" />
        </div>
      )}

      {selected.example6R && (
        <div style={{ flex: 1, minWidth: "280px" }}>
          <SectionLabel text="R Code" />
          <CodeBlock code={selected.example6R} lang="R" id="ex5-r" />
        </div>
      )}
    </div>

    {selected.outputTable6 && (
      <div style={{ marginTop: "20px" }}>
        <SectionLabel text="Output Dataset" />
        <div className="code-wrapper">
          <pre className="code-block">{selected.outputTable6}</pre>
        </div>
      </div>
    )}

    {selected.outputNote6 && (
      <div className="note-box" style={{ marginTop: "16px" }}>
        <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: "var(--note-text)" }}>
          📝 <strong>Note: </strong>{selected.outputNote6}
        </p>
      </div>
    )}
  </Collapsible>
)}

        {/* ════════════════════════════════════════
    WATCH OUT
════════════════════════════════════════ */}
{selected.watchOut && (
  <Collapsible
    title="Watch Out"
    isOpen={watchOutOpen}
    onToggle={() => setWatchOutOpen(!watchOutOpen)}
    badge="⚠ Common Pitfall"
  >
    <div style={{ marginBottom: "28px" }}>
      <h4
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--watchout-text)",
          marginBottom: "12px",
          marginTop: 0,
        }}
      >
        {selected.title} — Common Pitfall
      </h4>

      <p style={{ marginBottom: "12px", lineHeight: 1.75 }}>
        In SAS, any DATA step or PROC that uses a <strong>BY statement</strong>
        requires the dataset to be pre-sorted first.
      </p>

      <SectionLabel text="❌ Problem — BY statement without PROC SORT" />

      <CodeBlock
        code={
          selected.title === "PROC TRANSPOSE"
            ? `/* Dataset is NOT sorted by USUBJID */
proc transpose data=ADLB out=ADLB_WIDE;
  by USUBJID;
  id LBTESTCD;
  var AVAL;
run;

/* SAS Log ERROR:
   ERROR: BY variables are not properly sorted */`

            : `/* Dataset is NOT sorted by USUBJID LBTESTCD */
data ADLB_FINAL;
  set ADLB;
  by USUBJID LBTESTCD;
  if first.LBTESTCD then RANK = 0;
  RANK + 1;
run;

/* SAS Log ERROR:
   ERROR: BY variables are not properly sorted */`
        }
        lang="SAS"
        id="wo-sas-problem"
      />

      <div style={{ marginTop: "16px" }}>
        <SectionLabel text="✅ Fix — always PROC SORT first" />

        <CodeBlock
          code={
            selected.title === "PROC TRANSPOSE"
              ? `proc sort data=ADLB;
  by USUBJID;
run;

proc transpose data=ADLB out=ADLB_WIDE;
  by USUBJID;
  id LBTESTCD;
  var AVAL;
run;`

              : `proc sort data=ADLB;
  by USUBJID LBTESTCD VISITNUM;
run;

data ADLB_FINAL;
  set ADLB;
  by USUBJID LBTESTCD;
  if first.LBTESTCD then RANK = 0;
  RANK + 1;
run;`
          }
          lang="SAS"
          id="wo-sas-fix"
        />
      </div>
    </div>

    <div className="conclusion-box">
      <p
        style={{
          margin: 0,
          fontSize: "13px",
          lineHeight: 1.9,
          whiteSpace: "pre-wrap",
        }}
      >
        {`Key Takeaway:
• In SAS — always PROC SORT before any BY statement
• PROC TRANSPOSE with BY also requires sorted data
• In R — pivot_wider() and pivot_longer() do not require sorting`}
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

        <div className="footer">
          © {new Date().getFullYear()} SAS ↔ R Hub — Educational resource for Clinical Programmers
        </div>
      </div>
    </div>
  );
}