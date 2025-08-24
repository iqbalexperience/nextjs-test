// app/components/markdown/MermaidBlock.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Copy, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface MermaidBlockProps {
    code: string;
}

export default function MermaidBlock({ code }: MermaidBlockProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!containerRef.current) return;

            try {
                mermaid.initialize({
                    startOnLoad: false,
                    theme: "default",
                    themeVariables: {
                        primaryColor: "#3b82f6",
                        primaryTextColor: "#fff",
                        primaryBorderColor: "#2563eb",
                        lineColor: "#6b7280",
                        secondaryColor: "#f3f4f6",
                        tertiaryColor: "#e5e7eb",
                    },
                });

                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg: renderedSvg } = await mermaid.render(id, code);
                setSvg(renderedSvg);
                setError(null);
            } catch (err) {
                console.error("Mermaid rendering error:", err);
                setError("Failed to render Mermaid diagram");
            }
        };

        renderDiagram();
    }, [code]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    if (error) {
        return (
            <Card className="p-4 my-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <pre className="mt-2 text-sm overflow-x-auto">{code}</pre>
            </Card>
        );
    }

    return (
        <>
            <Card className="relative my-4 p-4 overflow-hidden group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={handleCopy}
                        className="h-8 w-8"
                    >
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setIsFullscreen(true)}
                        className="h-8 w-8"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>
                <div
                    ref={containerRef}
                    className="flex justify-center items-center overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            </Card>

            <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Mermaid Diagram</DialogTitle>
                    </DialogHeader>
                    <div
                        className="flex justify-center items-center p-4"
                        dangerouslySetInnerHTML={{ __html: svg }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}