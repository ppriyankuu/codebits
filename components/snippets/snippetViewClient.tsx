'use client'
import { useState, useTransition } from "react";
import { CopyButton } from "../ui/copyButton";
import { CodeEditor } from "../editor/codeEditor";

interface SnippetViewClientProps {
    slug: string;
    initialCode: string;
    isReadonly: boolean;
    isOwner: boolean;
}

export function SnippetViewClient({
    slug,
    initialCode,
    isReadonly: initialReadonly,
    isOwner,
}: SnippetViewClientProps) {
    const [code, setCode] = useState(initialCode);
    const [isReadonly, setIsReadonly] = useState(initialReadonly);
    const [saving, startSaving] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    const canEdit = !isReadonly || isOwner;

    const saveCode = () => {
        setMessage(null);
        startSaving(async () => {
            try {
                const res = await fetch(`/api/snippets/${slug}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to save');
                setMessage('Saved');
            } catch (error: any) {
                setMessage(error.message || 'Save failed');
            }
        });
    };

    const toggleReadOnly = () => {
        if (!isOwner) return;
        setMessage(null);
        startSaving(async () => {
            try {
                const res = await fetch(`/api/snippets/${slug}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_readonly: !isReadonly }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to update');
                setIsReadonly(data.snippet.is_readonly);
                setMessage('Updated readonly');
                setTimeout(() => setMessage(null), 1500);
            } catch (e: any) {
                setMessage(e.message || 'Failed to update readonly');
            }
        });
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
                <div className="flex gap-2 items-center">
                    <CopyButton text={code} />
                    {saving && <span className="text-neutral-500">Saving...</span>}
                    {message && <span className="text-neutral-400">{message}</span>}
                </div>

                <div className="flex gap-2 items-center">
                    <span className="text-neutral-500">
                        Mode: {isReadonly ? 'Read-only' : 'Editable'}
                    </span>
                    {isOwner && (
                        <button
                            onClick={toggleReadOnly}
                            className="px-2 py-1 border rounded hover:bg-neutral-800"
                        >
                            {isReadonly ? 'Allow edits' : 'Set read-only'}
                        </button>
                    )}
                </div>
            </div>

            <CodeEditor
                value={code}
                onChange={canEdit ? setCode : undefined}
                readOnly={!canEdit}
            />

            {canEdit && (
                <div className="flex justify-end">
                    <button
                        onClick={saveCode}
                        disabled={saving}
                        className="px-4 py-1 text-xs rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
                    >
                        Save changes
                    </button>
                </div>
            )}
        </div>
    )
}