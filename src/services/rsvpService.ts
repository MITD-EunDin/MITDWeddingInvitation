import type { RsvpPayload } from '../types/wedding';

export interface RsvpService {
  submit: (payload: RsvpPayload) => Promise<{ success: boolean; message: string }>;
}

/**
 * Mock service — giả lập độ trễ mạng, luôn thành công.
 * Khi có backend thật, thay bằng `createRsvpService(apiEndpoint)` bên dưới.
 */
function createMockRsvpService(): RsvpService {
  return {
    async submit(payload) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      // eslint-disable-next-line no-console
      console.info('[RSVP mock] Đã nhận phản hồi:', payload);
      return { success: true, message: 'Cảm ơn bạn đã phản hồi!' };
    },
  };
}

/** Service thật — gọi REST API khi đã có backend. */
function createRestRsvpService(endpoint: string): RsvpService {
  return {
    async submit(payload) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return { success: false, message: 'Gửi phản hồi thất bại, vui lòng thử lại.' };
      }
      return { success: true, message: 'Cảm ơn bạn đã phản hồi!' };
    },
  };
}

export function getRsvpService(apiEndpoint?: string): RsvpService {
  return apiEndpoint ? createRestRsvpService(apiEndpoint) : createMockRsvpService();
}
