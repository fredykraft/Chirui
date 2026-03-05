(function () {
  'use strict';

  var DEFAULT_LANGUAGE = 'en';
  var RELOAD_FLAG_KEY = 'auto_lang_reload_done';
  var OVERRIDE_KEY = 'site_lang_override';
  var LOCATION_KEY = 'user_location';
  var SUPPORTED_LANGUAGES = [
    'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru', 'zh-CN', 'zh-TW'
  ];

  // Map locations to languages
  var LOCATION_LANGUAGE_MAP = {
    'shanghai': 'zh-CN',
    'beijing': 'zh-CN',
    'shenzhen': 'zh-CN',
    'guangzhou': 'zh-CN',
    'chengdu': 'zh-CN',
    'hangzhou': 'zh-CN',
    'nanjing': 'zh-CN',
    'wuhan': 'zh-CN',
    'chongqing': 'zh-CN',
    'xi\'an': 'zh-CN',
    'xian': 'zh-CN',
    'harbin': 'zh-CN',
    'dalian': 'zh-CN',
    'qingdao': 'zh-CN',
    'changsha': 'zh-CN',
    'jinan': 'zh-CN',
    'taiyuan': 'zh-CN',
    'shenyang': 'zh-CN',
    'lanzhou': 'zh-CN',
    'guiyang': 'zh-CN',
    'yunnan': 'zh-CN',
    'tianjin': 'zh-CN',
    'suzhou': 'zh-CN',
    'ningbo': 'zh-CN',
    'xiamen': 'zh-CN',
    'fuzhou': 'zh-CN',
    'nanchang': 'zh-CN',
    'changchun': 'zh-CN',
    'jilin': 'zh-CN',
    'hefei': 'zh-CN',
    'zhengzhou': 'zh-CN',
    'taibei': 'zh-TW',
    'taipei': 'zh-TW',
    'kaohsiung': 'zh-TW',
    'tainan': 'zh-TW',
    'gaoxiong': 'zh-TW',
    'hongkong': 'zh-TW',
    'hong kong': 'zh-TW',
    'macau': 'zh-TW',
    'macao': 'zh-TW'
  };

  function normalizeLanguageTag(languageTag) {
    if (!languageTag) return DEFAULT_LANGUAGE;

    var lower = String(languageTag).toLowerCase();
    
    // Handle Chinese variants
    // Check for Traditional Chinese first (more specific)
    if (lower === 'zh-tw' || lower === 'zh-hant' || lower === 'zh-yue' || lower === 'zh-hk' || lower === 'zh-mo') {
      return 'zh-TW';
    }
    
    // Then check for Simplified Chinese (mainland and default)
    if (lower === 'zh' || lower === 'zh-cn' || lower === 'zh-hans' || lower === 'zh-sg' || 
        (lower.indexOf('zh-') === 0 && LOCATION_LANGUAGE_MAP[lower.replace('zh-', '')] !== 'zh-TW')) {
      return 'zh-CN';
    }
    
    // For any other 'zh-*' variant, default to Simplified Chinese
    if (lower.indexOf('zh') === 0) {
      return 'zh-CN';
    }

    var base = lower.split('-')[0];
    if (SUPPORTED_LANGUAGES.indexOf(base) !== -1) return base;

    return DEFAULT_LANGUAGE;
  }

  function detectSystemLanguage() {
    var languages = [];

    if (Array.isArray(navigator.languages) && navigator.languages.length) {
      languages = navigator.languages.slice();
    } else if (navigator.language) {
      languages = [navigator.language];
    }

    console.log('[Language Detection] Browser language settings:', languages);

    for (var i = 0; i < languages.length; i += 1) {
      var normalized = normalizeLanguageTag(languages[i]);
      console.log('[Language Detection] Processing:', languages[i], '-> Normalized:', normalized);
      
      // Return immediately if we find a supported non-default language
      if (normalized !== DEFAULT_LANGUAGE) {
        console.log('[Language Detection] Found non-default language:', normalized);
        return normalized;
      }
    }

    console.log('[Language Detection] No non-default language found, using default:', DEFAULT_LANGUAGE);
    return DEFAULT_LANGUAGE;
  }

  function getLanguageByLocation(location) {
    if (!location) return null;

    var lower = String(location).toLowerCase().trim();
    
    // Direct match
    if (LOCATION_LANGUAGE_MAP[lower]) {
      return LOCATION_LANGUAGE_MAP[lower];
    }

    // Partial match (check if location contains any mapped city)
    for (var city in LOCATION_LANGUAGE_MAP) {
      if (lower.indexOf(city) !== -1) {
        return LOCATION_LANGUAGE_MAP[city];
      }
    }

    return null;
  }

  function getCookieValue(name) {
    var prefix = name + '=';
    var parts = document.cookie ? document.cookie.split(';') : [];

    for (var i = 0; i < parts.length; i += 1) {
      var part = parts[i].trim();
      if (part.indexOf(prefix) === 0) {
        return part.substring(prefix.length);
      }
    }

    return '';
  }

  function getTargetLanguage() {
    var query = new URLSearchParams(window.location.search);
    var queryOverride = query.get('lang');

    // Priority 1: URL query parameter (highest priority - explicit user choice)
    if (queryOverride) {
      var queryLang = normalizeLanguageTag(queryOverride);
      try {
        localStorage.setItem(OVERRIDE_KEY, queryLang);
      } catch (error) {
      }
      return queryLang;
    }

    // Priority 2: localStorage override (user's saved preference)
    try {
      var saved = localStorage.getItem(OVERRIDE_KEY);
      if (saved) {
        return normalizeLanguageTag(saved);
      }
    } catch (error) {
    }

    // Priority 3: Location-based detection
    try {
      var location = localStorage.getItem(LOCATION_KEY);
      if (location) {
        var locationLang = getLanguageByLocation(location);
        if (locationLang) {
          return locationLang;
        }
      }
    } catch (error) {
    }

    // Priority 4: System language detection (fallback)
    return detectSystemLanguage();
  }

  function setTranslateCookie(targetLanguage) {
    var cookieValue = '/en/' + targetLanguage;
    var host = window.location.hostname;

    document.cookie = 'googtrans=' + cookieValue + ';path=/;max-age=31536000';
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      document.cookie = 'googtrans=' + cookieValue + ';domain=' + host + ';path=/;max-age=31536000';
    }
  }

  function applyLanguage(targetLanguage, attemptsLeft) {
    if (targetLanguage === DEFAULT_LANGUAGE) {
      document.documentElement.lang = DEFAULT_LANGUAGE;
      return;
    }

    setTranslateCookie(targetLanguage);

    var select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = targetLanguage;
      select.dispatchEvent(new Event('change'));
      return;
    }

    if (attemptsLeft > 0) {
      window.setTimeout(function () {
        applyLanguage(targetLanguage, attemptsLeft - 1);
      }, 200);
    }
  }

  function loadGoogleTranslateScript() {
    if (document.querySelector('script[data-auto-translate="google"]')) {
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-auto-translate', 'google');
    document.head.appendChild(script);
  }

  var targetLanguage = getTargetLanguage();
  document.documentElement.lang = targetLanguage;

  window.googleTranslateElementInit = function () {
    if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
      return;
    }

    new window.google.translate.TranslateElement(
      {
        pageLanguage: DEFAULT_LANGUAGE,
        includedLanguages: SUPPORTED_LANGUAGES.join(','),
        autoDisplay: false,
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      },
      'google_translate_element'
    );

    applyLanguage(targetLanguage, 20);
  };

  if (targetLanguage !== DEFAULT_LANGUAGE) {
    var expectedCookie = '/en/' + targetLanguage;
    var currentCookie = getCookieValue('googtrans');

    setTranslateCookie(targetLanguage);
    loadGoogleTranslateScript();

    if (currentCookie !== expectedCookie && !sessionStorage.getItem(RELOAD_FLAG_KEY)) {
      sessionStorage.setItem(RELOAD_FLAG_KEY, '1');
      window.location.reload();
      return;
    }
  } else {
    sessionStorage.removeItem(RELOAD_FLAG_KEY);
  }

  // Export global functions for managing location and language
  window.siteLanguageManager = {
    setLocation: function(location) {
      try {
        localStorage.setItem(LOCATION_KEY, location);
        console.log('[Language Manager] Location set to:', location);
        return true;
      } catch (error) {
        console.error('[Language Manager] Error setting location:', error);
        return false;
      }
    },

    getLocation: function() {
      try {
        return localStorage.getItem(LOCATION_KEY);
      } catch (error) {
        return null;
      }
    },

    clearLocation: function() {
      try {
        localStorage.removeItem(LOCATION_KEY);
        console.log('[Language Manager] Location cleared');
        return true;
      } catch (error) {
        console.error('[Language Manager] Error clearing location:', error);
        return false;
      }
    },

    setLanguage: function(language) {
      var normalized = normalizeLanguageTag(language);
      try {
        localStorage.setItem(OVERRIDE_KEY, normalized);
        console.log('[Language Manager] Language set to:', normalized);
      } catch (error) {
        console.error('[Language Manager] Error setting language:', error);
        return false;
      }

      // Apply the language change
      document.documentElement.lang = normalized;
      setTranslateCookie(normalized);
      
      // Try to update Google Translate widget
      var select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = normalized;
        select.dispatchEvent(new Event('change'));
      } else {
        // Reload if translator isn't ready yet
        setTimeout(function() {
          window.location.reload();
        }, 500);
      }
      return true;
    },

    getLanguage: function() {
      try {
        return localStorage.getItem(OVERRIDE_KEY) || targetLanguage;
      } catch (error) {
        return targetLanguage;
      }
    },

    clearLanguage: function() {
      try {
        localStorage.removeItem(OVERRIDE_KEY);
        sessionStorage.removeItem(RELOAD_FLAG_KEY);
        console.log('[Language Manager] Language preference cleared');
        return true;
      } catch (error) {
        console.error('[Language Manager] Error clearing language:', error);
        return false;
      }
    },

    recalculateLanguage: function() {
      var newLanguage = getTargetLanguage();
      if (newLanguage !== targetLanguage) {
        targetLanguage = newLanguage;
        document.documentElement.lang = newLanguage;
        setTranslateCookie(newLanguage);
        
        var select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = newLanguage;
          select.dispatchEvent(new Event('change'));
        } else {
          window.location.reload();
        }
        console.log('[Language Manager] Language recalculated to:', newLanguage);
        return true;
      }
      return false;
    },

    getSupportedLanguages: function() {
      return SUPPORTED_LANGUAGES.slice();
    },

    getCitiesForLanguage: function(language) {
      var normalized = normalizeLanguageTag(language);
      var cities = [];
      for (var city in LOCATION_LANGUAGE_MAP) {
        if (LOCATION_LANGUAGE_MAP[city] === normalized) {
          cities.push(city);
        }
      }
      return cities;
    }
  };

  console.log('[Language Manager] Initialized. Current language:', targetLanguage);
})();
