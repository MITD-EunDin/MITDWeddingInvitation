import { motion } from 'framer-motion';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

/**
 * Nút nhạc cố định góc màn hình. Chỉ hiện sau khi thiệp đã "mở" (isReady).
 * Không tự động phát trước tương tác người dùng — tránh bị mobile browser chặn autoplay.
 */
export function MusicPlayer({ title }: { title?: string }) {
  const { isPlaying, isReady, play, pause } = useAudioPlayer();

  if (!isReady) return null;

  return (
    <motion.button
      type="button"
      onClick={isPlaying ? pause : play}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      aria-label={isPlaying ? `Tạm dừng nhạc: ${title ?? ''}` : `Phát nhạc: ${title ?? ''}`}
      className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full
                 bg-background/90 text-primary shadow-md backdrop-blur border border-border
                 hover:bg-background transition-colors"
    >
      <span
        className={`h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center ${
          isPlaying ? 'animate-spin-slow' : ''
        }`}
        style={isPlaying ? { animation: 'spin 4s linear infinite' } : undefined}
      >
        <span className="h-1 w-1 rounded-full bg-primary" />
      </span>
      <span className="sr-only">{isPlaying ? 'Đang phát nhạc' : 'Nhạc đang tắt'}</span>
    </motion.button>
  );
}
