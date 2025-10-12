import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import "./DocumentationOverview.css";
import DocumentationNavigation from "./DocumentationNavigation";

// const HeadingRenderer = ({
//   level,
//   children,
// }: {
//   level: number;
//   children: React.ReactNode;
// }) => {
//   const text = Array.isArray(children)
//     ? children.join("")
//     : children?.toString() ?? "";

//   const id = text
//     .toLowerCase()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-");

//   const Tag = `h${level}` as React.ElementType;
//   return <Tag id={id}>{children}</Tag>;
// };

interface HeadingRendererProps {
  level: number;
  children?: React.ReactNode;
}

const HeadingRenderer: React.FC<HeadingRendererProps> = ({
  level,
  children,
}) => {
  const text = children?.toString() || "";
  const id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const Tag = `h${level}` as React.ElementType;
  return <Tag id={id}>{children}</Tag>;
};

const DocumentationOverview: React.FC = () => {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ fetch README.md from /public
    fetch(`/README.md?cacheBust=${Date.now()}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch README.md");
        return response.text();
      })
      .then((text) => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching README.md:", err);
        setError("Failed to load documentation.");
        setLoading(false);
      });
  }, []);

  const components: Components = {
    h1: ({ node, ...props }) => <HeadingRenderer level={1} {...props} />,
    h2: ({ node, ...props }) => <HeadingRenderer level={2} {...props} />,
    h3: ({ node, ...props }) => <HeadingRenderer level={3} {...props} />,
  };

  if (loading) return <div className="documentation-loading">Loading...</div>;
  if (error) return <div className="documentation-error">{error}</div>;

  return (
    <div className="documentation-layout">
      <DocumentationNavigation markdown={markdown} />
      <div className="documentation-container">
        <div className="documentation-content">
          <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default DocumentationOverview;
