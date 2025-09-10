/**
 * Universal price detection configuration
 * Works across all e-commerce websites by detecting price patterns in text content
 */

const UNIVERSAL_PRICE_CONFIG = {
    name: 'Universal E-commerce',
    // Comprehensive price patterns for different currencies and formats
    pricePatterns: [
        // Indian Rupee patterns
        /₹\s*[\d,]+(?:\.[\d]{1,2})?/g,           // ₹1,234 or ₹1,234.56
        /Rs\.?\s*[\d,]+(?:\.[\d]{1,2})?/gi,      // Rs 1,234 or Rs. 1,234.56
        /INR\s*[\d,]+(?:\.[\d]{1,2})?/gi,        // INR 1,234

        // US Dollar patterns
        /\$\s*[\d,]+(?:\.[\d]{1,2})?/g,          // $1,234 or $1,234.56
        /USD\s*[\d,]+(?:\.[\d]{1,2})?/gi,        // USD 1,234

        // Euro patterns
        /€\s*[\d,]+(?:\.[\d]{1,2})?/g,           // €1,234 or €1,234.56
        /EUR\s*[\d,]+(?:\.[\d]{1,2})?/gi,        // EUR 1,234

        // British Pound patterns
        /£\s*[\d,]+(?:\.[\d]{1,2})?/g,           // £1,234 or £1,234.56
        /GBP\s*[\d,]+(?:\.[\d]{1,2})?/gi,        // GBP 1,234

        // Other currencies
        /¥\s*[\d,]+(?:\.[\d]{1,2})?/g,           // ¥1,234 (Yen/Yuan)
        /JPY\s*[\d,]+(?:\.[\d]{1,2})?/gi,        // JPY 1,234
        /CNY\s*[\d,]+(?:\.[\d]{1,2})?/gi,        // CNY 1,234

        // Generic number patterns that might be prices (with currency context)
        /[\d,]+\.[\d]{2}\s*(?:only|off|save|discount)/gi,  // 1,234.56 only
        /(?:price|cost|amount):\s*[\d,]+(?:\.[\d]{1,2})?/gi // price: 1,234
    ],

    // Elements to exclude from price detection (to avoid false positives)
    excludeSelectors: [
        'script',
        'style',
        'noscript',
        '.breadcrumb',
        '.navigation',
        '.menu',
        '.header',
        '.footer',
        '[class*="date"]',
        '[class*="time"]',
        '[class*="phone"]',
        '[class*="zip"]',
        '[class*="postal"]'
    ]
};

/**
 * Detects if current site is an e-commerce website
 */
function detectSiteConfig() {
    const hostname = window.location.hostname.toLowerCase();

    // List of known e-commerce domains
    const ecommerceDomains = [
        'amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'meesho',
        'ebay', 'walmart', 'target', 'bestbuy', 'costco', 'homedepot',
        'shopify', 'woocommerce', 'magento', 'bigcommerce',
        'alibaba', 'aliexpress', 'etsy', 'overstock', 'wayfair'
    ];

    // Check if current site is likely an e-commerce site
    const isEcommerce = ecommerceDomains.some(domain => hostname.includes(domain)) ||
        hostname.includes('shop') ||
        hostname.includes('store') ||
        hostname.includes('buy') ||
        hostname.includes('cart') ||
        hostname.includes('mall');

    if (isEcommerce) {
        return {
            ...UNIVERSAL_PRICE_CONFIG,
            domain: hostname,
            siteName: getSiteName(hostname)
        };
    }

    return null;
}

/**
 * Gets a friendly site name from hostname
 */
function getSiteName(hostname) {
    if (hostname.includes('amazon')) return 'Amazon';
    if (hostname.includes('flipkart')) return 'Flipkart';
    if (hostname.includes('myntra')) return 'Myntra';
    if (hostname.includes('ajio')) return 'Ajio';
    if (hostname.includes('nykaa')) return 'Nykaa';
    if (hostname.includes('ebay')) return 'eBay';
    if (hostname.includes('walmart')) return 'Walmart';
    if (hostname.includes('target')) return 'Target';
    if (hostname.includes('meesho')) return 'Meesho';

    // Generic name for unknown sites
    return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
}

/**
 * Finds all elements containing price patterns using universal algorithm
 */
function findPriceElements() {
    const config = UNIVERSAL_PRICE_CONFIG;
    const priceElements = [];
    const processedElements = new Set();

    // Get all div, span, p, and other common elements that might contain prices
    const candidateElements = document.querySelectorAll('div, span, p, td, th, li, a, strong, b, em, i');

    candidateElements.forEach(element => {
        // Skip if already processed or if it's an excluded element
        if (processedElements.has(element) || shouldExcludeElement(element)) {
            return;
        }

        const text = element.innerText || element.textContent || '';

        // Check if element contains any price pattern
        const containsPrice = config.pricePatterns.some(pattern => {
            pattern.lastIndex = 0; // Reset regex
            return pattern.test(text);
        });

        if (containsPrice && isPriceElement(element, text)) {
            priceElements.push(element);
            processedElements.add(element);
        }
    });

    return priceElements;
}

/**
 * Checks if element should be excluded from price detection
 */
function shouldExcludeElement(element) {
    const config = UNIVERSAL_PRICE_CONFIG;

    // Check if element matches any exclude selector
    return config.excludeSelectors.some(selector => {
        try {
            return element.matches(selector) || element.closest(selector);
        } catch (e) {
            return false;
        }
    });
}

/**
 * Validates if an element is likely a price element
 */
function isPriceElement(element, text) {
    // Skip if text is too long (likely not just a price)
    if (text.length > 200) return false;

    // Skip if element is too large (likely not a price element)
    if (element.offsetWidth > 500 || element.offsetHeight > 200) return false;

    // Skip if element has too many child elements (likely a container)
    if (element.children.length > 5) return false;

    // Skip if text contains too many non-price words
    const words = text.trim().split(/\s+/);
    if (words.length > 10) return false;

    // Skip if it looks like a date, phone number, or other non-price number
    if (/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{10}|\d{3}-\d{3}-\d{4}/.test(text)) {
        return false;
    }

    return true;
}

/**
 * Gets the site configuration (universal for all sites)
 */
function getSiteConfig() {
    return detectSiteConfig();
}

// Export for use in content script (Node.js compatibility)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        UNIVERSAL_PRICE_CONFIG, 
        detectSiteConfig, 
        findPriceElements, 
        getSiteConfig 
    };
}