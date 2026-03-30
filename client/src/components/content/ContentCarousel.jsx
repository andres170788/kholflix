import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';

export default function ContentCarousel({ title, items = [], viewAllLink }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (!items.length) return null;

  return (
    <section className="relative py-6">
      <div className="flex items-center justify-between px-8 md:px-16 mb-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <a href={viewAllLink} className="text-sm text-violet-400 hover:text-violet-300 mr-4">
              View All
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-card hover:bg-card-hover transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-card hover:bg-card-hover transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-8 md:px-16 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-[180px] md:w-[200px]">
            <ContentCard content={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
