/**
 * Placeholder tạm thời cho các section sẽ triển khai ở giai đoạn tiếp theo
 * (Our Story, Couple, Venue, Gallery, Invitation, RSVP, Wishes, Gift, Final).
 * Xoá component này khi các section thật được thêm vào App.tsx.
 */
export function ComingSoonSection({ name }: { name: string }) {
  return (
    <section className="border-t border-dashed border-border px-6 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">
        Section sắp triển khai
      </p>
      <p className="font-display mt-2 text-2xl text-foreground">{name}</p>
    </section>
  );
}
