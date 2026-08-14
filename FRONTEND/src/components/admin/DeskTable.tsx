import type { ReactNode } from "react";

export function DeskTable({
  head,
  children,
}: {
  head: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-[1.25rem] border border-line bg-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-cream-deep text-[11px] uppercase tracking-wider text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
