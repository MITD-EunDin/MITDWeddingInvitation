import { Reveal } from '../common/Reveal';
import type { PersonInfo, WeddingDateTime } from '../../types/wedding';
import { FloralDivider, HeartIcon } from '../common/Icons';

interface Props {
  groom: PersonInfo;
  bride: PersonInfo;
  dateTime: WeddingDateTime;
  backgroundImage: string;
}

export function FinalSection({ groom, bride, dateTime, backgroundImage }: Props) {
  return (
    <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-4 py-24 sm:px-6 text-center">
      {/* Background with Dark Vignette */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Thank you background"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/75" />
      </div>

      <Reveal direction="up" className="relative z-10 text-white max-w-xl mx-auto">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-primary mb-4">
          <HeartIcon filled className="w-5 h-5 text-primary" />
        </div>

        <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-medium">
          Thank You
        </p>

        <h2 className="font-display mt-4 text-3xl sm:text-5xl font-normal leading-tight text-white drop-shadow-md">
          Chân Thành Cảm Ơn
        </h2>

        <FloralDivider className="w-40 h-5 text-primary mx-auto my-4" />

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/90 font-light italic">
          Sự hiện diện và những lời chúc phúc ấm áp của Quý khách là món quà vô giá và niềm hạnh phúc lớn nhất của chúng tôi trong ngày khởi đầu chương mới của cuộc đời.
        </p>

        {/* Script Signatures */}
        <div className="mt-8 font-script text-4xl sm:text-5xl text-[#F5D0A9] drop-shadow-md">
          {groom.displayName} <span className="text-primary font-serif font-light text-3xl sm:text-4xl">&amp;</span> {bride.displayName}
        </div>

        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/70">
          {dateTime.displayDate}
        </p>
      </Reveal>
    </section>
  );
}
