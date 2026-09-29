import { Suspense, lazy, useState, type ComponentType } from 'react';
import { Reveal } from '../common/Reveal';
import type { GalleryImage } from '../../types/wedding';

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
    <section className="bg-background-alt px-6 py-20 sm:py-28">
      <Reveal direction="up">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-primary">Gallery</p>
        <h2 className="font-display mt-3 text-center text-3xl text-foreground sm:text-4xl">
          Khoảnh Khắc Của Chúng Tôi
        </h2>
      </Reveal>

      {/* Mobile: grid 2 cột đều. Desktop: masonry qua CSS columns, ảnh featured chiếm 2 cột */}
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:columns-3 sm:gap-4 sm:[column-fill:balance]">
        {images.map((img, i) => (
          <Reveal
            key={img.id}
            direction="scale"
            delay={(i % 6) * 0.05}
            className={`overflow-hidden rounded-xl sm:mb-4 sm:break-inside-avoid relative group ${
              img.featured ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-alt rounded-xl"
              aria-label={`Xem ảnh lớn: ${img.alt}`}
            >
              {/* Loading placeholder */}
              <div
                className="absolute inset-0 bg-background z-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
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
                  transition-all duration-500 ease-out
                  ${loadedImages.has(img.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                  group-hover:scale-[1.03] group-hover:shadow-xl
                `}
              />

              {/* Overlay gradient + icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="mx-auto max-w-xs px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-center text-sm font-medium text-foreground shadow-lg">
                  Nhấn để xem to
                </div>
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

/** Import CSS của lightbox cùng lúc với component, chỉ khi cần. */
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
