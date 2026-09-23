import { Reveal } from '../common/Reveal';
import type { VenueInfo, WeddingDateTime } from '../../types/wedding';

interface Props {
  venue: VenueInfo;
  dateTime: WeddingDateTime;
}

export function VenueSection({ venue, dateTime }: Props) {
  return (
    <section className="bg-background px-6 py-20 sm:py-28">
      <Reveal direction="up">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-primary">
          Wedding Venue
        </p>
      </Reveal>

      <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-border">
        <Reveal direction="scale">
          <img
            src={venue.image}
            alt={venue.name}
            loading="lazy"
            className="h-64 w-full object-cover sm:h-80"
          />
        </Reveal>

        <Reveal direction="up" delay={0.1} className="bg-background px-6 py-8 text-center sm:px-10">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">{venue.session}</span>
          <h3 className="font-display mt-3 text-2xl text-foreground sm:text-3xl">{venue.name}</h3>
          <p className="mt-2 text-sm text-foreground-muted">{venue.address}</p>
          <p className="mt-4 text-sm text-foreground-muted">
            {dateTime.displayDate} &middot; {dateTime.displayTime}
          </p>

          <a
            href={venue.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary
                       px-6 py-2.5 text-sm tracking-wide text-primary transition-colors
                       hover:bg-primary hover:text-primary-contrast"
          >
            Xem Bản Đồ
          </a>
        </Reveal>
      </div>
    </section>
  );
}
