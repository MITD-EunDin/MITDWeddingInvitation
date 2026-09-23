import { useCountdown } from '../../hooks/useCountdown';
import { Reveal } from '../common/Reveal';
import type { WeddingData } from '../../types/wedding';

interface Props {
  dateTime: WeddingData['wedding']['dateTime'];
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-4xl text-foreground sm:text-5xl tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-foreground-muted">
        {label}
      </span>
    </div>
  );
}

export function WeddingDateSection({ dateTime }: Props) {
  const countdown = useCountdown(dateTime.isoDateTime);
  const date = new Date(dateTime.isoDateTime);

  return (
    <section className="bg-background-alt px-6 py-20 text-center sm:py-28">
      <Reveal direction="up">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Ngày Trọng Đại
        </p>
      </Reveal>

      <Reveal direction="up" delay={0.1}>
        <div className="mt-6 flex items-end justify-center gap-6 sm:gap-10">
          <div className="text-center">
            <div className="font-display text-2xl text-foreground-muted sm:text-3xl">
              {date.toLocaleDateString('vi-VN', { month: 'long' })}
            </div>
          </div>
          <div className="text-center">
            <div className="font-display text-6xl leading-none text-foreground sm:text-8xl">
              {date.getDate()}
            </div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl text-foreground-muted sm:text-3xl">
              {date.getFullYear()}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-foreground-muted">{dateTime.displayTime}</p>
      </Reveal>

      {!countdown.isPast ? (
        <Reveal direction="up" delay={0.2}>
          <div className="mx-auto mt-12 flex max-w-md items-center justify-center gap-6 sm:gap-10">
            <CountdownBlock value={countdown.days} label="Ngày" />
            <CountdownBlock value={countdown.hours} label="Giờ" />
            <CountdownBlock value={countdown.minutes} label="Phút" />
            <CountdownBlock value={countdown.seconds} label="Giây" />
          </div>
        </Reveal>
      ) : (
        <Reveal direction="up" delay={0.2}>
          <p className="mt-10 font-display text-2xl text-primary">Đã đến ngày trọng đại!</p>
        </Reveal>
      )}
    </section>
  );
}
