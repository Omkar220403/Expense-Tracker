"use client";

import { useEffect, useState } from "react";

type HealthState = "checking" | "available" | "unavailable" | "not-configured";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [health, setHealth] = useState<HealthState>(() => (apiUrl ? "checking" : "not-configured"));

  useEffect(() => {
    if (!apiUrl) {
      return;
    }

    fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/health`)
      .then((response) => {
        if (!response.ok) throw new Error("Health check failed");
        setHealth("available");
      })
      .catch(() => setHealth("unavailable"));
  }, [apiUrl]);

  const statusText = {
    checking: "Checking backend connection…",
    available: "Backend is connected",
    unavailable: "Backend is not reachable",
    "not-configured": "NEXT_PUBLIC_API_URL is not configured",
  }[health];

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-slate-900">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Local-first</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Smart Expense Tracker</h1>
        <p className="mt-4 leading-7 text-slate-600">
          Your privacy-conscious expense tracker is ready for its first feature.
        </p>
        <div className="mt-8 rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium" role="status">
          <span className={health === "available" ? "text-emerald-700" : "text-slate-700"}>{statusText}</span>
        </div>
        <p className="mt-5 text-sm text-slate-500">
          API health endpoint: <code className="rounded bg-slate-100 px-1.5 py-0.5">/api/v1/health</code>
        </p>
      </section>
    </main>
  );
}
