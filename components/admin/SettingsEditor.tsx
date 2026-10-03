"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { useToast } from "@/components/admin/Toast";
import { AdminApiError, adminFetch } from "@/components/admin/api";
import { SETTINGS_SECTIONS } from "@/lib/resource-config";

export function SettingsEditor() {
  const toast = useToast();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<{ settings: Record<string, unknown> }>("/api/admin/settings")
      .then((d) => setInitial(d.settings))
      .catch((e) => setError((e as Error).message));
  }, []);

  async function save(values: Record<string, unknown>) {
    try {
      await adminFetch("/api/admin/settings", { method: "PUT", body: JSON.stringify(values) });
      toast.success("Settings saved. The website has been updated.");
    } catch (e) {
      const err = e as AdminApiError;
      toast.error(err.message);
      if (err.fields) return { fields: err.fields };
    }
  }

  return (
    <>
      <AdminPageHeader title="Site settings" description="Contact details, hours, social links and direct billing partners used across the whole website." />
      {error ? <ErrorState message={error} /> : !initial ? <LoadingState /> : <ResourceForm sections={SETTINGS_SECTIONS} initialValues={initial} onSubmit={save} />}
    </>
  );
}
