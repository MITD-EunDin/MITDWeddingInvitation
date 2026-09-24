import { Reveal } from '../common/Reveal';
import { useToast } from '../../hooks/useToast';
import type { BankAccount, GiftConfig } from '../../types/wedding';

function AccountCard({ label, account }: { label: string; account: BankAccount }) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      showToast('Đã sao chép số tài khoản');
    } catch {
      showToast('Không thể sao chép — vui lòng copy thủ công');
    }
  };

  return (
    <div className="rounded-xl border border-border bg-background px-6 py-8 text-center">
      <span className="text-xs uppercase tracking-[0.2em] text-primary">{label}</span>

      {account.qrImage && (
        <div className="mx-auto mt-4 h-40 w-40 overflow-hidden rounded-lg border border-border">
          <img src={account.qrImage} alt={`QR chuyển khoản ${label}`} className="h-full w-full object-cover" />
        </div>
      )}

      <p className="font-display mt-4 text-lg text-foreground">{account.accountName}</p>
      <p className="text-sm text-foreground-muted">{account.bankName}</p>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm
                   text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        {account.accountNumber}
        <span aria-hidden="true">⧉</span>
        <span className="sr-only">Sao chép số tài khoản</span>
      </button>
    </div>
  );
}

export function GiftSection({ gift }: { gift: GiftConfig }) {
  if (!gift.enabled) return null;

  return (
    <section className="bg-background-alt px-6 py-20 sm:py-28">
      <Reveal direction="up">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-primary">
          Wedding Gift
        </p>
        <h2 className="font-display mt-3 text-center text-3xl text-foreground sm:text-4xl">
          Mừng Cưới
        </h2>
        {gift.note && (
          <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-foreground-muted">
            {gift.note}
          </p>
        )}
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
        {gift.groomAccount && (
          <Reveal direction="left">
            <AccountCard label="Nhà Trai" account={gift.groomAccount} />
          </Reveal>
        )}
        {gift.brideAccount && (
          <Reveal direction="right">
            <AccountCard label="Nhà Gái" account={gift.brideAccount} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
