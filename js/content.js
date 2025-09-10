class HideThePrices {
  constructor() {
    this.isActive = false;
    this.hiddenPrices = new Map();
    this.observer = null;
    this.siteConfig = null;
    this.init();
  }

  async init() {
    // Initialize site configuration
    this.siteConfig = getSiteConfig();

    // Exit early if site is not supported
    if (!this.siteConfig) {
      console.log('Price Hide: Site not supported');
      return;
    }

    console.log(`Price Hide: Detected ${this.siteConfig.siteName || this.siteConfig.name} (${this.siteConfig.domain})`);

    // Get initial state from storage
    const result = await chrome.storage.local.get(['priceHideActive']);
    this.isActive = !!result.priceHideActive; // Default to false

    if (this.isActive) {
      this.hidePrices();
      this.startObserver();
      this.startPeriodicScan();
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === 'toggleHide') {
        this.toggle();
        sendResponse({ active: this.isActive, site: this.siteConfig?.siteName || this.siteConfig?.name });
      } else if (message.action === 'getStatus') {
        sendResponse({ active: this.isActive, site: this.siteConfig?.siteName || this.siteConfig?.name });
      }
    });
  }

  toggle() {
    this.isActive = !this.isActive;
    chrome.storage.local.set({ priceHideActive: this.isActive });

    if (this.isActive) {
      this.hidePrices();
      this.startObserver();
      this.startPeriodicScan();
    } else {
      this.showPrices();
      this.stopObserver();
      this.stopPeriodicScan();
    }
  }

  hidePrices() {
    if (!this.siteConfig) {
      console.warn('Price Hide: No site configuration available');
      return;
    }

    // Use universal price detection algorithm
    const priceElements = findPriceElements();
    let totalElementsFound = 0;

    priceElements.forEach(element => {
      if (!element.classList.contains('price-hidden-element')) {
        this.hideElement(element);
        totalElementsFound++;
      }
    });

    console.log(`Price Hide: Found and removed ${totalElementsFound} price elements using universal algorithm`);
  }



  hideElement(element) {
    // Skip if already hidden
    if (element.classList.contains('price-hidden-element')) {
      return;
    }

    // Store original styles if not already stored
    if (!this.hiddenPrices.has(element)) {
      this.hiddenPrices.set(element, {
        display: element.style.display || '',
        visibility: element.style.visibility || '',
        opacity: element.style.opacity || '',
        height: element.style.height || '',
        width: element.style.width || '',
        overflow: element.style.overflow || ''
      });
    }

    // Mark as hidden and make completely invisible (but keep in DOM)
    element.classList.add('price-hidden-element');
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    element.style.height = '0';
    element.style.width = '0';
    element.style.overflow = 'hidden';
  }

  showPrices() {
    // Find all hidden elements and restore them
    const hiddenElements = document.querySelectorAll('.price-hidden-element');
    hiddenElements.forEach(element => {
      const originalData = this.hiddenPrices.get(element);
      if (originalData) {
        this.showElement(element, originalData);
      }
    });
    this.hiddenPrices.clear();
  }

  showElement(element, originalData) {
    // Remove hidden class
    element.classList.remove('price-hidden-element');

    // Restore original styles
    element.style.display = originalData.display;
    element.style.visibility = originalData.visibility;
    element.style.opacity = originalData.opacity;
    element.style.height = originalData.height;
    element.style.width = originalData.width;
    element.style.overflow = originalData.overflow;
  }

  startObserver() {
    if (this.observer || !this.siteConfig) return;

    this.observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if new content might contain prices
            const text = node.innerText || node.textContent || '';
            const config = this.siteConfig;
            
            // Quick check if the new content contains price patterns
            const mightContainPrices = config.pricePatterns.some(pattern => {
              pattern.lastIndex = 0;
              return pattern.test(text);
            });
            
            if (mightContainPrices) {
              shouldScan = true;
            }
          }
        });
      });
      
      // Only run full price detection if new content might contain prices
      if (shouldScan) {
        setTimeout(() => {
          if (this.isActive) {
            this.hidePrices();
          }
        }, 100); // Small delay to let DOM settle
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  startPeriodicScan() {
    // Scan for missed price elements every 2 seconds
    this.periodicScanInterval = setInterval(() => {
      if (this.isActive) {
        this.hidePrices();
      }
    }, 2000);
  }

  stopPeriodicScan() {
    if (this.periodicScanInterval) {
      clearInterval(this.periodicScanInterval);
      this.periodicScanInterval = null;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new HideThePrices());
} else {
  new HideThePrices();
}