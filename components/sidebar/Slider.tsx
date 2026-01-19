"use client";

import { FC, useEffect, useRef, useState } from "react";

interface SliderItem {
  id: number | string;
  title?: string;
  image: string;
}

interface SliderProps {
  items: SliderItem[];
  visibleItems?: number; // কতগুলো item viewport-এ দেখাবে
  speed?: number; // scroll speed (px per frame)
}

const Slider: FC<SliderProps> = ({ items, visibleItems = 3, speed = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAmountRef = useRef(0); // preserve scroll position
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame: number;

    const step = () => {
      if (!isPaused) {
        scrollAmountRef.current += speed;
        if (scrollAmountRef.current >= container.scrollWidth / 2) {
          scrollAmountRef.current = 0; // loop back
        }
        container.scrollLeft = scrollAmountRef.current;
      }
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, speed]);

  const itemWidthClass = `w-[calc(100%/${visibleItems})]`;
  const infiniteItems = [...items, ...items]; // for infinite scroll

  return (
    <div
      ref={containerRef}
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex gap-2 px-1">
        {infiniteItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`${itemWidthClass} flex-shrink-0 flex flex-col items-center gap-2`}
          >
            <img
              src={item.image}
              alt={item.title || "slider-item"}
              className="h-20 w-20 rounded-full object-cover shadow-md hover:scale-105 transition-transform cursor-pointer"
            />
            {item.title && (
              <span className="mt-1 text-xs text-center font-medium truncate">
                {item.title}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
