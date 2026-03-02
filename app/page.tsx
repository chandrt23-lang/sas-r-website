"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Arial",
        padding: "60px",
        maxWidth: "900px",
        margin: "auto"
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>
        SAS ↔ R Hub
      </h1>

      <p style={{ fontSize: "18px", lineHeight: "1.7", color: "#444" }}>
        SAS ↔ R Hub is an educational platform designed to help
        clinical programmers understand functional similarities and
        differences between SAS and R using practical examples
        and real-world clinical datasets examples.
      </p>

      <div style={{ marginTop: "40px" }}>
        <Link href="/functions">
          <button
            style={{
              padding: "12px 25px",
              fontSize: "16px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px"
            }}
          >
            Explore Functions →
          </button>
        </Link>
      </div>

      <div
        style={{
          marginTop: "80px",
          borderTop: "1px solid #eee",
          paddingTop: "20px",
          fontSize: "14px",
          color: "#666"
        }}
      >
        © {new Date().getFullYear()} SAS ↔ R Hub.
      </div>
    </div>
  );
}