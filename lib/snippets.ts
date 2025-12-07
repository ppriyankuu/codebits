import { generateSlug } from "./slug";
import { supabaseServer } from "./supabaseServer";

export type ExpiryOption = '1d' | '7d' | 'never';

export interface Snippet {
    id: string;
    slug: string;
    code: string;
    is_readonly: boolean;
    expires_at: string | null;
    owner_token: string;
    created_at: string;
    updated_at: string;
}

const DB_NAME = 'snippets'

function computeExpiresAt(option: ExpiryOption): string | null {
    if (option === 'never') return null;
    const now = new Date();
    if (option === '1d') now.setDate(now.getDate() + 1);
    if (option === '7d') now.setDate(now.getDate() + 7);
    return now.toISOString();
}

export async function createSnippet(
    code: string,
    expiry: ExpiryOption,
    isReadonly = false
): Promise<Snippet> {
    const supabase = supabaseServer();

    const slug = generateSlug();
    const ownerToken = crypto.randomUUID();
    const expires_at = computeExpiresAt(expiry);

    const { data, error } = await supabase
        .from(DB_NAME)
        .insert({
            slug,
            code,
            owner_token: ownerToken,
            expires_at,
            is_readonly: isReadonly,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Snippet;
}

export async function getSnippetBySlug(slug: string): Promise<Snippet | null> {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from(DB_NAME)
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return null;
    }

    return data as Snippet;
}

export async function updateSnippetCode(
    slug: string,
    code: string,
    ownerTokens: string[]
): Promise<Snippet> {
    const supabase = supabaseServer();

    const { data: snippet, error: fetchError } = await supabase
        .from('snippets')
        .select('*')
        .eq('slug', slug)
        .single();

    if (fetchError) throw fetchError;
    if (!snippet) throw new Error('Snippet not found');

    const isOwner = ownerTokens.includes(snippet.owner_token);

    if (!isOwner && snippet.is_readonly) {
        throw new Error('Not allowed to edit this snippet');
    }

    const { data, error } = await supabase
        .from('snippets')
        .update({ code, updated_at: new Date().toISOString() })
        .eq('slug', slug)
        .select()
        .single();

    if (error) throw error;
    return data as Snippet;
}

export async function setSnippetReadonly(
    slug: string,
    isReadonly: boolean,
    ownerTokens: string[]
): Promise<Snippet> {
    const supabase = supabaseServer();

    const { data: snippet, error: fetchError } = await supabase
        .from('snippets')
        .select('*')
        .eq('slug', slug)
        .single();

    if (fetchError) throw fetchError;
    if (!snippet) throw new Error('Snippet not found');

    const isOwner = ownerTokens.includes(snippet.owner_token);
    if (!isOwner) {
        throw new Error('Only owner can change readonly flag');
    }

    const { data, error } = await supabase
        .from('snippets')
        .update({ is_readonly: isReadonly, updated_at: new Date().toISOString() })
        .eq('slug', slug)
        .select()
        .single();

    if (error) throw error;
    return data as Snippet;
}