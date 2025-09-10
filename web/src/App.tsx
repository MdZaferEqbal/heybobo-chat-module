import { useEffect, useRef, useState } from "react";
import "./App.css";
import { ChatInput, Message } from "./components";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";

type MessageType = {
  role: string;
  content: string;
  createdAt: number;
  streamId?: string;
  attachments?: AttachmentType[];
};

type AttachmentType = {
  name: string;
  type?: string;
  size: number;
};

type SendParams = {
  text: string;
  attachments?: AttachmentType[];
};

function App() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [socketReady, setSocketReady] = useState(false);
  const chatRef = useRef<HTMLElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => setSocketReady(true);
    ws.onclose = () => setSocketReady(false);
    ws.onerror = () => setSocketReady(false);

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === "message_chunk") {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (!last || last.role !== "assistant" || last.streamId !== data.id) {
            return [
              ...prev,
              {
                role: "assistant",
                content: data.chunk,
                createdAt: Date.now(),
                streamId: data.id,
              },
            ];
          }
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...last,
            content: last.content + data.chunk,
          };
          return updated;
        });
      }
      if (data.type === "message_end") {
        setMessages((prev) =>
          prev.map((m) =>
            m.streamId === data.id ? { ...m, streamId: undefined } : m
          )
        );
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  function handleSend({ text, attachments }: SendParams) {
    const userMsg = {
      role: "user",
      content: text,
      attachments,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    wsRef.current?.send(
      JSON.stringify({ type: "user_message", text, attachments })
    );
  }

  useGSAP(() => {
    gsap.to(spanRef.current, {
      color: "tomato",
      scale: 1.15,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Heybobo - Chat Module</h1>
      </header>

      <main
        className="chat"
        ref={chatRef}
        role="list"
        aria-label="chat history"
      >
        {messages.map((m, index) => (
          <Message
            key={index}
            role={m.role}
            content={m.content}
            attachments={m.attachments}
            createdAt={m.createdAt}
          />
        ))}
      </main>

      <footer className="inputbar">
        <ChatInput onSend={handleSend} socketReady={socketReady} />
        <div className="input-controls">
          <span>
            Press <kbd>Enter</kbd> to send • <kbd>Shift+Enter</kbd> for newline
          </span>
          {socketReady ? (
            <p style={{ display: "inline", margin: 0, padding: 0 }}>
              Connected
            </p>
          ) : (
            <span ref={spanRef}>Connecting...</span>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
