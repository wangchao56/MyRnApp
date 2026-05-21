export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  code?: number;
}

export interface ApiError {
  message: string;
  code?: number;
}
