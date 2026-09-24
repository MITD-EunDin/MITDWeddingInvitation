import { Reveal } from '../common/Reveal';
import type { PersonInfo, WeddingDateTime } from '../../types/wedding';

interface Props {
  groom: PersonInfo;
  bride: PersonInfo;
  dateTime: WeddingDateTime;
  backgroundImage: string;
}

export function FinalSection({ groom, bride, dateTime, backgroundImage }: Props) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <Reveal direction="up" className="relative z-10 text-white">
        <p className="text-xs uppercase tracking-[0.35em] text-white/80">Thank You</p>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
          Cảm ơn bạn đã là một phần trong câu chuyện của chúng tôi.
        </p>
        <h2 className="font-display mt-8 text-3xl sm:text-4xl">
          {groom.displayName} <span className="mx-2 text-primary">&amp;</span> {bride.displayName}
        </h2>
        <p className="mt-3 text-sm tracking-wide text-white/80">{dateTime.displayDate}</p>
      </Reveal>
    </section>
  );
}
