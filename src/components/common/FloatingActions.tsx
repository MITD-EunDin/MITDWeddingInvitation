import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useToast } from '../../hooks/useToast';
import { HeartIcon, MusicIcon, SparklesIcon } from './Icons';

interface FloatingHeartProps {
  /** Tổng số lượt thả tim */
  totalHearts?: number;
  /** Callback khi bấm thả tim */
  onHeartClick?: () => void;
  /** Đã thả tim chưa */
  hasLiked?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export function FloatingHeart({
  totalHearts = 99,
  onHeartClick,
  hasLiked = false,
  position = 'bottom-right',
  className = '',
}: FloatingHeartProps) {
  const shouldReduceMotion = useReducedMotion();
  const [likesAdded, setLikesAdded] = useState(0);
  const [localLiked, setLocalLiked] = useState(hasLiked);
  const [burst, setBurst] = useState<boolean>(false);
  const { showToast } = useToast();

  const count = totalHearts + likesAdded;

  const handleClick = useCallback(() => {
    if (localLiked) {
      showToast('Bạn đã gửi tim chúc phúc rồi!');
      return;
    }

    setBurst(true);
    setLocalLiked(true);
    setLikesAdded((c) => c + 1);
    if (onHeartClick) onHeartClick();
    showToast('Cảm ơn bạn đã gửi trái tim chúc phúc! 💖');

    setTimeout(() => setBurst(false), 1200);
  }, [localLiked, onHeartClick, showToast]);

  const positionStyles = {
    'bottom-right': 'bottom-6 right-5',
    'bottom-left': 'bottom-6 left-5',
  };

  return (
    <div className={`fixed z-40 ${positionStyles[position]} ${className}`}>
      <motion.button
        type="button"
        onClick={handleClick}
        className={`
          flex items-center gap-2 rounded-full
          bg-background/95 backdrop-blur-md shadow-xl border
          px-4 py-2.5 transition-all duration-300 min-h-[44px] cursor-pointer
          ${localLiked ? 'border-primary/60 text-primary shadow-primary/20' : 'border-border text-foreground hover:border-primary hover:text-primary'}
        `}
        aria-label={localLiked ? `Đã thả tim (${count})` : `Thả tim chúc phúc (${count})`}
        whileHover={!shouldReduceMotion ? { scale: 1.05 } : undefined}
        whileTap={!shouldReduceMotion ? { scale: 0.95 } : undefined}
      >
        <span className="relative flex items-center justify-center">
          <HeartIcon
            filled={localLiked}
            className={`w-5 h-5 transition-transform duration-300 ${localLiked ? 'text-primary scale-110' : 'text-primary/70'}`}
          />
        </span>
        <span className="font-medium tabular-nums text-xs sm:text-sm">
          {count.toLocaleString('vi-VN')}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-foreground-muted hidden sm:inline">
          Chúc phúc
        </span>
      </motion.button>

      {/* Floating Sparkle Burst */}
      <AnimatePresence>
        {burst && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -45, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1 text-primary"
          >
            <SparklesIcon className="w-5 h-5" />
            <HeartIcon filled className="w-4 h-4 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FloatingMusicProps {
  position?: 'top-right' | 'top-left';
  className?: string;
}

export function FloatingMusic({ position = 'top-right', className = '' }: FloatingMusicProps) {
  const shouldReduceMotion = useReducedMotion();
  const { isPlaying, isReady, hasError, play, pause } = useAudioPlayer();

  if (!isReady) return null;

  const positionStyles = {
    'top-right': 'top-5 right-5',
    'top-left': 'top-5 left-5',
  };

  return (
    <motion.button
      type="button"
      onClick={isPlaying ? pause : play}
      initial={!shouldReduceMotion ? { opacity: 0, scale: 0.8 } : { opacity: 1 }}
      animate={!shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      whileHover={!shouldReduceMotion ? { scale: 1.08 } : undefined}
      whileTap={!shouldReduceMotion ? { scale: 0.92 } : undefined}
      className={`
        fixed z-40 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full
        bg-background/95 shadow-xl backdrop-blur-md border transition-all duration-300 min-h-[44px] min-w-[44px] cursor-pointer
        hover:shadow-primary/20 ${hasError ? 'border-red-300 text-red-500' : 'border-primary/40 text-primary'}
        ${positionStyles[position]} ${className}
      `}
      aria-label={
        hasError
          ? 'Không tìm thấy file nhạc'
          : isPlaying
            ? 'Tạm dừng nhạc nền'
            : 'Phát nhạc nền hôn lễ'
      }
      title={hasError ? 'Lỗi tải nhạc' : isPlaying ? 'Bấm để tắt nhạc' : 'Bấm để bật nhạc'}
    >
      <div className={`relative flex items-center justify-center ${isPlaying && !hasError ? 'animate-spin-slow' : ''}`}>
        <MusicIcon isPlaying={isPlaying} className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </motion.button>
  );
}
