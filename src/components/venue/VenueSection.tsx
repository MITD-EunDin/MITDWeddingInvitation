import { useState } from 'react';
import { Reveal } from '../common/Reveal';
import type { VenueInfo, WeddingDateTime } from '../../types/wedding';
import { useToast } from '../../hooks/useToast';
import { FloralDivider, MapPinIcon, ClockIcon, CopyIcon, CheckIcon } from '../common/Icons';

interface Props {
  venue: VenueInfo;
  dateTime: WeddingDateTime;
}

export function VenueSection({ venue, dateTime }: Props) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(venue.address);
      setCopied(true);
      showToast('Đã sao chép địa chỉ tiệc cưới!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Không thể tự động sao chép');
    }
  };

  const scheduleItems = [
    { time: '10:00', title: 'Đón Khách', desc: 'Chụp ảnh kỷ niệm & đón tiếp quý khách' },
    { time: '11:00', title: 'Lễ Thành Hôn', desc: 'Nghi thức trao nhẫn & chúc phúc' },
    { time: '11:30', title: 'Khai Tiệc Mừng', desc: 'Khai tiệc rượu & giao lưu âm nhạc' },
  ];

  return (
    <section className="relative bg-background-alt px-4 py-20 sm:px-6 sm:py-28 overflow-hidden">
      <Reveal direction="up">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
            Location &amp; Timeline
          </p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground">
            Địa Điểm &amp; Thời Gian
          </h2>
          <FloralDivider className="w-40 h-5 text-primary/60 mx-auto mt-3" />
        </div>
      </Reveal>

      <div className="mx-auto mt-12 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Venue Information Card */}
        <Reveal direction="left" className="h-full flex flex-col">
          <div className="flex-1 rounded-2xl border border-border/80 bg-background overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <img
                src={venue.image}
                alt={venue.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-4 left-4 rounded-full bg-primary/90 px-3.5 py-1 text-xs uppercase tracking-wider text-primary-contrast font-medium backdrop-blur-sm">
                {venue.session}
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl text-foreground font-medium">
                  {venue.name}
                </h3>
                <p className="mt-2 text-sm text-foreground-muted flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{venue.address}</span>
                </p>

                <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-2 text-xs text-primary font-medium">
                  <ClockIcon className="w-4 h-4" />
                  <span>{dateTime.displayDate} &bull; {dateTime.displayTime}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-wider text-primary-contrast transition-colors hover:bg-[#9F7A48]"
                >
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>Chỉ Đường Maps</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
                  aria-label="Sao chép địa chỉ"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-3.5 h-3.5" />
                      <span>Chép địa chỉ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Wedding Day Schedule */}
        <Reveal direction="right" className="h-full flex flex-col">
          <div className="flex-1 rounded-2xl border border-border/80 bg-background p-6 sm:p-8 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary pb-3 border-b border-border/60">
                <ClockIcon className="w-5 h-5" />
                <h3 className="font-display text-xl text-foreground font-medium uppercase tracking-wide">
                  Chương Trình Hôn Lễ
                </h3>
              </div>

              <div className="mt-6 space-y-6">
                {scheduleItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-sm font-semibold text-primary tabular-nums">
                      {item.time}
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-display text-base sm:text-lg text-foreground font-medium">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-xs sm:text-sm text-foreground-muted">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-background-alt p-4 text-xs text-foreground-muted leading-relaxed border border-border/60">
              <span className="font-medium text-foreground">💡 Lưu ý:</span> Khu vực tiệc cưới có bãi đỗ xe ô tô và xe máy thuận tiện có bảo vệ hướng dẫn.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
