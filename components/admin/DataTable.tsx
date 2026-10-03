"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Star } from "lucide-react";
import type { ColumnDef } from "@/lib/resource-config";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { resolveImage } from "@/lib/images";
import { cn, formatDate } from "@/lib/utils";

type Row = Record<string, unknown> & { _id: string };

function Cell({ col, row }: { col: ColumnDef; row: Row }) {
  const v = row[col.key];
  switch (col.type) {
    case "image":
      return (
        <span className="relative block size-12 overflow-hidden rounded-xl bg-sky-50 ring-1 ring-line">
          {typeof v === "string" && v ? <Image src={resolveImage(v)} alt="" fill sizes="48px" className="object-cover" /> : null}
        </span>
      );
    case "boolean":
      return col.key === "published" ? (
        <StatusBadge status={v ? "published" : "draft"} />
      ) : (
        <span className={cn("text-sm font-medium", v ? "text-teal-700" : "text-muted")}>{v ? "Yes" : "No"}</span>
      );
    case "date":
      return <span className="whitespace-nowrap text-sm text-muted">{formatDate(String(v ?? ""), { month: "short", day: "numeric", year: "numeric" })}</span>;
    case "badge":
      return <StatusBadge status={String(v ?? "")} className="normal-case" />;
    case "rating":
      return (
        <span className="flex items-center gap-1 text-sm font-semibold text-navy-900">
          <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" /> {String(v ?? "")}
        </span>
      );
    default:
      return <span className="line-clamp-2 text-sm font-medium text-navy-900">{String(v ?? "")}</span>;
  }
}

/** Table on desktop, stacked cards on mobile. */
export function DataTable({ columns, rows, actions, titleKey }: { columns: ColumnDef[]; rows: Row[]; actions: (row: Row) => ReactNode; titleKey: string }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-line bg-white md:block">
        <table className="w-full text-left">
          <thead className="border-b border-line bg-sky-50/60">
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted", c.className)}>
                  {c.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row._id} className="hover:bg-sky-50/40">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-3 align-middle", c.className)}>
                    <Cell col={c} row={row} />
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">{actions(row)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => {
          const image = columns.find((c) => c.type === "image");
          const rest = columns.filter((c) => c.type !== "image" && c.key !== titleKey);
          return (
            <li key={row._id} className="rounded-2xl border border-line bg-white p-4">
              <div className="flex gap-3">
                {image && <Cell col={image} row={row} />}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-900">{String(row[titleKey] ?? "")}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {rest.map((c) => (
                      <Cell key={c.key} col={c} row={row} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-1 border-t border-line pt-3">{actions(row)}</div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
