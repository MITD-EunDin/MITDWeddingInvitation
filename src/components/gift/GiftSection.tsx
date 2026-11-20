import { useState } from 'react';
import { Reveal } from '../common/Reveal';
import { useToast } from '../../hooks/useToast';
import type { BankAccount, GiftConfig } from '../../types/wedding';
import { FloralDivider, GiftBoxIcon, CopyIcon, CheckIcon } from '../common/Icons';

function AccountCard({ label, account }: { label: string; account: BankAccount }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      showToast(`Đã sao chép số tài khoản ${label}!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Không thể tự động sao chép — vui lòng copy thủ công');
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-background p-6 sm:p-8 text-center shadow-lg flex flex-col justify-between h-full">
      <div>
        <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs uppercase tracking-widest text-primary font-medium">
          Mừng Cưới {label}
        </span>

        {account.qrImage && (
          <div className="mx-auto mt-6 h-44 w-44 sm:h-48 sm:w-48 overflow-hidden rounded-xl border-2 border-primary/20 p-2 bg-white shadow-sm">
            <img
              src={account.qrImage}
              alt={`Mã QR mừng cưới ${label}`}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
        )}

        <div className="mt-5 space-y-1">
          <p className="font-display text-xl text-foreground font-semibold uppercase tracking-wide">
            {account.accountName}
          </p>
          <p className="text-xs sm:text-sm text-foreground-muted font-light">
            Ngân hàng: <span className="font-medium text-foreground">{account.bankName}</span>
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/60">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-background-alt py-2.5 px-4 text-xs font-medium uppercase tracking-wider text-foreground hover:bg-primary hover:text-primary-contrast transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Đã chép số tài khoản</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4 text-primary" />
              <span>STK: <strong className="font-mono tracking-normal">{account.accountNumber}</strong> (Chép)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function GiftSection({ gift }: { gift: GiftConfig }) {
  if (!gift.enabled) return null;

  return (
    <section id="gift-section" className="relative bg-background px-4 py-20 sm:px-6 sm:py-28 overflow-hidden">
      <Reveal direction="up">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <GiftBoxIcon className="w-6 h-6" />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
            Wedding Registry &amp; Gift
          </p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground">
            Hộp Mừng Cưới
          </h2>
          <FloralDivider className="w-40 h-5 text-primary/60 mx-auto mt-3" />
          {gift.note && (
            <p className="mx-auto mt-3 max-w-md text-center text-xs sm:text-sm leading-relaxed text-foreground-muted font-light italic">
              "{gift.note}"
            </p>
          )}
        </div>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 items-stretch">
        {gift.groomAccount && (
          <Reveal direction="left" className="h-full">
            <AccountCard label="Nhà Trai" account={gift.groomAccount} />
          </Reveal>
        )}
        {gift.brideAccount && (
          <Reveal direction="right" className="h-full">
            <AccountCard label="Nhà Gái" account={gift.brideAccount} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
