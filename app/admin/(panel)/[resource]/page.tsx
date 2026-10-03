import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceList } from "@/components/admin/ResourceList";
import { getResourceConfig, type ResourceKey } from "@/lib/resource-config";

export async function generateMetadata({ params }: PageProps<"/admin/[resource]">): Promise<Metadata> {
  const { resource } = await params;
  return { title: getResourceConfig(resource)?.label ?? "Not found" };
}

export default async function ResourceListPage({ params }: PageProps<"/admin/[resource]">) {
  const { resource } = await params;
  if (!getResourceConfig(resource)) notFound();
  return <ResourceList resourceKey={resource as ResourceKey} />;
}
