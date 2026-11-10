"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import type {
  HomeContent,
  HomeSection,
  HomeStat,
  HomepageBlogSettings,
} from "@/lib/defaults";
import FinalCtaPanel from "@/components/admin/FinalCtaPanel";
import HeroPanel from "@/components/admin/HeroPanel";
import BlogsPanel, { type EligibleBlogOption } from "@/components/admin/BlogsPanel";
import IndustriesPanel, {
  type IndustryRow,
} from "@/components/admin/IndustriesPanel";
import SectionsPanel from "@/components/admin/SectionsPanel";
import StatsPanel from "@/components/admin/StatsPanel";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "final-cta", label: "Final CTA" },
  { id: "sections", label: "Homepage Sections" },
  { id: "blogs", label: "Blogs" },
  { id: "statistics", label: "Statistics" },
  { id: "industries", label: "Industries" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function HomepageEditor({
  initialContent,
  initialSections,
  initialStats,
  initialIndustries,
  builtInIndustries,
  initialBlogSettings,
  initialEligibleBlogs,
  canSave,
}: {
  initialContent: HomeContent;
  initialSections: HomeSection[];
  initialStats: Record<"trust" | "why", HomeStat[]>;
  initialIndustries: IndustryRow[];
  builtInIndustries: readonly string[];
  initialBlogSettings: HomepageBlogSettings;
  initialEligibleBlogs: EligibleBlogOption[];
  canSave: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("hero");

  const onTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = TABS.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    setActiveTab(TABS[nextIndex].id);
    document.getElementById(`homepage-tab-${TABS[nextIndex].id}`)?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Homepage content sections"
        className="flex flex-wrap gap-2 border-b border-white/10 pb-3"
      >
        {TABS.map((tab, index) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`homepage-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`homepage-panel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange ${
                active
                  ? "bg-brand-orange text-ink"
                  : "border border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="homepage-panel-hero"
        role="tabpanel"
        aria-labelledby="homepage-tab-hero"
        tabIndex={0}
        hidden={activeTab !== "hero"}
        className="pt-6 focus-visible:outline-2 focus-visible:outline-brand-orange"
      >
        <HeroPanel initial={initialContent} canSave={canSave} />
      </div>
      <div
        id="homepage-panel-final-cta"
        role="tabpanel"
        aria-labelledby="homepage-tab-final-cta"
        tabIndex={0}
        hidden={activeTab !== "final-cta"}
        className="pt-6 focus-visible:outline-2 focus-visible:outline-brand-orange"
      >
        <FinalCtaPanel initial={initialContent} canSave={canSave} />
      </div>
      <div
        id="homepage-panel-sections"
        role="tabpanel"
        aria-labelledby="homepage-tab-sections"
        tabIndex={0}
        hidden={activeTab !== "sections"}
        className="pt-6 focus-visible:outline-2 focus-visible:outline-brand-orange"
      >
        <SectionsPanel initial={initialSections} canSave={canSave} />
      </div>
      <div
        id="homepage-panel-blogs"
        role="tabpanel"
        aria-labelledby="homepage-tab-blogs"
        tabIndex={0}
        hidden={activeTab !== "blogs"}
        className="pt-6 focus-visible:outline-2 focus-visible:outline-brand-orange"
      >
        <BlogsPanel initialSettings={initialBlogSettings} initialEligible={initialEligibleBlogs} canSave={canSave} />
      </div>
      <div
        id="homepage-panel-statistics"
        role="tabpanel"
        aria-labelledby="homepage-tab-statistics"
        tabIndex={0}
        hidden={activeTab !== "statistics"}
        className="pt-6 focus-visible:outline-2 focus-visible:outline-brand-orange"
      >
        <StatsPanel initialStats={initialStats} canSave={canSave} />
      </div>
      <div
        id="homepage-panel-industries"
        role="tabpanel"
        aria-labelledby="homepage-tab-industries"
        tabIndex={0}
        hidden={activeTab !== "industries"}
        className="pt-6 focus-visible:outline-2 focus-visible:outline-brand-orange"
      >
        <IndustriesPanel
          initialIndustries={initialIndustries}
          builtInIndustries={builtInIndustries}
          canSave={canSave}
        />
      </div>
    </div>
  );
}
