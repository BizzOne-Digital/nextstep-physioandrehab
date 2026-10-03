import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/PageEditor";
import { getPageDefinition } from "@/content/pages";

export async function generateMetadata({ params }: PageProps<"/admin/pages/[key]">): Promise<Metadata> {
  const { key } = await params;
  return { title: `Edit ${getPageDefinition(key)?.label ?? "page"}` };
}

export default async function EditPage({ params }: PageProps<"/admin/pages/[key]">) {
  const { key } = await params;
  const def = getPageDefinition(key);
  if (!def) notFound();
  return <PageEditor pageKey={def.key} />;
}
