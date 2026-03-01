# PocketBase Database Setup Guide

This guide explains how to set up the required PocketBase collections for your website.

## Prerequisites

- PocketBase server running at http://127.0.0.1:8090
- Admin account created

## Required Collections

### 1. Contacts Collection

**Collection Name:** `contacts`

**Type:** Base Collection

**Fields:**
- `name` (Text, Required)
  - Min length: 2
  - Max length: 100
  
- `email` (Email, Required)
  - Pattern: Must be valid email
  
- `subject` (Text, Optional)
  - Max length: 200
  
- `message` (Text, Required)
  - Min length: 10
  - Max length: 2000
  
- `submitted_at` (Date, Required)

**API Rules:**
- List: Admin only
- View: Admin only
- Create: Public (anyone can submit)
- Update: Admin only
- Delete: Admin only

**Setup Steps:**
1. Go to http://127.0.0.1:8090/_/
2. Click "New collection"
3. Choose "Base collection"
4. Name: `contacts`
5. Add fields as listed above
6. Go to "API Rules" tab
7. Set Create rule: empty (allows public access)
8. Keep other rules as admin only
9. Click "Create"

---

### 2. Newsletter Subscribers Collection

**Collection Name:** `newsletter_subscribers`

**Type:** Base Collection

**Fields:**
- `email` (Email, Required, Unique)
  - Pattern: Must be valid email
  - Note: Enable "Unique" checkbox to prevent duplicate subscriptions
  
- `subscribed_at` (Date, Required)
  
- `status` (Select, Required)
  - Options: `active`, `unsubscribed`
  - Default: `active`

**API Rules:**
- List: Admin only
- View: Admin only
- Create: Public (anyone can subscribe)
- Update: Admin only
- Delete: Admin only

**Setup Steps:**
1. Go to http://127.0.0.1:8090/_/
2. Click "New collection"
3. Choose "Base collection"
4. Name: `newsletter_subscribers`
5. Add fields as listed above
6. For email field: Check "Unique" and "Required"
7. Go to "API Rules" tab
8. Set Create rule: empty (allows public access)
9. Keep other rules as admin only
10. Click "Create"

---

### 3. Comments Collection

**Collection Name:** `comments`

**Type:** Base Collection

**Fields:**
- `author_name` (Text, Required)
  - Min length: 2
  - Max length: 100
  
- `author_email` (Email, Required)
  - Pattern: Must be valid email
  - Note: Email will not be displayed publicly
  
- `content` (Text, Required)
  - Min length: 5
  - Max length: 1000
  
- `page_url` (Text, Required)
  - The URL/path where comment was posted
  
- `status` (Select, Required)
  - Options: `pending`, `approved`, `rejected`
  - Default: `pending`
  
- `created` (Date, Required)

**API Rules:**
- List: Custom rule (only show approved comments)
  ```
  status = "approved"
  ```
- View: Admin only
- Create: Public (anyone can comment)
- Update: Admin only (for approving/rejecting)
- Delete: Admin only

**Setup Steps:**
1. Go to http://127.0.0.1:8090/_/
2. Click "New collection"
3. Choose "Base collection"
4. Name: `comments`
5. Add fields as listed above
6. For status field: Add options `pending`, `approved`, `rejected`
7. Go to "API Rules" tab
8. Set List rule: `status = "approved"`
9. Set Create rule: empty (allows public access)
10. Keep View, Update, Delete as admin only
11. Click "Create"

---

## Quick Setup Script

To quickly create all collections, you can use the PocketBase admin UI or import this schema.

**Important Notes:**
- The `Create` rule is left empty (no restrictions) to allow public form submissions
- All other operations require admin authentication for security
- Comments require approval before being displayed publicly
- Newsletter email addresses are unique to prevent duplicate subscriptions

---

## Testing the Setup

### Test Contact Form:
1. Visit your website
2. Fill out the contact form
3. Submit and check PocketBase dashboard for the new record

### Test Newsletter:
1. Enter an email in the newsletter form
2. Submit and verify in PocketBase dashboard

### Test Comments:
1. Add `{% include comments.html %}` to any page
2. Submit a test comment
3. Go to PocketBase dashboard → Comments collection
4. Change status from `pending` to `approved`
5. Refresh the page to see approved comment

---

## Security Best Practices

1. **Never expose your PocketBase admin credentials**
2. **Keep pb_data/ and pocketbase in .gitignore**
3. **Use HTTPS in production**
4. **Regularly backup pb_data/ folder**
5. **Review and approve comments before publishing**
6. **Monitor submission patterns for spam**

---

## Production Deployment

For production deployment, you'll need to:

1. **Host PocketBase** on a server (Cloud, VPS, etc.)
2. **Update PB_URL** in `/js/pocketbase-integration.js` to your production URL
3. **Enable HTTPS** with SSL certificate
4. **Set up CORS** properly in PocketBase
5. **Consider rate limiting** to prevent abuse

Example production URL update:
```javascript
const PB_URL = 'https://your-domain.com'; // Or your PocketBase server URL
```

---

## Troubleshooting

**Issue: Form submissions not working**
- Check browser console for errors
- Verify PocketBase is running: http://127.0.0.1:8090
- Verify collection names match exactly
- Check API Rules allow public Create access

**Issue: Comments not displaying**
- Check comment status is set to "approved"
- Verify List rule is `status = "approved"`
- Check browser console for errors

**Issue: "CORS error" in browser**
- PocketBase automatically handles CORS for localhost
- In production, configure CORS settings in PocketBase

---

## Viewing Submissions

To view form submissions:
1. Go to http://127.0.0.1:8090/_/
2. Log in with your admin credentials
3. Click on the collection name (contacts, newsletter_subscribers, comments)
4. View all submissions in table format
5. For comments: Change status to "approved" to publish

---

## Need Help?

Check the official PocketBase documentation:
https://pocketbase.io/docs/

---

**Setup Complete!** Your website now has a fully functional backend database system. 🎉
