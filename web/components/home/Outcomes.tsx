"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import CardIcon from "@/components/ui/CardIcon";
import Reveal from "@/components/ui/Reveal";

const outcomes = [
  {
    goal: "Generate More Leads",
    capabilities: ["Digital Marketing", "SEO", "Google Ads", "Landing Pages", "CRM", "Lead Automation"],
  },
  {
    goal: "Increase Sales",
    capabilities: ["CRM Setup", "Sales Automation", "Lead Nurturing", "Conversion Optimization", "WhatsApp Sales Flows"],
  },
  {
    goal: "Digitize My Business",
    capabilities: ["Business Website", "Custom Software", "Cloud Migration", "Ecommerce", "ERPEaz Cloud ERP"],
  },
  {
    goal: "Automate Operations",
    capabilities: ["Workflow Automation", "CRM Integration", "WhatsApp Business", "Reporting Dashboards", "Process Design"],
  },
  {
    goal: "Build a Digital Product",
    capabilities: ["Product Strategy", "UI/UX Design", "Web & Mobile Development", "Cloud Architecture", "Ongoing Support"],
  },
  {
    goal: "Use AI in My Business",
    capabilities: ["AI Strategy", "AI Integration", "AI Agents", "AI Automation", "Team Enablement"],
  },
  {
    goal: "Grow My Digital Presence",
    capabilities: ["SEO", "Content Strategy", "Paid Campaigns", "Social Presence", "Analytics & Reporting"],
  },
];

/**
 * "Business outcomes" — the same seven goals and their
 * capability lists, presented as selectable cards. Selecting a
 * card keeps the original behaviour (its capabilities are shown)
 * but now inside the card itself, so the whole section reads as
 * a visual grid instead of a list plus side panel.
 */
export default function Outcomes() {
  const [active, setActive] = useState(0);

  return (
    <section className="sec-sand theme-light relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      {/* Blue radial with orange atmospheric lighting */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift absolute -right-[15%] top-[15%] h-[32rem] w-[32rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift-slow absolute -left-[8%] bottom-[5%] h-[20rem] w-[20rem]"
      />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Business outcomes"
            title="What can we help you achieve?"
            description="Start with the business goal — we'll connect it to the right WebEaz capabilities."
      />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o, i) => {
            const isActive = active === i;
            return (
              <Reveal key={o.goal} delay={(i % 3) * 70}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`card-accent group flex h-full w-full flex-col p-6 text-left ${
                    isActive
                      ? "!border-brand-orange/50 shadow-[0_22px_42px_-20px_rgba(224,127,15,0.22)]"
                      : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-0.5 transition-colors duration-300 ${
                      isActive ? "bg-brand-orange" : "bg-line group-hover:bg-brand-blue/50"
                    }`}
                  />

                  <span className="flex items-start justify-between gap-4">
                    <CardIcon
                      name="outcome"
                      className={`h-7 w-7 transition-colors duration-300 ${
                        isActive ? "text-brand-orange-strong" : "text-brand-blue/80"
                      }`}
                    />
                    <span
                      className={`font-mono text-xs tracking-widest transition-colors duration-300 ${
                        isActive ? "text-brand-orange-strong" : "text-muted/70"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>

                  <span
                    className={`mt-4 block text-lg font-semibold tracking-tight transition-colors duration-300 sm:text-xl ${
                      isActive ? "text-ink" : "text-ink-soft"
                    }`}
                  >
                    {o.goal}
                  </span>

                  {/* Capabilities reveal in place, same data as before */}
                  <span
                    className={`grid transition-all duration-400 ${
                      isActive
                        ? "mt-5 grid-rows-[1fr] opacity-100"
                        : "mt-0 grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span key={isActive ? o.goal : "idle"} className="fade-rise flex flex-wrap gap-2">
                        {o.capabilities.map((c) => (
                          <span
                            key={c}
                            className="rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] font-medium text-ink-soft"
                          >
                            {c}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}