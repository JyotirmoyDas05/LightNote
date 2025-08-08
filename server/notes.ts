"use server";

import { db } from "@/db/drizzle";
import { InsertNote, notes } from "@/db/schema";
import { eq } from "drizzle-orm";

type WithImages = { images?: string[] }

// Helper to remove placeholder image upload nodes from Tiptap JSON content
function stripNodesOfType(content: TiptapNode | undefined, type: string): TiptapNode | undefined {
    if (!content) return content
    const clone: TiptapNode = { ...content }
    if (Array.isArray(clone.content)) {
        clone.content = clone.content
            .filter((child) => child.type !== type)
            .map((child) => stripNodesOfType(child, type)!)
    }
    return clone
}

// Remove empty paragraphs (those with no content) to avoid leftover blank space
function pruneEmptyParagraphs(content: TiptapNode | undefined): TiptapNode | undefined {
    if (!content) return content
    const clone: TiptapNode = { ...content }
    if (Array.isArray(clone.content)) {
        clone.content = clone.content
            .map((child) => pruneEmptyParagraphs(child)!)
            .filter((child) => {
                if (!child) return false
                if (child.type === 'paragraph') {
                    const childHasContent = Array.isArray(child.content) && child.content.length > 0
                    return childHasContent
                }
                return true
            })
    }
    return clone
}

export const createNote = async (values: InsertNote & WithImages) => {
    try {
        // Prefer provided images, else derive from content if available
        const imagesFromValues = Array.isArray(values.images) ? values.images : undefined
        const imagesFromContent =
            !imagesFromValues && values.content && typeof values.content === 'object'
                ? extractImageUrlsFromContent(values.content as TiptapNode)
                : undefined

        const sanitizedContent = values.content && typeof values.content === 'object'
            ? pruneEmptyParagraphs(stripNodesOfType(values.content as TiptapNode, 'imageUpload'))
            : values.content

        const payload: InsertNote & WithImages = {
            ...values,
            content: sanitizedContent ?? values.content,
            ...(imagesFromValues ? { images: imagesFromValues } : {}),
            ...(!imagesFromValues && imagesFromContent ? { images: imagesFromContent } : {}),
        }

        await db.insert(notes).values(payload);
        return { success: true, message: "Note created successfully" };
    } catch {
        return { success: false, message: "Failed to create note" };
    }
};

export const getNoteById = async (id: string) => {
    try {
        const note = await db.query.notes.findFirst({
            where: eq(notes.id, id),
            with: {
                notebook: true
            }
        });

        if (!note) return { success: true, note };
        const sanitized = note.content && typeof note.content === 'object'
            ? pruneEmptyParagraphs(stripNodesOfType(note.content as unknown as TiptapNode, 'imageUpload'))
            : note.content
        return { success: true, note: { ...note, content: sanitized } };
    } catch {
        return { success: false, message: "Failed to get notebook" };
    }
};

export const updateNote = async (id: string, values: Partial<InsertNote> & WithImages) => {
    try {
        // Prefer provided images, else derive from content if available; don't overwrite if neither supplied
        const imagesFromValues = Array.isArray(values.images) ? values.images : undefined
        const imagesFromContent =
            !imagesFromValues && values.content && typeof values.content === 'object'
                ? extractImageUrlsFromContent(values.content as TiptapNode)
                : undefined

        const sanitizedContent = values.content && typeof values.content === 'object'
            ? pruneEmptyParagraphs(stripNodesOfType(values.content as unknown as TiptapNode, 'imageUpload'))
            : values.content

        const updatePayload: Partial<InsertNote> & WithImages = {
            ...values,
            ...(sanitizedContent ? { content: sanitizedContent } : {}),
            ...(imagesFromValues ? { images: imagesFromValues } : {}),
            ...(!imagesFromValues && imagesFromContent ? { images: imagesFromContent } : {}),
        }

        await db.update(notes).set(updatePayload).where(eq(notes.id, id));
        return { success: true, message: "Notebook updated successfully" };
    } catch {
        return { success: false, message: "Failed to update notebook" };
    }
};

// One-time utility to sanitize all notes by removing leftover imageUpload placeholders and updating images
export const sanitizeAllNotes = async () => {
    try {
        const all = await db.query.notes.findMany()
        for (const n of all) {
            const cleanContent = n.content && typeof n.content === 'object'
                ? pruneEmptyParagraphs(stripNodesOfType(n.content as unknown as TiptapNode, 'imageUpload'))
                : n.content
            const images = cleanContent ? extractImageUrlsFromContent(cleanContent as TiptapNode) : []
        await db.update(notes).set({ content: cleanContent as unknown, images }).where(eq(notes.id, n.id))
        }
        return { success: true, message: `Sanitized ${all.length} notes` }
    } catch {
        return { success: false, message: 'Failed to sanitize notes' }
    }
}

// Types for Tiptap JSON content
type TiptapNode = {
  type?: string;
  attrs?: { [key: string]: unknown };
  content?: TiptapNode[];
};

// Helper to extract image URLs from Tiptap JSON content
function extractImageUrlsFromContent(content: TiptapNode): string[] {
    const urls: string[] = [];
    function traverse(node: TiptapNode | undefined): void {
        if (!node) return;
        if (node.type === 'image' && node.attrs && typeof node.attrs.src === 'string') {
            urls.push(node.attrs.src);
        }
        if (Array.isArray(node.content)) {
            node.content.forEach(traverse);
        }
    }
    traverse(content);
    return urls;
}

export const deleteNote = async (id: string) => {
    try {
        await db.delete(notes).where(eq(notes.id, id));
        return { success: true, message: "Notebook deleted successfully" };
    } catch {
        return { success: false, message: "Failed to delete notebook" };
    }
};