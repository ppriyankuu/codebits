import { getSnippetBySlug } from "@/lib/snippets";
import { get } from "http";
import { notFound } from "next/navigation";
import { getOwnerTokens } from "../api/_cookies";
import { SnippetViewClient } from "@/components/snippets/snippetViewClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function SnippetPage({ params }: PageProps) {
    const { slug } = await params;

    const snippet = await getSnippetBySlug(slug);
    if (!snippet) return notFound();

    const ownerTokens = await getOwnerTokens();
    const isOwner = ownerTokens.includes(snippet.owner_token);

    return (
        <main className="max-w-4xl mx-auto py-8 px-4 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Snippet: {snippet.slug}</h1>
                <div className="text-xs text-neutral-500">
                    {snippet.expires_at
                        ? `Expires: ${new Date(snippet.expires_at).toLocaleString()}`
                        : 'Expires: never'}
                </div>
            </div>

            <SnippetViewClient
                slug={snippet.slug}
                initialCode={snippet.code}
                isReadonly={snippet.is_readonly}
                isOwner={isOwner}
            />
        </main>
    )
}



