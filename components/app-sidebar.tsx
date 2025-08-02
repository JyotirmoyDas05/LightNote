"use client";
import * as React from "react";

import { SearchForm } from "@/components/search-form";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getNotebooks } from "@/server/notebooks";
import Image from "next/image";
import { SidebarData } from "./sidebar-data";
import Link from "next/link";

import { NavFavorites } from "./nav-favorites";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // ...existing code...
  const [favorites, setFavorites] = React.useState([]);
  type SidebarDataType = {
    versions: string[];
    navMain: Array<{
      title: string;
      url: string;
      emoji: string | null;
      items: Array<{
        id: string;
        title: string;
        url: string;
        emoji: string | null;
      }>;
    }>;
  } | null;
  const [data, setData] = React.useState<SidebarDataType>(null);

  React.useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const json = await res.json();
        setFavorites(
          json.favorites.map((fav: { note?: { title?: string; notebookId?: string; emoji?: string }; noteId: string }) => {
            return {
              name: fav.note?.title ?? "Favorite Note",
              url: `/dashboard/notebook/${fav.note?.notebookId}/note/${fav.noteId}`,
              emoji: fav.note?.emoji ?? "⭐",
              noteId: fav.noteId,
            };
          })
        );
        }
      } catch {
        setFavorites([]);
      }
    }
    fetchFavorites();
    const handler = () => fetchFavorites();
    window.addEventListener("favorites-updated", handler);
    return () => window.removeEventListener("favorites-updated", handler);
  }, []);

  React.useEffect(() => {
    async function fetchNotebooks() {
      const notebooks = await getNotebooks();
      setData({
        versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
        navMain: [
          ...(notebooks.notebooks?.map((notebook) => ({
            title: notebook.name,
            url: `/dashboard/${notebook.id}`,
            emoji: notebook.emoji ?? null,
            items: notebook.notes.map((note) => ({
              id: note.id,
              title: note.title,
              url: `/dashboard/notebook/${notebook.id}/note/${note.id}`,
              emoji: note.emoji ?? null,
            })),
          })) ?? []),
        ],
      });
    }
    fetchNotebooks();
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 pl-2">
          <Image src="/Suryastra-Logo-Design.png" alt="Logo" width={32} height={32} />
          <h2>LightNote</h2>
        </Link>

        <React.Suspense>
          <SearchForm />
        </React.Suspense>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* Favorites Tab */}
        <NavFavorites favorites={favorites} />
        {data && <SidebarData data={data} />}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}