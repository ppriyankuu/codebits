'use client'
import { useState } from "react";

interface CopyButtonProps {
    text: string;
};

export function CopyButton({ text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs border rounded-md hover:bg-neutral-800"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
}
