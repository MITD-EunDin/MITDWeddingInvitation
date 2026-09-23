import { wedding } from './data/wedding';
import { useEffect } from 'react';
import { applyTheme } from './theme/applyTheme';
import { AudioPlayerProvider } from './hooks/useAudioPlayer';
import { Hero } from './components/hero/Hero';
import { MusicPlayer } from './components/music/MusicPlayer';
import { WeddingDateSection } from './components/date/WeddingDateSection';
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

        {/* Giai đoạn tiếp theo: Our Story, Couple, Venue, Gallery, Invitation, RSVP, Wishes, Gift, Final */}
        <ComingSoonSection name="Our Story" />
        <ComingSoonSection name="Couple (Bride & Groom)" />

        <WeddingDateSection dateTime={wedding.wedding.dateTime} />

        <ComingSoonSection name="Wedding Venue" />
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
