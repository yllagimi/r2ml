(function () {
  'use strict';

  var manifestUrl = './articles.json';

  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function wordCount(text, limit) {
    return text.trim().split(/\s+/).slice(0, limit).join(' ');
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parseArticleText(text) {
    var lines = text.replace(/\r\n/g, '\n').split('\n');
    var title = (lines[0] || '').trim();
    var topic = '';
    var author = '';
    var bodyStart = 0;

    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!topic && /^Topic:\s*/i.test(line)) {
        topic = line.replace(/^Topic:\s*/i, '').trim();
        continue;
      }
      if (!author && /^Opinion by\s*/i.test(line)) {
        author = line.replace(/^Opinion by\s*/i, '').trim();
        continue;
      }
      if (line === '') {
        bodyStart = i + 1;
        break;
      }
    }

    var body = lines.slice(bodyStart).join('\n').trim();
    var paragraphs = body.split(/\n\s*\n/).map(function (chunk) {
      return chunk.trim();
    }).filter(Boolean);

    return {
      title: title,
      topic: topic,
      author: author,
      body: body,
      paragraphs: paragraphs,
      abstract: wordCount(body, 50)
    };
  }

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function renderParagraphs(container, paragraphs) {
    var html = '';

    paragraphs.forEach(function (paragraph) {
      var isHeading = paragraph.length < 80 && !/[.!?]$/.test(paragraph);
      if (isHeading) {
        html += '<h3>' + escapeHtml(paragraph) + '</h3>';
      } else if (/^References$/i.test(paragraph)) {
        html += '<h2>' + escapeHtml(paragraph) + '</h2>';
      } else {
        html += '<p>' + escapeHtml(paragraph).replace(/\n+/g, '<br>') + '</p>';
      }
    });

    container.innerHTML = html;
  }

  function buildPage(article, allArticles) {
    var titleEl = document.querySelector('.page-hero h1');
    var subEl = document.querySelector('.page-hero p:last-of-type');
    var bodyEl = document.getElementById('opinionArticleBody');
    var metaEl = document.getElementById('opinionArticleMeta');
    var abstractEl = document.getElementById('opinionArticleAbstract');
    var prevEl = document.getElementById('opinionPrev');
    var nextEl = document.getElementById('opinionNext');

    titleEl.textContent = article.title;
    subEl.textContent = article.topic || 'Opinion';
    document.title = article.title + ' | R2ML Commentary';
    metaEl.textContent = [article.topic, article.author].filter(Boolean).join(' · ');
    abstractEl.textContent = article.abstract;
    renderParagraphs(bodyEl, article.paragraphs);

    // Inject Article structured data for LLM / search discoverability
    var canonicalEl = document.getElementById('articleCanonical');
    var jsonLdEl = document.getElementById('articleJsonLd');
    var canonicalUrl = 'https://r2ml.org/opinion/article.html?slug=' + encodeURIComponent(article.slug);
    if (canonicalEl) canonicalEl.href = canonicalUrl;
    if (jsonLdEl) {
      jsonLdEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': canonicalUrl,
        'url': canonicalUrl,
        'headline': article.title,
        'description': article.abstract,
        'articleSection': article.topic || 'Opinion',
        'author': {
          '@type': 'Person',
          '@id': 'https://r2ml.org/#founder',
          'name': article.author || 'R2ML'
        },
        'publisher': {
          '@type': 'Organization',
          '@id': 'https://r2ml.org/#organization',
          'name': 'R2ML',
          'url': 'https://r2ml.org'
        },
        'isPartOf': {'@id': 'https://r2ml.org/#website'},
        'inLanguage': 'en-US'
      });
    }

    var index = allArticles.findIndex(function (item) {
      return item.slug === article.slug;
    });

    if (index > 0) {
      prevEl.href = 'article.html?slug=' + encodeURIComponent(allArticles[index - 1].slug);
      prevEl.style.display = 'inline-flex';
    } else {
      prevEl.style.display = 'none';
    }

    if (index >= 0 && index < allArticles.length - 1) {
      nextEl.href = 'article.html?slug=' + encodeURIComponent(allArticles[index + 1].slug);
      nextEl.style.display = 'inline-flex';
    } else {
      nextEl.style.display = 'none';
    }
  }

  function start() {
    var params = getParams();
    var slug = params.get('slug');

    fetch(manifestUrl)
      .then(function (response) { return response.ok ? response.json() : Promise.reject(new Error('Manifest response not ok')); })
      .then(function (articles) {
        if (!articles || !articles.length) throw new Error('No articles in manifest');

        var selected = articles[0];
        if (slug) {
          var found = articles.find(function (article) { return article.slug === slug; });
          if (found) selected = found;
        }

        var filePath = selected.file.startsWith('../') ? selected.file : ('./' + encodeURI(selected.file));
        return fetch(filePath)
          .then(function (response) { return response.ok ? response.text() : Promise.reject(new Error('Article file response not ok: ' + response.status)); })
          .then(function (text) {
            var parsed = parseArticleText(text);
            parsed.slug = selected.slug || slugify(parsed.title);
            selected.title = selected.title || parsed.title;
            selected.topic = selected.topic || parsed.topic;
            selected.author = selected.author || parsed.author;
            selected.abstract = parsed.abstract;
            selected.paragraphs = parsed.paragraphs;
            return { article: selected, allArticles: articles };
          });
      })
      .then(function (payload) {
        buildPage(payload.article, payload.allArticles);
      })
      .catch(function (error) {
        console.error('Opinion article load error:', error);
        var bodyEl = document.getElementById('opinionArticleBody');
        bodyEl.innerHTML = '<p>Unable to load the requested article right now. Check browser console for details.</p>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
