import { Reveal } from '../common/Reveal';
import type { InvitationConfig, PersonInfo, WeddingDateTime } from '../../types/wedding';

interface Props {
  invitation: InvitationConfig;
  groom: PersonInfo;
  bride: PersonInfo;
  dateTime: WeddingDateTime;
}

export function InvitationSection({ invitation, groom, bride, dateTime }: Props) {
  return (
    <section className="bg-background px-6 py-20 sm:py-28">
      <Reveal direction="scale" className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-border bg-background-alt px-8 py-14 text-center sm:px-14 sm:py-16">
          <span aria-hidden="true" className="font-display text-3xl text-primary">
            &#10047;
          </span>

          <h2 className="font-display mt-6 text-2xl uppercase tracking-[0.15em] text-foreground sm:text-3xl">
            {invitation.title}
          </h2>

          <p className="mt-6 text-sm leading-relaxed text-foreground-muted">{invitation.message}</p>

          <div className="mt-8 font-display text-2xl text-foreground sm:text-3xl">
            {groom.fullName}
            <span className="mx-3 text-primary">&amp;</span>
            {bride.fullName}
          </div>

          <div className="mx-auto mt-6 h-px w-16 bg-border" />

          <p className="mt-6 text-sm tracking-wide text-foreground-muted">
            {dateTime.displayDate}
          </p>
          <p className="text-sm tracking-wide text-foreground-muted">{dateTime.displayTime}</p>

          <div className="mt-8 space-y-1">
            {invitation.sessions.map((session) => (
              <p key={session.name} className="text-sm text-foreground">
                {session.session} &middot; {session.name}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
