"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BannerItem {
  id: string | number;
  tag?: string;
  title: string;
  description: string;
  link: string;
  buttonText?: string;
  bgGradient?: string;
  imageUrl?: string;
}

interface BannerCarouselProps {
  banners: BannerItem[];
  autoPlayInterval?: number; // in ms
}

export function BannerCarousel({ banners, autoPlayInterval = 5000 }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  // Set interval for auto play
  useEffect(() => {
    if (banners.length <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(nextSlide, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, autoPlayInterval, banners.length, isHovered]);

  if (!banners || banners.length === 0) return null;

  return (
    <section 
      className="bg-white border-b border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="w-full h-[240px] md:h-[440px] rounded-3xl overflow-hidden relative shadow-2xl shadow-primary/10 group">
          
          {/* Slides Container */}
          <div 
            className="flex h-full transition-transform duration-500 ease-out w-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner) => (
              <div 
                key={banner.id} 
                className="w-full h-full relative flex-shrink-0 select-none"
              >
                {/* Background (Gradient or Image) */}
                {banner.imageUrl ? (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner.imageUrl})` }}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                  </div>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${banner.bgGradient || "from-rose-600 via-primary to-red-800"}`}></div>
                )}
                
                {/* Carbon fibre overlay and light reflections */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-15 mix-blend-overlay"></div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse delay-700"></div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-center text-white z-10 px-6 md:px-12">
                  {banner.tag && (
                    <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs md:text-sm font-semibold mb-4 md:mb-6 border border-white/30 uppercase tracking-wider">
                      {banner.tag}
                    </span>
                  )}
                  <h2 className="text-2xl md:text-6xl font-extrabold mb-3 md:mb-4 leading-tight drop-shadow-lg max-w-4xl whitespace-pre-line">
                    {banner.title}
                  </h2>
                  <p className="text-sm md:text-2xl font-medium text-white/90 mb-6 md:mb-8 max-w-2xl drop-shadow-md">
                    {banner.description}
                  </p>
                  <Link 
                    href={banner.link} 
                    className="bg-white text-primary px-6 py-2.5 md:px-8 md:py-3.5 rounded-full font-bold text-sm md:text-lg hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group/btn cursor-pointer"
                  >
                    {banner.buttonText || "Belanja Sekarang"}
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 z-20"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 z-20"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {banners.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentIndex ? "w-8 bg-white shadow-md" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
