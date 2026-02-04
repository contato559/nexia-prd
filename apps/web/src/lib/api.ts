const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error || data.message || 'Erro na requisição', response.status, data);
    }

    return data;
  }

  if (!response.ok) {
    throw new ApiError('Erro na requisição', response.status);
  }

  return response as unknown as T;
}

export const api = {
  baseUrl: API_BASE_URL,

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  // Para streaming SSE
  getStreamUrl(endpoint: string): string {
    return `${API_BASE_URL}/api${endpoint}`;
  },
};

export { ApiError };
export type { ApiResponse };
