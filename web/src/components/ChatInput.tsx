import gsap from "gsap";
import { useRef, useState, type ChangeEvent } from "react";

type ChatInputType = {
  onSend: (param: OnSendParam) => void;
};

type OnSendParam = {
  text: string;
  attachments: AttachmentType[];
  rawFiles: File[];
};

type AttachmentType = {
  name: string;
  type?: string;
  size: number;
};

const ChatInput = ({ onSend }: ChatInputType) => {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...list]);
    e.target.value = "";
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function submit() {
    const text = value.trim();
    if (!text && files.length === 0) {
      gsap.to(textareaRef.current, {
        backgroundColor: "rgba(229, 31, 31, 0.25)",
        scale: 1.05,
        repeat: 1,
        yoyo: true,
        onStart: () => {
          if (textareaRef.current) {
            textareaRef.current.placeholder =
              "Enter text, add files, or both to send message.";
          }
        },
        onComplete: () => {
          if (textareaRef.current) {
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.placeholder = "Message...";
              }
            }, 3000);
          }
        },
        ease: "power1.inOut",
      });

      gsap.to(".iconbtn", {
        backgroundColor: "rgba(229, 31, 31, 0.25)",
        scale: 1.25,
        x: 20,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut",
      });

      return;
    }
    const attachments = files.map((f) => ({
      name: f.name,
      type: f.type,
      size: f.size,
    }));
    onSend({ text, attachments, rawFiles: files });
    setValue("");
    setFiles([]);
  }

  return (
    <div className="inputwrap">
      <div>
        <textarea
          ref={textareaRef}
          value={value}
          name="user_input"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setValue(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Message…"
          aria-label="Chat input"
        />
        {files.length > 0 && (
          <div className="attachments" style={{ marginTop: 8 }}>
            {files.map((f, i) => (
              <span key={i} className="chip">
                {f.name}
                <button
                  aria-label={`remove ${f.name}`}
                  onClick={() => removeFile(i)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="controls">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={onFileChange}
          aria-hidden
        />
        <button
          className="iconbtn"
          title="Attach Files"
          aria-label="Attach files"
          onClick={() => fileInputRef.current?.click()}
        >
          📎
        </button>
        <button className="primary" onClick={submit} aria-label="Send message">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
