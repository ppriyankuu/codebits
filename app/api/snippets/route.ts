import { createSnippet } from "@/lib/snippets";
import { NextRequest, NextResponse } from "next/server";
import { addOwnerToken } from "../_cookies";

export async function POST(req: NextRequest) {
    try {
        const { code, expiry, is_readonly } = await req.json();

        if (typeof code !== 'string' || !code.trim()) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const validExpiries = ['1d', '7d', 'never'];
        const chosenExpiry = validExpiries.includes(expiry) ? expiry : 'never';

        const snippet = await createSnippet(
            code,
            chosenExpiry as any,
            !!is_readonly,
        );

        await addOwnerToken(snippet.owner_token);

        return NextResponse.json(
            { slug: snippet.slug },
            { status: 201 }
        );
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: 'Failed to create snippet' },
            { status: 500 }
        );
    }
}