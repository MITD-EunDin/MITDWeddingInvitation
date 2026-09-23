import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isReady: boolean; // đã từng được user "mở" (tương tác lần đầu)
  hasError: boolean; // không tìm thấy/không phát được file nào trong danh sách src
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  /** Gọi khi user bấm "MỞ THIỆP ♫" — mở nội dung + cố gắng phát nhạc */
  open: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerState | null>(null);

/** Đoán MIME type từ đuôi file để browser chọn source phù hợp. */
function mimeTypeFor(src: string): string | undefined {
  const ext = src.split('.').pop()?.toLowerCase().split('?')[0];
  switch (ext) {
    case 'mp3':
      return 'audio/mpeg';
    case 'm4a':
      return 'audio/mp4';
    case 'mp4':
      return 'audio/mp4';
    case 'aac':
      return 'audio/aac';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
    case 'oga':
      return 'audio/ogg';
    case 'flac':
      return 'audio/flac';
    default:
      return undefined;
  }
}

export function AudioPlayerProvider({
  src,
  autoStartOnOpen,
  children,
}: {
  src?: string | string[];
  autoStartOnOpen: boolean;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const sources = useMemo(() => (Array.isArray(src) ? src : src ? [src] : []), [src]);

  useEffect(() => {
    setHasError(false);
    setIsPlaying(false);
  }, [sources]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || sources.length === 0) return;
    audio.play().then(
      () => setIsPlaying(true),
      (err) => {
        // Không autoplay được (chính sách browser) hoặc file lỗi.
        // Không throw để tránh crash UI — chỉ log để debug.
        setIsPlaying(false);
        console.warn(
          '[MusicPlayer] Không thể phát nhạc. Nếu vừa mới thêm file, kiểm tra lại: ' +
            '(1) đường dẫn trong wedding.ts có khớp CHÍNH XÁC tên file trong public/assets/audio (phân biệt hoa/thường), ' +
            '(2) file có thật sự nằm trong public/assets/audio, ' +
            '(3) định dạng file có được browser hỗ trợ. Chi tiết lỗi:',
          err,
        );
      },
    );
  }, [sources]);

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
    if (sources.length > 0 && autoStartOnOpen) {
      play();
    }
  }, [sources, autoStartOnOpen, play]);

  const handleAllSourcesFailed = useCallback(() => {
    setHasError(true);
    setIsPlaying(false);
    console.error(
      '[MusicPlayer] Không load được file nhạc nào trong danh sách:',
      sources,
      '— hãy kiểm tra file có tồn tại đúng đường dẫn trong thư mục public/assets/audio và tên/đuôi file khớp với wedding.ts.',
    );
  }, [sources]);

  return (
    <AudioPlayerContext.Provider
      value={{ isPlaying, isMuted, isReady, hasError, play, pause, toggleMute, open }}
    >
      {sources.length > 0 && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio
          ref={audioRef}
          loop
          preload="auto"
          className="hidden"
          onError={handleAllSourcesFailed}
        >
          {sources.map((s) => (
            <source key={s} src={s} type={mimeTypeFor(s)} />
          ))}
        </audio>
      )}
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}
