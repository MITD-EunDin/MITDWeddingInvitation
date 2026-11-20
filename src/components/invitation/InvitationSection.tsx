import { Reveal } from '../common/Reveal';
import type { InvitationConfig, PersonInfo, WeddingDateTime } from '../../types/wedding';
import { DoubleHappinessIcon, FloralCorner, FloralDivider, MapPinIcon, ClockIcon } from '../common/Icons';

interface Props {
  invitation: InvitationConfig;
  groom: PersonInfo;
  bride: PersonInfo;
  dateTime: WeddingDateTime;
}

export function InvitationSection({ invitation, groom, bride, dateTime }: Props) {
  return (
    <section id="invitation-card" className="relative bg-background px-4 py-20 sm:px-6 sm:py-28 overflow-hidden">
      {/* Background Subtle Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <DoubleHappinessIcon className="w-[450px] h-[450px] text-primary" />
      </div>

      <Reveal direction="up">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
            Thư Mời Hôn Lễ
          </p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground font-normal">
            Trân Trọng Kính Mời
          </h2>
          <FloralDivider className="w-40 h-5 text-primary/60 mx-auto mt-3" />
        </div>
      </Reveal>

      {/* Main Luxury Invitation Card */}
      <Reveal direction="scale" className="mx-auto max-w-2xl">
        <div className="relative rounded-2xl border border-border/80 bg-background-alt px-6 py-12 sm:px-14 sm:py-16 text-center shadow-xl">
          {/* 4 Decorative Floral Corners */}
          <FloralCorner position="top-left" className="absolute top-4 left-4 w-9 h-9 text-primary/50" />
          <FloralCorner position="top-right" className="absolute top-4 right-4 w-9 h-9 text-primary/50" />
          <FloralCorner position="bottom-left" className="absolute bottom-4 left-4 w-9 h-9 text-primary/50" />
          <FloralCorner position="bottom-right" className="absolute bottom-4 right-4 w-9 h-9 text-primary/50" />

          {/* Double Happiness Gold Crest */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
            <DoubleHappinessIcon className="h-8 w-8 text-primary" />
          </div>

          {/* Invitation Message */}
          <p className="mt-6 max-w-lg mx-auto text-sm sm:text-base leading-relaxed text-foreground-muted font-light italic">
            "{invitation.message}"
          </p>

          {/* Family Representation (Nhà Trai - Nhà Gái) */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-border/60 py-6 text-xs sm:text-sm">
            <div className="space-y-1">
              <p className="uppercase tracking-widest text-primary font-medium">Nhà Trai</p>
              {groom.familyInfo?.fatherName && (
                <p className="text-foreground font-medium">Ông: {groom.familyInfo.fatherName}</p>
              )}
              {groom.familyInfo?.motherName && (
                <p className="text-foreground font-medium">Bà: {groom.familyInfo.motherName}</p>
              )}
              <p className="text-[11px] text-foreground-muted pt-1">Hôn trường Nhà Trai</p>
            </div>

            <div className="space-y-1 border-l border-border/60">
              <p className="uppercase tracking-widest text-primary font-medium">Nhà Gái</p>
              {bride.familyInfo?.fatherName && (
                <p className="text-foreground font-medium">Ông: {bride.familyInfo.fatherName}</p>
              )}
              {bride.familyInfo?.motherName && (
                <p className="text-foreground font-medium">Bà: {bride.familyInfo.motherName}</p>
              )}
              <p className="text-[11px] text-foreground-muted pt-1">Hôn trường Nhà Gái</p>
            </div>
          </div>

          {/* Couple Names (Calligraphy & Display) */}
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.25em] text-foreground-muted">
              Hôn lễ của hai chúng tôi
            </p>
            <div className="mt-3 font-script text-4xl sm:text-5xl md:text-6xl text-foreground font-normal tracking-wide">
              <span>{groom.fullName}</span>
              <span className="mx-3 text-primary font-serif font-light text-3xl sm:text-4xl">&amp;</span>
              <span>{bride.fullName}</span>
            </div>
          </div>

          {/* Date & Time Highlight Box */}
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-primary/30 bg-background/80 p-5 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-primary">
              <ClockIcon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest font-medium">Thời Gian Tổ Chức</span>
            </div>
            <p className="font-display mt-2 text-xl sm:text-2xl text-foreground font-medium">
              {dateTime.displayDate}
            </p>
            <p className="mt-1 text-sm tracking-wider text-primary font-medium">
              Vào lúc: {dateTime.displayTime}
            </p>
          </div>

          {/* Sessions / Venues */}
          <div className="mt-8 space-y-4">
            {invitation.sessions.map((session, idx) => (
              <div key={idx} className="space-y-1">
                <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                  {session.session}
                </span>
                <h3 className="font-display text-lg sm:text-xl text-foreground pt-1">
                  {session.name}
                </h3>
                <p className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-foreground-muted">
                  <MapPinIcon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>{session.address}</span>
                </p>
              </div>
            ))}
          </div>

          {/* RSVP Quick Action Button */}
          <div className="mt-10">
            <a
              href="#rsvp-section"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-xs uppercase tracking-[0.2em] text-primary-contrast transition-all duration-300 hover:bg-[#9F7A48] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span>Phản Hồi Tham Dự (RSVP)</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
