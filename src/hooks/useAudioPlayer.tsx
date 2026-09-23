import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isReady: boolean; // đã từng được user "mở" (tương tác lần đầu)
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  /** Gọi khi user bấm "MỞ THIỆP ♫" — mở nội dung + cố gắng phát nhạc */
  open: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerState | null>(null);

export function AudioPlayerProvider({
  src,
  autoStartOnOpen,
  children,
}: {
  src?: string;
  autoStartOnOpen: boolean;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  const play = useCallback(() => {
    // Chỉ phát khi có audio và trình duyệt cho phép (đã có tương tác người dùng)
    audioRef.current?.play().then(
      () => setIsPlaying(true),
      () => setIsPlaying(false), // browser chặn -> im lặng bỏ qua, user có thể bấm play tay
    );
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  }, []);

  const open = useCallback(() => {
    setIsReady(true);
    if (src && autoStartOnOpen) {
      play();
    }
  }, [src, autoStartOnOpen, play]);

  return (
    <AudioPlayerContext.Provider value={{ isPlaying, isMuted, isReady, play, pause, toggleMute, open }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}
