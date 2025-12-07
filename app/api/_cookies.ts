import { cookies } from "next/headers";

const COOKIE_NAME = 'codebits_owner_tokens';

export async function getOwnerTokens(): Promise<string[]> {
    const store = await cookies();
    const raw = store.get(COOKIE_NAME)?.value;

    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export async function addOwnerToken(token: string) {
    const store = await cookies();
    const tokens = await getOwnerTokens();

    if (!tokens.includes(token)) tokens.push(token);

    store.set(
        COOKIE_NAME,
        JSON.stringify(tokens),
        {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1yr
        }
    );
}

export async function isOwner(ownerToken: string): Promise<boolean> {
    const tokens = await getOwnerTokens();
    return tokens.includes(ownerToken);
}