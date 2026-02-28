/**
 * Activity Tracker - Tracks and saves visitor activities using cookies
 * Tracks: page views, clicks, time spent, scroll depth, sessions, referrers
 */

var ActivityTracker = (function() {
  'use strict';

  // Configuration
  var config = {
    cookiePrefix: 'visitor_',
    sessionDuration: 30, // minutes
    enabled: false, // Wait for consent
    trackClicks: true,
    trackScroll: true,
    trackTime: true,
    saveInterval: 5000 // Save every 5 seconds
  };

  // State
  var state = {
    sessionId: null,
    visitorId: null,
    pageLoadTime: null,
    lastActivityTime: null,
    currentPageData: {},
    scrollDepth: 0,
    clicks: [],
    saveTimer: null
  };

  /**
   * Initialize the tracker
   */
  function init(options) {
    if (options) {
      Object.assign(config, options);
    }

    // Check for consent
    if (CookieManager.get(config.cookiePrefix + 'consent') !== 'true') {
      console.log('Visitor tracking waiting for consent');
      return;
    }

    config.enabled = true;
    initVisitor();
    initSession();
    trackPageView();
    setupEventListeners();
    startAutoSave();
    
    console.log('Activity Tracker initialized');
  }

  /**
   * Enable tracking (after consent)
   */
  function enableTracking() {
    CookieManager.set(config.cookiePrefix + 'consent', 'true', 365);
    config.enabled = true;
    init();
  }

  /**
   * Disable tracking and clear data
   */
  function disableTracking() {
    config.enabled = false;
    clearAllData();
    CookieManager.delete(config.cookiePrefix + 'consent');
    if (state.saveTimer) {
      clearInterval(state.saveTimer);
    }
    console.log('Activity Tracking disabled');
  }

  /**
   * Initialize or get visitor ID
   */
  function initVisitor() {
    var visitorId = CookieManager.get(config.cookiePrefix + 'id');
    
    if (!visitorId) {
      visitorId = generateId();
      CookieManager.set(config.cookiePrefix + 'id', visitorId, 730); // 2 years
      
      // Store visitor info
      var visitorData = {
        id: visitorId,
        firstVisit: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: window.screen.width + 'x' + window.screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      CookieManager.setJSON(config.cookiePrefix + 'info', visitorData, 730);
    }
    
    state.visitorId = visitorId;
    incrementVisitCount();
  }

  /**
   * Initialize or resume session
   */
  function initSession() {
    var sessionData = CookieManager.getJSON(config.cookiePrefix + 'session');
    var now = new Date().getTime();
    
    // Check if session is still valid
    if (sessionData && sessionData.lastActivity) {
      var timeSinceLastActivity = now - sessionData.lastActivity;
      var sessionTimeout = config.sessionDuration * 60 * 1000;
      
      if (timeSinceLastActivity < sessionTimeout) {
        // Resume existing session
        state.sessionId = sessionData.id;
        sessionData.lastActivity = now;
        sessionData.pageCount = (sessionData.pageCount || 0) + 1;
        CookieManager.setJSON(config.cookiePrefix + 'session', sessionData, 1);
        return;
      }
    }
    
    // Create new session
    state.sessionId = generateId();
    sessionData = {
      id: state.sessionId,
      startTime: now,
      lastActivity: now,
      pageCount: 1,
      referrer: document.referrer || 'direct',
      landingPage: window.location.pathname
    };
    
    CookieManager.setJSON(config.cookiePrefix + 'session', sessionData, 1);
  }

  /**
   * Track page view
   */
  function trackPageView() {
    state.pageLoadTime = new Date().getTime();
    state.lastActivityTime = state.pageLoadTime;
    
    var pageData = {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      sessionId: state.sessionId,
      visitorId: state.visitorId
    };
    
    state.currentPageData = pageData;
    
    // Get page views history
    var pageViews = CookieManager.getJSON(config.cookiePrefix + 'page_views') || [];
    pageViews.push(pageData);
    
    // Keep only last 50 page views to avoid cookie size limits
    if (pageViews.length > 50) {
      pageViews = pageViews.slice(-50);
    }
    
    CookieManager.setJSON(config.cookiePrefix + 'page_views', pageViews, 30);
    
    // Track page view count for this specific page
    trackPageCounter(window.location.pathname);
  }

  /**
   * Track counter for specific page
   */
  function trackPageCounter(pagePath) {
    var pageCounters = CookieManager.getJSON(config.cookiePrefix + 'page_counters') || {};
    pageCounters[pagePath] = (pageCounters[pagePath] || 0) + 1;
    CookieManager.setJSON(config.cookiePrefix + 'page_counters', pageCounters, 365);
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    if (!config.enabled) return;

    // Track clicks
    if (config.trackClicks) {
      document.addEventListener('click', handleClick, true);
    }

    // Track scroll
    if (config.trackScroll) {
      window.addEventListener('scroll', handleScroll);
    }

    // Track time (update last activity)
    if (config.trackTime) {
      document.addEventListener('mousemove', updateActivity);
      document.addEventListener('keydown', updateActivity);
      document.addEventListener('touchstart', updateActivity);
    }

    // Track page visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Save data before page unload
    window.addEventListener('beforeunload', saveCurrentPageData);
  }

  /**
   * Handle click events
   */
  function handleClick(event) {
    if (!config.enabled) return;

    var target = event.target;
    var clickData = {
      timestamp: new Date().toISOString(),
      element: target.tagName,
      text: target.innerText ? target.innerText.substring(0, 50) : '',
      id: target.id || '',
      className: target.className || '',
      href: target.href || ''
    };

    state.clicks.push(clickData);
    
    // Keep only last 100 clicks
    if (state.clicks.length > 100) {
      state.clicks.shift();
    }

    updateActivity();
  }

  /**
   * Handle scroll events
   */
  function handleScroll() {
    if (!config.enabled) return;

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    if (scrollPercent > state.scrollDepth) {
      state.scrollDepth = scrollPercent;
    }

    updateActivity();
  }

  /**
   * Update last activity time
   */
  function updateActivity() {
    if (!config.enabled) return;
    state.lastActivityTime = new Date().getTime();
    updateSession();
  }

  /**
   * Update session last activity
   */
  function updateSession() {
    var sessionData = CookieManager.getJSON(config.cookiePrefix + 'session');
    if (sessionData) {
      sessionData.lastActivity = new Date().getTime();
      CookieManager.setJSON(config.cookiePrefix + 'session', sessionData, 1);
    }
  }

  /**
   * Handle visibility change (tab switch, minimize)
   */
  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      saveCurrentPageData();
    } else {
      updateActivity();
    }
  }

  /**
   * Save current page data
   */
  function saveCurrentPageData() {
    if (!config.enabled || !state.pageLoadTime) return;

    var timeSpent = Math.round((state.lastActivityTime - state.pageLoadTime) / 1000); // seconds
    
    var pageActivity = {
      path: window.location.pathname,
      url: window.location.href,
      title: document.title,
      sessionId: state.sessionId,
      timeSpent: timeSpent,
      scrollDepth: state.scrollDepth,
      clicks: state.clicks.length,
      clickDetails: state.clicks.slice(-10), // Last 10 clicks
      timestamp: new Date().toISOString()
    };

    // Save to activity history
    var activities = CookieManager.getJSON(config.cookiePrefix + 'activities') || [];
    activities.push(pageActivity);
    
    // Keep only last 20 activities
    if (activities.length > 20) {
      activities = activities.slice(-20);
    }
    
    CookieManager.setJSON(config.cookiePrefix + 'activities', activities, 30);

    // Update total time spent
    updateTotalTimeSpent(timeSpent);
  }

  /**
   * Update total time spent on site
   */
  function updateTotalTimeSpent(timeSpent) {
    var totalTime = parseInt(CookieManager.get(config.cookiePrefix + 'total_time') || '0');
    totalTime += timeSpent;
    CookieManager.set(config.cookiePrefix + 'total_time', totalTime.toString(), 365);
  }

  /**
   * Start auto-save timer
   */
  function startAutoSave() {
    if (state.saveTimer) {
      clearInterval(state.saveTimer);
    }
    
    state.saveTimer = setInterval(function() {
      if (config.enabled) {
        saveCurrentPageData();
      }
    }, config.saveInterval);
  }

  /**
   * Increment visit count
   */
  function incrementVisitCount() {
    var visitCount = parseInt(CookieManager.get(config.cookiePrefix + 'visit_count') || '0');
    visitCount++;
    CookieManager.set(config.cookiePrefix + 'visit_count', visitCount.toString(), 730);
  }

  /**
   * Track custom event
   */
  function trackEvent(eventName, eventData) {
    if (!config.enabled) return;

    var event = {
      name: eventName,
      data: eventData || {},
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      sessionId: state.sessionId
    };

    var events = CookieManager.getJSON(config.cookiePrefix + 'custom_events') || [];
    events.push(event);
    
    // Keep only last 30 events
    if (events.length > 30) {
      events = events.slice(-30);
    }
    
    CookieManager.setJSON(config.cookiePrefix + 'custom_events', events, 30);
  }

  /**
   * Get visitor statistics
   */
  function getStats() {
    return {
      visitorId: state.visitorId,
      sessionId: state.sessionId,
      visitorInfo: CookieManager.getJSON(config.cookiePrefix + 'info'),
      session: CookieManager.getJSON(config.cookiePrefix + 'session'),
      visitCount: parseInt(CookieManager.get(config.cookiePrefix + 'visit_count') || '0'),
      totalTimeSpent: parseInt(CookieManager.get(config.cookiePrefix + 'total_time') || '0'),
      pageViews: CookieManager.getJSON(config.cookiePrefix + 'page_views') || [],
      activities: CookieManager.getJSON(config.cookiePrefix + 'activities') || [],
      pageCounters: CookieManager.getJSON(config.cookiePrefix + 'page_counters') || {},
      customEvents: CookieManager.getJSON(config.cookiePrefix + 'custom_events') || []
    };
  }

  /**
   * Clear all tracking data
   */
  function clearAllData() {
    var prefix = config.cookiePrefix;
    var cookies = [
      'id', 'info', 'session', 'page_views', 'page_counters',
      'activities', 'total_time', 'visit_count', 'custom_events', 'consent'
    ];
    
    cookies.forEach(function(name) {
      CookieManager.delete(prefix + name);
    });
  }

  /**
   * Generate unique ID
   */
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Expose trackEvent as global function for use in main.js
  window.siteTrackEvent = trackEvent;

  // Public API
  return {
    init: init,
    enable: enableTracking,
    disable: disableTracking,
    trackEvent: trackEvent,
    getStats: getStats,
    clearData: clearAllData,
    isEnabled: function() { return config.enabled; }
  };
})();
