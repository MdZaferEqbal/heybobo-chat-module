import { createServer } from "http";
import { WebSocketServer } from "ws";

const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

const uid = () => Math.random().toString(36).slice(2, 10);

function formatSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

wss.on("connection", (ws) => {
  ws.on("message", async (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (data.type === "user_message") {
      const messageId = uid();

      const attachText = data.attachments?.length
        ? `\n\nAttached files:\n${data.attachments
            .map(
              (a) =>
                `• ${a.name} (${a.type || "unknown"}, ${formatSize(a.size)})`
            )
            .join("\n")}`
        : "";

      let reply = "";

      if (data.text && !attachText) {
        reply = `**Thanks!** I received your message:\n\n>${data.text}`;
      } else if (!data.text && attachText) {
        let fileCountText = "";
        if (data.attachments.length > 0 && data.attachments.length == 1)
          fileCountText = "file";
        else fileCountText = "files";

        reply = `**Thanks!** I received your ${fileCountText}:\n${attachText}`;
      } else {
        let fileCountText = "";
        if (data.attachments.length > 0 && data.attachments.length == 1)
          fileCountText = "file";
        else fileCountText = "files";

        reply = `**Thanks!** I received your message and ${fileCountText}:\n\n>${data.text}\n${attachText}`;
      }

      const tokens = reply.split(/(\s+)/);
      let i = 0;
      const interval = setInterval(() => {
        if (i >= tokens.length) {
          ws.send(JSON.stringify({ type: "message_end", id: messageId }));
          clearInterval(interval);
          return;
        }
        ws.send(
          JSON.stringify({
            type: "message_chunk",
            id: messageId,
            chunk: tokens[i],
          })
        );
        i++;
      }, 30);
    }
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`WS server listening on ws://localhost:${PORT}`);
});
