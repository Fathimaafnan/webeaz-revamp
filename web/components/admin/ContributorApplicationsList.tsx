"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, panelClass } from "@/components/admin/api";

export type ContributorRow = {
  id: number;
  fullName: string;
  email: string;
  professionalRole: string;
  company?: string | null;
  status: string;
  createdAt: string;
  reviewedAt?: string | null;
};

const FILTERS = ["All", "PENDING", "APPROVED", "REJECTED"] as const;

export default function ContributorApplicationsList() {
  const [applications, setApplications] = useState<ContributorRow[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(nextFilter: (typeof FILTERS)[number]) {
    setError("");
    setLoading(true);
    const url =
      nextFilter === "All" ? "/api/admin/contributor-applications" : `/api/admin/contributor-applications?status=${nextFilter}`;
    const result = await apiGet<{ applications: ContributorRow[] }>(url);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setApplications(result.data.applications);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = "/api/admin/contributor-applications";
      const result = await apiGet<{ applications: ContributorRow[] }>(url);
      if (cancelled) return;
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setApplications(result.data.applications);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-label="Applications" className={panelClass}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-semibold text-white">Applications</h2>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter applications">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => {
                setFilter(f);
                void load(f);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${filter === f ? "bg-brand-orange text-ink" : "border border-white/15 text-white/70 hover:bg-white/5 hover:text-white"}`}
            >
              {f === "All" ? "All" : f === "PENDING" ? "Pending" : f === "APPROVED" ? "Approved" : "Rejected"}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-lg border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : loading ? (
        <p role="status" className="mt-4 rounded-lg border border-white/10 bg-black/10 p-4 text-sm text-white/60">
          Loading applications…
        </p>
      ) : applications.length === 0 ? (
        <p role="status" className="mt-4 rounded-lg border border-white/10 bg-black/10 p-4 text-sm text-white/60">
          No {filter === "All" ? "" : filter.toLowerCase() + " "}applications yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-black/20 text-xs uppercase tracking-wide text-white/55">
              <tr>
                <th scope="col" className="px-4 py-3">Applicant</th>
                <th scope="col" className="px-4 py-3">Role</th>
                <th scope="col" className="px-4 py-3">Company</th>
                <th scope="col" className="px-4 py-3">Submitted</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {applications.map((app) => (
                <tr key={app.id} className="text-white/80">
                  <td className="px-4 py-3">
                    <span className="block font-semibold text-white">{app.fullName}</span>
                    <span className="text-xs text-white/45">{app.email}</span>
                  </td>
                  <td className="px-4 py-3">{app.professionalRole}</td>
                  <td className="px-4 py-3">{app.company ?? "—"}</td>
                  <td className="px-4 py-3">
                    {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(app.createdAt))}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold">{app.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/contributor-applications/${app.id}`}
                      className="rounded-lg border border-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/5"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
