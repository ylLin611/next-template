'use client';

import { getHealth } from '@/features/system/api/get-health';
import { systemQueryKeys } from '@/features/system/query/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useHealthQuery() {
  return useQuery({
    queryKey: systemQueryKeys.health,
    queryFn: getHealth,
  });
}
