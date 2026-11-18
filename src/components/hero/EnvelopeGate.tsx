import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DoubleHappinessIcon, SparklesIcon } from '../common/Icons';

interface EnvelopeGateProps {
  groomName: string;
  brideName: string;
  displayDate: string;
  onOpen: () => void;
}

export function EnvelopeGate({ groomName, brideName, displayDate, onOpen }: EnvelopeGateProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    // Allow animation to play briefly before revealing the full invitation
    setTimeout(() => {
      onOpen();
    }, shouldReduceMotion ? 100 : 700);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4 py-8 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Envelope Container */}
      <motion.div
        className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[4/3] sm:aspect-[16/11] rounded-2xl p-1 bg-gradient-to-br from-[#DFBA73] via-[#B88E56] to-[#8C6430] shadow-2xl"
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Envelope Paper Body */}
        <div className="relative w-full h-full bg-[#FAF6F0] rounded-[14px] overflow-hidden flex flex-col justify-between p-6 sm:p-8 text-center border border-[#E8DCB8]/60 shadow-inner">
          {/* Decorative Corner Borders */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/40 rounded-bl pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br pointer-events-none" />

          {/* Top Envelope Header */}
          <div className="relative z-10 pt-2">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-primary font-medium">
              Wedding Invitation
            </p>
            <div className="mx-auto mt-2 h-px w-16 bg-primary/30" />
          </div>

          {/* Envelope Center (Couple Names & Ceremony info) */}
          <div className="relative z-10 my-auto py-2">
            <h2 className="font-script text-3xl sm:text-4xl md:text-5xl text-[#2C221E] tracking-wide">
              {groomName} <span className="text-primary font-serif">&amp;</span> {brideName}
            </h2>
            <p className="font-display text-sm sm:text-base text-foreground-muted tracking-widest uppercase mt-2">
              Trân Trọng Kính Mời
            </p>
            <p className="text-xs text-foreground-muted mt-1 tracking-wider">
              {displayDate}
            </p>
          </div>

          {/* Wax Seal Button (Interactive CTA) */}
          <div className="relative z-20 pb-1 flex flex-col items-center">
            {/* Silk ribbon line */}
            <div className="absolute top-[-24px] w-full h-[3px] bg-gradient-to-r from-transparent via-[#8B2635]/30 to-transparent" />

            <motion.button
              type="button"
              onClick={handleOpenClick}
              disabled={isOpening}
              whileHover={!shouldReduceMotion ? { scale: 1.06 } : undefined}
              whileTap={!shouldReduceMotion ? { scale: 0.95 } : undefined}
              className="group relative flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 rounded-full"
              aria-label="Chạm để mở thiệp cưới và phát nhạc"
            >
              {/* Embossed Wax Seal Badge */}
              <div
                className={`
                  relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-seal-gradient shadow-xl
                  flex items-center justify-center border-2 border-[#D4A86A]
                  ${isOpening ? 'scale-110' : 'animate-seal-pulse'}
                `}
              >
                {/* Outer wax drip effect */}
                <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none" />
                {/* Gold Double Happiness or Monogram */}
                <DoubleHappinessIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#F5D0A9] drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
              </div>

              {/* Hint Text */}
              <div className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 border border-primary/30 shadow-sm backdrop-blur-sm">
                <SparklesIcon className="w-3.5 h-3.5 text-primary animate-spin-slow" />
                <span className="text-xs font-medium text-[#2C221E] tracking-wider uppercase">
                  {isOpening ? 'Đang mở thiệp...' : 'Chạm mở thiệp ♫'}
                </span>
                <SparklesIcon className="w-3.5 h-3.5 text-primary animate-spin-slow" />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
