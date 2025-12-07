import { getSnippetBySlug, setSnippetReadonly, updateSnippetCode } from "@/lib/snippets";
import { NextRequest, NextResponse } from "next/server";
import { getOwnerTokens } from "../../_cookies";

export async function Get(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const snippet = await getSnippetBySlug(slug);
        if (!snippet) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const ownerTokens = await getOwnerTokens();
        const isOwner = ownerTokens.includes(snippet.owner_token);

        return NextResponse.json({
            snippet: {
                slug: snippet.slug,
                code: snippet.code,
                is_readonly: snippet.is_readonly,
                expires_at: snippet.expires_at,
                created_at: snippet.created_at,
                updated_at: snippet.updated_at,
            },
            isOwner,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error fetching snippet' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await req.json();
        const ownerTokens = await getOwnerTokens();
        const requesterToken = ownerTokens[0] ?? null;

        if ('code' in body) {
            const snippet = await updateSnippetCode(slug, body.code, ownerTokens);
            return NextResponse.json({ ok: true, snippet });
        }

        if ('is_readonly' in body) {
            const snippet = await setSnippetReadonly(
                slug,
                !!body.is_readonly,
                ownerTokens
            );
            return NextResponse.json({ ok: true, snippet });
        }

        return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message ?? 'Update failed' }, { status: 400 });
    }
}