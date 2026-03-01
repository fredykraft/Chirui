/**
 * Smart Features for Chirui Huang Website
 * Advanced interactive features to enhance user experience
 */

(function() {
  'use strict';

  // ============================================
  // 1. READING PROGRESS BAR
  // ============================================
  function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.insertBefore(progressBar, document.body.firstChild);

    const progressFill = progressBar.querySelector('.reading-progress-fill');

    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const progress = (scrollTop / documentHeight) * 100;
      
      progressFill.style.width = Math.min(progress, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ============================================
  // 2. DARK MODE TOGGLE
  // ============================================
  function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    darkModeToggle.innerHTML = `
      <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    document.body.appendChild(darkModeToggle);

    // Detect system preference and load saved preference
    function initTheme() {
      let theme = localStorage.getItem('theme');
      
      // If no saved preference, detect system preference
      if (!theme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
      }
      
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
    }

    // Initialize theme on load
    initTheme();

    // Listen to system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // Only apply system theme if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        document.documentElement.style.colorScheme = newTheme;
      }
    });

    darkModeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.style.colorScheme = newTheme;
      localStorage.setItem('theme', newTheme);
      
      // Add animation class
      darkModeToggle.classList.add('toggle-active');
      setTimeout(() => {
        darkModeToggle.classList.remove('toggle-active');
      }, 600);
      
      // Track theme change
      if (window.siteTrackEvent) {
        window.siteTrackEvent('theme_change', {
          theme: newTheme,
          page_path: window.location.pathname
        });
      }
    });
  }

  // ============================================
  // 3. READING TIME ESTIMATOR
  // ============================================
  function initReadingTime() {
    const articles = document.querySelectorAll('article, .c-article, .c-content');
    
    articles.forEach(function(article) {
      const text = article.textContent || article.innerText;
      const wordCount = text.trim().split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min
      
      if (readingTime > 1) {
        const readingTimeEl = document.createElement('div');
        readingTimeEl.className = 'reading-time';
        readingTimeEl.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${readingTime} min read</span>
        `;
        
        const header = article.querySelector('.c-article__header, h1, .c-article__title');
        if (header) {
          header.parentNode.insertBefore(readingTimeEl, header.nextSibling);
        } else {
          article.insertBefore(readingTimeEl, article.firstChild);
        }
      }
    });
  }

  // ============================================
  // 4. KEYBOARD SHORTCUTS
  // ============================================
  function initKeyboardShortcuts() {
    const shortcuts = {
      '/': function() { // Focus search
        const searchInput = document.getElementById('js-search-input');
        if (searchInput) {
          searchInput.focus();
          return true;
        }
      },
      'h': function() { // Go home
        if (window.location.pathname !== '/') {
          window.location.href = '/';
          return true;
        }
      },
      't': function() { // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      },
      'b': function() { // Scroll to bottom
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        return true;
      },
      'd': function() { // Toggle dark mode
        const darkModeBtn = document.querySelector('.dark-mode-toggle');
        if (darkModeBtn) {
          darkModeBtn.click();
          return true;
        }
      },
      '?': function() { // Show shortcuts help
        showShortcutsHelp();
        return true;
      }
    };

    document.addEventListener('keydown', function(e) {
      // Don't trigger if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      const handler = shortcuts[e.key];
      if (handler && handler()) {
        e.preventDefault();
        
        if (window.siteTrackEvent) {
          window.siteTrackEvent('keyboard_shortcut', {
            key: e.key,
            page_path: window.location.pathname
          });
        }
      }
    });
  }

  function showShortcutsHelp() {
    const existing = document.getElementById('shortcuts-modal');
    if (existing) {
      existing.remove();
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.className = 'shortcuts-modal';
    modal.innerHTML = `
      <div class="shortcuts-content">
        <h3>⌨️ Keyboard Shortcuts</h3>
        <ul class="shortcuts-list">
          <li><kbd>/</kbd> Focus search</li>
          <li><kbd>h</kbd> Go to home</li>
          <li><kbd>t</kbd> Scroll to top</li>
          <li><kbd>b</kbd> Scroll to bottom</li>
          <li><kbd>d</kbd> Toggle dark mode</li>
          <li><kbd>?</kbd> Show/hide this help</li>
        </ul>
        <button class="shortcuts-close">Got it!</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(function() {
      modal.classList.add('active');
    }, 10);

    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target.classList.contains('shortcuts-close')) {
        modal.classList.remove('active');
        setTimeout(function() {
          modal.remove();
        }, 300);
      }
    });
  }

  // ============================================
  // 5. AUTO TABLE OF CONTENTS
  // ============================================
  function initTableOfContents() {
    const article = document.querySelector('article, .c-article, .c-content');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3, h4');
    if (headings.length < 3) return; // Only show TOC for longer articles

    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h4>📑 Table of Contents</h4><ul class="toc-list"></ul>';
    
    const tocList = toc.querySelector('.toc-list');
    
    headings.forEach(function(heading, index) {
      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }
      
      const li = document.createElement('li');
      li.className = 'toc-item toc-' + heading.tagName.toLowerCase();
      li.innerHTML = `<a href="#${heading.id}">${heading.textContent}</a>`;
      tocList.appendChild(li);
    });

    // Insert TOC after first paragraph or at start of article
    const firstParagraph = article.querySelector('p');
    if (firstParagraph) {
      firstParagraph.parentNode.insertBefore(toc, firstParagraph.nextSibling);
    } else {
      article.insertBefore(toc, article.firstChild);
    }

    // Highlight active section
    function highlightActiveToc() {
      let current = '';
      
      headings.forEach(function(heading) {
        const rect = heading.getBoundingClientRect();
        if (rect.top < 200) {
          current = heading.id;
        }
      });

      tocList.querySelectorAll('.toc-item').forEach(function(item) {
        item.classList.remove('active');
      });

      if (current) {
        const activeItem = tocList.querySelector(`a[href="#${current}"]`);
        if (activeItem) {
          activeItem.parentElement.classList.add('active');
        }
      }
    }

    window.addEventListener('scroll', highlightActiveToc, { passive: true });
    highlightActiveToc();
  }

  // ============================================
  // 6. COPY CODE BUTTON
  // ============================================
  function initCopyCodeButton() {
    const codeBlocks = document.querySelectorAll('pre code, pre');
    
    codeBlocks.forEach(function(codeBlock) {
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-code-btn';
      copyButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Copy</span>
      `;
      
      copyButton.addEventListener('click', function() {
        const code = codeBlock.textContent;
        
        navigator.clipboard.writeText(code).then(function() {
          copyButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Copied!</span>
          `;
          copyButton.classList.add('copied');
          
          setTimeout(function() {
            copyButton.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            `;
            copyButton.classList.remove('copied');
          }, 2000);

          if (window.siteTrackEvent) {
            window.siteTrackEvent('copy_code', {
              page_path: window.location.pathname
            });
          }
        });
      });

      const parent = codeBlock.parentNode;
      parent.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);
      wrapper.appendChild(copyButton);
    });
  }

  // ============================================
  // 7. SMOOTH SCROLL ENHANCEMENTS
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without jumping
          history.pushState(null, null, href);
        }
      });
    });
  }

  // ============================================
  // 8. ENHANCED SCROLL TO TOP WITH PROGRESS
  // ============================================
  function enhanceScrollToTop() {
    const scrollTopBtn = document.querySelector('.c-top');
    if (!scrollTopBtn) return;

    // Add circular progress
    const circle = document.createElement('div');
    circle.className = 'scroll-progress-circle';
    scrollTopBtn.appendChild(circle);

    function updateScrollProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const progress = (scrollTop / documentHeight) * 100;
      
      circle.style.background = `conic-gradient(#FFB6C1 ${progress * 3.6}deg, rgba(255,255,255,0.1) 0deg)`;
      
      if (scrollTop > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

  // ============================================
  // 9. LAZY LOADING IMAGES WITH FADE-IN
  // ============================================
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(function(img) {
        img.classList.add('lazy-image');
        imageObserver.observe(img);
      });
    }
  }

  // ============================================
  // 10. SMART EXTERNAL LINKS
  // ============================================
  function initSmartLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    
    links.forEach(function(link) {
      const url = new URL(link.href);
      
      // Add security attributes for external links
      if (url.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // ============================================
  // 11. MOBILE RESPONSIVE HAMBURGER MENU
  // ============================================
  function initMobileMenu() {
    const hamburger = document.getElementById('js-hamburger');
    const navMenu = document.getElementById('js-nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function() {
      const isOpen = hamburger.classList.toggle('is-active');
      navMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('is-active');
        navMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideMenu = navMenu.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);
      
      if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('is-open')) {
        hamburger.classList.remove('is-active');
        navMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });

    // Handle window resize - close menu on larger screens
    window.addEventListener('resize', function() {
      if (window.innerWidth > 640) {
        hamburger.classList.remove('is-active');
        navMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  // ============================================
  // INITIALIZE ALL FEATURES
  // ============================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    try {
      initReadingProgress();
      initDarkMode();
      initReadingTime();
      initKeyboardShortcuts();
      initTableOfContents();
      initCopyCodeButton();
      initSmoothScroll();
      enhanceScrollToTop();
      initLazyLoading();
      initSmartLinks();
      initMobileMenu();

      console.log('✨ Smart features initialized successfully!');
    } catch (error) {
      console.error('Error initializing smart features:', error);
    }
  }

  // Auto-initialize
  init();
})();
