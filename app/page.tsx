"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-16 md:py-24">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-10">
          SAS ↔ R Hub
        </h1>

        <p className="text-xl md:text-2xl leading-relaxed mb-16 text-muted-foreground max-w-3xl mx-auto">
          SAS ↔ R Hub is an educational platform designed to help clinical programmers understand
          functional similarities and differences between SAS and R using practical examples and
          real-world clinical datasets examples.
        </p>

        <div className="mt-8 flex gap-6 justify-center flex-wrap">

  <Link href="/functions">
    <button
      style={{
        padding: "14px 32px",
        fontSize: "18px",
        fontWeight: "bold",
        backgroundColor: "black",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      Explore Functions →
    </button>
  </Link>

  <Link href="/merge">
    <button
      style={{
        padding: "14px 32px",
        fontSize: "18px",
        fontWeight: "bold",
        backgroundColor: "black",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      Merge / Joins →
    </button>
  </Link>

</div>

        <footer className="mt-24 pt-10 text-sm text-muted-foreground border-t border-border w-full text-center">
          © {new Date().getFullYear()} SAS ↔ R Hub.
        </footer>
      </div>
    </div>
  );
}