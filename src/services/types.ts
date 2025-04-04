export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}
