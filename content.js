// Check if we're on a Medium article and redirect to Freedium
(function() {
  const currentUrl = window.location.href;
  
  // Skip if already on Freedium
  if (currentUrl.includes('freedium.cfd')) {
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
      'og:ios:url',
      'og:android:url',
      'og:android:app_name',
      'og:ios:app_name'
    ];
    
    for (const property of metaProperties) {
      const metaTag = document.querySelector(`meta[property="${property}"]`);
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