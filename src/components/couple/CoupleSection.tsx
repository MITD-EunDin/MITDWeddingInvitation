import { Reveal } from '../common/Reveal';
import type { PersonInfo } from '../../types/wedding';

interface Props {
  groom: PersonInfo;
  bride: PersonInfo;
}

function PersonCard({ person, align }: { person: PersonInfo; align: 'left' | 'right' }) {
  return (
    <Reveal
      direction={align === 'left' ? 'left' : 'right'}
      className="flex flex-col items-center text-center"
    >
      <div className="h-56 w-56 overflow-hidden rounded-full border border-border sm:h-72 sm:w-72">
        <img
          src={person.photo}
          alt={person.fullName}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="font-display mt-6 text-3xl text-foreground">{person.fullName}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground-muted">
        {person.description}
      </p>
    </Reveal>
  );
}

export function CoupleSection({ groom, bride }: Props) {
  return (
    <section className="relative bg-background-alt px-6 py-20 sm:py-28">
      <Reveal direction="up">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-primary">The Couple</p>
      </Reveal>

      <div className="relative mx-auto mt-14 grid max-w-4xl grid-cols-1 items-center gap-16 sm:grid-cols-2 sm:gap-8">
        <PersonCard person={groom} align="left" />

        {/* Dấu & ở giữa — desktop tuyệt đối căn giữa, mobile nằm giữa 2 card */}
        <span
          aria-hidden="true"
          className="font-display pointer-events-none relative z-10 -my-8 block text-center text-4xl text-primary
                     sm:absolute sm:left-1/2 sm:top-1/2 sm:my-0 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:text-5xl"
        >
          &amp;
        </span>

        <PersonCard person={bride} align="right" />
      </div>
    </section>
  );
}
