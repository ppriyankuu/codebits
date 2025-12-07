import { CreateSnippetClient } from "@/components/snippets/createSnippetClient";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-semibold">CodeBits.</h1>
      <p className="text-sm text-neutral-400">
        Paste your code, get a shareable URL. No login required.
      </p>
      <CreateSnippetClient />
    </main>
  );
}
