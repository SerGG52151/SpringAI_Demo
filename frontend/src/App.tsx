import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type Role = 'user' | 'assistant';

type ChatMessage = {
  role: Role;
  content: string;
};

type ChatApiResponse = {
  reply: string;
};

const starterMessage: ChatMessage = {
  role: 'assistant',
  content: 'Ask me anything. I will route the conversation through Spring AI and Ollama.',
};

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const apiBaseUrl = useMemo(() => (import.meta.env.VITE_API_BASE_URL ?? '').trim(), []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();
    if (!text || isSending) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setDraft('');
    setIsSending(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as ChatApiResponse;
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: `I could not reach the backend. ${errorMessage}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="eyebrow">Spring AI + Ollama</div>
        <h1>Chat with a local model from a modern TypeScript client.</h1>
        <p>
          This demo keeps the frontend lightweight and the backend focused on prompt orchestration through Spring AI.
        </p>
        <div className="status-row">
          <span className="status-pill">Backend: http://localhost:8080</span>
          <span className="status-pill">Model: Ollama</span>
          <span className="status-pill">UI: TypeScript + React</span>
        </div>
      </section>

      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <h2>Conversation</h2>
            <p>Messages are forwarded to the backend as full chat history.</p>
          </div>
          <div className={`connection-badge ${isSending ? 'sending' : 'ready'}`}>
            {isSending ? 'Thinking' : 'Ready'}
          </div>
        </header>

        <div className="message-list" aria-live="polite">
          {messages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={`message-bubble ${message.role}`}>
              <div className="message-label">{message.role === 'user' ? 'You' : 'Assistant'}</div>
              <div className="message-content">{message.content}</div>
            </article>
          ))}
          {isSending ? (
            <article className="message-bubble assistant pending">
              <div className="message-label">Assistant</div>
              <div className="message-content">Generating a reply…</div>
            </article>
          ) : null}
          <div ref={endRef} />
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask for a recipe, a code explanation, a summary, or anything else..."
            rows={4}
            disabled={isSending}
          />
          <div className="composer-actions">
            <span className="hint">Shift+Enter for a new line. Enter sends.</span>
            <button type="submit" disabled={isSending || !draft.trim()}>
              {isSending ? 'Sending...' : 'Send message'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default App;
