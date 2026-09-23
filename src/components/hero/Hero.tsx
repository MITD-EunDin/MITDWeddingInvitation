import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { WeddingData } from '../../types/wedding';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

interface HeroProps {
  couple: WeddingData['couple'];
  weddingInfo: WeddingData['wedding'];
  media: WeddingData['media'];
}

export function Hero({ couple, weddingInfo, media }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const { open, isReady } = useAudioPlayer();
  const hasMusic = Boolean(media.music);
  // Nếu không có nhạc, thiệp mở luôn không cần gate
  const [gateOpen, setGateOpen] = useState(!hasMusic);

  const handleOpen = () => {
    setGateOpen(true);
    open();
  };

  return (
    <section className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {media.heroBackgroundType === 'video' && media.heroVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={media.heroVideoPoster}
            onError={(e) => {
              // fallback về ảnh nếu video lỗi
              (e.target as HTMLVideoElement).style.display = 'none';
            }}
          >
            <source src={media.heroVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            src={media.heroImage}
            alt=""
            className={`h-full w-full object-cover ${!shouldReduceMotion ? 'animate-ken-burns' : ''}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50" />
      </div>

      {/* Gate: nút mở thiệp */}
      <AnimatePresence>
        {!gateOpen && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              type="button"
              onClick={handleOpen}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-lg tracking-widest text-white border border-white/70
                         rounded-full px-8 py-3 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              MỞ THIỆP ♫
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={gateOpen ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-4 text-xs uppercase tracking-[0.3em] text-white/80"
        >
          {weddingInfo.saveTheDateText}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={gateOpen ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="font-display text-4xl leading-tight sm:text-6xl md:text-7xl"
        >
          {couple.groom.displayName}
          <span className="mx-3 text-primary sm:mx-5">&amp;</span>
          {couple.bride.displayName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={gateOpen ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-6 text-sm tracking-[0.2em] text-white/90 sm:text-base"
        >
          {weddingInfo.dateTime.displayDate}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={gateOpen ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="h-9 w-5 rounded-full border-2 border-white/70 flex justify-center pt-1.5"
        >
          <span className="h-1.5 w-1 rounded-full bg-white/90" />
        </motion.div>
      </motion.div>

      {/* an toàn: nếu isReady đã true từ trước (vd quay lại trang), đảm bảo content hiện */}
      {isReady && !gateOpen && null}
    </section>
  );
}
