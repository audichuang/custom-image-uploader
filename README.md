# 🖼️ Image Uploader for Inkdrop

A powerful image hosting plugin for Inkdrop that automatically uploads your images to Imgur or Lsky services with drag & drop support.

## ✨ Features

- 🎯 **Dual Service Support**: Upload to Imgur or Lsky image hosting
- 🖱️ **Drag & Drop**: Drop image URLs directly into your editor
- 📋 **Clipboard Support**: Paste images from clipboard (Cmd+V / Ctrl+V)
- 🔄 **Service Switching**: Easy switching between image hosting services
- 🌍 **Custom Endpoints**: Support for self-hosted Lsky instances
- 🔔 **Smart Notifications**: Dismissable notifications with detailed messages
- 🔐 **Secure Configuration**: API token management

## 🚀 Quick Start

### 1. Installation

```bash
# Option 1: Via npm
npm install inkdrop-image-uploader-plugin

# Option 2: Via ipm (Inkdrop Package Manager)
ipm install image-uploader-plugin

# Option 3: Development install
cd /path/to/custom-image-uploader
ipm link --dev
```

Restart Inkdrop after installation.

### 2. Basic Configuration

1. Open: **Preferences → Plugins → image-uploader-plugin**
2. Choose your preferred service: **📷 Imgur** or **🌍 Lsky**

#### For Imgur Users:
1. Visit [Imgur API](https://api.imgur.com/oauth2/addclient)
2. Create a new application
3. Select "Anonymous usage only"
4. Copy your Client ID
5. Paste into **[📷 Imgur Only] Client ID** field

#### For Lsky Users:
1. Enter your instance URL in **[🌍 Lsky Only] API Endpoint**
   - Example: `https://your-lsky.com/api/v1/upload`
2. Enter your token in **[🌍 Lsky Only] Token**
   - Format: `Bearer 1|YOUR_TOKEN_HERE`

## 📚 How to Use

### Method 1: Drag & Drop
1. Copy any image URL
2. Drag the URL into your Inkdrop editor
3. The plugin automatically uploads and replaces with markdown

### Method 2: Clipboard
1. Copy an image to clipboard (screenshot, image file, etc.)
2. Paste (Cmd+V / Ctrl+V) in your editor
3. The plugin uploads and inserts the image

### Method 3: Direct URL Paste
1. Copy an image URL
2. Paste it directly in the editor
3. The plugin detects and uploads supported image URLs

## ⚙️ Configuration Reference

| Setting | Description | Default | Example |
|---------|-------------|---------|---------|
| **Choose Your Image Host** | Select primary service | Imgur | Imgur / Lsky |
| **[📷 Imgur Only] Client ID** | Imgur API authentication | - | abc123xyz |
| **[🌍 Lsky Only] API Endpoint** | Your Lsky instance URL | lskypor.audiweb.uk | https://your.lsky.com/api/v1/upload |
| **[🌍 Lsky Only] Token** | Lsky authentication token | - | Bearer 1\|xxx |
| **Show Notifications** | Display upload status | ✓ | ✓ / ✗ |
| **Retain Original Link** | Keep original on failure | ✓ | ✓ / ✗ |

## 🔔 Notification System

The plugin provides informative notifications that can be manually dismissed:

- **Success Notifications**: Show which service was used
- **Error Notifications**: Include troubleshooting hints
- **All Dismissable**: Click the × button to close
- **Detailed Information**: Hover for more context

## 🛠️ Advanced Configuration

### Custom Lsky Instance
```json
{
  "endpoint": "https://your-domain.com/api/v1/upload",
  "token": "Bearer 1|your_token_here",
  "strategy": "private" // or "public"
}
```

### Supported Image Formats
- JPG/JPEG
- PNG
- GIF
- WebP
- BMP
- URLs from: Imgur, Reddit, Picsum Photos

## 📋 Troubleshooting

### Common Issues

**Issue**: Upload fails with "Configuration error"  
**Solution**: Check your API credentials and endpoint URLs

**Issue**: Images not uploading on paste  
**Solution**: Ensure your clipboard contains actual image data, not just URLs

**Issue**: Too many notification popups  
**Solution**: Click the × button to dismiss notifications manually

**Issue**: Can't see Lsky settings  
**Solution**: Scroll down in settings - all options are always visible

### Debug Mode

Enable verbose logging by setting:
```javascript
inkdrop.config.set('core.debugMode', true)
```

## 🔐 Security Notes

- API keys are stored securely in Inkdrop's configuration
- No image data is stored locally
- All uploads use HTTPS
- Bearer tokens are transmitted securely

## 📝 Changelog

### Version 0.1.8
- Added dismissable notifications
- Enhanced error messages with troubleshooting hints
- Improved success notifications with service information
- Updated configuration descriptions

### Version 0.1.7
- Improved Lsky support
- Added custom endpoint configuration
- Enhanced error handling

### Version 0.1.0
- Initial release
- Basic Imgur support
- Drag & drop functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Inkdrop](https://inkdrop.app) - Amazing note-taking app
- [Imgur API](https://apidocs.imgur.com/) - Free image hosting
- [Lsky Pro](https://www.lsky.pro/) - Open-source image hosting

## 📧 Support

- Issue Tracker: [GitHub Issues](https://github.com/audichuang/custom-image-uploader/issues)
- Email: audi51408@gmail.com
- Documentation: [Wiki](https://github.com/audichuang/custom-image-uploader/wiki)

---

Made with ❤️ by [audi](https://github.com/audichuang)
