"use client";

import { useEffect, useMemo, useState } from "react";
import type { ArchitectureTab } from "@/lib/content";

type ArchitectureTabsProps = {
  tabs: ArchitectureTab[];
};

export function ArchitectureTabs({ tabs }: ArchitectureTabsProps) {
  const firstId = tabs[0]?.id ?? "frontend";
  const [active, setActive] = useState<ArchitectureTab["id"]>(firstId);

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === active) && tabs[0]) {
      setActive(tabs[0].id);
    }
  }, [active, tabs]);

  const current = useMemo(
    () => tabs.find((tab) => tab.id === active) ?? tabs[0],
    [active, tabs],
  );

  if (!current) {
    return null;
  }

  return (
    <>
      <div className="architecture-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === active ? "active" : undefined}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="architecture-panel">
        <h3>{current.title}</h3>
        <p>{current.description}</p>
        <ul>
          {current.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

