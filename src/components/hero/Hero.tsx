import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { WeddingData } from '../../types/wedding';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { EnvelopeGate } from './EnvelopeGate';
import { FloralDivider, WeddingRingsIcon } from '../common/Icons';

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
    <section className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {media.heroBackgroundType === 'video' && media.heroVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={media.heroVideoPoster}
            onError={(e) => {
              (e.target as HTMLVideoElement).style.display = 'none';
            }}
          >
            <source src={media.heroVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            src={media.heroImage}
            alt={`${couple.groom.displayName} & ${couple.bride.displayName}`}
            className={`h-full w-full object-cover ${!shouldReduceMotion ? 'animate-ken-burns' : ''}`}
          />
        )}
        {/* Soft Vignette Overlay for Luxury Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
      </div>

      {/* Royal Interactive Envelope Gate */}
      <AnimatePresence>
        {!gateOpen && (
          <EnvelopeGate
            groomName={couple.groom.displayName}
            brideName={couple.bride.displayName}
            displayDate={weddingInfo.dateTime.displayDate}
            onOpen={handleOpen}
          />
        )}
      </AnimatePresence>

      {/* Hero Content with Arch Frame */}
      <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center text-white max-w-3xl mx-auto">
        {/* Save The Date Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={gateOpen ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm mb-6"
        >
          <WeddingRingsIcon className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-[0.3em] text-white/90 font-medium">
            {weddingInfo.saveTheDateText}
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={gateOpen ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="font-script text-3xl sm:text-4xl text-[#F5D0A9] mb-3 drop-shadow-md"
        >
          {weddingInfo.tagline}
        </motion.p>

        {/* Couple Main Names */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={gateOpen ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-normal leading-tight tracking-wide drop-shadow-lg text-white"
        >
          {couple.groom.displayName}
          <span className="mx-3 text-primary font-serif font-light text-3xl sm:text-5xl md:text-6xl">
            &amp;
          </span>
          {couple.bride.displayName}
        </motion.h1>

        {/* Floral Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={gateOpen ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="w-48 text-primary my-4"
        >
          <FloralDivider className="w-44 h-5 text-[#E6C280] mx-auto" />
        </motion.div>

        {/* Wedding Date & Time */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={gateOpen ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="space-y-1 text-white/95"
        >
          <p className="font-display text-lg sm:text-xl tracking-[0.15em] font-medium uppercase">
            {weddingInfo.dateTime.displayDate}
          </p>
          <p className="text-sm tracking-widest text-[#E6C280] font-light">
            {weddingInfo.dateTime.displayTime}
          </p>
        </motion.div>

        {/* Action Button: Lướt xem thiệp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={gateOpen ? { opacity: 1 } : {}}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="mt-10"
        >
          <a
            href="#invitation-card"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6C280]/60 bg-black/40 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-[#F5D0A9] backdrop-blur-sm transition-all duration-300 hover:bg-[#B88E56] hover:text-white hover:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>Xem Thiệp Mời</span>
            <span aria-hidden="true" className="text-sm">↓</span>
          </a>
        </motion.div>
      </div>

      {/* Floating Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={gateOpen ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="h-8 w-5 rounded-full border-2 border-white/60 flex justify-center pt-1"
        >
          <span className="h-1.5 w-1 rounded-full bg-[#E6C280]" />
        </motion.div>
      </motion.div>

      {/* Helper to keep state safe if reloaded */}
      {isReady && !gateOpen && null}
    </section>
  );
}
