(function () {
  'use strict';

  var manifestUrl = 'opinion/articles.json';
  var state = {
    articles: [],
    currentIndex: 0,
    intervalId: null,
    titleEl: null,
    abstractEl: null,
    metaEl: null,
    linkEl: null,
    prevBtn: null,
    nextBtn: null
  };

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
    var abstract = wordCount(body, 50);

    return {
      title: title,
      topic: topic,
      author: author,
      body: body,
      abstract: abstract
    };
  }

  function getPageUrl(article) {
    return 'opinion/article.html?slug=' + encodeURIComponent(article.slug);
  }

  function renderArticle(index) {
    if (!state.articles.length) return;

    state.currentIndex = (index + state.articles.length) % state.articles.length;
    var article = state.articles[state.currentIndex];

    state.titleEl.innerHTML = '<a href="' + getPageUrl(article) + '">' + escapeHtml(article.title) + '</a>';
    state.abstractEl.textContent = article.abstract;
    state.metaEl.textContent = [article.topic, article.author].filter(Boolean).join(' · ');
    state.linkEl.href = getPageUrl(article);

    if (state.prevBtn) state.prevBtn.disabled = state.articles.length < 2;
    if (state.nextBtn) state.nextBtn.disabled = state.articles.length < 2;
  }

  function rotate(direction) {
    renderArticle(state.currentIndex + direction);
  }

  function buildSection() {
    var impactSection = Array.prototype.find.call(document.querySelectorAll('.section-block'), function (section) {
      var title = section.querySelector('.section-title');
      return title && title.textContent.trim() === 'Our Impact';
    });

    if (!impactSection || document.querySelector('.commentary-band')) return;

    var section = document.createElement('section');
    section.className = 'section-block commentary-band';
    section.id = 'commentary-band';
    section.innerHTML = [
      '<div class="container">',
      '  <p class="section-title">Commentary</p>',
      '  <h2>Latest opinion articles</h2>',
      '  <div class="row g-4 align-items-stretch">',
      '    <div class="col-lg-9">',
      '      <div class="commentary-card">',
      '        <div class="commentary-label">Featured article</div>',
      '        <h3 class="commentary-title mb-3"><a href="#">Loading…</a></h3>',
      '        <p class="commentary-abstract mb-3"></p>',
      '        <div class="commentary-meta"></div>',
      '      </div>',
      '    </div>',
      '    <div class="col-lg-3 d-flex align-items-end justify-content-lg-end">',
      '      <div class="d-flex flex-column gap-2 w-100">',
      '        <div class="commentary-nav">',
      '          <button type="button" class="prev-commentary" aria-label="Previous article">‹</button>',
      '          <button type="button" class="next-commentary" aria-label="Next article">›</button>',
      '        </div>',
      '        <a class="btn btn-secondary-theme w-100" href="#" id="viewCommentaryArticle">Read full article</a>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    impactSection.insertAdjacentElement('afterend', section);

    state.titleEl = section.querySelector('.commentary-title');
    state.abstractEl = section.querySelector('.commentary-abstract');
    state.metaEl = section.querySelector('.commentary-meta');
    state.linkEl = section.querySelector('#viewCommentaryArticle');
    state.prevBtn = section.querySelector('.prev-commentary');
    state.nextBtn = section.querySelector('.next-commentary');

    state.prevBtn.addEventListener('click', function () {
      rotate(-1);
    });
    state.nextBtn.addEventListener('click', function () {
      rotate(1);
    });

    if (window.fetch) {
      fetch(manifestUrl)
        .then(function (response) {
          return response.ok ? response.json() : Promise.reject(new Error('Manifest failed'));
        })
        .then(function (articles) {
          state.articles = articles || [];
          if (!state.articles.length) {
            state.titleEl.textContent = 'No commentary articles found';
            state.abstractEl.textContent = 'Add files to the opinion folder and register them in opinion/articles.json.';
            state.metaEl.textContent = '';
            state.linkEl.removeAttribute('href');
            state.prevBtn.disabled = true;
            state.nextBtn.disabled = true;
            return;
          }

          state.articles = state.articles.map(function (article) {
            return article;
          });

          return Promise.all(state.articles.map(function (article) {
            return fetch('opinion/' + article.file)
              .then(function (response) { return response.ok ? response.text() : Promise.reject(new Error('Article failed')); })
              .then(function (text) {
                var parsed = parseArticleText(text);
                article.abstract = parsed.abstract;
                if (!article.title) article.title = parsed.title;
                if (!article.topic) article.topic = parsed.topic;
                if (!article.author) article.author = parsed.author;
                return article;
              });
          }));
        })
        .then(function () {
          if (!state.articles.length) return;
          renderArticle(0);
          if (state.articles.length > 1) {
            state.intervalId = window.setInterval(function () {
              rotate(1);
            }, 8000);
          }
        })
        .catch(function () {
          state.titleEl.textContent = 'Commentary unavailable';
          state.abstractEl.textContent = 'The opinion feed could not be loaded right now.';
          state.metaEl.textContent = '';
          state.linkEl.removeAttribute('href');
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSection);
  } else {
    buildSection();
  }
})();
