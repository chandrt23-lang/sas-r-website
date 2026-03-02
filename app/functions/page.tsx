"use client";

import { useState } from "react";
import { contentData, FunctionItem } from "../../data/functions";

export default function FunctionsPage() {
  const [selected, setSelected] = useState<FunctionItem>(contentData[0]);
  const [search, setSearch] = useState("");

  const filtered = contentData.filter((item: FunctionItem) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const categories = [
    "Character Functions",
    "Numeric Functions",
    "Date Formats"
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "320px",
          borderRight: "1px solid #eee",
          padding: "20px",
          background: "#fafafa"
        }}
      >
        <h2 style={{ fontWeight: "bold" }}>SAS ↔ R Hub</h2>

        <input
          type="text"
          placeholder="Search..."
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "20px"
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {categories.map((cat) => (
          <div key={cat} style={{ marginBottom: "20px" }}>
            <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>{cat}</h4>

            {filtered
              .filter((item: FunctionItem) => item.category === cat)
              .map((item: FunctionItem) => (
                <div
                  key={item.id}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    backgroundColor:
                      selected.id === item.id ? "#eaeaea" : "transparent",
                    marginBottom: "4px",
                    borderRadius: "4px"
                  }}
                  onClick={() => setSelected(item)}
                >
                  {item.title}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", maxWidth: "1000px" }}>
        <h1 style={{ fontWeight: "bold" }}>{selected.title}</h1>

        {/* Overview */}
        <h3 style={{ marginTop: "30px" }}>Overview</h3>
        <p>{selected.overview}</p>

        {/* Behavior Difference */}
        {selected.behavior && (
          <div
            style={{
              background: "#fff8e1",
              padding: "15px",
              borderLeft: "5px solid orange",
              marginTop: "20px",
              borderRadius: "4px"
            }}
          >
            ⚠ <strong>Behavior Difference</strong>
            <p style={{ marginTop: "5px" }}>{selected.behavior}</p>
          </div>
        )}

        {/* Syntax */}
        <h3 style={{ marginTop: "30px" }}>Syntax Comparison</h3>
        <div style={{ display: "flex", gap: "40px" }}>
          <div style={{ flex: 1 }}>
            <h4>SAS</h4>
            <div style={{ position: "relative" }}>
              <pre style={{ background: "#f4f4f4", padding: "10px" }}>
                {selected.sas}
              </pre>
              <button
                onClick={() => copyToClipboard(selected.sas)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  fontSize: "12px"
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h4>R</h4>
            <div style={{ position: "relative" }}>
              <pre style={{ background: "#f4f4f4", padding: "10px" }}>
                {selected.r}
              </pre>
              <button
                onClick={() => copyToClipboard(selected.r)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  fontSize: "12px"
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Details */}
        <h3 style={{ marginTop: "30px" }}>Details</h3>
        <p>{selected.details}</p>

        {/* Examples */}
        <h3 style={{ marginTop: "30px" }}>Example</h3>
        <div style={{ display: "flex", gap: "40px" }}>
          <div style={{ flex: 1 }}>
            <h4>SAS Example</h4>
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>
              {selected.exampleSAS}
            </pre>
          </div>

          <div style={{ flex: 1 }}>
            <h4>R Example</h4>
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>
              {selected.exampleR}
            </pre>
          </div>
        </div>

        {/* Output Dataset */}
       {selected.outputTable && (
  <>
    <h3 style={{ marginTop: "30px" }}>Output Dataset</h3>
    <pre style={{ background: "#eef6ff", padding: "10px" }}>
      {selected.outputTable}
    </pre>
  </>
)}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "60px",
            padding: "20px",
            borderTop: "1px solid #eee",
            fontSize: "13px",
            color: "#666"
          }}
        >
          © {new Date().getFullYear()} SAS ↔ R Hub.  
          Educational resource for Clinical Programmers.
        </div>
      </div>
    </div>
  );
}