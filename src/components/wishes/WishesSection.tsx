import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Reveal } from '../common/Reveal';
import { getRealtimeWishesService } from '../../services/realtime';
import type { WishesConfig, WishItem } from '../../types/wedding';
import { BookHeartIcon, FloralDivider, HeartIcon, SparklesIcon } from '../common/Icons';

const schema = z.object({
  name: z.string().trim().min(2, 'Vui lòng nhập tên của bạn'),
  message: z.string().trim().min(3, 'Lời chúc quá ngắn').max(300, 'Tối đa 300 ký tự'),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  config: WishesConfig;
}

const QUICK_WISHES = [
  'Chúc hai bạn trăm năm hạnh phúc, răng long đầu bạc! 💖',
  'Chúc mừng tân lang tân nương, mãi yêu thương ngọt ngào! 💍',
  'Chúc hai bạn sớm đón thiên thần nhỏ nhé! 👶',
  'Hạnh phúc viên mãn, vạn sự như ý! ✨',
];

export function WishesSection({ config }: Props) {
  const [service, setService] = useState<Awaited<ReturnType<typeof getRealtimeWishesService>> | null>(null);
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: '', message: '' } });

  // Initialize real-time service
  useEffect(() => {
    let active = true;
    getRealtimeWishesService(config.mockData).then((s) => {
      if (active) setService(s);
    });
    return () => {
      active = false;
    };
  }, [config.mockData]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!service) return;
    const unsubscribe = service.subscribe((data) => {
      setWishes(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [service]);

  if (!config.enabled) return null;

  const onSubmit = async (values: FormValues) => {
    if (!service) return;
    const wish = await service.add(values);
    // Optimistic update
    setWishes((prev) => [wish, ...prev.filter((w) => w.id !== wish.id)]);
    reset();
  };

  const handleQuickWish = (wishText: string) => {
    setValue('message', wishText, { shouldValidate: true });
  };

  return (
    <section id="wishes-section" className="relative bg-background px-4 py-20 sm:px-6 sm:py-28 overflow-hidden">
      <Reveal direction="up">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
            Wedding Guestbook
          </p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground">
            Sổ Lưu Bút &amp; Lời Chúc
          </h2>
          <FloralDivider className="w-40 h-5 text-primary/60 mx-auto mt-3" />
          <p className="mt-2 text-center text-xs sm:text-sm text-foreground-muted font-light">
            Gửi gắm những tình cảm và lời chúc phúc chân thành nhất đến cô dâu & chú rể
          </p>
        </div>
      </Reveal>

      {/* Guestbook Form Card */}
      <Reveal direction="up" delay={0.1} className="mx-auto mt-10 max-w-lg">
        <div className="rounded-2xl border border-border/80 bg-background-alt p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-2 text-primary pb-3 border-b border-border/60">
            <BookHeartIcon className="w-5 h-5" />
            <h3 className="font-display text-lg sm:text-xl text-foreground font-medium uppercase tracking-wide">
              Gửi Lời Chúc Mừng
            </h3>
          </div>

          {/* Quick Wishes Chips */}
          <div className="mt-4">
            <p className="text-xs text-foreground-muted mb-2 font-medium">Gợi ý lời chúc nhanh:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_WISHES.map((quick, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickWish(quick)}
                  className="rounded-full border border-primary/30 bg-background px-3 py-1.5 text-xs text-foreground-muted transition-colors hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer text-left"
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
            <div>
              <label htmlFor="wish-name" className="block text-xs font-medium text-foreground-muted mb-1">
                Tên của bạn <span className="text-primary">*</span>
              </label>
              <input
                id="wish-name"
                type="text"
                placeholder="Nhập tên của bạn hoặc gia đình..."
                {...register('name')}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="wish-message" className="block text-xs font-medium text-foreground-muted mb-1">
                Lời chúc <span className="text-primary">*</span>
              </label>
              <textarea
                id="wish-message"
                rows={3}
                placeholder="Viết lời chúc mừng đến cô dâu & chú rể..."
                {...register('message')}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs uppercase tracking-widest text-primary-contrast transition-all duration-300 hover:bg-[#9F7A48] hover:shadow-md disabled:opacity-60 cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang gửi lời chúc...' : 'Gửi Lời Chúc Phúc'}</span>
            </button>
          </form>
        </div>
      </Reveal>

      {/* Wishes List Cards */}
      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {loading ? (
          <div className="col-span-full py-8 text-center text-sm text-foreground-muted">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-2 text-xs">Đang tải sổ lưu bút...</p>
          </div>
        ) : wishes.length === 0 ? (
          <p className="col-span-full text-center text-sm text-foreground-muted italic py-6">
            Chưa có lời chúc nào. Hãy là người đầu tiên gửi trao lời chúc phúc!
          </p>
        ) : (
          wishes.map((wish, i) => (
            <Reveal
              key={wish.id}
              direction="up"
              delay={Math.min(i * 0.05, 0.25)}
              className="rounded-2xl border border-border/80 bg-background-alt p-5 shadow-sm transition-shadow hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-primary mb-2">
                  <span className="font-display font-medium text-base text-foreground">
                    {wish.name}
                  </span>
                  <HeartIcon filled className="w-4 h-4 text-primary/70" />
                </div>
                <p className="text-sm leading-relaxed text-foreground-muted font-light italic">
                  "{wish.message}"
                </p>
              </div>
              <time className="mt-4 block text-[11px] text-foreground-muted/70 pt-2 border-t border-border/40">
                {new Date(wish.createdAt).toLocaleDateString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </Reveal>
          ))
        )}
      </div>
    </section>
  );
}
