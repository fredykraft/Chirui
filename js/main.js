$(document).ready(function () {

  'use strict';

  /* =======================
  // Simple Search Settings
  ======================= */

  var searchInput = document.getElementById('js-search-input');
  var resultsContainer = document.getElementById('js-results-container');

  if (searchInput && resultsContainer && window.SimpleJekyllSearch) {
    var searchJsonPath = searchInput.getAttribute('data-search-json') || '/search.json';
    var siteBaseUrl = (searchInput.getAttribute('data-site-baseurl') || '').replace(/\/+$/g, '');

    console.log('[Search] Initializing with:', searchJsonPath);

    try {
      SimpleJekyllSearch({
        searchInput: searchInput,
        resultsContainer: resultsContainer,
        json: searchJsonPath,
        searchResultTemplate: '<li class="c-search-results-list__item"><a class="c-search-results-list__link" href="{url}"><span class="c-search-results-list__title">{title}</span><span class="c-search-results-list__meta">📄 {category}</span><span class="c-search-results-list__snippet">{content}</span></a></li>',
        noResultsText: '<li class="c-search-results-list__item"><p class="c-search-results-list__empty">No results found. Try different keywords.</p></li>',
        limit: 8,
        fuzzy: false,
        exclude: [],
        success: function() {
          console.log('[Search] Successfully loaded');
        },
        error: function(err) {
          console.error('[Search] Error:', err);
          resultsContainer.innerHTML = '<li class="c-search-results-list__item"><p class="c-search-results-list__empty">Search is loading...</p></li>';
        },
        templateMiddleware: function(prop, value, template) {
          // Truncate content to show smart excerpts
          if (prop === 'content') {
            // Remove HTML entities and excessive whitespace
            var cleaned = value.replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
            // Truncate to 150 characters with ellipsis
            if (cleaned.length > 150) {
              var truncated = cleaned.substring(0, 150);
              var lastSpace = truncated.lastIndexOf(' ');
              if (lastSpace > 100) {
                truncated = truncated.substring(0, lastSpace);
              }
              return truncated + '...';
            }
            return cleaned;
          }
          return value;
        }
      });

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