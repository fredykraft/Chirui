/**
 * PocketBase Configuration
 * 
 * SECURITY: This file configures the PocketBase API endpoint for the public website.
 * The endpoint must be HTTPS in production to protect data in transit.
 * 
 * DO NOT hardcode sensitive backend URLs - use environment variables instead.
 * Set POCKETBASE_URL in your deployment environment.
 */

(function() {
  'use strict';
  
  // Only set default if not already configured
  if (!window.POCKETBASE_URL) {
    window.POCKETBASE_URL = 'https://chirui-huang.pockethost.io';
  }
})();
