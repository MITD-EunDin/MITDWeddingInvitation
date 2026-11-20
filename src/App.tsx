import { useEffect } from 'react';
import { wedding } from './data/wedding';
import { applyTheme } from './theme/applyTheme';
import { AudioPlayerProvider } from './hooks/useAudioPlayer';
import { ToastProvider } from './hooks/useToast';
import { Hero } from './components/hero/Hero';
import { InvitationSection } from './components/invitation/InvitationSection';
import { CoupleSection } from './components/couple/CoupleSection';
import { WeddingDateSection } from './components/date/WeddingDateSection';
import { VenueSection } from './components/venue/VenueSection';
import { StorySection } from './components/story/StorySection';
import { GallerySection } from './components/gallery/GallerySection';
import { WishesSection } from './components/wishes/WishesSection';
import { RsvpSection } from './components/rsvp/RsvpForm';
import { GiftSection } from './components/gift/GiftSection';
import { FinalSection } from './components/final/FinalSection';
import { Particles, FallingHearts } from './components/common/Particles';
import { FloatingMusic, FloatingHeart, FloatingQuickLinks } from './components/common/FloatingActions';

function App() {
  useEffect(() => {
    applyTheme(wedding.theme);
  }, []);

  return (
    <ToastProvider>
      <AudioPlayerProvider
        src={wedding.media.music?.src}
        autoStartOnOpen={wedding.media.music?.autoStartOnOpen ?? false}
      >
        <div className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-primary/20 selection:text-foreground">
          {/* Falling hearts background - subtle & romantic */}
          <FallingHearts
            count={14}
            colors={['#E8B4B4', '#CCA46E', '#F5D0D0', '#D4A5A5', '#E6C280']}
            className="fixed inset-0 z-30 pointer-events-none"
          />

          {/* Canvas sparkling ambient particles */}
          <Particles
            count={6}
            primaryColor={wedding.theme.colors.primary}
            secondaryColor={wedding.theme.colors.secondary}
            className="fixed inset-0 z-10 pointer-events-none"
          />

          {/* 1. Hero Cover with Interactive Wax-Seal Royal Envelope */}
          <Hero couple={wedding.couple} weddingInfo={wedding.wedding} media={wedding.media} />

          {/* 2. Official Wedding Invitation Card (Trân Trọng Kính Mời) */}
          <InvitationSection
            invitation={wedding.invitation}
            groom={wedding.couple.groom}
            bride={wedding.couple.bride}
            dateTime={wedding.wedding.dateTime}
          />

          {/* 3. The Couple (Cô Dâu & Chú Rể) */}
          <CoupleSection groom={wedding.couple.groom} bride={wedding.couple.bride} />

          {/* 4. Wedding Date, Calendar & Countdown */}
          <WeddingDateSection dateTime={wedding.wedding.dateTime} />

          {/* 5. Venue & Wedding Day Schedule */}
          <VenueSection venue={wedding.venue} dateTime={wedding.wedding.dateTime} />

          {/* 6. Love Story Timeline */}
          <StorySection items={wedding.story} />

          {/* 7. Photo Gallery with Lightbox */}
          <GallerySection images={wedding.gallery} />

          {/* 8. Real-time Wedding Guestbook / Wishes */}
          <WishesSection config={wedding.wishes} />

          {/* 9. RSVP Response Form */}
          <RsvpSection config={wedding.rsvp} />

          {/* 10. Wedding Registry & Gift Box */}
          <GiftSection gift={wedding.gift} />

          {/* 11. Final Gratitude & Signature */}
          <FinalSection
            groom={wedding.couple.groom}
            bride={wedding.couple.bride}
            dateTime={wedding.wedding.dateTime}
            backgroundImage={wedding.seo.ogImage}
          />

          {/* Floating Controls: Music Player & Love Heart Tap */}
          <FloatingMusic position="top-right" />
          <FloatingHeart position="bottom-right" totalHearts={128} />
          <FloatingQuickLinks />
        </div>
      </AudioPlayerProvider>
    </ToastProvider>
  );
}

export default App;
