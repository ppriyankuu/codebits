import { getSnippetBySlug } from "@/lib/snippets";
import { getOwnerTokens } from "../api/_cookies";
import { SnippetViewClient } from "@/components/snippets/snippetViewClient";
import { CopyButton } from "@/components/ui/copyButton";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function SnippetPage({ params }: PageProps) {
    const { slug } = await params;

    const snippet = await getSnippetBySlug(slug);
    if (!snippet) return;

    const ownerTokens = await getOwnerTokens();
    const isOwner = ownerTokens.includes(snippet.owner_token);

    return (
        <main className="max-w-4xl mx-auto py-8 px-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-sm font-semibold">Snippet: {snippet.slug}</h1>
                    <CopyButton
                        text={`https://codebits-dempho.vercel.app/${snippet.slug}`}
                        url_or_code="URL"
                    />
                </div>

                <div className="text-neutral-500">
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



