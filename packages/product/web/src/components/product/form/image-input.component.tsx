"use client";

import { useState } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PhotoIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { FormMessage, Input } from "@pharmacore/shared-web";

interface ImageInputProps {
    imagesURL: string[];
    errors: any;
    onImagesChange: (images: string[]) => void;
}

export function ImageInput({
    imagesURL,
    errors,
    onImagesChange,
}: ImageInputProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = imagesURL.filter((url) => url.trim());
    const currentImage = images[currentIndex] || null;
    const hasImages = images.length > 0;
    const hasMultipleImages = images.length > 1;

    const goToPrevious = () => {
        if (images.length > 0) {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? images.length - 1 : prevIndex - 1,
            );
        }
    };

    const goToNext = () => {
        if (images.length > 0) {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1,
            );
        }
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const addImage = () => {
        onImagesChange([...imagesURL, ""]);
    };

    const removeImage = (index: number) => {
        onImagesChange(imagesURL.filter((_, i) => i !== index));
    };

    const updateImage = (index: number, value: string) => {
        const newImages = [...imagesURL];
        newImages[index] = value;
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="mt-6">
                <div className="relative group h-68 w-60 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    {!hasImages ? (
                        <PhotoIcon className="h-16 w-16 text-gray-400" />
                    ) : hasMultipleImages ? (
                        <>
                            <img
                                alt="Imagem do produto"
                                src={currentImage!}
                                className="w-full h-full object-contain transition-opacity duration-500"
                            />
                            <button
                                onClick={goToPrevious}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-r-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                aria-label="Imagem anterior"
                                type="button"
                            >
                                <ChevronLeftIcon className="h-6 w-6" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-l-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                aria-label="Próxima imagem"
                                type="button"
                            >
                                <ChevronRightIcon className="h-6 w-6" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`h-2 w-2 rounded-full transition-all duration-200 ${
                                            index === currentIndex
                                                ? "bg-white w-6"
                                                : "bg-white/50 hover:bg-white/75"
                                        }`}
                                        aria-label={`Ir para imagem ${index + 1}`}
                                        type="button"
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <img
                            alt="Imagem do produto"
                            src={currentImage!}
                            className="w-full h-full object-contain transition-opacity duration-500"
                        />
                    )}
                </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <PhotoIcon className="h-4 w-4 text-gray-400" />
                URLs das Imagens
            </label>
            <div className="space-y-3">
                {imagesURL.map((url, index) => (
                    <div className="flex flex-col" key={index}>
                        <div className="flex gap-2">
                            <Input
                                type="url"
                                placeholder="https://exemplo.com/imagem.jpg"
                                value={url}
                                onChange={(e) =>
                                    updateImage(index, e.target.value)
                                }
                                className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                            />
                            {imagesURL.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                    title="Remover imagem"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                        {errors?.[index]?.message && (
                            <FormMessage>{errors[index].message}</FormMessage>
                        )}
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={addImage}
                className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
                + Adicionar imagem
            </button>
        </div>
    );
}
