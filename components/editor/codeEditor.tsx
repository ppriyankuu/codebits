'use client'
import { TextareaHTMLAttributes } from 'react';

interface CodeEditorProps
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string;
    onChange?: (value: string) => void;
    readonly?: boolean;
};

export function CodeEditor({ value, onChange, readOnly, ...rest }: CodeEditorProps) {
    return (
        <textarea
            {...rest}
            value={value}
            readOnly={readOnly}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full h-full min-h-[300px] font-mono text-sm bg-neutral-900 text-neutral-100 p-3 rounded-md outline-none resize-y ${readOnly ? 'cursor-not-allowed opacity-75' : 'cursor-text'
                }`}
            spellCheck={false}
        />
    )
}