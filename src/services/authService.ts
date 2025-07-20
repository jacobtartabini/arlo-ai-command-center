import { generateCodeVerifier, generateCodeChallenge, generateState, storePKCEData, retrieveAndClearPKCEData } from '@/utils/pkce';
import { ZitadelTokenResponse, ZitadelUserInfo, AuthUser } from '@/types/auth';

// Environment configuration
const ZITADEL_DOMAIN = 'arlo-gusfzw.us1.zitadel.cloud';
const CLIENT_ID = import.meta.env.VITE_ZITADEL_CLIENT_ID || 'your-client-id';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'https://arlo.jacobtartabini.com/auth/callback';

// Debug environment variables
console.log('Auth Service Environment Check:', {
  CLIENT_ID,
  REDIRECT_URI,
  hasClientId: !!import.meta.env.VITE_ZITADEL_CLIENT_ID,
  hasRedirectUri: !!import.meta.env.VITE_REDIRECT_URI,
  allEnvVars: import.meta.env
});

// Zitadel OIDC endpoints
const ENDPOINTS = {
  authorization: `https://${ZITADEL_DOMAIN}/oauth/v2/authorize`,
  token: `https://${ZITADEL_DOMAIN}/oauth/v2/token`,
  userinfo: `https://${ZITADEL_DOMAIN}/oidc/v1/userinfo`,
  endSession: `https://${ZITADEL_DOMAIN}/oidc/v1/end_session`,
};

class AuthService {
  // Initiate OIDC login flow with PKCE
  async initiateLogin(): Promise<void> {
    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateState();

      // Store PKCE data for callback
      storePKCEData(codeVerifier, state);

      // Build authorization URL
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: state,
      });

      const authUrl = `${ENDPOINTS.authorization}?${params.toString()}`;
      
      // Redirect to Zitadel
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate login:', error);
      throw new Error('Failed to start authentication process');
    }
  }

  // Handle OAuth callback and exchange code for tokens
  async handleCallback(code: string, state: string): Promise<AuthUser> {
    try {
      console.log('Handling callback with code:', code, 'state:', state);
      
      // Retrieve and validate PKCE data
      const { codeVerifier, state: storedState } = retrieveAndClearPKCEData();
      
      console.log('PKCE Data retrieved:', { 
        codeVerifier: codeVerifier ? 'EXISTS' : 'MISSING', 
        storedState, 
        receivedState: state,
        statesMatch: state === storedState
      });

      if (!codeVerifier) {
        throw new Error('Missing code verifier - session may have expired');
      }

      if (!storedState) {
        throw new Error('Missing stored state - session may have expired');
      }

      if (state !== storedState) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }

      // Exchange authorization code for tokens
      const tokenResponse = await this.exchangeCodeForTokens(code, codeVerifier);
      
      // Fetch user information
      const userInfo = await this.fetchUserInfo(tokenResponse.access_token);

      // Create auth user object
      const authUser: AuthUser = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name || userInfo.given_name,
        picture: userInfo.picture,
        accessToken: tokenResponse.access_token,
        idToken: tokenResponse.id_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: Date.now() + (tokenResponse.expires_in * 1000),
      };

      // Store user session
      this.storeUserSession(authUser);

      return authUser;
    } catch (error) {
      console.error('Callback handling failed:', error);
      throw error;
    }
  }

  // Exchange authorization code for tokens
  private async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<ZitadelTokenResponse> {
    const response = await fetch(ENDPOINTS.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    return response.json();
  }

  // Fetch user information from Zitadel
  private async fetchUserInfo(accessToken: string): Promise<ZitadelUserInfo> {
    const response = await fetch(ENDPOINTS.userinfo, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user information');
    }

    return response.json();
  }

  // Store user session in localStorage (secure storage would be better)
  private storeUserSession(user: AuthUser): void {
    localStorage.setItem('arlo_auth_user', JSON.stringify(user));
  }

  // Retrieve stored user session
  getStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem('arlo_auth_user');
      if (!stored) return null;

      const user: AuthUser = JSON.parse(stored);
      
      // Check if token is expired
      if (Date.now() >= user.expiresAt) {
        this.clearUserSession();
        return null;
      }

      return user;
    } catch (error) {
      console.error('Failed to retrieve stored user:', error);
      this.clearUserSession();
      return null;
    }
  }

  // Clear user session
  clearUserSession(): void {
    localStorage.removeItem('arlo_auth_user');
  }

  // Logout and optionally call end session endpoint
  async logout(idToken?: string): Promise<void> {
    try {
      this.clearUserSession();

      // Optional: call Zitadel end session endpoint
      if (idToken) {
        const params = new URLSearchParams({
          id_token_hint: idToken,
          post_logout_redirect_uri: window.location.origin + '/login',
        });

        // Use hidden iframe or fetch to avoid redirect
        fetch(`${ENDPOINTS.endSession}?${params.toString()}`, {
          method: 'GET',
          mode: 'no-cors', // Avoid CORS issues
        }).catch(() => {
          // Ignore errors from end session call
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Always clear local session even if remote logout fails
      this.clearUserSession();
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getStoredUser() !== null;
  }
}

export const authService = new AuthService();