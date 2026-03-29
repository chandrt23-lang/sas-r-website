"use client";

import { useState } from "react";
import { joinsData, JoinItem } from "../../data/joins";

export default function MergePage() {
  const [selected, setSelected] = useState<JoinItem>(
    joinsData.find((item) => item.id === "full-join") || joinsData[0]
  );
  const [search, setSearch] = useState("");

  const filtered = joinsData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <div className="flex min-h-screen font-sans bg-background text-foreground">

      {/* ── Sidebar ── */}
      <div className="w-[320px] border-r border-border bg-sidebar p-6 overflow-y-auto sticky top-0 h-screen">
        <a href="/" className="no-underline">
  <h2 className="font-bold text-xl mb-6 hover:opacity-70 transition-opacity cursor-pointer">SAS ↔ R Hub</h2>
</a>

        <input
          type="text"
          placeholder="Search joins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 mb-6"
        />

        <div className="mb-5">
          <div className="font-semibold py-2 mb-2">Merge / Joins</div>
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className={`px-3 py-2 rounded-md cursor-pointer mb-1 transition-colors ${
                selected.id === item.id
                  ? "bg-muted/30 font-medium"
                  : "hover:bg-muted/10"
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 p-10 max-w-5xl overflow-y-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold mt-0 mb-8">{selected.title}</h1>

        {/* ── Overview ── */}
        <h3 className="text-2xl mt-8 mb-3">Overview</h3>
        <p className="leading-relaxed">{selected.overview}</p>

        {/* ── Behavior Difference ── */}
        {selected.behavior && (
          <div className="bg-warning-bg border-l-4 border-warning-border p-5 my-6 rounded-md">
            <strong className="text-warning-text block mb-2">⚠ Behavior Difference</strong>
            <p className="text-foreground/90">{selected.behavior}</p>
          </div>
        )}

        {/* ── Syntax Comparison ── */}
        <h3 className="text-2xl mt-10 mb-4">Syntax Comparison</h3>
        <div className="flex flex-wrap gap-8">
          <div className="flex-1 min-w-[320px]">
            <h4 className="text-lg mb-2">SAS</h4>
            <div className="relative">
              <pre className="code-block min-h-[80px]">
                {selected.sas?.trim()}
              </pre>
              <button onClick={() => copyToClipboard(selected.sas)} className="copy-btn">
                Copy
              </button>
            </div>
          </div>
          <div className="flex-1 min-w-[320px]">
            <h4 className="text-lg mb-2">R</h4>
            <div className="relative">
              <pre className="code-block min-h-[80px]">
                {selected.r?.trim()}
              </pre>
              <button onClick={() => copyToClipboard(selected.r)} className="copy-btn">
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* ── Details ── */}
        <h3 className="text-2xl mt-10 mb-3">Details</h3>
        <p className="leading-relaxed whitespace-pre-wrap">{selected.details}</p>

        {/* ════════════════════════════════════════
            EXAMPLE 1
        ════════════════════════════════════════ */}
        <div className="mt-12 border-t border-border pt-8">
          <h3 className="text-2xl font-bold mb-2">
            {selected.example1Title || "Example"}
          </h3>
          {selected.example1Desc && (
            <p className="leading-relaxed mb-6 text-foreground/80">
              {selected.example1Desc}
            </p>
          )}

          {/* Input Datasets */}
          {selected.example1Input && (
            <>
              <h4 className="text-lg font-semibold mb-2">Input Datasets</h4>
              <pre className="code-block mb-8">{selected.example1Input}</pre>
            </>
          )}

          {/* SAS and R Code side by side */}
          <div className="flex flex-wrap gap-8">
            <div className="flex-1 min-w-[320px]">
              <h4 className="text-lg mb-2">SAS Code</h4>
              <pre className="code-block min-h-[100px]">
                {selected.exampleSAS?.trim()}
              </pre>
            </div>
            <div className="flex-1 min-w-[320px]">
              <h4 className="text-lg mb-2">R Code</h4>
              <pre className="code-block min-h-[100px]">
                {selected.exampleR?.trim()}
              </pre>
            </div>
          </div>

          {/* Output */}
          {selected.outputTable1 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-2">Output Dataset</h4>
              <pre className="code-block">{selected.outputTable1}</pre>
            </div>
          )}

          {/* Output Note */}
          {selected.outputNote1 && (
            <div className="mt-4 p-4 rounded-md border border-border bg-muted/10">
              <p className="text-sm leading-relaxed text-foreground/80">
                📝 <strong>Note: </strong>{selected.outputNote1}
              </p>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════
            EXAMPLE 2 (only if exists)
        ════════════════════════════════════════ */}
        {selected.example2Title && (
          <div className="mt-12 border-t border-border pt-8">
            <h3 className="text-2xl font-bold mb-2">{selected.example2Title}</h3>
            {selected.example2Desc && (
              <p className="leading-relaxed mb-6 text-foreground/80">
                {selected.example2Desc}
              </p>
            )}

            {/* Input Datasets */}
            {selected.example2Input && (
              <>
                <h4 className="text-lg font-semibold mb-2">Input Datasets</h4>
                <pre className="code-block mb-8">{selected.example2Input}</pre>
              </>
            )}

            {/* SAS and R Code side by side */}
            <div className="flex flex-wrap gap-8">
              {selected.example2SAS && (
                <div className="flex-1 min-w-[320px]">
                  <h4 className="text-lg mb-2">SAS Code</h4>
                  <pre className="code-block min-h-[100px]">
                    {selected.example2SAS?.trim()}
                  </pre>
                </div>
              )}
              {selected.example2R && (
                <div className="flex-1 min-w-[320px]">
                  <h4 className="text-lg mb-2">R Code</h4>
                  <pre className="code-block min-h-[100px]">
                    {selected.example2R?.trim()}
                  </pre>
                </div>
              )}
            </div>

            {/* Output */}
            {selected.outputTable2 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-2">Output Dataset</h4>
                <pre className="code-block">{selected.outputTable2}</pre>
              </div>
            )}

            {/* Output Note */}
            {selected.outputNote2 && (
              <div className="mt-4 p-4 rounded-md border border-border bg-muted/10">
                <p className="text-sm leading-relaxed text-foreground/80">
                  📝 <strong>Note: </strong>{selected.outputNote2}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            WATCH OUT (only if exists)
        ════════════════════════════════════════ */}
        {selected.watchOut && (
          <div className="mt-12 border-t border-border pt-8">
            <h3 className="text-2xl font-bold mb-6">⚠ Watch Out</h3>

            {/* SAS — Silent Variable Overwrite */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-3 text-warning-text">
                SAS — Silent Variable Overwrite
              </h4>
              <p className="leading-relaxed mb-4 text-foreground/80">
                When two datasets share a variable name that is <strong>not</strong> the BY variable,
                SAS silently overwrites the value from the left dataset with the value from the right
                dataset — no error is thrown and nothing appears in the log by default.
              </p>
              <p className="leading-relaxed mb-4 text-foreground/80">
                In the example below, both DM and VS contain a variable called <strong>COUNTRY</strong>.
                After the merge, the value of <strong>COUNTRY</strong> from VS overwrites the one from
                DM silently. You will not notice this unless you check the log carefully.
              </p>

              <h5 className="font-semibold mb-2">❌ Problem — variable gets overwritten silently:</h5>
              <pre className="code-block mb-4">{`data ADVS;
  merge DM VS(in=b);
  by SUBJID;
  if b;
run;

/* Both DM and VS have COUNTRY variable.
   VS.COUNTRY silently overwrites DM.COUNTRY.
   No error is thrown — you will not notice this without checking the log. */`}</pre>

              <h5 className="font-semibold mb-2">✅ Fix — use OPTIONS MSGLEVEL=I to catch it in the log:</h5>
              <pre className="code-block mb-4">{`options msglevel=i;

data ADVS;
  merge DM VS(in=b);
  by SUBJID;
  if b;
run;

/* SAS Log will now show:
   INFO: Variable COUNTRY is in both datasets.
   Values from VS will overwrite values from DM. */`}</pre>

              <h5 className="font-semibold mb-2">✅ Best Practice — keep only required variables using KEEP=:</h5>
              <pre className="code-block mb-4">{`data ADVS;
  merge DM(in=b keep=SUBJID AGE SEX)
        VS(in=b keep=SUBJID VISIT VSDTC VSTEST VSORRES);
  by SUBJID;
  if b;
run;

/* COUNTRY is excluded from both datasets before merging.
   No risk of overwrite — only the variables you need are brought in. */`}</pre>
            </div>

            {/* R — Suffix Clash */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-3 text-warning-text">
                R — Unexpected .x and .y Suffix Clash
              </h4>
              <p className="leading-relaxed mb-4 text-foreground/80">
                In R, when both datasets share a variable name that is <strong>not</strong> in
                the <strong>by</strong> argument, dplyr does not overwrite — instead it automatically
                renames the conflicting columns by adding <strong>.x</strong> (from the left dataset)
                and <strong>.y</strong> (from the right dataset) suffixes.
              </p>
              <p className="leading-relaxed mb-4 text-foreground/80">
                This means <strong>COUNTRY</strong> from DM becomes <strong>COUNTRY.x</strong> and
                <strong> COUNTRY</strong> from VS becomes <strong>COUNTRY.y</strong> — causing
                unexpected columns in your output and potential downstream errors.
              </p>

              <h5 className="font-semibold mb-2">❌ Problem — unexpected .x and .y columns appear:</h5>
              <pre className="code-block mb-4">{`library(dplyr)

ADVS <- right_join(DM, VS, by = "SUBJID")

# Output contains:
# COUNTRY.x  (COUNTRY from DM)
# COUNTRY.y  (COUNTRY from VS)
# This is unexpected and will cause issues downstream`}</pre>

              <h5 className="font-semibold mb-2">✅ Best Practice — use select() to keep only required variables before joining:</h5>
              <pre className="code-block mb-4">{`library(dplyr)

ADVS <- right_join(
  DM %>% select(SUBJID, AGE, SEX),
  VS %>% select(SUBJID, VISIT, VSDTC, VSTEST, VSORRES),
  by = "SUBJID"
)

# COUNTRY is excluded from both datasets before joining.
# No .x or .y suffix clash — only the variables you need are brought in.`}</pre>
            </div>

            {/* Key Takeaway box */}
            <div className="p-5 rounded-md border border-warning-border bg-warning-bg">
              <p className="text-sm leading-loose whitespace-pre-wrap text-foreground/90">
                {`Key Takeaway:\n` +
                `• Always keep only the required variables before merging in both SAS and R\n` +
                `• In SAS — use KEEP= option in the MERGE statement to select only needed variables\n` +
                `• In R — use select() before passing datasets into any join function\n` +
                `• In SAS — use OPTIONS MSGLEVEL=I to catch silent variable overwrites in the log\n` +
                `• In R — watch for unexpected .x and .y suffixes in your output column names\n` +
                `• This best practice applies to all join types — Full Join, Left Join, Right Join and Inner Join`}
              </p>
            </div>
          </div>
        )}

        {/* ── Conclusion ── */}
        {selected.conclusion && (
          <div className="mt-12 border-t border-border pt-8">
            <h3 className="text-2xl font-bold mb-4">Conclusion</h3>
            <div className="p-5 rounded-md border border-border bg-muted/10">
              <p className="text-sm leading-loose whitespace-pre-wrap text-foreground/90">
                {selected.conclusion}
              </p>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="mt-20 pt-6 border-t border-border text-center text-sm text-muted">
          © {new Date().getFullYear()} SAS ↔ R Hub — Educational resource for Clinical Programmers
        </div>

      </div>
    </div>
  );
}