"use client";

import { useState } from "react";
import { contentData, FunctionItem } from "../../data/functions";

export default function FunctionsPage() {
  const [selected, setSelected] = useState<FunctionItem>(
    contentData.find((item) => item.id === "strip-trimws") || contentData[0]
  );
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>("Character Functions");

  const categories = ["Character Functions", "Numeric Functions", "Date Formats"];

  const filtered = contentData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <div className="flex min-h-screen font-sans bg-background text-foreground">
      {/* Sidebar */}
      <div
        className="w-[320px] border-r border-border bg-sidebar p-6 overflow-y-auto sticky top-0 h-screen"
      >
        <a href="/" className="no-underline">
  <h2 className="font-bold text-xl mb-6 hover:opacity-70 transition-opacity cursor-pointer">SAS ↔ R Hub</h2>
</a>

        <input
          type="text"
          placeholder="Search functions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 mb-6"
        />

        {categories.map((cat) => (
          <div key={cat} className="mb-5">
            <div
              className="font-semibold cursor-pointer py-2 flex justify-between items-center hover:opacity-80"
              onClick={() => setOpenCategory(openCategory === cat ? null : cat)}
            >
              <span>{cat}</span>
              <span className="text-lg">{openCategory === cat ? "▼" : "▶"}</span>
            </div>

            {openCategory === cat &&
              filtered
                .filter((item) => item.category === cat)
                .map((item) => (
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
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 max-w-5xl overflow-y-auto">
        <h1 className="text-4xl font-bold mt-0 mb-8">{selected.title}</h1>

        {/* Overview */}
        <h3 className="text-2xl mt-8 mb-3">Overview</h3>
        <p className="leading-relaxed">{selected.overview}</p>

        {/* Behavior Warning */}
        {selected.behavior && (
          <div className="bg-warning-bg border-l-4 border-warning-border p-5 my-6 rounded-md">
            <strong className="text-warning-text block mb-2">⚠ Behavior Difference</strong>
            <p className="text-foreground/90">{selected.behavior}</p>
          </div>
        )}

        {/* Syntax Comparison */}
        <h3 className="text-2xl mt-10 mb-4">Syntax Comparison</h3>

        <div className="flex flex-wrap gap-8">
          <div className="flex-1 min-w-[320px]">
            <h4 className="text-lg mb-2">SAS</h4>
            <div className="relative">
              <pre className="code-block min-h-[80px]">
                {selected.sas?.trim() || "— No SAS syntax provided —"}
              </pre>
              {selected.sas?.trim() && (
                <button
                  onClick={() => copyToClipboard(selected.sas)}
                  className="copy-btn"
                >
                  Copy
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-[320px]">
            <h4 className="text-lg mb-2">R</h4>
            <div className="relative">
              <pre className="code-block min-h-[80px]">
                {selected.r?.trim() || "— No R equivalent provided —"}
              </pre>
              {selected.r?.trim() && (
                <button
                  onClick={() => copyToClipboard(selected.r)}
                  className="copy-btn"
                >
                  Copy
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <h3 className="text-2xl mt-10 mb-3">Details</h3>
        <p className="leading-relaxed whitespace-pre-wrap">{selected.details}</p>

        {/* Examples */}
        <h3 className="text-2xl mt-10 mb-4">Example</h3>

        <div className="flex flex-wrap gap-8">
          <div className="flex-1 min-w-[320px]">
            <h4 className="text-lg mb-2">SAS Example</h4>
            <pre className="code-block min-h-[100px]">
              {selected.exampleSAS?.trim() || "— Example not available —"}
            </pre>
          </div>

          <div className="flex-1 min-w-[320px]">
            <h4 className="text-lg mb-2">R Example</h4>
            <pre className="code-block min-h-[100px]">
              {selected.exampleR?.trim() || "— Example not available —"}
            </pre>
          </div>
        </div>

        {/* Output Dataset */}
        {selected.outputTable?.trim() && (
          <>
            <h3 className="text-2xl mt-10 mb-3">Output Dataset</h3>
            <pre className="code-block bg-blue-950/30 border-blue-800">
              {selected.outputTable}
            </pre>
          </>
        )}

        {/* Footer */}
        <div className="mt-20 pt-6 border-t border-border text-center text-sm text-muted">
          © {new Date().getFullYear()} SAS ↔ R Hub — Educational resource for Clinical Programmers
        </div>
      </div>
    </div>
  );
}