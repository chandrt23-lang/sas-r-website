"use client";

import { useState } from "react";
import { contentData } from "../data/functions";

export default function Home() {
  const [selected, setSelected] = useState(contentData[0]);
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<any>({});

  const filtered = contentData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc: any, item: any) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const toggleCategory = (category: string) => {
    setOpenCategories((prev: any) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #ddd",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontWeight: "bold" }}>SAS ↔ R Hub</h2>

        <input
          type="text"
          placeholder="Search..."
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "15px",
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {Object.keys(grouped).map((category) => (
          <div key={category} style={{ marginBottom: "15px" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                cursor: "pointer",
              }}
              onClick={() => toggleCategory(category)}
            >
              {openCategories[category] ? "▼ " : "▶ "}
              {category}
            </div>

            {openCategories[category] &&
              grouped[category].map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    padding: "8px 8px 8px 20px",
                    cursor: "pointer",
                    backgroundColor:
                      selected.id === item.id ? "#f0f0f0" : "white",
                    marginBottom: "4px",
                  }}
                  onClick={() => setSelected(item)}
                >
                  {item.title}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        <h1 style={{ fontWeight: "bold" }}>{selected.title}</h1>

        {/* Overview */}
        <h3 style={{ fontWeight: "bold", marginTop: "30px" }}>
          Overview
        </h3>
        <p>{selected.overview}</p>

        {/* Behavior Difference Box */}
        {selected.behavior && (
          <div
            style={{
              backgroundColor: "#fff4e5",
              borderLeft: "5px solid #ffa500",
              padding: "15px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <strong>⚠ Behavior Difference</strong>
            <p style={{ marginTop: "8px" }}>{selected.behavior}</p>
          </div>
        )}

        {/* Syntax */}
        <h3 style={{ fontWeight: "bold", marginTop: "30px" }}>
          Syntax Comparison
        </h3>

        <div style={{ display: "flex", gap: "40px" }}>
          <div>
            <h4 style={{ fontWeight: "bold" }}>SAS</h4>
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>
              {selected.sas}
            </pre>
          </div>

          <div>
            <h4 style={{ fontWeight: "bold" }}>R</h4>
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>
              {selected.r}
            </pre>
          </div>
        </div>

        {/* Details */}
        <h3 style={{ fontWeight: "bold", marginTop: "30px" }}>
          Details
        </h3>
        <p>{selected.details}</p>

        {/* Example */}
        <h3 style={{ fontWeight: "bold", marginTop: "30px" }}>
          Example
        </h3>

        <div style={{ display: "flex", gap: "40px" }}>
          <div>
            <h4 style={{ fontWeight: "bold" }}>SAS Example</h4>
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>
              {selected.exampleSAS}
            </pre>
          </div>

          <div>
            <h4 style={{ fontWeight: "bold" }}>R Example</h4>
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>
              {selected.exampleR}
            {/* Output Dataset */}
{selected.outputTable && (
  <>
    <h3 style={{ fontWeight: "bold", marginTop: "30px" }}>
      📤 Output Dataset
    </h3>
    <pre
      style={{
        background: "#f4f4f4",
        padding: "15px",
        whiteSpace: "pre-wrap",
      }}
    >
      {selected.outputTable}
    </pre>
  </>
)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}