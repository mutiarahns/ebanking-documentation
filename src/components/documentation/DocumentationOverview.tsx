import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./DocumentationOverview.css";
import DocumentationNavigation from "./DocumentationNavigation";

// Custom components for rendering markdown elements with IDs for navigation
const HeadingRenderer = ({
  level,
  children,
}: {
  level: number;
  children: React.ReactNode;
}) => {
  const text = children?.toString() || "";
  const id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return <HeadingTag id={id}>{children}</HeadingTag>;
};

const DocumentationOverview: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the README.md file
    fetch("/README.md")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch README.md");
        }
        return response.text();
      })
      .then((text) => {
        console.log(text);
        setMarkdown(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching README.md:", err);
        setError("Failed to load documentation. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="documentation-loading">Loading documentation...</div>
    );
  }

  if (error) {
    return <div className="documentation-error">{error}</div>;
  }

  // Define type for heading props
  interface HeadingProps {
    children: React.ReactNode;
    node?: unknown;
    className?: string;
    // Add other specific props as needed
    [key: string]: unknown; // For other props that might be passed
  }

  // Custom components for ReactMarkdown
  const components = {
    h1: (props: HeadingProps) => <HeadingRenderer level={1} {...props} />,
    h2: (props: HeadingProps) => <HeadingRenderer level={2} {...props} />,
    h3: (props: HeadingProps) => <HeadingRenderer level={3} {...props} />,
  };

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
