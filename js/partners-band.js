(function () {
  'use strict';

  var partnerItems = [
    { src: 'images/clients/RTI.png', alt: 'RTI International' },
    { src: 'images/clients/MHS.jpg', alt: 'Military Health System' },
    { src: 'images/clients/dvbic.png', alt: 'Defense and Veterans Brain Injury Center' },
    { src: 'images/clients/GDIT.png', alt: 'General Dynamics Information Technology' },
    { src: 'images/clients/bah.png', alt: 'Booz Allen Hamilton' },
    { src: 'images/clients/GovCIO.png', alt: 'GovCIO' },
    { src: 'images/clients/Altarum.jpg', alt: 'Altarum Institute' },
    { src: 'images/clients/RTI.png', alt: 'RTI International' }
  ];

  var state = {
    index: 0,
    track: null,
    prev: null,
    next: null,
    items: []
  };

  function getVisibleCount() {
    var width = window.innerWidth;
    if (width < 576) return 1;
    if (width < 768) return 2;
    if (width < 1200) return 3;
    return 4;
  }

  function getStepSize() {
    if (!state.items.length) return 0;

    var itemRect = state.items[0].getBoundingClientRect();
    var styles = window.getComputedStyle(state.track);
    var gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;

    return itemRect.width + gap;
  }

  function updateButtons() {
    var maxIndex = Math.max(0, state.items.length - getVisibleCount());

    if (state.prev) {
      state.prev.disabled = state.index <= 0;
    }

    if (state.next) {
      state.next.disabled = state.index >= maxIndex;
    }
  }

  function render() {
    if (!state.track || !state.items.length) return;

    var maxIndex = Math.max(0, state.items.length - getVisibleCount());
    state.index = Math.min(Math.max(state.index, 0), maxIndex);

    var step = getStepSize();
    state.track.style.transform = 'translateX(' + (-state.index * step) + 'px)';
    updateButtons();
  }

  function move(direction) {
    state.index += direction;
    render();
  }

  function buildSection() {
    if (document.querySelector('.partners-band')) return;

    var footer = document.querySelector('footer');
    if (!footer || !footer.parentNode) return;

    var prefix = window.location.pathname.indexOf('/crosswalk/') !== -1 ? '../' : '';

    var section = document.createElement('section');
    section.className = 'section-block partners-band';
    section.innerHTML = [
      '<div class="container">',
      '  <h2 class="mb-5 border-bottom pb-3">Partners &amp; Clients</h2>',
      '  <p class="text-muted mb-4 text-center">R2ML has partnered with leading organizations in government, health systems, and research</p>',
      '  <div class="partners-carousel">',
      '    <button class="partners-nav-btn" id="partnersNavPrev" type="button" aria-label="Previous partners" disabled>&lsaquo;</button>',
      '    <div class="partners-wrapper">',
      '      <div class="partners-track" id="partnersTrack">',
      partnerItems.map(function (item) {
        return '        <div class="partner-logo-item"><img src="' + prefix + item.src + '" alt="' + item.alt + '"></div>';
      }).join('\n'),
      '      </div>',
      '    </div>',
      '    <button class="partners-nav-btn" id="partnersNavNext" type="button" aria-label="Next partners">&rsaquo;</button>',
      '  </div>',
      '</div>'
    ].join('\n');

    footer.parentNode.insertBefore(section, footer);

    state.track = section.querySelector('#partnersTrack');
    state.prev = section.querySelector('#partnersNavPrev');
    state.next = section.querySelector('#partnersNavNext');
    state.items = Array.prototype.slice.call(section.querySelectorAll('.partner-logo-item'));

    state.prev.addEventListener('click', function (event) {
      event.preventDefault();
      move(-1);
    });

    state.next.addEventListener('click', function (event) {
      event.preventDefault();
      move(1);
    });

    window.previousPartnerSlide = function () {
      move(-1);
    };

    window.nextPartnerSlide = function () {
      move(1);
    };

    window.addEventListener('resize', function () {
      window.requestAnimationFrame(render);
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSection);
  } else {
    buildSection();
  }
})();