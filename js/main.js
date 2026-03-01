$(document).ready(function () {

  'use strict';

  /* =======================
  // Enhanced Search with Result Count and Highlighting
  ======================= */

  var searchInput = document.getElementById('js-search-input');
  var resultsContainer = document.getElementById('js-results-container');

  if (searchInput && resultsContainer) {
    var searchJsonPath = searchInput.getAttribute('data-search-json') || '/search.json';
    var siteBaseUrl = (searchInput.getAttribute('data-site-baseurl') || '').replace(/\/+$/g, '');
    var searchIndex = [];

    console.log('[Search] Loading from:', searchJsonPath);

    // Load search index
    fetch(searchJsonPath)
      .then(function(response) {
        if (!response.ok) throw new Error('Failed to load search index');
        return response.json();
      })
      .then(function(data) {
        searchIndex = data;
        console.log('[Search] Loaded', searchIndex.length, 'items');
      })
      .catch(function(error) {
        console.error('[Search] Error:', error);
      });

    // Search function
    function performSearch(query) {
      if (!query || query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
      }

      var queryLower = query.toLowerCase();
      var results = [];

      // Search through index
      searchIndex.forEach(function(item) {
        var titleLower = (item.title || '').toLowerCase();
        var contentLower = (item.content || '').toLowerCase();
        var score = 0;

        // Check title match (higher priority)
        if (titleLower.indexOf(queryLower) !== -1) {
          score += 10;
        }

        // Check content match
        if (contentLower.indexOf(queryLower) !== -1) {
          score += 5;
        }

        if (score > 0) {
          results.push({
            item: item,
            score: score,
            query: query
          });
        }
      });

      // Sort by score
      results.sort(function(a, b) {
        return b.score - a.score;
      });

      // Limit results
      results = results.slice(0, 8);

      // Display results
      displayResults(results, query);
    }

    // Display search results
    function displayResults(results, query) {
      if (results.length === 0) {
        resultsContainer.innerHTML = '<li class="c-search-results-list__item"><p class="c-search-results-list__empty">No results found. Try different keywords.</p></li>';
        return;
      }

      // Add result count header
      var html = '<li class="c-search-results-list__count">Found ' + results.length + ' result' + (results.length !== 1 ? 's' : '') + ' for "' + escapeHtml(query) + '"</li>';

      results.forEach(function(result) {
        var item = result.item;
        var location = getLocation(item.url);
        var snippet = getSnippet(item.content, query);
        var highlightedSnippet = highlightText(snippet, query);

        html += '<li class="c-search-results-list__item">' +
                '<a class="c-search-results-list__link" href="' + escapeHtml(item.url) + '?search=' + encodeURIComponent(query) + '">' +
                '<span class="c-search-results-list__title">' + highlightText(item.title, query) + '</span>' +
                '<span class="c-search-results-list__meta">📍 ' + escapeHtml(location) + '</span>' +
                '<span class="c-search-results-list__snippet">' + highlightedSnippet + '</span>' +
                '</a></li>';
      });

      resultsContainer.innerHTML = html;
    }

    // Get readable location from URL
    function getLocation(url) {
      var location = (url || '').replace(siteBaseUrl, '').replace(/^\//, '').replace(/\/$/, '').replace('.html', '');
      
      if (!location || location === '') {
        return 'Home';
      }
      
      if (location.includes('/')) {
        return location.split('/').map(function(part) {
          return part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        }).join(' › ');
      }
      
      return location.charAt(0).toUpperCase() + location.slice(1).replace(/-/g, ' ');
    }

    // Get snippet with context around search term
    function getSnippet(content, query) {
      var cleaned = (content || '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
      var queryLower = query.toLowerCase();
      var contentLower = cleaned.toLowerCase();
      var termIndex = contentLower.indexOf(queryLower);

      if (termIndex !== -1) {
        var start = Math.max(0, termIndex - 50);
        var end = Math.min(cleaned.length, termIndex + query.length + 100);
        return (start > 0 ? '...' : '') + cleaned.substring(start, end) + (end < cleaned.length ? '...' : '');
      }

      return cleaned.length > 150 ? cleaned.substring(0, 150) + '...' : cleaned;
    }

    // Highlight search terms in text
    function highlightText(text, query) {
      if (!text || !query) return text;
      
      var regex = new RegExp('(' + escapeRegex(query) + ')', 'gi');
      return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // Escape HTML
    function escapeHtml(text) {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return (text || '').replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Escape regex special characters
    function escapeRegex(text) {
      return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Debounce function
    function debounce(func, wait) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          func.apply(context, args);
        }, wait);
      };
    }

    // Bind search input
    searchInput.addEventListener('input', debounce(function(e) {
      performSearch(e.target.value.trim());
    }, 200));

    // Clear on Escape
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
      }
    });

    // Clear when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.c-search')) {
        resultsContainer.innerHTML = '';
      }
    });
  }

      console.log('[Search] Successfully initialized');
    } catch (error) {
      console.error('[Search] Initialization error:', error);
      resultsContainer.innerHTML = '<li class="c-search-results-list__item"><p class="c-search-results-list__empty">Search temporarily unavailable</p></li>';
    }

    // Clear results when clicking outside
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.c-search')) {
        resultsContainer.innerHTML = '';
      }
    });

    // Clear results on Escape key
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
      }
    });
  } else if (searchInput && resultsContainer) {
    console.error('[Search] SimpleJekyllSearch library not loaded');
  }


  /* =======================
  // Highlight Search Terms on Page
  ======================= */

  // Check if user came from a search result
  var urlParams = new URLSearchParams(window.location.search);
  var searchQuery = urlParams.get('search');
  
  if (searchQuery && searchQuery.length > 0) {
    console.log('[Search] Will highlight term:', searchQuery);
    
    // Function to highlight text in an element
    function highlightInElement(element, term) {
      var walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      var nodesToReplace = [];
      var node;
      var matchCount = 0;
      
      while (node = walker.nextNode()) {
        // Skip script, style, and noscript elements
        var parentTag = node.parentElement.tagName;
        if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || 
            parentTag === 'NOSCRIPT' || parentTag === 'MARK') {
          continue;
        }
        
        var text = node.nodeValue;
        var lowerText = text.toLowerCase();
        var lowerTerm = term.toLowerCase();
        
        if (lowerText.indexOf(lowerTerm) !== -1) {
          nodesToReplace.push({
            node: node,
            text: text,
            term: term
          });
          matchCount++;
        }
      }
      
      console.log('[Search] Found', matchCount, 'text nodes containing term');
      
      // Replace nodes with highlighted version
      var highlightCount = 0;
      nodesToReplace.forEach(function(item) {
        var regex = new RegExp('(' + item.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        var parts = item.text.split(regex);
        var fragment = document.createDocumentFragment();
        
        parts.forEach(function(part) {
          if (part.toLowerCase() === item.term.toLowerCase()) {
            var mark = document.createElement('mark');
            mark.className = 'c-search-hit';
            mark.textContent = part;
            fragment.appendChild(mark);
            highlightCount++;
          } else if (part) {
            fragment.appendChild(document.createTextNode(part));
          }
        });
        
        item.node.parentNode.replaceChild(fragment, item.node);
      });
      
      console.log('[Search] Created', highlightCount, 'highlights');
      return highlightCount;
    }
    
    // Wait for page to load, then highlight
    setTimeout(function() {
      var contentArea = document.querySelector('.c-content') || 
                        document.querySelector('article') || 
                        document.querySelector('main') || 
                        document.body;
      
      console.log('[Search] Highlighting in:', contentArea.tagName, contentArea.className);
      
      var totalHighlights = highlightInElement(contentArea, searchQuery);
      
      if (totalHighlights > 0) {
        // Scroll to first highlight
        var firstHighlight = document.querySelector('.c-search-hit');
        if (firstHighlight) {
          console.log('[Search] Scrolling to first match');
          firstHighlight.classList.add('c-search-hit--focus');
          setTimeout(function() {
            firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 200);
        }
      } else {
        console.log('[Search] No highlights created - term may not be in visible content');
      }
    }, 300);
  }


  /* =======================
  // Old Search Code (disabled)
  ======================= */

  function oldSearchCode() {
    // Keeping old search code commented for reference
    var searchInput_old = document.getElementById('js-search-input');
    var resultsContainer_old = document.getElementById('js-results-container');

    if (!searchInput_old || !resultsContainer_old || window.SimpleJekyllSearch) {
      return; // Skip if using new search
    }

    var searchJsonPath = searchInput_old.getAttribute('data-search-json') || '/search.json';
    var siteBaseUrl = (searchInput_old.getAttribute('data-site-baseurl') || '').replace(/\/+$/g, '');
    var homeUrl = searchInput_old.getAttribute('data-home-url') || '/';
    var siteTitle = (searchInput_old.getAttribute('data-site-title') || '').toLowerCase();

    console.log('[Search] Loading from:', searchJsonPath);

    fetch(searchJsonPath)
      .then(function (response) {
        console.log('[Search] Response status:', response.status);
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      })
      .then(function (searchIndex) {
        console.log('[Search] Loaded successfully, items:', searchIndex.length);
        var index = (searchIndex || []).map(function (item) {
          var title = decodeEntities(item.title || '');
          var category = decodeEntities(item.category || '');
          var tags = decodeEntities(item.tags || '');
          var content = decodeEntities(item.content || '');
          var url = item.url || '#';

          return {
            title: title,
            category: category,
            tags: tags,
            content: content,
            url: url,
            titleLower: title.toLowerCase(),
            tagsLower: tags.toLowerCase(),
            contentLower: content.toLowerCase(),
            urlLower: url.toLowerCase()
          };
        });

        bindSearch(index);
      })
      .catch(function (error) {
        console.error('[Search] Error loading search index:', error);
        resultsContainer_old.innerHTML = '<li class="c-search-results-list__item"><p class="c-search-results-list__empty">Search unavailable: ' + error.message + '</p></li>';
      });

    function bindSearch(index) {
      searchInput.addEventListener('input', debounce(function (event) {
        var query = event.target.value.trim();

        if (!query) {
          resultsContainer.innerHTML = '';
          return;
        }

        var matches = findMatches(index, query).slice(0, 8);
        renderMatches(matches, query);

        if (window.siteTrackEvent) {
          window.siteTrackEvent('search_query', {
            query_length: query.length,
            result_count: matches.length,
            page_path: window.location.pathname
          });
        }
      }, 120));

      searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          searchInput.value = '';
          resultsContainer.innerHTML = '';
        }
      });

      document.addEventListener('click', function (event) {
        if (!event.target.closest('.c-search')) {
          resultsContainer.innerHTML = '';
        }
      });
    }

    function findMatches(index, query) {
      var queryLower = query.toLowerCase();
      var terms = tokenizeQuery(queryLower);

      return index.map(function (item) {
        var fields = [item.titleLower, item.tagsLower, item.contentLower, item.urlLower];
        var everyTermExists = terms.every(function (term) {
          return fields.some(function (field) {
            return field.indexOf(term) !== -1;
          });
        });

        if (!everyTermExists) {
          return null;
        }

        var titleHit = firstMatchIndex(item.titleLower, terms);
        var tagsHit = firstMatchIndex(item.tagsLower, terms);
        var contentHit = firstMatchIndex(item.contentLower, terms);
        var urlHit = firstMatchIndex(item.urlLower, terms);

        var bestField = 'content';
        var bestIndex = contentHit;

        if (titleHit !== -1) {
          bestField = 'title';
          bestIndex = titleHit;
        } else if (tagsHit !== -1) {
          bestField = 'tags';
          bestIndex = tagsHit;
        } else if (urlHit !== -1) {
          bestField = 'url';
          bestIndex = urlHit;
        }

        var score = 0;
        if (item.titleLower.indexOf(queryLower) !== -1) {
          score += 80;
        }
        if (titleHit !== -1) {
          score += 30;
        }
        if (tagsHit !== -1) {
          score += 20;
        }
        if (urlHit !== -1) {
          score += 10;
        }
        if (contentHit !== -1) {
          score += 5;
        }

        return {
          item: item,
          bestField: bestField,
          bestIndex: bestIndex,
          score: score
        };
      }).filter(Boolean).sort(function (a, b) {
        return b.score - a.score;
      });
    }

    function renderMatches(matches, query) {
      if (!matches.length) {
        resultsContainer.innerHTML = '<li class="c-search-results-list__item"><p class="c-search-results-list__empty">No results found</p></li>';
        return;
      }

      var terms = tokenizeQuery(query.toLowerCase());
      var html = matches.map(function (result) {
        var item = result.item;
        var displayTitle = getDisplayTitle(item);
        var locationText = formatLocation(item.url || '/');
        var matchedInText = fieldLabel(result.bestField);
        var snippetText = buildSnippet(item, result.bestField, result.bestIndex);
        var highlightedTitle = highlightText(displayTitle, terms);
        var highlightedLocation = highlightText(locationText, terms);
        var highlightedSnippet = highlightText(snippetText, terms);
        var resultUrl = appendQueryParam(item.url, query);

        return [
          '<li class="c-search-results-list__item">',
          '<a class="c-search-results-list__link" href="' + escapeHtml(resultUrl) + '">',
          '<span class="c-search-results-list__title">' + highlightedTitle + '</span>',
          '<span class="c-search-results-list__meta">Location: ' + highlightedLocation + '</span>',
          '<span class="c-search-results-list__where">Found in: ' + matchedInText + '</span>',
          '<span class="c-search-results-list__snippet">' + highlightedSnippet + '</span>',
          '</a>',
          '</li>'
        ].join('');
      }).join('');

      resultsContainer.innerHTML = html;

      var resultLinks = resultsContainer.querySelectorAll('.c-search-results-list__link');
      Array.prototype.forEach.call(resultLinks, function (link, index) {
        link.addEventListener('click', function () {
          if (window.siteTrackEvent) {
            window.siteTrackEvent('search_result_click', {
              result_rank: index + 1,
              target_path: link.getAttribute('href') || '',
              page_path: window.location.pathname
            });
          }
        });
      });
    }

    function buildSnippet(item, bestField, bestIndex) {
      if (bestField === 'title') {
        return item.title;
      }
      if (bestField === 'tags') {
        return item.tags ? 'Tags: ' + item.tags : item.content.slice(0, 140);
      }
      if (bestField === 'url') {
        return 'Path: ' + item.url;
      }

      var source = item.content || '';
      if (!source) {
        return item.title;
      }

      if (bestIndex === -1) {
        return source.slice(0, 160);
      }

      var start = Math.max(0, bestIndex - 85);
      var end = Math.min(source.length, bestIndex + 120);
      var prefix = start > 0 ? '…' : '';
      var suffix = end < source.length ? '…' : '';

      return prefix + source.slice(start, end).trim() + suffix;
    }

    function fieldLabel(field) {
      if (field === 'title') {
        return 'Title';
      }
      if (field === 'tags') {
        return 'Tags';
      }
      if (field === 'url') {
        return 'Page URL';
      }

      return 'Page Content';
    }

    function formatLocation(url) {
      var normalizedPath = normalizePath(url);

      if (normalizedPath === '/') {
        return 'Home (/)' ;
      }

      var normalized = normalizedPath.replace(/\/+$/g, '');
      var parts = normalized.split('/').filter(Boolean);
      var section = parts.length ? parts[parts.length - 1] : 'home';
      var sectionTitle = section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' ');

      return sectionTitle + ' (' + normalizedPath + ')';
    }

    function getDisplayTitle(item) {
      if (!item || !item.url) {
        return '';
      }

      var normalizedPath = normalizePath(item.url);
      var normalizedHome = normalizePath(homeUrl);
      if (normalizedPath === '/' || normalizedPath === normalizedHome || (siteTitle && item.titleLower === siteTitle)) {
        return 'Home';
      }

      return item.title;
    }

    function appendQueryParam(url, query) {
      if (!url || url === '#') {
        return url;
      }

      var separator = url.indexOf('?') === -1 ? '?' : '&';
      return url + separator + 'q=' + encodeURIComponent(query);
    }

    function normalizePath(url) {
      var value = String(url || '');

      value = value.split('#')[0];
      value = value.split('?')[0];

      if (!value) {
        return '/';
      }

      if (siteBaseUrl && value.indexOf(siteBaseUrl + '/') === 0) {
        value = value.slice(siteBaseUrl.length);
      } else if (siteBaseUrl && value === siteBaseUrl) {
        value = '/';
      }

      if (!value.startsWith('/')) {
        value = '/' + value;
      }

      value = value.replace(/\/+$/g, '');
      return value || '/';
    }

    function tokenizeQuery(query) {
      return query.split(/\s+/).filter(function (term) {
        return term.length > 0;
      });
    }

    function firstMatchIndex(text, terms) {
      var positions = terms.map(function (term) {
        return text.indexOf(term);
      }).filter(function (position) {
        return position !== -1;
      });

      return positions.length ? Math.min.apply(null, positions) : -1;
    }

    function highlightText(text, terms) {
      var highlighted = escapeHtml(text || '');

      terms.forEach(function (term) {
        if (!term) {
          return;
        }

        var escapedTerm = escapeRegExp(escapeHtml(term));
        if (!escapedTerm) {
          return;
        }

        highlighted = highlighted.replace(new RegExp('(' + escapedTerm + ')', 'ig'), '<mark class="c-search-mark">$1</mark>');
      });

      return highlighted;
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function decodeEntities(value) {
      var textArea = document.createElement('textarea');
      textArea.innerHTML = value;
      return textArea.value;
    }

    function escapeRegExp(value) {
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function debounce(callback, delay) {
      var timeoutId;

      return function () {
        var context = this;
        var args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
          callback.apply(context, args);
        }, delay);
      };
    }
  }

  applySearchHighlightsFromUrl();

  function applySearchHighlightsFromUrl() {
    var query = getQueryTerm();

    if (!query) {
      return;
    }

    var terms = query.toLowerCase().split(/\s+/).filter(function (term) {
      return term.length > 0;
    });

    if (!terms.length) {
      return;
    }

    var wrapper = document.querySelector('.o-wrapper');
    if (!wrapper) {
      return;
    }

    setTimeout(function () {
      highlightTermsInElement(wrapper, terms);

      var firstHit = wrapper.querySelector('.c-search-hit');
      if (firstHit) {
        firstHit.classList.add('c-search-hit--focus');
        firstHit.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  }

  function getQueryTerm() {
    var rawSearch = window.location.search || '';
    var query = '';

    try {
      query = (new URLSearchParams(rawSearch).get('q') || '').trim();
    } catch (error) {
      query = '';
    }

    if (!query && rawSearch.indexOf('q=') !== -1) {
      query = decodeURIComponent(rawSearch.split('q=')[1].split('&')[0] || '').trim();
    }

    if (!query && window.location.hash && window.location.hash.indexOf('q=') !== -1) {
      query = decodeURIComponent(window.location.hash.replace('#', '').split('q=')[1].split('&')[0] || '').trim();
    }

    return query;
  }

  function highlightTermsInElement(rootElement, terms) {
    if (!rootElement || !terms.length) {
      return;
    }

    var escapedTerms = terms.map(escapeRegExpGlobal).sort(function (a, b) {
      return b.length - a.length;
    });
    var matchRegex = new RegExp('(' + escapedTerms.join('|') + ')', 'ig');

    var textNodes = [];
    var walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        var parentNode = node.parentNode;
        if (!parentNode || !parentNode.nodeName) {
          return NodeFilter.FILTER_REJECT;
        }

        var parentTag = parentNode.nodeName.toLowerCase();
        if (['script', 'style', 'noscript', 'textarea', 'input', 'mark'].indexOf(parentTag) !== -1) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    });

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(function (textNode) {
      var source = textNode.nodeValue;

      if (!matchRegex.test(source)) {
        matchRegex.lastIndex = 0;
        return;
      }
      matchRegex.lastIndex = 0;

      var fragment = document.createDocumentFragment();
      var lastIndex = 0;
      var match;

      while ((match = matchRegex.exec(source)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(source.slice(lastIndex, match.index)));
        }

        var mark = document.createElement('mark');
        mark.className = 'c-search-hit';
        mark.textContent = match[0];
        fragment.appendChild(mark);

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < source.length) {
        fragment.appendChild(document.createTextNode(source.slice(lastIndex)));
      }

      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  function escapeRegExpGlobal(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* =======================
  // Responsive videos
  ======================= */

  $('.c-wrap-content').fitVids({
    'customSelector': ['iframe[src*="ted.com"]']
  });

  /* =======================================
  // Switching between posts and categories
  ======================================= */

  $('.c-nav__list > .c-nav__item').click(function() {
    $('.c-nav__list > .c-nav__item').removeClass('is-active');
    $(this).addClass('is-active');
    if ($('.c-nav__item:last-child').hasClass('is-active')) {
      $('.c-posts').css('display', 'none').removeClass('o-opacity');
      $('.c-load-more').css('display', 'none')
      $('.c-categories').css('display', '').addClass('o-opacity');
    } else {
      $('.c-posts').css('display', '').addClass('o-opacity');
      $('.c-load-more').css('display', '')
      $('.c-categories').css('display', 'none').removeClass('o-opacity');
    }
  });

  /* =======================
  // Adding ajax pagination
  ======================= */

  $(".c-load-more").click(loadMorePosts);

  function loadMorePosts() {
    var _this = this;
    var $postsContainer = $('.c-posts');
    var nextPage = parseInt($postsContainer.attr('data-page')) + 1;
    var totalPages = parseInt($postsContainer.attr('data-totalPages'));

    $(this).addClass('is-loading').text("Loading...");

    $.get('/page/' + nextPage, function (data) {
      var htmlData = $.parseHTML(data);
      var $articles = $(htmlData).find('article');

      $postsContainer.attr('data-page', nextPage).append($articles);

      if ($postsContainer.attr('data-totalPages') == nextPage) {
        $('.c-load-more').remove();
      }

      $(_this).removeClass('is-loading');
    });
  }

  /* ==============================
  // Smooth scroll to the tags page
  ============================== */

  $('.c-tag__list a').on('click', function (e) {
    e.preventDefault();

    var currentTag = $(this).attr('href'),
      currentTagOffset = $(currentTag).offset().top;

    $('html, body').animate({
      scrollTop: currentTagOffset - 10
    }, 400);

  });

  /* =======================
  // Scroll to top
  ======================= */

  $('.c-top').click(function () {
    $('html, body').stop().animate({ scrollTop: 0 }, 'slow', 'swing');
  });
  $(window).scroll(function () {
    if ($(this).scrollTop() > $(window).height()) {
      $('.c-top').addClass("c-top--active");
    } else {
      $('.c-top').removeClass("c-top--active");
    };
  });

  /* =======================
  // Contact Form Popup
  ======================= */

  $('.js-form-open').click(function (e) {
    e.preventDefault();
    $('.c-form-box').addClass('is-visible');
    $('body').addClass('is-overflow');
  });

  $('.c-form-bnt__close, .c-form-box').click(function () {
    $('.c-form-box').removeClass('is-visible');
    $('body').removeClass('is-overflow');
  });

  $('.c-form').click(function (e) {
    e.stopPropagation();
  });


});