import { motion } from 'framer-motion';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

/**
 * Nút nhạc cố định góc màn hình. Chỉ hiện sau khi thiệp đã "mở" (isReady).
 * Không tự động phát trước tương tác người dùng — tránh bị mobile browser chặn autoplay.
 */
export function MusicPlayer({ title }: { title?: string }) {
  const { isPlaying, isReady, hasError, play, pause } = useAudioPlayer();

  if (!isReady) return null;

  return (
    <motion.button
      type="button"
      onClick={isPlaying ? pause : play}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      aria-label={
        hasError
          ? 'Không tìm thấy file nhạc'
          : isPlaying
            ? `Tạm dừng nhạc: ${title ?? ''}`
            : `Phát nhạc: ${title ?? ''}`
      }
      title={hasError ? 'Không load được file nhạc — kiểm tra console (F12) để xem chi tiết' : undefined}
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full
                 bg-background/90 shadow-md backdrop-blur border transition-colors
                 hover:bg-background ${hasError ? 'border-red-300 text-red-400' : 'border-border text-primary'}`}
    >
      <span
        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
          hasError ? 'border-red-400' : 'border-primary'
        }`}
        style={isPlaying && !hasError ? { animation: 'spin 4s linear infinite' } : undefined}
      >
        <span className={`h-1 w-1 rounded-full ${hasError ? 'bg-red-400' : 'bg-primary'}`} />
      </span>
      <span className="sr-only">
        {hasError ? 'Lỗi file nhạc' : isPlaying ? 'Đang phát nhạc' : 'Nhạc đang tắt'}
      </span>
    </motion.button>
  );
}
