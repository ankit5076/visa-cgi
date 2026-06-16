const TOKEN_STORAGE_KEY = 'cgi_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'cgi_refresh_token';
const SESSION_ID_STORAGE_KEY = 'cgi_session_id';
const USER_EMAIL_STORAGE_KEY = 'cgi_user_email';
class JWTAuthManager {
    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
        this.sessionId = null;
        this.userEmail = null;
    }
    async init() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.local.get([
                    TOKEN_STORAGE_KEY,
                    REFRESH_TOKEN_STORAGE_KEY,
                    SESSION_ID_STORAGE_KEY,
                    USER_EMAIL_STORAGE_KEY
                ]);
                this.accessToken = result[TOKEN_STORAGE_KEY];
                this.refreshToken = result[REFRESH_TOKEN_STORAGE_KEY];
                this.sessionId = result[SESSION_ID_STORAGE_KEY];
                this.userEmail = result[USER_EMAIL_STORAGE_KEY];
            } else {
                this.accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
                this.refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
                this.sessionId = localStorage.getItem(SESSION_ID_STORAGE_KEY);
                this.userEmail = localStorage.getItem(USER_EMAIL_STORAGE_KEY);
            }
        } catch (error) {
        }
    }
    async storeTokens(accessToken, refreshToken, sessionId, userEmail) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.sessionId = sessionId;
        this.userEmail = userEmail;
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.local.set({
                    [TOKEN_STORAGE_KEY]: accessToken,
                    [REFRESH_TOKEN_STORAGE_KEY]: refreshToken,
                    [SESSION_ID_STORAGE_KEY]: sessionId,
                    [USER_EMAIL_STORAGE_KEY]: userEmail
                });
            } else {
                localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
                localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
                localStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId);
                localStorage.setItem(USER_EMAIL_STORAGE_KEY, userEmail);
            }
        } catch (error) {
        }
    }
    async clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        this.sessionId = null;
        this.userEmail = null;
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.local.remove([
                    TOKEN_STORAGE_KEY,
                    REFRESH_TOKEN_STORAGE_KEY,
                    SESSION_ID_STORAGE_KEY,
                    USER_EMAIL_STORAGE_KEY
                ]);
            } else {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
                localStorage.removeItem(SESSION_ID_STORAGE_KEY);
                localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
            }
        } catch (error) {
        }
    }
    isTokenValid() {
        if (!this.accessToken) return false;
        try {
            const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            const isValid = payload.exp > now + 5;
            if (!isValid) {
            }
            return isValid;
        } catch (error) {
            return false;
        }
    }
    getAuthHeaders() {
        if (!this.accessToken) {
            console.warn('🚫 JWT: No access token available');
            return {};
        }
        return {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
        };
    }
    async refreshAccessToken(serverUrl) {
        if (!this.refreshToken || !this.userEmail) {
            return false;
        }
        try {
            const startTime = Date.now();
            const response = await fetch(`${serverUrl}/api/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refreshToken: this.refreshToken,
                    email: this.userEmail
                })
            });
            if (response.ok) {
                const data = await response.json();
                await this.storeTokens(
                    data.__token,
                    data.__refreshToken,
                    data.__sessionId,
                    this.userEmail
                );
                const refreshTime = Date.now() - startTime;
                try {
                    const payload = JSON.parse(atob(data.__token.split('.')[1]));
                    const expiryTime = new Date(payload.exp * 1000);
                } catch (e) {
                }
                return true;
            } else {
                await this.clearTokens();
                return false;
            }
        } catch (error) {
            await this.clearTokens();
            return false;
        }
    }
    async makeAuthenticatedRequest(url, options = {}) {
        if (!this.accessToken) {
            await this.init();
        }
        if (!this.isTokenValid()) {
            const urlObj = new URL(url);
            const serverUrl = `${urlObj.protocol}//${urlObj.host}`;
            const refreshed = await this.refreshAccessToken(serverUrl);
            if (!refreshed) {
                let storedEmail = null;
                let version = null;
                try {
                    if (typeof chrome !== 'undefined' && chrome.storage && chrome.runtime) {
                        const result = await chrome.storage.local.get(['email']);
                        storedEmail = result.email;
                        version = chrome.runtime.getManifest().version;
                    }
                    if (storedEmail && version) {
                        const authData = await this.authenticate(serverUrl, storedEmail, version);
                        if (authData) {
                            return;
                        } else {
                        }
                    } else {
                    }
                } catch (autoAuthError) {
                }
                throw new Error('Authentication failed - please re-authenticate');
            }
        }
        const headers = {
            ...this.getAuthHeaders(),
            ...(options.headers || {})
        };
        const requestOptions = {
            ...options,
            headers
        };
        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 401 && this.refreshToken) {
                const urlObj = new URL(url);
                const serverUrl = `${urlObj.protocol}//${urlObj.host}`;
                const refreshed = await this.refreshAccessToken(serverUrl);
                if (refreshed) {
                    const newHeaders = {
                        ...this.getAuthHeaders(),
                        ...(options.headers || {})
                    };
                    return await fetch(url, { ...requestOptions, headers: newHeaders });
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
    async authenticate(serverUrl, email, version) {
        try {
            const response = await fetch(`${serverUrl}/api/get-config?email=${encodeURIComponent(email)}&version=${encodeURIComponent(version)}`);
            if (response.ok) {
                const data = await response.json();
                if (data.__token && data.__refreshToken) {
                    await this.storeTokens(
                        data.__token,
                        data.__refreshToken,
                        data.__sessionId,
                        email.toLowerCase()
                    );
                    return data;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }
}
const jwtAuth = new JWTAuthManager();
if (typeof window !== 'undefined') {
    window.JWTAuth = jwtAuth;
    window.HMACUtils = {
        signedFetch: (url, options) => jwtAuth.makeAuthenticatedRequest(url, options),
        makeSignedRequest: (url, options) => jwtAuth.makeAuthenticatedRequest(url, options),
        authenticate: (serverUrl, email, version) => jwtAuth.authenticate(serverUrl, email, version)
    };
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = jwtAuth;
}
