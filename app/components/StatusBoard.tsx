"use client";

import { useState } from "react";
import type { StatusColumn } from "@/lib/content";

type StatusBoardProps = {
  columns: StatusColumn[];
};

export function StatusBoard({ columns }: StatusBoardProps) {
  const [activeId, setActiveId] = useState<StatusColumn["id"]>("in-progress");

  return (
    <div className="status-board">
      <div className="status-tabs">
        {columns.map((column) => (
          <button
            key={column.id}
            type="button"
            className={`status-tab ${activeId === column.id ? "active" : ""}`}
            onClick={() => setActiveId(column.id)}
            aria-pressed={activeId === column.id}
          >
            {column.label}
          </button>
        ))}
      </div>
      <div className="status-columns" data-mode={activeId}>
        {columns.map((column) => (
          <div
            key={column.id}
            className="status-column"
            data-column={column.id}
          >
            {column.cards.map((card) => (
              <article key={card.title} className="status-card">
                <div>
                  <h4>{card.title}</h4>
                  <small>{card.summary}</small>
                </div>
                <span>{card.tag}</span>
                <small>{card.effort}</small>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

