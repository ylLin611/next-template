import { request } from '@/lib/http/request';

export type HealthResponse = {
  ok: boolean;
  timestamp: string;
};

export function getHealth() {
  return request<HealthResponse>('/api/health', {
    method: 'GET',
  });
}
