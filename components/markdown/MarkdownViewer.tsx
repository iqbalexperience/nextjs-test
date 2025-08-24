// app/components/markdown/MarkdownViewer.tsx
"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { cn } from "@/lib/utils";
import MermaidBlock from "./MermaidBlock";
import MarkmapBlock from "./MarkmapBlock";
import ImageViewer from "./ImageViewer";
import type { Components } from "react-markdown";

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

export default function MarkdownViewer({ content, className }: MarkdownViewerProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className={cn("animate-pulse", className)}>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
        );
    }

    const components: Components = {
        // Handle code blocks with special rendering for mermaid and markmap
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const codeContent = String(children).replace(/\n$/, "");

            // Handle Mermaid diagrams
            if (language === "mermaid") {
                return <MermaidBlock code={codeContent} />;
            }

            // Handle Markmap diagrams
            if (language === "markmap") {
                return <MarkmapBlock code={codeContent} />;
            }

            // Inline code
            if (inline) {
                return (
                    <code
                        className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-mono text-gray-800 dark:text-gray-200"
                        {...props}
                    >
                        {children}
                    </code>
                );
            }

            // Regular code blocks
            return (
                <div className="relative group">
                    <pre className="overflow-x-auto p-4 rounded-lg bg-gray-900 dark:bg-gray-950">
                        <code
                            className={cn(
                                "text-sm font-mono text-gray-100",
                                className
                            )}
                            {...props}
                        >
                            {children}
                        </code>
                    </pre>
                    {language && (
                        <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">
                            {language}
                        </div>
                    )}
                </div>
            );
        },

        // Handle links - open external links in new tab
        a({ href, children, ...props }) {
            const isExternal = href?.startsWith("http") || href?.startsWith("https");

            return (
                <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    {...props}
                >
                    {children}
                    {isExternal && (
                        <span className="inline-block ml-1">
                            <svg
                                className="inline-block w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </span>
                    )}
                </a>
            );
        },

        // Handle images with rounded corners and fullscreen capability
        img({ src, alt, ...props }: any) {
            if (!src) return null;
            return <ImageViewer src={src} alt={alt || ""} {...props} />;
        },

        // Headings with better styling
        h1: ({ children, ...props }) => (
            <h1 className="text-4xl font-bold mb-6 mt-8 text-gray-900 dark:text-gray-100" {...props}>
                {children}
            </h1>
        ),
        h2: ({ children, ...props }) => (
            <h2 className="text-3xl font-semibold mb-4 mt-6 text-gray-900 dark:text-gray-100" {...props}>
                {children}
            </h2>
        ),
        h3: ({ children, ...props }) => (
            <h3 className="text-2xl font-semibold mb-3 mt-4 text-gray-900 dark:text-gray-100" {...props}>
                {children}
            </h3>
        ),
        h4: ({ children, ...props }) => (
            <h4 className="text-xl font-semibold mb-2 mt-3 text-gray-900 dark:text-gray-100" {...props}>
                {children}
            </h4>
        ),

        // Paragraphs
        p: ({ children, ...props }) => (
            <div className="mb-4 leading-7 text-gray-700 dark:text-gray-300" {...props}>
                {children}
            </div>
        ),

        // Lists
        ul: ({ children, ...props }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300" {...props}>
                {children}
            </ul>
        ),
        ol: ({ children, ...props }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300" {...props}>
                {children}
            </ol>
        ),

        // Blockquotes
        blockquote: ({ children, ...props }) => (
            <blockquote
                className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400"
                {...props}
            >
                {children}
            </blockquote>
        ),

        // Tables
        table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
                    {children}
                </table>
            </div>
        ),
        thead: ({ children, ...props }) => (
            <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
                {children}
            </thead>
        ),
        th: ({ children, ...props }) => (
            <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                {...props}
            >
                {children}
            </th>
        ),
        td: ({ children, ...props }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300" {...props}>
                {children}
            </td>
        ),

        // Horizontal rule
        hr: ({ ...props }) => (
            <hr className="my-8 border-gray-200 dark:border-gray-700" {...props} />
        ),
    };

    return (
        <div className={cn("prose prose-lg dark:prose-invert max-w-none", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap" }],
                ]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}