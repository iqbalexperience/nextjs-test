// app/components/markdown/ImageViewer.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageViewerProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ImageViewer({ src, alt, className }: ImageViewerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Check if it's an external image
    const isExternal = src.startsWith("http") || src.startsWith("https");

    const handleImageError = () => {
        setImageError(true);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    if (imageError) {
        return (
            <div className="flex items-center justify-center w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Failed to load image</p>
            </div>
        );
    }

    return (
        <>
            <div className="relative group my-4 inline-block w-full">
                <div className="relative overflow-hidden rounded-lg">
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" ></div>
                    )}

                    {isExternal ? (
                        // For external images, use regular img tag
                        <img
                            src={src}
                            alt={alt}
                            onClick={() => setIsFullscreen(true)}
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                            className={cn(
                                "w-full h-auto rounded-lg cursor-pointer transition-transform duration-200 hover:scale-[1.02]",
                                !imageLoaded && "opacity-0",
                                className
                            )}
                        />
                    ) : (
                        // For local images, use Next.js Image component
                        <div className="relative w-full" style={{ minHeight: "200px" }}>
                            <Image
                                src={src}
                                alt={alt}
                                width={800}
                                height={600}
                                onClick={() => setIsFullscreen(true)}
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                                className={cn(
                                    "w-full h-auto rounded-lg cursor-pointer transition-transform duration-200 hover:scale-[1.02] object-cover",
                                    !imageLoaded && "opacity-0",
                                    className
                                )}
                                priority={false}
                            />
                        </div>
                    )}

                    {/* Hover overlay with expand icon */}
                    <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg pointer-events-none">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg pointer-events-auto">
                                <Expand className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image caption */}
                {alt && (
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2 italic">
                        {alt}
                    </p>
                )}
            </div>

            {/* Fullscreen Dialog */}
            <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
                    <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
                        <DialogTitle className="text-white">{alt || "Image"}</DialogTitle>
                        <Button
                            onClick={() => setIsFullscreen(false)}
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-white hover:bg-white/20"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </DialogHeader>

                    <div className="flex items-center justify-center w-full h-full bg-black/90 p-4">
                        {isExternal ? (
                            <img
                                src={src}
                                alt={alt}
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={src}
                                    alt={alt}
                                    width={1920}
                                    height={1080}
                                    className="max-w-full max-h-full object-contain"
                                    priority
                                />
                            </div>
                        )}
                    </div>

                    {alt && (
                        <DialogDescription className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white text-center">
                            {alt}
                        </DialogDescription>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}