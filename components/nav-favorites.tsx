"use client"

import {
  ArrowUpRight,
  Link as LinkIcon,
  MoreHorizontal,
  StarOff,
  Trash2,
} from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"


interface NavFavoritesProps {
  favorites: {
    name: string;
    url: string;
    emoji?: string;
    noteId: string;
  }[];
  loading?: boolean;
}

export function NavFavorites({ favorites, loading = false }: NavFavoritesProps) {
  const { isMobile } = useSidebar();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {loading ? (
          <>
            <SidebarMenuItem><Skeleton className="h-8 w-2/3" /></SidebarMenuItem>
            <SidebarMenuItem><Skeleton className="h-8 w-1/2" /></SidebarMenuItem>
            <SidebarMenuItem><Skeleton className="h-8 w-1/4" /></SidebarMenuItem>
          </>
        ) : (
          favorites.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <a href={item.url} title={item.name}>
                  <span>{item.emoji ?? "⭐"}</span>
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        if (!item.noteId) return;
                        await fetch("/api/favorites", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ noteId: item.noteId }),
                        });
                        if (window && window.dispatchEvent) {
                          window.dispatchEvent(new Event("favorites-updated"));
                        }
                        if (typeof window !== "undefined") {
                          import("sonner").then(({ toast }) => {
                            toast.success(`${item.emoji ?? ""} ${item.name} removed from Favorites!`);
                          });
                        }
                      } catch {}
                    }}
                  >
                    <StarOff className="text-muted-foreground" />
                    <span>Remove from Favorites</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LinkIcon className="text-muted-foreground" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowUpRight className="text-muted-foreground" />
                    <span>Open in New Tab</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )))}
        </SidebarMenu>
      </SidebarGroup>
  );
}
