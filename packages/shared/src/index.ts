// Types e DTOs compartilhados entre frontend e backend
// Este arquivo será expandido conforme o projeto cresce

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
