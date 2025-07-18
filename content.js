// Check if we're on a Medium article and redirect to Freedium
(function() {
  let lastUrl = window.location.href;
  
  function checkAndRedirect() {
    const currentUrl = window.location.href;
    console.log('Quickdium: Checking URL:', currentUrl);

    // Skip if already on Freedium
    if (currentUrl.includes('freedium.cfd')) {
      console.log('Quickdium: Already on Freedium, skipping');
      return;
    }

    // Check if homepage
    if (currentUrl.endsWith('medium.com') || currentUrl.endsWith('medium.com/')) {
      console.log('Quickdium: Homepage detected, skipping');
      return;
    }

    // Whitelist for Medium base domains that should not be redirected
    const whitelistedHostNames = [
      'policy.medium.com',
      'blog.medium.com',
      'help.medium.com',
    ];

    // Whitelist for Medium URLs that should not be redirected
    const whitelistedUrls = [
      'medium.com/m/signin',
      'medium.com/jobs-at-medium',
      'medium.com/about',
      'medium.com/membership'
    ]

    const url = new URL(currentUrl);
    const fullPath = url.hostname + url.pathname;
    const hostOnly = url.hostname;

    // Check if current URL matches any whitelisted URL
    var isWhitelisted = whitelistedUrls.some(whitelistedUrl => {
      return fullPath === whitelistedUrl ||
             hostOnly === whitelistedUrl ||
             fullPath.startsWith(whitelistedUrl + '/') ||
             (whitelistedUrl.includes('/') && fullPath.startsWith(whitelistedUrl));
    });

    isWhitelisted = isWhitelisted || (whitelistedHostNames.some(whitelistedHostName => {
      return fullPath === whitelistedHostName ||
             hostOnly === whitelistedHostName;
    }));

    if (isWhitelisted) {
      console.log('Quickdium: URL is whitelisted, skipping');
      return;
    }

    // Method 1: Check URL patterns for known Medium sites
    const knownMediumDomains = [
      'medium.com',
      'towardsdatascience.com',
      'hackernoon.com',
      'netflixtechblog.com',
      'itnext.io',
      'codeburst.io',
      'freecodecamp.org',
      'levelup.gitconnected.com',
      'better.dev',
      'betterprogramming.pub',
      'javascript.plainenglish.io',
      'python.plainenglish.io',
      'aws.plainenglish.io',
      'uxplanet.org',
      'uxdesign.cc',
      'blog.bitsrc.io',
      'blog.prototypr.io',
      'envatotuts.com',
      'blog.usejournal.com'
    ];
    
    const isMediumByUrl = knownMediumDomains.some(domain => 
      currentUrl.includes(domain + '/') || 
      currentUrl.includes('.' + domain + '/') ||
      url.hostname === domain ||
      url.hostname.endsWith('.' + domain)
    );
    
    console.log('Quickdium: URL hostname:', url.hostname);
    console.log('Quickdium: isMediumByUrl:', isMediumByUrl);

    // Method 2: Check meta properties in head element
    const isMediumByMeta = () => {
      const metaProperties = [
        'ios:url',
        'android:url',
        'android:app_name',
        'ios:app_name'
      ];

      for (const property of metaProperties) {
        const metaTag = document.querySelector(`meta[property$="${property}"]`);
        if (metaTag && metaTag.content.toLowerCase().includes('medium')) {
          return true;
        }
      }
      
      // Check for Medium-specific meta tags and elements
      const mediumIndicators = [
        'meta[name="medium-site-verification"]',
        'meta[property="article:published_time"]',
        'meta[property="medium:collection"]',
        'script[src*="medium.com"]',
        'link[href*="medium.com"]',
        '.medium-zoom-image',
        '[data-medium-element]'
      ];
      
      for (const selector of mediumIndicators) {
        if (document.querySelector(selector)) {
          return true;
        }
      }
      
      return false;
    };

    // Check both methods
    const isMediumByMetaResult = isMediumByMeta();
    console.log('Quickdium: isMediumByMeta:', isMediumByMetaResult);
    
    const isMediumArticle = isMediumByUrl || isMediumByMetaResult;
    console.log('Quickdium: isMediumArticle:', isMediumArticle);

    if (isMediumArticle) {
      // Construct Freedium URL
      const freediumUrl = `https://freedium.cfd/${currentUrl}`;
      console.log('Quickdium: Redirecting to:', freediumUrl);

      // Redirect to Freedium
      window.location.replace(freediumUrl);
    } else {
      console.log('Quickdium: Not a Medium article, no redirect needed');
    }
  }
  
  // Initial check
  checkAndRedirect();
  
  // Listen for URL changes in SPAs
  function detectUrlChange() {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      console.log('Quickdium: URL changed, rechecking...');
      setTimeout(checkAndRedirect, 100); // Small delay to ensure DOM is updated
    }
  }
  
  // Method 1: Override history methods
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(detectUrlChange, 0);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(detectUrlChange, 0);
  };
  
  // Method 2: Listen for popstate (back/forward navigation)
  window.addEventListener('popstate', detectUrlChange);
  
  // Method 3: Fallback - periodic check for URL changes
  setInterval(detectUrlChange, 1000);
  
  // Method 4: Watch for DOM changes that might indicate navigation
  const observer = new MutationObserver(function() {
    detectUrlChange();
  });
  
  observer.observe(document, {
    childList: true,
    subtree: true
  });
})();