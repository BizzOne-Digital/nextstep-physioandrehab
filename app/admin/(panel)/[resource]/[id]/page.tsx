import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceEditor } from "@/components/admin/ResourceEditor";
import { getResourceConfig, type ResourceKey } from "@/lib/resource-config";

export async function generateMetadata({ params }: PageProps<"/admin/[resource]/[id]">): Promise<Metadata> {
  const { resource, id } = await params;
  const config = getResourceConfig(resource);
  return { title: config ? `${id === "new" ? "New" : "Edit"} ${config.singular.toLowerCase()}` : "Not found" };
}

/** Handles both /admin/{resource}/new and /admin/{resource}/{id}. */
export default async function ResourceEditPage({ params }: PageProps<"/admin/[resource]/[id]">) {
  const { resource, id } = await params;
  if (!getResourceConfig(resource)) notFound();
  if (id !== "new" && !/^[a-f0-9]{24}$/i.test(id)) notFound();
  return <ResourceEditor resourceKey={resource as ResourceKey} id={id === "new" ? undefined : id} />;
}
