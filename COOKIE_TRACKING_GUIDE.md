# Cookie Tracking System Documentation

## Overview
This website now includes a comprehensive cookie-based activity tracking system that monitors and saves visitor activities while respecting user privacy with a consent mechanism.

## Features

### What is Tracked:
1. **Page Views**: Every page visit is recorded with URL, title, and timestamp
2. **Click Events**: User clicks on elements (buttons, links, etc.)
3. **Time Spent**: Duration spent on each page
4. **Scroll Depth**: How far users scroll on each page (percentage)
5. **Session Data**: Visit sessions with session IDs
6. **Visitor Information**: Unique visitor ID, browser info, screen resolution, timezone
7. **Navigation Patterns**: Referrer, landing page, page sequence
8. **Custom Events**: Trackable custom user actions

### Cookies Created:
- `visitor_id`: Unique visitor identifier (730 days)
- `visitor_info`: Visitor browser and device information (730 days)
- `visitor_session`: Current session data (1 day)
- `visitor_page_views`: History of page views (30 days)
- `visitor_page_counters`: Count of visits to each page (365 days)
- `visitor_activities`: Detailed activity logs (30 days)
- `visitor_total_time`: Total time spent on site (365 days)
- `visitor_visit_count`: Number of visits (730 days)
- `visitor_custom_events`: Custom tracked events (30 days)
- `visitor_consent`: User's consent choice (365 days)

## Files

### JavaScript Files:
1. **cookie-manager.js**: Core cookie utilities
   - Set, get, delete cookies
   - JSON cookie support
   - Security features (secure, sameSite)

2. **activity-tracker.js**: Activity tracking engine
   - Tracks all user interactions
   - Manages sessions and visitors
   - Saves data periodically
   - Provides statistics API

### HTML Files:
3. **cookie-consent.html**: Cookie consent banner and settings UI
   - GDPR-compliant consent banner
   - Settings modal for granular control
   - Data viewer to show tracked data
   - Delete data functionality

## User Interface

### Cookie Consent Banner
- Appears on first visit
- Options: Accept, Decline, Settings
- Clear explanation of what is tracked
- Slide-up animation

### Cookie Settings Modal
- Toggle analytics tracking on/off
- View detailed information about cookies
- Save preferences
- View tracked data
- Delete all tracked data

### Data Viewer
- Shows all collected data in JSON format
- Transparent data display
- Accessible from settings

## Usage

### For Users (Visitors):
1. **Accept Cookies**: Click "Accept" to enable tracking
2. **Decline Cookies**: Click "Decline" to disable tracking
3. **Configure Settings**: Click "Settings" to customize
4. **View Your Data**: Open settings → "View My Data"
5. **Delete Your Data**: Open settings → "Delete My Data"

### For Developers:

#### Access Tracking Data:
```javascript
// Get all statistics
var stats = ActivityTracker.getStats();
console.log(stats);

// Stats object contains:
// - visitorId: Unique visitor ID
// - sessionId: Current session ID
// - visitCount: Number of visits
// - totalTimeSpent: Total seconds on site
// - pageViews: Array of page view history
// - activities: Detailed activity logs
// - pageCounters: Visit count per page
// - customEvents: Custom tracked events
```

#### Track Custom Events:
```javascript
// Track a custom event
ActivityTracker.trackEvent('button_clicked', {
  buttonId: 'subscribe',
  location: 'homepage'
});

// Track form submission
ActivityTracker.trackEvent('form_submitted', {
  formName: 'contact',
  fields: ['name', 'email', 'message']
});

// Track video play
ActivityTracker.trackEvent('video_played', {
  videoId: 'intro-video',
  duration: 120
});
```

#### Manual Control:
```javascript
// Enable tracking programmatically
ActivityTracker.enable();

// Disable tracking
ActivityTracker.disable();

// Clear all data
ActivityTracker.clearData();

// Check if enabled
if (ActivityTracker.isEnabled()) {
  console.log('Tracking is active');
}
```

#### Cookie Manager API:
```javascript
// Set a cookie
CookieManager.set('myCookie', 'value', 30); // expires in 30 days

// Get a cookie
var value = CookieManager.get('myCookie');

// Delete a cookie
CookieManager.delete('myCookie');

// Check if exists
if (CookieManager.exists('myCookie')) {
  console.log('Cookie exists');
}

// Store JSON data
CookieManager.setJSON('myData', {name: 'John', age: 30}, 7);

// Retrieve JSON data
var data = CookieManager.getJSON('myData');

// Get all cookies
var allCookies = CookieManager.getAll();
```

## Privacy & Compliance

### GDPR Compliance:
- ✅ User consent required before tracking
- ✅ Clear disclosure of tracking activities
- ✅ Ability to view collected data
- ✅ Ability to delete all data
- ✅ Granular control over tracking preferences

### Cookie Policy Features:
- Transparent disclosure
- Easy opt-out mechanism
- Data access and deletion rights
- No tracking without consent
- Respect for DNT (Do Not Track) possible

## Configuration

### Customize Tracking Settings:
Edit in `activity-tracker.js`:

```javascript
var config = {
  cookiePrefix: 'visitor_',      // Cookie name prefix
  sessionDuration: 30,            // Session timeout (minutes)
  trackClicks: true,              // Enable click tracking
  trackScroll: true,              // Enable scroll tracking
  trackTime: true,                // Enable time tracking
  saveInterval: 5000              // Auto-save interval (ms)
};
```

### Customize Appearance:
Edit styles in `cookie-consent.html`:
- Banner colors
- Button styles
- Modal design
- Animations
- Responsive breakpoints

## Data Limits

To prevent cookie size issues, the system maintains limits:
- Page views: Last 50 entries
- Activities: Last 20 entries
- Clicks per session: Last 100 clicks
- Custom events: Last 30 events

Older data is automatically removed (FIFO - First In, First Out).

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

### Test the System:
1. Open your website in a browser
2. Open Developer Console (F12)
3. Run test commands:

```javascript
// Check if system loaded
console.log('CookieManager:', typeof CookieManager);
console.log('ActivityTracker:', typeof ActivityTracker);

// View current stats
console.log(ActivityTracker.getStats());

// Test custom event
ActivityTracker.trackEvent('test_event', {test: true});

// View all cookies
console.log(CookieManager.getAll());
```

### Clear Test Data:
```javascript
// In browser console:
ActivityTracker.clearData();
```

## Security Considerations

1. **Secure Cookies**: Automatically set when using HTTPS
2. **SameSite Policy**: Prevents CSRF attacks
3. **No Sensitive Data**: Never store passwords or payment info
4. **Client-Side Only**: All tracking is local (no server transmission)
5. **User Control**: Users can delete all data anytime

## Server-Side Integration (Optional)

To send data to a server for analysis:

```javascript
// In activity-tracker.js, add to saveCurrentPageData():
function sendToServer(data) {
  fetch('/api/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
}
```

## Troubleshooting

### Tracking Not Working:
1. Check browser console for errors
2. Verify all JS files are loaded
3. Check if user declined cookies
4. Ensure cookies are enabled in browser

### Banner Not Showing:
1. Check if consent was already given
2. Verify `cookie-consent.html` is included
3. Check browser console for errors

### Data Not Saving:
1. Check cookie size limits (4KB per cookie)
2. Verify browser allows cookies
3. Check if third-party cookies are blocked

## Future Enhancements

Possible additions:
- [ ] Heat map visualization
- [ ] A/B testing integration
- [ ] Export data to CSV/JSON
- [ ] Dashboard for analytics
- [ ] Real-time visitor counter
- [ ] Funnel analysis
- [ ] Conversion tracking

## Support

For issues or questions:
1. Check browser console for error messages
2. Review this documentation
3. Test in multiple browsers
4. Clear cookies and test fresh session

## License

This tracking system is part of the website codebase and follows the same license terms.

---

**Last Updated**: February 2026
