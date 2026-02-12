export class RequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: Record<string, QueryValue>;
  body?: unknown;
  baseUrl?: string;
};

function withQueryParams(path: string, params?: Record<string, QueryValue>) {
  if (!params) {
    return path;
  }

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    search.append(key, String(value));
  }

  const query = search.toString();
  if (!query) {
    return path;
  }

  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

export async function request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { params, body, headers, baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '', ...init } = options;
  const url = `${baseUrl}${withQueryParams(path, params)}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data ? String(data.message) : response.statusText;
    throw new RequestError(message || 'Request failed', response.status, data);
  }

  return data as TResponse;
}
