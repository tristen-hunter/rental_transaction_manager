import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface GroupedListProps<T> {
  groupedData: { monthKey: string; displayMonth: string; agents: [string, T[]][] }[];
  renderCard: (item: T) => React.ReactNode;
}

export function GroupedList<T extends { id: string }>({ groupedData, renderCard }: GroupedListProps<T>) {
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set());

  const toggleMonth = (monthKey: string) => {
    setCollapsedMonths(prev => {
      const next = new Set(prev);
      next.has(monthKey) ? next.delete(monthKey) : next.add(monthKey);
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {groupedData.map(({ monthKey, displayMonth, agents }) => {
        const isCollapsed = collapsedMonths.has(monthKey);

        return (
          <div key={monthKey} className="space-y-6">
            {/* Clickable Month Heading */}
            <button
              onClick={() => toggleMonth(monthKey)}
              className={`w-full flex items-center gap-2 pb-2 transition-all group border-t-muted-foreground border-t ${
                    isCollapsed
                    ? 'border-b-0 border-l-4 border-l-border pl-3'
                    : 'border-b border-b-border border-l-4 border-l-transparent pl-3'
                }`}
            >
            {isCollapsed
            ? <ChevronRight className="w-4 h-4 mr-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            : <ChevronDown className="w-4 h-4 mr-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              }
              <h2 className="text-lg font-bold text-foreground uppercase tracking-widest">
                {displayMonth}
              </h2>
              
            </button>

            {/* Collapsible Content */}
            {isCollapsed && agents.map(([agentName, items]) => (
              <div key={agentName} className="pl-4 border-l-2 border-accent/20 space-y-3">
                <h3 className="text-sm font-semibold text-primary/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Agent: {agentName}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {items.map((item) => (
                    <React.Fragment key={item.id}>
                      {renderCard(item)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}