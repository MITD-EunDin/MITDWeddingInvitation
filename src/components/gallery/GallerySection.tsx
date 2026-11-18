import { Suspense, lazy, useState, type ComponentType } from 'react';
import { Reveal } from '../common/Reveal';
import type { GalleryImage } from '../../types/wedding';
import { FloralDivider, SparklesIcon } from '../common/Icons';

// Lazy-load lightbox + its CSS chỉ khi người dùng thật sự mở ảnh —
// tránh cộng dồn vào bundle chính, giảm thời gian tải trang đầu.
const Lightbox = lazy(() => import('yet-another-react-lightbox'));

interface Props {
  images: GalleryImage[];
}

export function GallerySection({ images }: Props) {
  const [index, setIndex] = useState(-1);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  if (images.length === 0) return null;

  const handleLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  return (
    <section className="relative bg-background-alt px-4 py-20 sm:px-6 sm:py-28 overflow-hidden">
      <Reveal direction="up">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
            Photo Gallery
          </p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground">
            Khoảnh Khắc Hạnh Phúc
          </h2>
          <FloralDivider className="w-40 h-5 text-primary/60 mx-auto mt-3" />
        </div>
      </Reveal>

      {/* Grid gallery */}
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:columns-3 sm:gap-4 sm:[column-fill:balance]">
        {images.map((img, i) => (
          <Reveal
            key={img.id}
            direction="scale"
            delay={(i % 6) * 0.05}
            className={`overflow-hidden rounded-2xl sm:mb-4 sm:break-inside-avoid relative group border border-border/80 bg-background p-1.5 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/50 ${
              img.featured ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="relative block w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl overflow-hidden cursor-pointer"
              aria-label={`Xem ảnh lớn: ${img.alt}`}
            >
              {/* Loading placeholder */}
              <div
                className="absolute inset-0 bg-background-alt z-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>

              <img
                src={img.thumbnail ?? img.src}
                alt={img.alt}
                loading="lazy"
                width={img.width}
                height={img.height}
                onLoad={() => handleLoad(img.id)}
                className={`
                  h-full w-full object-cover rounded-xl
                  transition-all duration-700 ease-out
                  ${loadedImages.has(img.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                  group-hover:scale-105
                `}
              />

              {/* Hover Overlay with Romantic Hint */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none flex items-end justify-center p-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-foreground shadow-md">
                  <SparklesIcon className="w-3.5 h-3.5 text-primary" />
                  <span>Phóng to ảnh</span>
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {index >= 0 && (
        <Suspense fallback={null}>
          <LightboxLoader
            index={index}
            images={images}
            onClose={() => setIndex(-1)}
            LightboxComponent={Lightbox}
          />
        </Suspense>
      )}
    </section>
  );
}

function LightboxLoader({
  index,
  images,
  onClose,
  LightboxComponent,
}: {
  index: number;
  images: GalleryImage[];
  onClose: () => void;
  LightboxComponent: ComponentType<any>;
}) {
  import('yet-another-react-lightbox/styles.css');
  return (
    <LightboxComponent
      open={index >= 0}
      index={index}
      close={onClose}
      slides={images.map((img) => ({ src: img.src, alt: img.alt, width: img.width, height: img.height }))}
      controller={{ closeOnBackdropClick: true }}
    />
  );
}
