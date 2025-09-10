# Hide The Prices - Chrome Extension

A universal Chrome extension that helps you hide prices on any e-commerce website.

## 💡 Inspiration

This extension was born from a simple but relatable problem: whenever I show my Mom something online to choose from, she first sees the prices and then decides based on cost rather than preference. I wanted her to choose what she genuinely likes without being influenced by price tags. Since manually hiding prices by hand isn't practical, I built this extension to solve the problem automatically - now she can browse and pick what she truly wants, and we can discuss pricing afterward!

## 🌟 Features

- 🔒 **Universal Price Detection** - Works on any e-commerce website
- 🎛️ **Easy Toggle** - Simple on/off switch via popup interface
- 🌐 **Smart Detection** - Automatically detects e-commerce sites and price patterns
- 🚀 **Lightweight & Fast** - Minimal performance impact
- 🔄 **Real-time Updates** - Automatically hides new prices as you browse
- 🎯 **Intelligent Filtering** - Avoids false positives like dates, phone numbers
- ✨ **Complete Removal** - Prices are hidden from DOM but can be restored
- 💰 **Multi-Currency Support** - Supports ₹, $, €, £, ¥ and more

## 🚀 Installation

### From Source (Developer Mode)
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your toolbar

### From Chrome Web Store
*Coming soon - extension will be published to Chrome Web Store*

## 📖 Usage

1. Visit any e-commerce website (Amazon, Flipkart, Myntra, eBay, etc.)
2. Click the extension icon in your toolbar
3. Toggle "Hide Prices" on/off as needed
4. The popup shows which site is detected
5. Prices are instantly hidden from the page
6. Toggle off to restore all prices

## 🌍 Supported Sites

This extension uses a **universal algorithm** that works on any e-commerce website, including:

- **Major Platforms**: Amazon, Flipkart, Myntra, eBay, Walmart, Target, Best Buy
- **Regional Sites**: Ajio, Nykaa, Meesho, and more
- **E-commerce Platforms**: Shopify, WooCommerce, Magento stores
- **Any Website**: With price information in supported currencies

## 🛠️ Development

### Project Structure

```
hide-the-prices-extension/
├── manifest.json          # Extension configuration
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── icons/                # Extension icons (16, 32, 48, 128px)
├── html/
│   └── popup.html        # Popup interface
├── css/
│   ├── popup.css         # Popup styling
│   └── content.css       # Price hiding styles
└── js/
    ├── popup.js          # Popup functionality
    ├── background.js     # Service worker
    ├── site-configs.js   # Universal price detection algorithm
    └── content.js        # Main price hiding logic
```

### Key Technologies

- **Manifest V3** - Latest Chrome extension format
- **Service Worker** - Efficient background processing
- **Universal Algorithm** - Works across all e-commerce sites
- **Mutation Observer** - Real-time price detection
- **Local Storage** - Remembers user preferences

### How It Works

1. **Detection**: Scans page content for price patterns using regex
2. **Validation**: Filters out false positives (dates, phone numbers, etc.)
3. **Hiding**: Applies CSS to completely hide price elements
4. **Monitoring**: Watches for new content and hides prices dynamically
5. **Restoration**: Can restore all hidden prices when toggled off

### Universal Price Detection

The extension uses a sophisticated algorithm that:
- Detects multiple currency formats (₹1,234, $99.99, €50.00, etc.)
- Validates element size and content to avoid false positives
- Excludes navigation, headers, and other non-price content
- Works on any website without site-specific configuration

## 🔒 Privacy & Security

- ✅ **No Data Collection** - Extension doesn't collect or transmit any data
- ✅ **Local Storage Only** - Preferences stored locally on your device
- ✅ **No Tracking** - No analytics or user behavior tracking
- ✅ **Open Source** - Full source code available for review
- ✅ **Minimal Permissions** - Only requests necessary permissions

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. **Report Issues** - Found a bug or have a suggestion?
2. **Submit Pull Requests** - Improvements and new features
3. **Test on Different Sites** - Help improve compatibility
4. **Improve Documentation** - Help others understand the project

### Development Setup

1. Fork this repository
2. Make your changes
3. Test thoroughly on multiple e-commerce sites
4. Submit a pull request with a clear description

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.
