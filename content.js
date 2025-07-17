// Check if we're on a Medium article and redirect to Freedium
(function() {
  const currentUrl = window.location.href;
  
  // Skip if already on Freedium
  if (currentUrl.includes('freedium.cfd')) {
    return;
  }
  
  // Whitelist for Medium URLs that should not be redirected
  const whitelistedUrls = [
    'medium.com',
    'medium.com/m/signin',
    'policy.medium.com',
    'blog.medium.com',
    'medium.com/jobs-at-medium',
    'medium.com/about',
    'help.medium.com',
    'medium.com/membership'
  ];
  
  // Check if current URL matches any whitelisted URL
  const isWhitelisted = whitelistedUrls.some(whitelistedUrl => {
    const url = new URL(currentUrl);
    const fullPath = url.hostname + url.pathname;
    const hostOnly = url.hostname;
    
    return fullPath === whitelistedUrl || 
           hostOnly === whitelistedUrl ||
           fullPath.startsWith(whitelistedUrl + '/') ||
           (whitelistedUrl.includes('/') && fullPath.startsWith(whitelistedUrl));
  });
  
  if (isWhitelisted) {
    return;
  }
  
  // Method 1: Check URL patterns for known Medium sites
  const isMediumByUrl = (
    currentUrl.includes('medium.com/') ||
    currentUrl.includes('towardsdatascience.com/') ||
    currentUrl.includes('hackernoon.com/')
  );
  
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
    return false;
  };
  
  // Check both methods
  const isMediumArticle = isMediumByUrl || isMediumByMeta();
  
  if (isMediumArticle) {
    // Construct Freedium URL
    const freediumUrl = `https://freedium.cfd/${currentUrl}`;
    
    // Redirect to Freedium
    window.location.replace(freediumUrl);
  }
})();