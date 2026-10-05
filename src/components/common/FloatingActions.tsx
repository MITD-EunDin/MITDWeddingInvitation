import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useToast } from '../../hooks/useToast';

interface FloatingHeartProps {
  /** Tổng số lượt thả tim (từ backend/realtime) */
  totalHearts: number;
  /** Callback khi bấm thả tim */
  onHeartClick: () => void;
  /** Đã thả tim chưa (local state) */
  hasLiked?: boolean;
  /** Vị trí */
  position?: 'bottom-right' | 'bottom-left';
  /** ClassName tùy chỉnh */
  className?: string;
}

export function FloatingHeart({
  totalHearts,
  onHeartClick,
  hasLiked = false,
  position = 'bottom-right',
  className = '',
}: FloatingHeartProps) {
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(totalHearts);
  const [localLiked, setLocalLiked] = useState(hasLiked);
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);
  const { showToast } = useToast();

  // Sync với props
  useEffect(() => {
    setCount(totalHearts);
  }, [totalHearts]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (localLiked) {
        showToast('Bạn đã thả tim rồi!');
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      setBurst({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setLocalLiked(true);
      setCount((c) => c + 1);
      onHeartClick();
      showToast('Đã gửi trái tim! 💖');
    },
    [localLiked, onHeartClick, showToast]
  );

  const positionStyles = {
    'bottom-right': 'bottom-5 right-5',
    'bottom-left': 'bottom-5 left-5',
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={localLiked}
      className={`
        fixed z-50 flex flex-col items-center gap-1 rounded-full
        bg-background/95 backdrop-blur-sm shadow-xl border
        px-4 py-2.5 transition-all duration-300
        ${positionStyles[position]}
        ${localLiked ? 'border-primary/50 text-primary' : 'border-border text-foreground hover:border-primary hover:text-primary'}
        ${className}
      `}
      aria-label={localLiked ? `Đã thả tim (${count})` : `Thả tim (${count})`}
      whileHover={!shouldReduceMotion && !localLiked ? { scale: 1.05 } : undefined}
      whileTap={!shouldReduceMotion && !localLiked ? { scale: 0.95 } : undefined}
    >
      <span className="flex items-center gap-1.5">
        <motion.span
          animate={localLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.4 }}
          className="text-2xl"
        >
          {localLiked ? '♥' : '♡'}
        </motion.span>
        <span className="font-medium tabular-nums text-sm whitespace-nowrap">{count.toLocaleString('vi-VN')}</span>
      </span>
      <span className="text-[10px] uppercase tracking-wide text-foreground-muted hidden sm:block">
        Thả tim
      </span>

      {/* Burst animation */}
      <AnimatePresence>
        {burst && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.6 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ left: `${burst.x}px`, top: `${burst.y}px` }}
          >
            <span className="text-2xl">✨</span>
            <span className="text-2xl" style={{ transform: 'rotate(60deg)' }}>✨</span>
            <span className="text-2xl" style={{ transform: 'rotate(120deg)' }}>✨</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

interface FloatingMusicProps {
  position?: 'top-right' | 'top-left';
  className?: string;
}

export function FloatingMusic({ position = 'top-right', className = '' }: FloatingMusicProps) {
  const shouldReduceMotion = useReducedMotion();
  const { isPlaying, isReady, hasError, play, pause, toggleMute } = useAudioPlayer();

  if (!isReady) return null;

  const positionStyles = {
    'top-right': 'top-5 right-5',
    'top-left': 'top-5 left-5',
  };

  return (
    <motion.button
      type="button"
      onClick={isPlaying ? pause : play}
      onContextMenu={(e) => { e.preventDefault(); toggleMute(); }}
      initial={!shouldReduceMotion ? { opacity: 0, scale: 0.8, y: 20 } : { opacity: 1 }}
      animate={!shouldReduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className={`
        fixed z-40 flex h-11 w-11 items-center justify-center rounded-full
        bg-background/90 shadow-md backdrop-blur border transition-colors
        hover:bg-background ${hasError ? 'border-red-300 text-red-400' : 'border-border text-primary'}
        ${positionStyles[position]} ${className}
      `}
      aria-label={
        hasError
          ? 'Không tìm thấy file nhạc'
          : isPlaying
            ? 'Tạm dừng nhạc (giữ để tắt tiếng)'
            : 'Phát nhạc (giữ để bật tiếng)'
      }
      title={hasError ? 'Lỗi load nhạc — xem console F12' : isPlaying ? 'Đang phát — giữ để tắt tiếng' : 'Nhạc tắt — bấm để phát'}
    >
      <span
        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
          hasError ? 'border-red-400' : 'border-primary'
        }`}
        style={isPlaying && !hasError ? { animation: 'spin 4s linear infinite' } : undefined}
      >
        <span className={`h-1 w-1 rounded-full ${hasError ? 'bg-red-400' : 'bg-primary'}`} />
      </span>
      <span className="sr-only">
        {hasError ? 'Lỗi file nhạc' : isPlaying ? 'Đang phát nhạc' : 'Nhạc đang tắt'}
      </span>
    </motion.button>
  );
}

interface FloatingWishesBarProps {
  /** Số lượng lời chúc */
  wishesCount: number;
  /** Mở form gửi lời chúc */
  onOpenWishes: () => void;
  /** Hiển thị preview lời chúc mới nhất */
  latestWish?: { name: string; message: string } | null;
  position?: 'bottom' | 'top';
  className?: string;
}

export function FloatingWishesBar({
  wishesCount,
  onOpenWishes,
  latestWish,
  position = 'bottom',
  className = '',
}: FloatingWishesBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={!shouldReduceMotion ? { opacity: 0, y: position === 'bottom' ? 100 : -100 } : { opacity: 1 }}
      animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className={`
        fixed z-40 left-1/2 -translate-x-1/2 w-full max-w-md px-4
        ${position === 'bottom' ? 'bottom-5' : 'top-5'}
        ${className}
      `}
    >
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onClickCapture={onOpenWishes}
        whileHover={!shouldReduceMotion ? { scale: 1.02 } : undefined}
        whileTap={!shouldReduceMotion ? { scale: 0.98 } : undefined}
        className={`
          w-full flex items-center gap-3 rounded-2xl
          bg-background/95 backdrop-blur-sm shadow-xl border border-border
          px-4 py-3 text-left transition-all duration-300
          hover:border-primary/50
        `}
        aria-expanded={isOpen}
        aria-label={`Lời chúc (${wishesCount}) - bấm để xem`}
      >
        <div className="flex items-center gap-2 text-primary">
          <motion.span
            animate={!shouldReduceMotion ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-2xl"
          >
            💌
          </motion.span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Sổ lưu bút</p>
            <p className="text-xs text-foreground-muted">
              {wishesCount} lời chúc {latestWish ? `· Mới: ${latestWish.name}` : ''}
            </p>
          </div>
          <span className="text-2xl text-primary">→</span>
        </div>
      </motion.button>

      {/* Preview tooltip */}
      <AnimatePresence>
        {isOpen && latestWish && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              mt-3 rounded-xl border border-border bg-background p-4 shadow-xl
              ${position === 'bottom' ? 'mb-2' : 'mt-2'}
            `}
          >
            <p className="text-sm text-foreground-muted">Lời chúc mới nhất</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">"{latestWish.message}"</p>
            <p className="mt-2 text-xs text-primary">— {latestWish.name}</p>
            <button
              type="button"
              onClick={onOpenWishes}
              className="mt-3 w-full rounded-full border border-primary px-4 py-2 text-sm text-primary hover:bg-primary hover:text-primary-contrast transition-colors"
            >
              Gửi lời chúc
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Combined floating actions bar - heart + music + wishes
 */
export function FloatingActionsBar({
  totalHearts,
  onHeartClick,
  wishesCount,
  onOpenWishes,
  latestWish,
  hasLiked,
}: {
  totalHearts: number;
  onHeartClick: () => void;
  wishesCount: number;
  onOpenWishes: () => void;
  latestWish?: { name: string; message: string } | null;
  hasLiked?: boolean;
}) {
  return (
    <>
      <FloatingHeart totalHearts={totalHearts} onHeartClick={onHeartClick} hasLiked={hasLiked} />
      <FloatingMusic />
      <FloatingWishesBar
        wishesCount={wishesCount}
        onOpenWishes={onOpenWishes}
        latestWish={latestWish}
      />
    </>
  );
}