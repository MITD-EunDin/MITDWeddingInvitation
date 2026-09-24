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

  if (images.length === 0) return null;

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
            className={`overflow-hidden rounded-lg sm:mb-4 sm:break-inside-avoid ${
              img.featured ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block w-full"
              aria-label={`Xem ảnh lớn: ${img.alt}`}
            >
              <img
                src={img.thumbnail ?? img.src}
                alt={img.alt}
                loading="lazy"
                width={img.width}
                height={img.height}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
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
