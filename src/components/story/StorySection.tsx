import { Reveal } from '../common/Reveal';
import type { StoryItem } from '../../types/wedding';
import { FloralDivider, HeartIcon } from '../common/Icons';

interface Props {
  items: StoryItem[];
}

export function StorySection({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="relative bg-background px-4 py-20 sm:px-6 sm:py-28 overflow-hidden">
      <Reveal direction="up">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
            Our Love Story
          </p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground">
            Hành Trình Yêu Thương
          </h2>
          <FloralDivider className="w-40 h-5 text-primary/60 mx-auto mt-3" />
        </div>
      </Reveal>

      <div className="relative mx-auto mt-16 max-w-4xl">
        {/* Timeline Line - Desktop Center */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10 sm:block"
        />
        {/* Timeline Line - Mobile Left */}
        <div
          aria-hidden="true"
          className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10 sm:hidden"
        />

        <ol className="space-y-16 sm:space-y-24">
          {items.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <li key={item.id} className="relative">
                {/* Timeline Heart Node */}
                <div
                  aria-hidden="true"
                  className="absolute left-5 top-4 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-background border-2 border-primary shadow-sm sm:left-1/2"
                >
                  <HeartIcon filled className="h-3.5 w-3.5 text-primary" />
                </div>

                <div
                  className={`ml-12 grid gap-6 sm:ml-0 sm:grid-cols-2 sm:gap-14 ${
                    isEven ? '' : 'sm:[&>*:first-child]:order-2'
                  }`}
                >
                  {/* Photo with Frame */}
                  <Reveal direction={isEven ? 'left' : 'right'} className="group">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-background-alt p-2 shadow-md transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-xl">
                      <div className="h-60 sm:h-72 w-full overflow-hidden rounded-xl">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </Reveal>

                  {/* Text Content */}
                  <Reveal
                    direction={isEven ? 'right' : 'left'}
                    className={`flex flex-col justify-center ${isEven ? 'sm:text-left' : 'sm:text-right'}`}
                  >
                    <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary w-fit self-start sm:self-auto">
                      {item.date}
                    </span>
                    <h3 className="font-display mt-3 text-2xl sm:text-3xl text-foreground font-medium">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground-muted font-light">
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
