(function () {
  'use strict';

  var DEFAULT_LANGUAGE = 'en';
  var RELOAD_FLAG_KEY = 'auto_lang_reload_done';
  var OVERRIDE_KEY = 'site_lang_override';
  var SUPPORTED_LANGUAGES = [
    'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru', 'zh-CN', 'zh-TW'
  ];

  function normalizeLanguageTag(languageTag) {
    if (!languageTag) return DEFAULT_LANGUAGE;

    var lower = String(languageTag).toLowerCase();
    if (lower === 'zh-cn' || lower === 'zh-hans') return 'zh-CN';
    if (lower === 'zh-tw' || lower === 'zh-hant') return 'zh-TW';

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

    for (var i = 0; i < languages.length; i += 1) {
      var normalized = normalizeLanguageTag(languages[i]);
      if (normalized !== DEFAULT_LANGUAGE || languages[i].toLowerCase().indexOf('en') !== 0) {
        return normalized;
      }
    }

    return DEFAULT_LANGUAGE;
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

    if (queryOverride) {
      var queryLang = normalizeLanguageTag(queryOverride);
      try {
        localStorage.setItem(OVERRIDE_KEY, queryLang);
      } catch (error) {
      }
      return queryLang;
    }

    try {
      var saved = localStorage.getItem(OVERRIDE_KEY);
      if (saved) {
        return normalizeLanguageTag(saved);
      }
    } catch (error) {
    }

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
})();
