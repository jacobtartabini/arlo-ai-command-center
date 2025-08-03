export interface ZitadelTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface ZitadelUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  preferred_username?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  tailscaleVerified: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  verifyTailscaleAccess: () => Promise<void>;
  setTailscaleVerified: (verified: boolean) => void;
}