/**
 * Cookie Manager - Utilities for managing browser cookies
 * Provides functions to set, get, and delete cookies with security features
 */

var CookieManager = (function() {
  'use strict';

  /**
   * Set a cookie with specified parameters
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {number} days - Expiration in days (default: 365)
   * @param {object} options - Additional options (path, domain, secure, sameSite)
   */
  function setCookie(name, value, days, options) {
    options = options || {};
    days = days || 365;
    
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    
    var path = options.path || '/';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var secure = options.secure || window.location.protocol === 'https:' ? '; secure' : '';
    var sameSite = options.sameSite ? '; samesite=' + options.sameSite : '; samesite=lax';
    
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=' + path + domain + secure + sameSite;
  }

  /**
   * Get a cookie value by name
   * @param {string} name - Cookie name
   * @returns {string|null} Cookie value or null if not found
   */
  function getCookie(name) {
    var nameEQ = name + '=';
    var cookies = document.cookie.split(';');
    
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
      }
    }
    return null;
  }

  /**
   * Delete a cookie by name
   * @param {string} name - Cookie name
   * @param {string} path - Cookie path (default: '/')
   */
  function deleteCookie(name, path) {
    path = path || '/';
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=' + path + ';';
  }

  /**
   * Check if a cookie exists
   * @param {string} name - Cookie name
   * @returns {boolean} True if cookie exists
   */
  function cookieExists(name) {
    return getCookie(name) !== null;
  }

  /**
   * Get all cookies as an object
   * @returns {object} Object with cookie names as keys
   */
  function getAllCookies() {
    var cookies = {};
    var cookieArray = document.cookie.split(';');
    
    for (var i = 0; i < cookieArray.length; i++) {
      var cookie = cookieArray[i].trim();
      var eqPos = cookie.indexOf('=');
      if (eqPos > 0) {
        var name = cookie.substring(0, eqPos);
        var value = cookie.substring(eqPos + 1);
        cookies[name] = decodeURIComponent(value);
      }
    }
    return cookies;
  }

  /**
   * Set a JSON object as cookie
   * @param {string} name - Cookie name
   * @param {object} value - Object to store
   * @param {number} days - Expiration in days
   */
  function setJSONCookie(name, value, days) {
    try {
      var jsonString = JSON.stringify(value);
      setCookie(name, jsonString, days);
      return true;
    } catch (e) {
      console.error('Error setting JSON cookie:', e);
      return false;
    }
  }

  /**
   * Get a JSON object from cookie
   * @param {string} name - Cookie name
   * @returns {object|null} Parsed object or null
   */
  function getJSONCookie(name) {
    try {
      var value = getCookie(name);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (e) {
      console.error('Error parsing JSON cookie:', e);
      return null;
    }
  }

  /**
   * Clear all cookies (use with caution)
   */
  function clearAllCookies() {
    var cookies = getAllCookies();
    for (var name in cookies) {
      if (cookies.hasOwnProperty(name)) {
        deleteCookie(name);
      }
    }
  }

  // Public API
  return {
    set: setCookie,
    get: getCookie,
    delete: deleteCookie,
    exists: cookieExists,
    getAll: getAllCookies,
    setJSON: setJSONCookie,
    getJSON: getJSONCookie,
    clearAll: clearAllCookies
  };
})();
