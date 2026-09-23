import { wedding } from './data/wedding';
import { useEffect } from 'react';
import { applyTheme } from './theme/applyTheme';
import { AudioPlayerProvider } from './hooks/useAudioPlayer';
import { Hero } from './components/hero/Hero';
import { MusicPlayer } from './components/music/MusicPlayer';
import { WeddingDateSection } from './components/date/WeddingDateSection';
import { StorySection } from './components/story/StorySection';
import { CoupleSection } from './components/couple/CoupleSection';
import { VenueSection } from './components/venue/VenueSection';
import { ComingSoonSection } from './components/common/ComingSoonSection';

function App() {
  useEffect(() => {
    applyTheme(wedding.theme);
  }, []);

  return (
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

        {/* Giai đoạn tiếp theo: Gallery, Invitation, RSVP, Wishes, Gift, Final */}
        <ComingSoonSection name="Gallery" />
        <ComingSoonSection name="Wedding Invitation" />
        <ComingSoonSection name="RSVP" />
        <ComingSoonSection name="Wedding Wishes" />
        <ComingSoonSection name="Wedding Gift" />
        <ComingSoonSection name="Final / Thank You" />

        <MusicPlayer title={wedding.media.music?.title} />
      </div>
    </AudioPlayerProvider>
  );
}

export default App;
