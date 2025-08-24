// app/components/markdown/MarkmapBlock.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Markmap } from "markmap-view";
import { Transformer } from "markmap-lib";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Copy, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface MarkmapBlockProps {
    code: string;
}

export default function MarkmapBlock({ code }: MarkmapBlockProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const fullscreenSvgRef = useRef<SVGSVGElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderMarkmap = (svg: SVGSVGElement | null) => {
            if (!svg) return;

            try {
                const transformer = new Transformer();
                const { root } = transformer.transform(code);

                svg.innerHTML = "";
                const markmap = Markmap.create(svg);
                markmap.setData(root);
                markmap.fit();
                setError(null);
            } catch (err) {
                console.error("Markmap rendering error:", err);
                setError("Failed to render Markmap");
            }
        };

        renderMarkmap(svgRef.current);
    }, [code]);

    useEffect(() => {
        if (isFullscreen && fullscreenSvgRef.current) {
            const transformer = new Transformer();
            const { root } = transformer.transform(code);

            fullscreenSvgRef.current.innerHTML = "";
            const markmap = Markmap.create(fullscreenSvgRef.current);
            markmap.setData(root);
            markmap.fit();
        }
    }, [isFullscreen, code]);

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
            <Card className="relative my-4 overflow-hidden group">
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
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
                <div className="w-full h-[400px] p-4">
                    <svg
                        ref={svgRef}
                        className="w-full h-full"
                        style={{ maxWidth: "100%", height: "100%" }}
                    />
                </div>
            </Card>

            <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                <DialogContent className="max-w-[90vw] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Markmap Visualization</DialogTitle>
                    </DialogHeader>
                    <div className="w-full h-[70vh]">
                        <svg
                            ref={fullscreenSvgRef}
                            className="w-full h-full"
                            style={{ maxWidth: "100%", height: "100%" }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}