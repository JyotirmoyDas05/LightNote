"use client";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuSub,
} from "./ui/sidebar";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { ChevronRight, File, Heart, MoreHorizontal, Link as LinkIcon, ArrowUpRight, Trash2 } from "lucide-react";
import { useQueryState } from "nuqs";

interface SidebarDataProps {
  data: {
    navMain: {
      title: string;
      url: string;
      emoji?: string | null;
      items: { id: string; title: string; url: string; emoji?: string | null }[];
    }[];
  };
}

export function SidebarData({ data }: SidebarDataProps) {
  const [search] = useQueryState("search", { defaultValue: "" });

  const filteredData = data.navMain.filter((item) => {
    const notebookMatches = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const noteMatches = item.items.some((note) =>
      note.title.toLowerCase().includes(search.toLowerCase())
    );

    return notebookMatches || noteMatches;
  });

  // Toast notification
  // Import at top: import { toast } from "sonner";
  // Import at top: import { Heart, HeartIcon, ... } from "lucide-react";
  const [favoritedNoteId, setFavoritedNoteId] = React.useState<string | null>(null);
  // Alert Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Delete handler
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      // Call API to delete note from both notebook and favorites
      await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id, wipeAll: true }),
      });
      if (typeof window !== "undefined") {
        import("sonner").then(({ toast }) => {
          toast.success(`${deleteTarget.title} deleted from all sections.`);
        });
      }
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
      if (window && window.dispatchEvent) {
        window.dispatchEvent(new Event("notebooks-updated", { bubbles: true }));
        window.dispatchEvent(new Event("favorites-updated", { bubbles: true }));
        // Also force a location reload for notebook section if needed
        if (window.location.pathname.includes("dashboard/notebook")) {
          window.location.reload();
        }
      }
    } catch {
      if (typeof window !== "undefined") {
        import("sonner").then(({ toast }) => {
          toast.error(`Failed to delete ${deleteTarget.title}.`);
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Import AlertDialog components
  // import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
  // import { Loader2 } from "lucide-react";
  return (
    <>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete <span className="font-bold">{deleteTarget?.title}</span> and all its notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsDeleteDialogOpen(false); setDeleteTarget(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Favorites Section */}
      {filteredData.filter((item) => item.title.toLowerCase() === "favorites").map((item) => (
        <Collapsible
          key={item.title}
          title={item.title}
          defaultOpen
          className="group/collapsible"
        >
          {/* ...existing code for favorites rendering... */}
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
            >
              <CollapsibleTrigger>
                {item.emoji ? (
                  <span className="text-lg mr-1">{item.emoji}</span>
                ) : null}
                {item.title}{" "}
                {item.items.length > 0 && (
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuSub>
                    {item.items.map((note) => (
                      <SidebarMenuItem key={note.id} className="flex items-center group">
                        {/* ...existing code for note rendering... */}
                        <SidebarMenuButton asChild>
                          <a href={note.url} className="flex items-center gap-2 flex-1">
                            {note.emoji ? (
                              <span className="text-lg mr-1">{note.emoji}</span>
                            ) : (
                              <File />
                            )}
                            {note.title}
                          </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                              {favoritedNoteId === note.id ? (
                                <Heart fill="currentColor" className="text-pink-500 mr-2" />
                              ) : (
                                <MoreHorizontal className="text-muted-foreground" />
                              )}
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 rounded-lg" side="right" align="start">
                            {/* ...existing code for dropdown menu... */}
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  if (!note.id) return;
                                  setFavoritedNoteId(note.id);
                                  await fetch("/api/favorites", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ noteId: note.id }),
                                  });
                                  if (window && window.dispatchEvent) {
                                    window.dispatchEvent(new Event("favorites-updated"));
                                  }
                                  // Show toast notification
                                  if (typeof window !== "undefined") {
                                    import("sonner").then(({ toast }) => {
                                      toast.success(`${note.emoji ?? ""} ${note.title} is added to Favorites!`);
                                    });
                                  }
                                  // Reset icon after short delay
                                  setTimeout(() => setFavoritedNoteId(null), 1200);
                                } catch {}
                              }}
                            >
                              {favoritedNoteId === note.id ? (
                                <Heart fill="currentColor" className="text-pink-500 mr-2" />
                              ) : (
                                <Heart className="text-muted-foreground mr-2" />
                              )}
                              <span>Add as Favorite</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <LinkIcon className="text-muted-foreground mr-2" />
                              <span>Copy Link</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowUpRight className="text-muted-foreground mr-2" />
                              <span>Open in New Tab</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                setDeleteTarget({ id: note.id, title: note.title });
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="text-muted-foreground mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
      {/* Separator between Favorites and Notebooks */}
      <div className="my-2">
        <Separator />
      </div>
      {/* Normal Notebooks Section */}
      {filteredData.filter((item) => item.title.toLowerCase() !== "favorites").map((item) => (
        <Collapsible
          key={item.title}
          title={item.title}
          defaultOpen
          className="group/collapsible"
        >
          {/* ...existing code for notebook rendering... */}
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
            >
              <CollapsibleTrigger>
                {item.emoji ? (
                  <span className="text-lg mr-1">{item.emoji}</span>
                ) : null}
                {item.title}{" "}
                {item.items.length > 0 && (
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuSub>
                    {item.items.map((note) => (
                      <SidebarMenuItem key={note.id} className="flex items-center group">
                        {/* ...existing code for note rendering... */}
                        <SidebarMenuButton asChild>
                          <a href={note.url} className="flex items-center gap-2 flex-1">
                            {note.emoji ? (
                              <span className="text-lg mr-1">{note.emoji}</span>
                            ) : (
                              <File />
                            )}
                            {note.title}
                          </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                              {favoritedNoteId === note.id ? (
                                <Heart fill="currentColor" className="text-pink-500 mr-2" />
                              ) : (
                                <MoreHorizontal className="text-muted-foreground" />
                              )}
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 rounded-lg" side="right" align="start">
                            {/* ...existing code for dropdown menu... */}
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  if (!note.id) return;
                                  setFavoritedNoteId(note.id);
                                  await fetch("/api/favorites", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ noteId: note.id }),
                                  });
                                  if (window && window.dispatchEvent) {
                                    window.dispatchEvent(new Event("favorites-updated"));
                                  }
                                  // Show toast notification
                                  if (typeof window !== "undefined") {
                                    import("sonner").then(({ toast }) => {
                                      toast.success(`${note.emoji ?? ""} ${note.title} is added to Favorites!`);
                                    });
                                  }
                                  // Reset icon after short delay
                                  setTimeout(() => setFavoritedNoteId(null), 1200);
                                } catch {}
                              }}
                            >
                              {favoritedNoteId === note.id ? (
                                <Heart fill="currentColor" className="text-pink-500 mr-2" />
                              ) : (
                                <Heart className="text-muted-foreground mr-2" />
                              )}
                              <span>Add as Favorite</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <LinkIcon className="text-muted-foreground mr-2" />
                              <span>Copy Link</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowUpRight className="text-muted-foreground mr-2" />
                              <span>Open in New Tab</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                setDeleteTarget({ id: note.id, title: note.title });
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="text-muted-foreground mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </>
  );
}