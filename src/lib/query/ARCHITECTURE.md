# TanStack Query 约定

- 统一在 `src/features/<domain>/api` 编写请求函数（只做请求与类型）。
- 统一在 `src/features/<domain>/query` 编写 `useQuery`/`useMutation` hooks。
- Query Key 按领域维护在 `src/features/<domain>/query/query-keys.ts`。
- 所有请求统一走 `src/lib/http/request.ts`，集中处理错误与参数。
- 全局 Provider 在 `src/providers/query-provider.tsx`，已接入 `src/app/layout.tsx`。

## 示例

- API: `src/features/system/api/get-health.ts`
- Hook: `src/features/system/query/use-health-query.ts`
- Query Key: `src/features/system/query/query-keys.ts`
- Route: `src/app/api/health/route.ts`

