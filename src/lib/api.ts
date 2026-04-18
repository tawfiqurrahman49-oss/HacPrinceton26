const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface User {
  id: number;
  email: string;
  role: 'investor' | 'startup';
  is_active: boolean;
  created_at: string;
}

export interface InvestorProfile {
  id: number;
  user_id: number;
  name: string;
  bio: string;
  focus_areas?: string[];
  investment_range?: string;
  location?: string;
  website?: string;
  images?: string[];
  created_at: string;
}

export interface StartupProfile {
  id: number;
  user_id: number;
  name: string;
  pitch: string;
  industry?: string;
  stage?: string;
  location?: string;
  website?: string;
  images?: string[];
  created_at: string;
}

export interface SwipeResponse {
  id: number;
  swiper_id: number;
  swiped_id: number;
  direction: 'left' | 'right';
  matched: boolean;
  created_at: string;
}

export interface Match {
  id: number;
  investor_id: number;
  startup_id: number;
  is_active: boolean;
  created_at: string;
  investor?: InvestorProfile;
  startup?: StartupProfile;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(email: string, password: string, role: 'investor' | 'startup', captchaToken: string) {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, captcha_token: captchaToken }),
    });
  }

  async login(email: string, password: string, captchaToken: string) {
    const response = await this.request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, captcha_token: captchaToken }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async getMe() {
    return this.request<User>('/users/me');
  }

  // Profiles
  async createInvestorProfile(data: Partial<InvestorProfile>) {
    return this.request<InvestorProfile>('/investors/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyInvestorProfile() {
    return this.request<InvestorProfile>('/investors/profile/me');
  }

  async updateInvestorProfile(data: Partial<InvestorProfile>) {
    return this.request<InvestorProfile>('/investors/profile/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async createStartupProfile(data: Partial<StartupProfile>) {
    return this.request<StartupProfile>('/startups/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyStartupProfile() {
    return this.request<StartupProfile>('/startups/profile/me');
  }

  async updateStartupProfile(data: Partial<StartupProfile>) {
    return this.request<StartupProfile>('/startups/profile/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Swipes
  async swipe(targetUserId: number, direction: 'left' | 'right') {
    return this.request<SwipeResponse>('/swipes/', {
      method: 'POST',
      body: JSON.stringify({ target_user_id: targetUserId, direction }),
    });
  }

  async getFeed(limit = 10) {
    return this.request<(InvestorProfile | StartupProfile)[]>(`/swipes/feed?limit=${limit}`);
  }

  // Matches
  async getMatches() {
    return this.request<Match[]>('/matches/');
  }

  async unmatch(matchId: number) {
    return this.request('/matches/' + matchId, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
