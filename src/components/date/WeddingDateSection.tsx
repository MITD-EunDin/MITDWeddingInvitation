import { useCountdown } from '../../hooks/useCountdown';
import { Reveal } from '../common/Reveal';
import type { WeddingData } from '../../types/wedding';
import { CalendarHeartIcon, FloralDivider, SparklesIcon } from '../common/Icons';

interface Props {
  dateTime: WeddingData['wedding']['dateTime'];
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/30 bg-background/90 px-3 py-4 sm:px-5 sm:py-5 shadow-md w-20 sm:w-24">
      <span className="font-display text-3xl sm:text-4xl font-semibold text-primary tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-foreground-muted font-medium">
        {label}
      </span>
    </div>
  );
}

/** Helper to generate calendar matrix for the wedding month */
function renderMonthCalendar(weddingDate: Date) {
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth(); // 0-indexed
  const weddingDay = weddingDate.getDate();

  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  // Adjust so Monday is 0 or Sunday is 0 (Let's use Sunday = 0)
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return { days, weddingDay };
}

export function WeddingDateSection({ dateTime }: Props) {
  const countdown = useCountdown(dateTime.isoDateTime);
  const date = new Date(dateTime.isoDateTime);
  const { days, weddingDay } = renderMonthCalendar(date);

  // Generate Google Calendar Link
  const startDateStr = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDateObj = new Date(date.getTime() + 4 * 60 * 60 * 1000);
  const endDateStr = endDateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    'Lễ Thành Hôn — Đám Cưới Trọng Đại'
  )}&dates=${startDateStr}/${endDateStr}&details=${encodeURIComponent(
    'Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi!'
  )}`;

  return (
    <section className="relative bg-background px-4 py-20 sm:px-6 sm:py-28 overflow-hidden">
      <Reveal direction="up">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
            Save The Special Date
          </p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground">
            Ngày Chung Đôi
          </h2>
          <FloralDivider className="w-40 h-5 text-primary/60 mx-auto mt-3" />
        </div>
      </Reveal>

      {/* Visual Wedding Calendar Card */}
      <Reveal direction="scale" className="mx-auto mt-12 max-w-sm sm:max-w-md">
        <div className="rounded-2xl border border-border/80 bg-background-alt p-6 sm:p-8 text-center shadow-lg">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <span className="font-display text-lg sm:text-xl font-semibold uppercase text-primary tracking-wider">
              Tháng {date.getMonth() + 1} / {date.getFullYear()}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-foreground-muted font-medium">
              <CalendarHeartIcon className="w-4 h-4 text-primary" />
              <span>{dateTime.displayTime}</span>
            </span>
          </div>

          {/* Calendar Day Headers */}
          <div className="mt-4 grid grid-cols-7 text-center text-xs font-medium text-foreground-muted">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          {/* Calendar Grid */}
          <div className="mt-2 grid grid-cols-7 gap-y-2 text-center text-xs sm:text-sm">
            {days.map((d, index) => {
              if (d === null) {
                return <div key={`empty-${index}`} />;
              }
              const isWeddingDay = d === weddingDay;
              return (
                <div key={d} className="flex items-center justify-center p-1">
                  {isWeddingDay ? (
                    <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-contrast shadow-md">
                      <span>{d}</span>
                      <span className="absolute -top-1 -right-1 text-[10px]">♥</span>
                    </div>
                  ) : (
                    <span className="text-foreground/80 hover:text-primary transition-colors">
                      {d}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add to Calendar Button */}
          <div className="mt-6 border-t border-border/60 pt-4">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-background px-5 py-2 text-xs font-medium uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-contrast"
            >
              <CalendarHeartIcon className="w-4 h-4" />
              <span>Lưu Lịch Google Calendar</span>
            </a>
          </div>
        </div>
      </Reveal>

      {/* Countdown Timer */}
      <div className="mt-12 text-center">
        {!countdown.isPast ? (
          <Reveal direction="up" delay={0.15}>
            <p className="text-xs uppercase tracking-[0.25em] text-foreground-muted mb-6">
              Thời gian đếm ngược đến ngày vui
            </p>
            <div className="flex items-center justify-center gap-2.5 sm:gap-4">
              <CountdownBlock value={countdown.days} label="Ngày" />
              <span className="text-xl text-primary font-bold">:</span>
              <CountdownBlock value={countdown.hours} label="Giờ" />
              <span className="text-xl text-primary font-bold">:</span>
              <CountdownBlock value={countdown.minutes} label="Phút" />
              <span className="text-xl text-primary font-bold">:</span>
              <CountdownBlock value={countdown.seconds} label="Giây" />
            </div>
          </Reveal>
        ) : (
          <Reveal direction="up" delay={0.15}>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30 text-primary">
              <SparklesIcon className="w-5 h-5 text-primary" />
              <span className="font-display text-xl sm:text-2xl font-medium">
                Ngày trọng đại đã bắt đầu! Chúc phúc đôi tân uyên ương!
              </span>
              <SparklesIcon className="w-5 h-5 text-primary" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
