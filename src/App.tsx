import { useEffect } from 'react';
import { wedding } from './data/wedding';
import { applyTheme } from './theme/applyTheme';
import { AudioPlayerProvider } from './hooks/useAudioPlayer';
import { ToastProvider } from './hooks/useToast';
import { Hero } from './components/hero/Hero';
import { StorySection } from './components/story/StorySection';
import { CoupleSection } from './components/couple/CoupleSection';
import { WeddingDateSection } from './components/date/WeddingDateSection';
import { VenueSection } from './components/venue/VenueSection';
import { GallerySection } from './components/gallery/GallerySection';
import { InvitationSection } from './components/invitation/InvitationSection';
import { RsvpSection } from './components/rsvp/RsvpForm';
import { GiftSection } from './components/gift/GiftSection';
import { FinalSection } from './components/final/FinalSection';
import { Particles } from './components/common/Particles';
import { FloatingMusic } from './components/common/FloatingActions';
import { FallingHearts } from './components/common/Particles';

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
        <div className="font-body text-foreground">
          {/* Falling hearts background - full screen, top to bottom */}
          <FallingHearts
            count={20}
            colors={['#E8B4B4', '#B99364', '#F5D0D0', '#D4A5A5', '#FFB6C1', '#FFA0A0']}
            className="fixed inset-0 z-50 pointer-events-none"
          />

          {/* Subtle particles for extra atmosphere */}
          <Particles
            count={8}
            primaryColor={wedding.theme.colors.primary}
            secondaryColor={wedding.theme.colors.secondary}
            className="fixed inset-0 z-10 pointer-events-none"
          />

          <Hero couple={wedding.couple} weddingInfo={wedding.wedding} media={wedding.media} />

          <StorySection items={wedding.story} />
          <CoupleSection groom={wedding.couple.groom} bride={wedding.couple.bride} />
          <WeddingDateSection dateTime={wedding.wedding.dateTime} />
          <VenueSection venue={wedding.venue} dateTime={wedding.wedding.dateTime} />
          <GallerySection images={wedding.gallery} />
          <InvitationSection
            invitation={wedding.invitation}
            groom={wedding.couple.groom}
            bride={wedding.couple.bride}
            dateTime={wedding.wedding.dateTime}
          />
          <RsvpSection config={wedding.rsvp} />
          <GiftSection gift={wedding.gift} />
          <FinalSection
            groom={wedding.couple.groom}
            bride={wedding.couple.bride}
            dateTime={wedding.wedding.dateTime}
            backgroundImage={wedding.seo.ogImage}
          />

          {/* Floating music control only */}
          <FloatingMusic position="top-right" />
        </div>
      </AudioPlayerProvider>
    </ToastProvider>
  );
}

export default App;
