import { useEffect } from 'react';
import { wedding } from './data/wedding';
import { applyTheme } from './theme/applyTheme';
import { AudioPlayerProvider } from './hooks/useAudioPlayer';
import { ToastProvider } from './hooks/useToast';
import { Hero } from './components/hero/Hero';
import { MusicPlayer } from './components/music/MusicPlayer';
import { StorySection } from './components/story/StorySection';
import { CoupleSection } from './components/couple/CoupleSection';
import { WeddingDateSection } from './components/date/WeddingDateSection';
import { VenueSection } from './components/venue/VenueSection';
import { GallerySection } from './components/gallery/GallerySection';
import { InvitationSection } from './components/invitation/InvitationSection';
import { RsvpSection } from './components/rsvp/RsvpForm';
import { WishesSection } from './components/wishes/WishesSection';
import { GiftSection } from './components/gift/GiftSection';
import { FinalSection } from './components/final/FinalSection';

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
          <WishesSection config={wedding.wishes} />
          <GiftSection gift={wedding.gift} />
          <FinalSection
            groom={wedding.couple.groom}
            bride={wedding.couple.bride}
            dateTime={wedding.wedding.dateTime}
            backgroundImage={wedding.seo.ogImage}
          />

          <MusicPlayer title={wedding.media.music?.title} />
        </div>
      </AudioPlayerProvider>
    </ToastProvider>
  );
}

export default App;
