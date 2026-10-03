import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarCheck, Database, FileText, Inbox, MessageSquareQuote, Newspaper, PenSquare, Settings, Stethoscope } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { SeedButton } from "@/components/admin/SeedButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { getDbState } from "@/lib/data";
import { Appointment, BlogPost, ContactSubmission, Service, StoredUpload, TeamMember, Testimonial } from "@/models";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

interface Recent {
  _id: string;
  name?: string;
  fullName?: string;
  service?: string;
  subject?: string;
  status: string;
  createdAt: string;
}

async function loadStats() {
  await connectDB();
  const [newAppointments, totalAppointments, newContacts, pendingReviews, services, team, published, drafts, uploads, recentAppointments, recentContacts] =
    await Promise.all([
      Appointment.countDocuments({ status: "new" }),
      Appointment.countDocuments({}),
      ContactSubmission.countDocuments({ status: "new" }),
      Testimonial.countDocuments({ published: false }),
      Service.countDocuments({}),
      TeamMember.countDocuments({}),
      BlogPost.countDocuments({ status: "published" }),
      BlogPost.countDocuments({ status: "draft" }),
      StoredUpload.countDocuments({}),
      Appointment.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      ContactSubmission.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ]);
  return {
    newAppointments, totalAppointments, newContacts, pendingReviews, services, team, published, drafts, uploads,
    recentAppointments: JSON.parse(JSON.stringify(recentAppointments)) as Recent[],
    recentContacts: JSON.parse(JSON.stringify(recentContacts)) as Recent[],
  };
}

export default async function DashboardPage() {
  const state = await getDbState();

  if (state === "unavailable") {
    return (
      <>
        <AdminPageHeader title="Dashboard" />
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Database className="mt-1 size-6 shrink-0 text-amber-700" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-bold">{isDatabaseConfigured() ? "Cannot reach the database" : "Database not configured"}</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-800">
                {isDatabaseConfigured()
                  ? "MONGODB_URI is set but the connection failed. Check the connection string, network access (IP allow list) and that the cluster is running."
                  : "Set MONGODB_URI in your environment variables, then restart the app. The public website is currently showing the built-in migrated content."}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const s = await loadStats();
  const cards = [
    { label: "New appointment requests", value: s.newAppointments, href: "/admin/appointments?status=new", icon: CalendarCheck, alert: s.newAppointments > 0 },
    { label: "Unread messages", value: s.newContacts, href: "/admin/contacts?status=new", icon: Inbox, alert: s.newContacts > 0 },
    { label: "Reviews awaiting approval", value: s.pendingReviews, href: "/admin/testimonials", icon: MessageSquareQuote, alert: s.pendingReviews > 0 },
    { label: "Published blog posts", value: s.published, href: "/admin/blogs", icon: Newspaper, alert: false, sub: s.drafts ? `${s.drafts} draft${s.drafts > 1 ? "s" : ""}` : undefined },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" description="What needs attention today, at a glance." />

      {state === "unseeded" && (
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-teal-500/30 bg-mint-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Import the website content</h2>
            <p className="mt-1 text-sm text-navy-800">
              The database is empty. Import the migrated services, conditions, FAQs, team, blog posts and settings so you can edit them here.
            </p>
          </div>
          <SeedButton />
        </div>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="group flex h-full flex-col rounded-3xl border border-line bg-white p-5 transition-shadow hover:shadow-card">
              <div className="flex items-center justify-between">
                <span className={c.alert ? "grid size-11 place-items-center rounded-2xl bg-teal-700 text-white" : "grid size-11 place-items-center rounded-2xl bg-sky-50 text-navy-800"}>
                  <c.icon className="size-5" aria-hidden="true" />
                </span>
                {c.alert && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">Needs action</span>}
              </div>
              <p className="mt-5 font-display text-3xl font-extrabold text-navy-900">{c.value}</p>
              <p className="mt-1 text-sm text-muted">{c.label}</p>
              {c.sub && <p className="mt-1 text-xs font-medium text-teal-700">{c.sub}</p>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <RecentList
          title="Latest appointment requests"
          href="/admin/appointments"
          empty="No appointment requests yet."
          items={s.recentAppointments.map((a) => ({ id: a._id, title: a.fullName ?? "", meta: a.service || "No service selected", status: a.status, date: a.createdAt }))}
        />
        <RecentList
          title="Latest contact messages"
          href="/admin/contacts"
          empty="No messages yet."
          items={s.recentContacts.map((c) => ({ id: c._id, title: c.name ?? "", meta: c.subject || "No subject", status: c.status, date: c.createdAt }))}
        />
      </div>

      <section className="mt-8 rounded-3xl border border-line bg-white p-6">
        <h2 className="text-lg font-bold">Quick actions</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/blogs/new", label: "Write a blog post", icon: PenSquare },
            { href: "/admin/pages/home", label: "Edit homepage", icon: FileText },
            { href: "/admin/services", label: `Manage ${s.services} services`, icon: Stethoscope },
            { href: "/admin/settings", label: "Update hours & contact", icon: Settings },
          ].map((a) => (
            <li key={a.href}>
              <Link href={a.href} className="flex items-center gap-3 rounded-2xl bg-sky-50 p-4 text-sm font-semibold text-navy-900 hover:bg-mint-100">
                <a.icon className="size-5 text-teal-700" aria-hidden="true" /> {a.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-muted">
          {s.team} team member{s.team === 1 ? "" : "s"} · {s.uploads} uploaded image{s.uploads === 1 ? "" : "s"} stored in MongoDB · {s.totalAppointments} total appointment requests
        </p>
      </section>
    </>
  );
}

function RecentList({
  title,
  href,
  empty,
  items,
}: {
  title: string;
  href: string;
  empty: string;
  items: { id: string; title: string; meta: string; status: string; date: string }[];
}) {
  return (
    <section className="rounded-3xl border border-line bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800">
          View all <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      {items.length ? (
        <ul className="mt-4 divide-y divide-line">
          {items.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy-900">{i.title}</p>
                <p className="truncate text-sm text-muted">
                  {i.meta} · {formatDate(i.date, { month: "short", day: "numeric" })}
                </p>
              </div>
              <StatusBadge status={i.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-2xl bg-sky-50 p-5 text-sm text-muted">{empty}</p>
      )}
    </section>
  );
}
