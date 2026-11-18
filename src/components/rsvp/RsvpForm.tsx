import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Reveal } from '../common/Reveal';
import { getRsvpService } from '../../services/rsvpService';
import type { RsvpConfig } from '../../types/wedding';
import { FloralDivider, EnvelopeIcon, CheckIcon, SparklesIcon } from '../common/Icons';

const schema = z.object({
  name: z.string().trim().min(2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)'),
  attendance: z.enum(['yes', 'no'], { error: 'Vui lòng chọn xác nhận tham dự' }),
  guests: z
    .number({ error: 'Vui lòng chọn số người tham dự' })
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
    <section id="rsvp-section" className="relative bg-background-alt px-4 py-20 sm:px-6 sm:py-28 overflow-hidden">
      <Reveal direction="up" className="mx-auto max-w-lg text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
          R.S.V.P
        </p>
        <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground">
          Xác Nhận Tham Dự
        </h2>
        <FloralDivider className="w-40 h-5 text-primary/60 mx-auto mt-3" />
        {config.deadline && (
          <p className="mt-2 text-xs sm:text-sm text-foreground-muted">
            Vui lòng gửi phản hồi trước{' '}
            <span className="font-medium text-primary">
              {new Date(config.deadline).toLocaleDateString('vi-VN')}
            </span>{' '}
            để gia đình chuẩn bị chu đáo nhất.
          </p>
        )}
      </Reveal>

      <Reveal direction="up" delay={0.1} className="mx-auto mt-10 max-w-md">
        {status === 'success' ? (
          <div className="rounded-2xl border border-primary/40 bg-background p-8 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
              <CheckIcon className="w-7 h-7" />
            </div>
            <h3 className="font-display text-2xl text-foreground font-medium">
              Gửi Xác Nhận Thành Công!
            </h3>
            <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
              {resultMessage || 'Cảm ơn quý khách đã phản hồi. Sự hiện diện của quý khách là niềm vinh hạnh của gia đình!'}
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-primary px-6 py-2 text-xs uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-contrast transition-colors"
            >
              Gửi phản hồi khác
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/80 bg-background p-6 sm:p-8 shadow-lg">
            <div className="flex items-center gap-2 text-primary pb-3 border-b border-border/60 mb-5">
              <EnvelopeIcon className="w-5 h-5" />
              <h3 className="font-display text-lg text-foreground font-medium uppercase tracking-wide">
                Phiếu Phản Hồi Hôn Lễ
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="rsvp-name" className="block text-xs font-medium text-foreground-muted mb-1">
                  Họ và tên của bạn <span className="text-primary">*</span>
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  placeholder="Vd: Nguyễn Văn A & Gia đình"
                  {...register('name')}
                  className="w-full rounded-xl border border-border bg-background-alt px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* Attendance */}
              <div>
                <span className="block text-xs font-medium text-foreground-muted mb-1.5">
                  Bạn có thể tham dự? <span className="text-primary">*</span>
                </span>
                <Controller
                  control={control}
                  name="attendance"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => field.onChange('yes')}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 px-3 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                          field.value === 'yes'
                            ? 'border-primary bg-primary text-primary-contrast shadow-sm'
                            : 'border-border bg-background-alt text-foreground hover:border-primary/60'
                        }`}
                      >
                        <SparklesIcon className="w-3.5 h-3.5" />
                        <span>Chắc chắn tham dự</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => field.onChange('no')}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 px-3 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                          field.value === 'no'
                            ? 'border-primary bg-primary text-primary-contrast shadow-sm'
                            : 'border-border bg-background-alt text-foreground hover:border-primary/60'
                        }`}
                      >
                        <span>Rất tiếc vắng mặt</span>
                      </button>
                    </div>
                  )}
                />
              </div>

              {/* Guests Count */}
              <div>
                <label htmlFor="rsvp-guests" className="block text-xs font-medium text-foreground-muted mb-1.5">
                  Số người tham dự
                </label>
                <Controller
                  control={control}
                  name="guests"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => field.onChange(num)}
                          className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                            field.value === num
                              ? 'border-primary bg-primary text-primary-contrast'
                              : 'border-border bg-background-alt text-foreground hover:border-primary'
                          }`}
                        >
                          {num === 4 ? '4+ người' : `${num} người`}
                        </button>
                      ))}
                    </div>
                  )}
                />
                {errors.guests && <p className="mt-1 text-xs text-red-500">{errors.guests.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="rsvp-message" className="block text-xs font-medium text-foreground-muted mb-1">
                  Gửi gắm lời nhắn (không bắt buộc)
                </label>
                <textarea
                  id="rsvp-message"
                  rows={3}
                  placeholder="Lời nhắn gửi tới cô dâu chú rể..."
                  {...register('message')}
                  className="w-full resize-none rounded-xl border border-border bg-background-alt px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-500 text-center font-medium">{resultMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs uppercase tracking-widest text-primary-contrast transition-all duration-300 hover:bg-[#9F7A48] hover:shadow-lg disabled:opacity-60 cursor-pointer"
              >
                <span>{status === 'submitting' ? 'Đang gửi...' : 'Gửi Xác Nhận Tham Dự'}</span>
                <span aria-hidden="true">→</span>
              </button>
            </form>
          </div>
        )}
      </Reveal>
    </section>
  );
}
