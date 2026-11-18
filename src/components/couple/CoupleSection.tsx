import { Reveal } from '../common/Reveal';
import type { PersonInfo } from '../../types/wedding';
import { FloralDivider, WeddingRingsIcon } from '../common/Icons';

interface Props {
  groom: PersonInfo;
  bride: PersonInfo;
}

function PersonCard({
  person,
  role,
  align,
}: {
  person: PersonInfo;
  role: 'CHÚ RỂ' | 'CÔ DÂU';
  align: 'left' | 'right';
}) {
  return (
    <Reveal
      direction={align === 'left' ? 'left' : 'right'}
      className="flex flex-col items-center text-center max-w-sm mx-auto"
    >
      {/* Arch-framed photo */}
      <div className="relative group">
        {/* Decorative Golden Outer Ring */}
        <div className="absolute -inset-2.5 rounded-t-[140px] rounded-b-3xl border border-primary/30 pointer-events-none transition-transform duration-500 group-hover:scale-[1.02]" />

        <div className="h-64 w-52 sm:h-80 sm:w-64 overflow-hidden rounded-t-[130px] rounded-b-2xl border-2 border-primary/50 shadow-lg bg-background">
          <img
            src={person.photo}
            alt={`${role}: ${person.fullName}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Role Badge */}
        <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-5 py-1 text-xs uppercase tracking-[0.25em] text-primary-contrast shadow-md font-medium">
          {role}
        </div>
      </div>

      {/* Name & Details */}
      <div className="mt-8 space-y-2">
        <h3 className="font-display text-2xl sm:text-3xl text-foreground font-medium">
          {person.fullName}
        </h3>

        {/* Parents Information */}
        {person.familyInfo && (
          <p className="text-xs sm:text-sm text-foreground-muted font-light">
            Con ông: <span className="font-medium text-foreground">{person.familyInfo.fatherName}</span>
            <br />
            Con bà: <span className="font-medium text-foreground">{person.familyInfo.motherName}</span>
          </p>
        )}

        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-foreground-muted max-w-xs mx-auto italic">
          "{person.description}"
        </p>
      </div>
    </Reveal>
  );
}

export function CoupleSection({ groom, bride }: Props) {
  return (
    <section className="relative bg-background-alt px-4 py-20 sm:px-6 sm:py-28 overflow-hidden">
      <Reveal direction="up">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
            The Happy Couple
          </p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground">
            Cô Dâu &amp; Chú Rể
          </h2>
          <FloralDivider className="w-40 h-5 text-primary/60 mx-auto mt-3" />
        </div>
      </Reveal>

      <div className="relative mx-auto mt-16 grid max-w-4xl grid-cols-1 items-center gap-16 sm:grid-cols-2 sm:gap-10">
        <PersonCard person={groom} role="CHÚ RỂ" align="left" />

        {/* Central Interlocking Rings Accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative z-10 -my-6 flex justify-center sm:absolute sm:left-1/2 sm:top-1/2 sm:my-0 sm:-translate-x-1/2 sm:-translate-y-1/2"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background border border-primary/40 shadow-md">
            <WeddingRingsIcon className="w-7 h-7 text-primary animate-float-gentle" />
          </div>
        </div>

        <PersonCard person={bride} role="CÔ DÂU" align="right" />
      </div>
    </section>
  );
}
