import formatSize from "../utils";
import MarkdownRenderer from "./MarkdownRenderer";

type MessageTypes = {
  role: string;
  content: string;
  attachments?: AttachmentType[];
  createdAt: number;
};

type AttachmentType = {
  name: string;
  type?: string;
  size: number;
};

export default function Message({
  role,
  content,
  attachments,
  createdAt,
}: MessageTypes) {
  return (
    <section className="message" role="listitem" aria-label={`${role} message`}>
      <div className="avatar" aria-hidden>
        {role === "user" ? "U" : "A"}
      </div>
      <div className={`bubble ${role}`}>
        <div className="meta">
          {role === "user" ? "You" : "Assistant"} •{" "}
          {new Date(createdAt).toLocaleTimeString()}
        </div>
        {role === "user" ? (
          <article className="user-article">{content || ""}</article>
        ) : (
          <MarkdownRenderer>{content || ""}</MarkdownRenderer>
        )}
        {attachments?.length ? (
          <div className="attachments" aria-label="attachments">
            {attachments.map((a, i) => (
              <span
                key={i}
                className="chip"
                title={`${a.name} (${a.type || "file"})`}
              >
                {a.name} <span aria-hidden>·</span> {formatSize(a.size)}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
