import { useState } from 'react';
import { Image } from '../types/property';

interface ImageSliderProps {
    images: Image[];
}

export function ImageSlider({ images = [] }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (e: React.MouseEvent, slideIndex: number) => {
        e.stopPropagation();
        setCurrentIndex(slideIndex);
    };

    if (!Array.isArray(images) || images.length === 0) {
        return (
            <div className="w-full h-[480px] bg-gray-200 flex items-center justify-center text-gray-400">
                No Images Available
            </div>
        );
    }

    const imageUrl = images[currentIndex]?.url;
    if (!imageUrl) {
        return (
            <div className="w-full h-[480px] bg-gray-200 flex items-center justify-center text-gray-400">
                Invalid Image URL
            </div>
        );
    }

    return (
        <div className="relative w-full h-[480px] group">
            <img
                src={imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_URL}${imageUrl.replace(/^\/api/, '')}`}
                alt={`Property ${currentIndex + 1}`}
                className="w-full h-full object-cover"
            />
            
            {/* Left Arrow */}
            <button 
                className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={goToPrevious}
                type="button"
                aria-label="Previous image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* Right Arrow */}
            <button 
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={goToNext}
                type="button"
                aria-label="Next image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>

            {/* Dots/Thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={(e) => goToSlide(e, slideIndex)}
                        type="button"
                        aria-label={`Go to image ${slideIndex + 1}`}
                        className={`
                            w-3 h-3 rounded-full cursor-pointer transition-all
                            ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}
                        `}
                    />
                ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
} 