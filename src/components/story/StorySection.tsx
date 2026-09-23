import { Reveal } from '../common/Reveal';
import type { StoryItem } from '../../types/wedding';

interface Props {
  items: StoryItem[];
}

export function StorySection({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="bg-background px-6 py-20 sm:py-28">
      <Reveal direction="up">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-primary">Our Story</p>
        <h2 className="font-display mt-3 text-center text-3xl text-foreground sm:text-4xl">
          Hành Trình Yêu Thương
        </h2>
      </Reveal>

      <div className="relative mx-auto mt-16 max-w-4xl">
        {/* Đường timeline dọc — ẩn trên mobile, hiện từ sm trở lên ở giữa */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border sm:block"
        />
        {/* Đường timeline mobile — bên trái */}
        <div
          aria-hidden="true"
          className="absolute left-4 top-0 h-full w-px bg-border sm:hidden"
        />

        <ol className="space-y-14 sm:space-y-20">
          {items.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <li key={item.id} className="relative">
                {/* Dot mốc thời gian */}
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full
                             bg-primary ring-4 ring-background sm:left-1/2"
                />

                <div
                  className={`ml-10 grid gap-6 sm:ml-0 sm:grid-cols-2 sm:gap-12 ${
                    isEven ? '' : 'sm:[&>*:first-child]:order-2'
                  }`}
                >
                  <Reveal direction={isEven ? 'left' : 'right'} className="overflow-hidden rounded-xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-56 w-full object-cover sm:h-64"
                    />
                  </Reveal>

                  <Reveal
                    direction={isEven ? 'right' : 'left'}
                    className={`flex flex-col justify-center ${isEven ? 'sm:text-left' : 'sm:text-right'}`}
                  >
                    <span className="text-xs uppercase tracking-[0.2em] text-primary">
                      {item.date}
                    </span>
                    <h3 className="font-display mt-2 text-2xl text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                      {item.description}
                    </p>
                  </Reveal>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
