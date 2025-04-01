import { useState } from 'react';
import { Image } from '../types/property';

interface ImageSliderProps {
    images: Image[];
}

export function ImageSlider({ images = [] }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    if (!Array.isArray(images) || images.length === 0) {
        return (
            <div className="w-full h-[480px] bg-gray-200 flex items-center justify-center text-gray-400">
                No Images Available
            </div>
        );
    }

    return (
        <div className="relative w-full h-[480px] group">
            <img
                src={import.meta.env.VITE_API_URL + images[currentIndex].url}
                alt={`Property ${currentIndex + 1}`}
                className="w-full h-full object-cover"
            />
            
            {/* Left Arrow */}
            <div 
                className="hidden group-hover:block absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                onClick={goToPrevious}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </div>

            {/* Right Arrow */}
            <div 
                className="hidden group-hover:block absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                onClick={goToNext}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </div>

            {/* Dots/Thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`
                            w-2 h-2 rounded-full cursor-pointer transition-all
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