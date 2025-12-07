'use client'
import { ExpiryOption } from "@/lib/snippets";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CodeEditor } from "../editor/codeEditor";

export function CreateSnippetClient() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [expiry, setExpiry] = useState<ExpiryOption>('7d');
    const [startReadonly, setStartReadonly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('/api/snippets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, expiry, is_readonly: startReadonly }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to create snippet');
            } else {
                router.push(`/${data.slug}`);
            }
        } catch (error) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <CodeEditor
                value={code}
                onChange={setCode}
                placeholder="// Paste your code here..."
            />

            <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-2 items-center">
                        <span className="text-neutral-400">Expires:</span>
                        <select
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value as ExpiryOption)}
                            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs"
                        >
                            <option value="1d">1 day</option>
                            <option value="7d">7 days</option>
                            <option value="never">Never</option>
                        </select>
                    </div>

                    <label className="flex items-center gap-1 cursor-pointer bg-neutral-800 rounded-lg px-2 py-1">
                        <input
                            type="checkbox"
                            checked={startReadonly}
                            onChange={(e) => setStartReadonly(e.target.checked)}
                        />
                        <span className="select-none text-neutral-400">
                            Start read-only (only you can change)
                        </span>
                    </label>
                </div>

                <button
                    onClick={handleCreate}
                    disabled={loading || !code.trim()}
                    className="px-4 py-1 text-xs rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create snippet'}
                </button>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    )
}