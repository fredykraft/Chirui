/**
 * User Authentication Module
 * Handles registration, login, and user session management
 */

class UserAuth {
  constructor(baseUrl) {
    // Use provided baseUrl, or window.POCKETBASE_URL
    // SECURITY: No fallback to localhost in production code
    this.baseUrl = baseUrl || window.POCKETBASE_URL;
    
    if (!this.baseUrl) {
      console.error('[Auth] Error: PocketBase URL not configured. Authentication will not work.');
    }
    
    this.authToken = this.getStoredToken();
    this.currentUser = this.getStoredUser();
  }

  // ============================================
  // REGISTRATION
  // ============================================

  async register(username, email, password, fullname = '') {
    // Validate inputs
    if (!this.validateUsername(username)) {
      throw new Error('Username must be 3-20 characters (letters, numbers, _, - only)');
    }
    if (!this.validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }
    if (!this.validatePassword(password)) {
      throw new Error('Password must be at least 8 characters');
    }
    if (fullname && fullname.length > 100) {
      throw new Error('Full name must be 100 characters or less');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/collections/users/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.toLowerCase().trim(),
          email: email.toLowerCase().trim(),
          password: password,
          fullname: fullname.trim(),
          verified: false
        })
      });

      if (!response.ok) {
        const error = await response.json();
        const message = error.data?.email?.[0]?.message || 
                       error.data?.username?.[0]?.message ||
                       error.message || 
                       'Registration failed';
        throw new Error(message);
      }

      const user = await response.json();
      
      // Auto-login after registration
      return await this.loginWithPassword(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // ============================================
  // LOGIN
  // ============================================

  async loginWithPassword(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/api/collections/users/auth-with-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identity: email.toLowerCase().trim(),
            password: password
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid email or password');
      }

      const data = await response.json();
      this.setToken(data.token);
      this.setUser(data.record);

      return data.record;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // ============================================
  // LOGOUT
  // ============================================

  logout() {
    this.authToken = null;
    this.currentUser = null;
    localStorage.removeItem('pb_auth_token');
    localStorage.removeItem('pb_current_user');
    sessionStorage.removeItem('pb_auth_token');
  }

  // ============================================
  // TOKEN MANAGEMENT
  // ============================================

  setToken(token) {
    this.authToken = token;
    localStorage.setItem('pb_auth_token', token);
    sessionStorage.setItem('pb_auth_token', token);
  }

  getStoredToken() {
    return sessionStorage.getItem('pb_auth_token') || 
           localStorage.getItem('pb_auth_token');
  }

  isAuthenticated() {
    return !!this.authToken;
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================

  setUser(user) {
    this.currentUser = user;
    localStorage.setItem('pb_current_user', JSON.stringify(user));
  }

  getStoredUser() {
    const stored = localStorage.getItem('pb_current_user');
    return stored ? JSON.parse(stored) : null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async updateProfile(userId, data) {
    if (!this.authToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/api/collections/users/records/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.authToken
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Update failed');
      }

      const user = await response.json();
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    if (!this.validatePassword(newPassword)) {
      throw new Error('New password must be at least 8 characters');
    }

    return this.updateProfile(userId, {
      password: newPassword,
      passwordConfirm: newPassword
    });
  }

  // ============================================
  // VALIDATION
  // ============================================

  validateUsername(username) {
    if (!username) return false;
    const re = /^[a-zA-Z0-9_-]{3,20}$/;
    return re.test(username);
  }

  validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email) && email.length <= 254;
  }

  validatePassword(password) {
    return password && password.length >= 8;
  }

  // ============================================
  // REQUEST HELPERS
  // ============================================

  async getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.authToken && { 'Authorization': this.authToken })
    };
  }

  async authenticatedFetch(url, options = {}) {
    const headers = await this.getAuthHeaders();
    return fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers }
    });
  }
}

// Initialize globally
const userAuth = new UserAuth();
window.UserAuth = UserAuth;
window.userAuth = userAuth;
