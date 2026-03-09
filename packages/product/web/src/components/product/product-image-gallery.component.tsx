"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface ProductImageGalleryProps {
    images: string[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const imageButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    const handleImageNavigation = (direction: "left" | "right") => {
        const newIndex =
            direction === "left"
                ? Math.max(selectedIndex - 1, 0)
                : Math.min(selectedIndex + 1, images.length - 1);
        setSelectedIndex(newIndex);
    };

    useEffect(() => {
        const selectedButton = imageButtonsRef.current[selectedIndex];
        if (selectedButton) {
            selectedButton.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
            });
        }
    }, [selectedIndex]);

    useEffect(() => {
        const firstButton = imageButtonsRef.current[0];
        if (firstButton) {
            setTimeout(() => {
                firstButton.scrollIntoView({
                    behavior: "auto",
                    block: "nearest",
                    inline: "start",
                });
            }, 0);
        }
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center rounded-2xl border border-border-card bg-bg-card p-4">
                <img
                    alt=""
                    src={images[selectedIndex]}
                    className="max-h-[420px] w-auto max-w-full object-contain"
                />
            </div>

            <div className="hidden sm:block">
                <div className="relative flex items-center gap-3">
                    <button
                        onClick={() => handleImageNavigation("left")}
                        className="shrink-0 rounded-[10px] border border-border-input bg-bg-input p-2 text-text-secondary transition-all hover:bg-bg-card-hover"
                        aria-label="Anterior"
                        type="button"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>

                    <div className="flex gap-3 py-2 px-1 flex-1 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center">
                        {images.map((image, idx) => (
                            <button
                                key={idx}
                                ref={(el) => {
                                    imageButtonsRef.current[idx] = el;
                                }}
                                onClick={() => setSelectedIndex(idx)}
                                className={`group relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-2 bg-bg-card p-1 transition-all ${
                                    selectedIndex === idx
                                        ? "border-accent-blue"
                                        : "border-border-card hover:border-border-strong"
                                }`}
                                aria-label={`Selecionar imagem ${idx + 1}`}
                                type="button"
                            >
                                <img
                                    alt=""
                                    src={image}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handleImageNavigation("right")}
                        className="shrink-0 rounded-[10px] border border-border-input bg-bg-input p-2 text-text-secondary transition-all hover:bg-bg-card-hover"
                        aria-label="Próximo"
                        type="button"
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
