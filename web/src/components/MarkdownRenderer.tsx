import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type MarkdownRendererType = {
  children: string;
};

const MarkdownRenderer = ({ children }: MarkdownRendererType) => {
  return (
    <article className="markdown codeblock">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {children}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
