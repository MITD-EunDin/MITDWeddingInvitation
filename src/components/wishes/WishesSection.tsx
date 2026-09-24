import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Reveal } from '../common/Reveal';
import { getWishesService } from '../../services/wishesService';
import type { WishesConfig, WishItem } from '../../types/wedding';

const schema = z.object({
  name: z.string().trim().min(2, 'Vui lòng nhập tên'),
  message: z.string().trim().min(3, 'Lời chúc quá ngắn').max(300, 'Tối đa 300 ký tự'),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  config: WishesConfig;
}

export function WishesSection({ config }: Props) {
  const service = useMemo(
    () => getWishesService(config.apiEndpoint, config.mockData),
    [config.apiEndpoint, config.mockData],
  );
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: '', message: '' } });

  useEffect(() => {
    let active = true;
    setLoading(true);
    service.list().then((data) => {
      if (active) {
        setWishes(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [service]);

  if (!config.enabled) return null;

  const onSubmit = async (values: FormValues) => {
    const wish = await service.add(values);
    setWishes((prev) => [wish, ...prev]);
    reset();
  };

  return (
    <section className="bg-background px-6 py-20 sm:py-28">
      <Reveal direction="up">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-primary">Wishes</p>
        <h2 className="font-display mt-3 text-center text-3xl text-foreground sm:text-4xl">
          Lời Chúc Từ Mọi Người
        </h2>
      </Reveal>

      <Reveal direction="up" delay={0.1} className="mx-auto mt-10 max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <input
            type="text"
            placeholder="Tên của bạn"
            {...register('name')}
            className="w-full rounded-lg border border-border bg-background-alt px-4 py-2.5 text-sm
                       text-foreground outline-none focus:border-primary"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}

          <textarea
            rows={3}
            placeholder="Gửi lời chúc mừng đến cặp đôi..."
            {...register('message')}
            className="w-full resize-none rounded-lg border border-border bg-background-alt px-4 py-2.5
                       text-sm text-foreground outline-none focus:border-primary"
          />
          {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full border border-primary py-2.5 text-sm tracking-wide text-primary
                       transition-colors hover:bg-primary hover:text-primary-contrast disabled:opacity-60"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi Lời Chúc'}
          </button>
        </form>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {loading ? (
          <p className="col-span-full text-center text-sm text-foreground-muted">Đang tải...</p>
        ) : (
          wishes.map((wish, i) => (
            <Reveal
              key={wish.id}
              direction="up"
              delay={Math.min(i * 0.05, 0.3)}
              className="rounded-xl border border-border bg-background-alt p-5"
            >
              <p className="text-sm leading-relaxed text-foreground">{wish.message}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-primary">— {wish.name}</p>
            </Reveal>
          ))
        )}
      </div>
    </section>
  );
}
