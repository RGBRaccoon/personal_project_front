export interface User {
  id: string;            // user_id → id
  email: string;
  is_active: boolean;    // 추가
  is_superuser: boolean; // 추가
  is_verified: boolean;  // 추가
} 

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  id: number;
}
