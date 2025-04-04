import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

interface UserSettings {
  theme: 'light' | 'dark';
  defaultNoteColor: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface UserData {
  name: string;
  email: string;
  id: string;
  settings: UserSettings;
}

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    } as LoginCredentials);
    
    
    localStorage.setItem('token', response.data.token);

    if (!response.data.user) {
      console.error('No user data in response:', response.data);
      return response.data;
    }

    const userData = {
      name: response.data.user.name,
      email: response.data.user.email,
      id: response.data.user._id,
      settings: response.data.user.settings
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    
    return response.data;
  }

  async register(name: string, email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', {
      name,
      email,
      password,
    } as RegisterCredentials);
    
    
    localStorage.setItem('token', response.data.token);

    if (!response.data.user) {
      console.error('No user data in response:', response.data);
      return response.data;
    }

    const userData = {
      name: response.data.user.name,
      email: response.data.user.email,
      id: response.data.user._id,
      settings: response.data.user.settings
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserData(): UserData | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
}

export const authService = new AuthService();
