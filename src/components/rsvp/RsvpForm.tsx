import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Reveal } from '../common/Reveal';
import { getRsvpService } from '../../services/rsvpService';
import type { RsvpConfig } from '../../types/wedding';

const schema = z.object({
  name: z.string().trim().min(2, 'Vui lòng nhập họ tên (tối thiểu 2 ký tự)'),
  attendance: z.enum(['yes', 'no'], { error: 'Vui lòng chọn một mục' }),
  guests: z
    .number({ error: 'Vui lòng nhập số người' })
    .int()
    .min(1, 'Tối thiểu 1 người')
    .max(10, 'Tối đa 10 người'),
  message: z.string().trim().max(300, 'Lời nhắn tối đa 300 ký tự').optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  config: RsvpConfig;
}

export function RsvpSection({ config }: Props) {
  const service = useMemo(() => getRsvpService(config.apiEndpoint), [config.apiEndpoint]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [resultMessage, setResultMessage] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', attendance: 'yes', guests: 1, message: '' },
  });

  if (!config.enabled) return null;

  const onSubmit = async (values: FormValues) => {
    setStatus('submitting');
    const result = await service.submit({
      name: values.name,
      attendance: values.attendance === 'yes',
      guests: values.guests,
      message: values.message ?? '',
    });
    setResultMessage(result.message);
    setStatus(result.success ? 'success' : 'error');
    if (result.success) reset();
  };

  return (
    <section className="bg-background-alt px-6 py-20 sm:py-28">
      <Reveal direction="up" className="mx-auto max-w-lg text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">RSVP</p>
        <h2 className="font-display mt-3 text-3xl text-foreground sm:text-4xl">
          Xác Nhận Tham Dự
        </h2>
        {config.deadline && (
          <p className="mt-2 text-xs text-foreground-muted">
            Vui lòng phản hồi trước {new Date(config.deadline).toLocaleDateString('vi-VN')}
          </p>
        )}
      </Reveal>

      <Reveal direction="up" delay={0.1} className="mx-auto mt-10 max-w-md">
        {status === 'success' ? (
          <div className="rounded-xl border border-border bg-background px-6 py-8 text-center">
            <p className="font-display text-xl text-primary">{resultMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label htmlFor="rsvp-name" className="block text-sm text-foreground-muted">
                Họ và tên
              </label>
              <input
                id="rsvp-name"
                type="text"
                {...register('name')}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm
                           text-foreground outline-none focus:border-primary"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
              />
              {errors.name && (
                <p id="rsvp-name-error" className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <span className="block text-sm text-foreground-muted">Bạn có thể tham dự?</span>
              <Controller
                control={control}
                name="attendance"
                render={({ field }) => (
                  <div className="mt-1.5 grid grid-cols-2 gap-3">
                    {(
                      [
                        ['yes', 'Tham dự'],
                        ['no', 'Không tham dự'],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={`rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                          field.value === value
                            ? 'border-primary bg-primary text-primary-contrast'
                            : 'border-border bg-background text-foreground hover:border-primary'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            <div>
              <label htmlFor="rsvp-guests" className="block text-sm text-foreground-muted">
                Số người tham dự
              </label>
              <input
                id="rsvp-guests"
                type="number"
                min={1}
                max={10}
                {...register('guests', { valueAsNumber: true })}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm
                           text-foreground outline-none focus:border-primary"
                aria-invalid={Boolean(errors.guests)}
              />
              {errors.guests && <p className="mt-1 text-xs text-red-500">{errors.guests.message}</p>}
            </div>

            <div>
              <label htmlFor="rsvp-message" className="block text-sm text-foreground-muted">
                Lời nhắn (không bắt buộc)
              </label>
              <textarea
                id="rsvp-message"
                rows={3}
                {...register('message')}
                className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5
                           text-sm text-foreground outline-none focus:border-primary"
              />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
            </div>

            {status === 'error' && <p className="text-sm text-red-500">{resultMessage}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-full bg-primary py-3 text-sm tracking-wide text-primary-contrast
                         transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === 'submitting' ? 'Đang gửi...' : 'Gửi Phản Hồi'}
            </button>
          </form>
        )}
      </Reveal>
    </section>
  );
}
