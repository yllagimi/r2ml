(function () {
  'use strict';

  // ─── VIDEO SLIDER ─────────────────────────────────────────────────
  var videos = [
    {
      title: 'TBI Analytics Overview – R2ML Video Briefing 1',
      src: 'https://www.youtube.com/embed/9BLYMc4RSZ8'
    },
    {
      title: 'Population Health & Machine Learning – Video Briefing 2',
      src: 'https://www.youtube.com/embed/H5qeaOyyTug?si=exdlFAvdU3lZfgV_'
    },
    {
      title: 'Surveillance & Policy Analytics – Video Briefing 3',
      src: 'https://www.youtube.com/embed/tURfr3ZfgmQ?si=nRlgpUwpQoVKLz8X'
    },
    {
      title: 'Predictive Modeling in Federal Health – Video Briefing 4',
      src: 'https://www.youtube.com/embed/2aAZIgVv_V8?si=50qmxDdIVG7yaDye'
    }
  ];

  var videoIndex = 0;

  function initVideoSlider() {
    var frame   = document.getElementById('videoFrame');
    var titleEl = document.getElementById('videoTitle');
    var countEl = document.getElementById('videoCount');
    var prevBtn = document.getElementById('videoPrev');
    var nextBtn = document.getElementById('videoNext');
    if (!frame) return;

    function renderVideo() {
      var v = videos[videoIndex];
      frame.src = v.src;
      if (titleEl) titleEl.textContent = v.title;
      if (countEl) countEl.textContent = (videoIndex + 1) + ' of ' + videos.length;
      if (prevBtn) prevBtn.disabled = (videoIndex === 0);
      if (nextBtn) nextBtn.disabled = (videoIndex === videos.length - 1);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () {
      if (videoIndex > 0) { videoIndex--; renderVideo(); }
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (videoIndex < videos.length - 1) { videoIndex++; renderVideo(); }
    });

    renderVideo();
  }

  // ─── RESEARCH SLIDER ──────────────────────────────────────────────
  var researches = [
    {
      title: 'Clinical Trajectories of Comorbidity Associated With Military-Sustained Mild TBI',
      category: 'TBI & Military Health',
      year: '2024',
      href: 'https://pubmed.ncbi.nlm.nih.gov/38758066/'
    },
    {
      title: 'Mechanisms of Injury for TBI Among U.S. Military Service Members Before and During COVID-19',
      category: 'TBI & Military Health',
      year: '2024',
      href: 'https://academic.oup.com/milmed/article/190/3-4/e830/7866810'
    },
    {
      title: 'Clusters of Conditions Among US Service Members Diagnosed with Mild TBI, 2017–2019',
      category: 'TBI & Military Health',
      year: '2022',
      href: 'https://pubmed.ncbi.nlm.nih.gov/36438977/'
    },
    {
      title: 'Benzodiazepine Prescription Patterns After Mild TBI in U.S. Military Service Members',
      category: 'Healthcare Policy',
      year: '2024',
      href: 'https://pubmed.ncbi.nlm.nih.gov/39028226/'
    },
    {
      title: 'Trends in Traumatic Brain Injury Among U.S. Service Members',
      category: 'TBI & Military Health',
      year: '2023',
      href: 'https://pubmed.ncbi.nlm.nih.gov/36870787/'
    },
    {
      title: 'Estimates of Long-Term Disability Among U.S. Service Members with TBI',
      category: 'TBI & Military Health',
      year: '2020',
      href: 'https://pubmed.ncbi.nlm.nih.gov/32472830/'
    }
  ];

  var resIndex = 0;

  function initResearchSlider() {
    var titleEl = document.getElementById('resTitle');
    var catEl   = document.getElementById('resCat');
    var linkEl  = document.getElementById('resLink');
    var countEl = document.getElementById('resCount');
    var prevBtn = document.getElementById('resPrev');
    var nextBtn = document.getElementById('resNext');
    if (!titleEl) return;

    function renderRes() {
      var r = researches[resIndex];
      titleEl.textContent = r.title;
      if (catEl)   catEl.textContent  = r.category + ' · ' + r.year;
      if (linkEl)  linkEl.href        = r.href;
      if (countEl) countEl.textContent = (resIndex + 1) + ' of ' + researches.length;
      if (prevBtn) prevBtn.disabled = (resIndex === 0);
      if (nextBtn) nextBtn.disabled = (resIndex === researches.length - 1);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () {
      if (resIndex > 0) { resIndex--; renderRes(); }
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (resIndex < researches.length - 1) { resIndex++; renderRes(); }
    });

    renderRes();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initVideoSlider();
      initResearchSlider();
    });
  } else {
    initVideoSlider();
    initResearchSlider();
  }
})();
