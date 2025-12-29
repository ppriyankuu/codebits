'use client';
import { useState } from "react";

interface CopyButtonProps {
    url_or_code: 'URL' | 'snippet';
    text: string;
}

export function CopyButton({ url_or_code, text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { }
    };

    const base =
        "rounded-md lg:text-sm transition whitespace-nowrap";

    const variant =
        url_or_code === 'snippet'
            ? "w-full sm:w-auto px-4 py-2 sm:py-1 text-sm bg-neutral-800 hover:bg-neutral-700"
            : "px-3 py-1 border hover:bg-neutral-800 text-xs";

    return (
        <button
            onClick={handleCopy}
            className={`${base} ${variant}`}
        >
            {copied ? 'Copied!' : `Copy ${url_or_code}`}
        </button>
    );
}

