# Inkdrop Custom Image Uploader

A plugin that automatically uploads dropped image URLs to various image hosting services.

## Features

- 🌟 Support for multiple image hosting services: Imgur, Cloudinary, SM.MS
- 🔄 Quick switching between image hosting services
- ⚙️ Simple configuration interface, no code modification required
- 📱 Automatic download and upload of images
- 💬 Friendly notification system
- 🔗 Option to retain original links on upload failure

## Installation

### From Inkdrop Plugin Market (Recommended)

1. Open Inkdrop
2. Go to Preferences (⌘,) > Plugins
3. Search for "custom-image-uploader"
4. Click "Install"

### Manual Installation

1. Download this project or use git clone
2. Create a symlink in Inkdrop's plugin directory:
   ```bash
   # macOS
   ln -s /path/to/custom-image-uploader ~/.config/inkdrop/packages/custom-image-uploader
   
   # Windows
   mklink /D "%APPDATA%\inkdrop\packages\custom-image-uploader" "path\to\custom-image-uploader"
   ```

## Configuration

### 1. Configure Image Hosting Services

Go to Inkdrop Preferences → Plugins → custom-image-uploader

#### Imgur
- Register an application at [Imgur API](https://api.imgur.com/oauth2/addclient)
- Copy the Client ID and paste it in settings

#### Cloudinary
- Sign up for [Cloudinary](https://cloudinary.com/)
- Get your Cloud Name
- Create an Upload Preset (Settings → Upload → Upload presets)
- Fill in Cloud Name and Upload Preset in settings

#### SM.MS
- Sign up for [SM.MS](https://smms.app/)
- Get your API Token
- Fill in API Key in settings

### 2. Choose Default Image Host

Select your preferred default image hosting service in settings.

## Usage

### Basic Usage

1. Copy an image URL from web or other sources
2. Drag and drop the URL into Inkdrop editor
3. The plugin will automatically:
   - Download the image
   - Upload to selected image host
   - Insert the image into your note

### Commands

Use Command Palette (⇧⌘P) to execute these commands:

- `custom-image-uploader:switch-to-imgur` - Switch to Imgur
- `custom-image-uploader:switch-to-cloudinary` - Switch to Cloudinary  
- `custom-image-uploader:switch-to-sm_ms` - Switch to SM.MS
- `custom-image-uploader:upload-from-clipboard` - Upload from clipboard (future feature)

## Settings

| Setting Name | Description | Default |
|-------------|-------------|---------|
| Default Image Host | Choose image host for dropped images | Imgur |
| Show Notifications | Show notifications on upload success/failure | Yes |
| Retain Original Path on Failure | Keep original URL when upload fails | Yes |

## Troubleshooting

### Common Issues

1. **Upload Failure**
   - Check internet connection
   - Verify API Key is correctly configured
   - Check if image hosting service is working

2. **Cannot Drop**
   - Ensure plugin is installed and enabled
   - Try restarting Inkdrop

3. **Settings Page Not Found**
   - Check plugin name is correct
   - Try reinstalling the plugin

### Logs

If you encounter issues, check detailed logs in Inkdrop Developer Tools:

1. Press `⌥⌘I` to open Developer Tools
2. Switch to Console tab
3. Look for related error messages

## Development

### Local Development

1. Clone the project
   ```bash
   git clone https://github.com/your-username/inkdrop-custom-image-uploader.git
   cd inkdrop-custom-image-uploader
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Link to Inkdrop
   ```bash
   npm link
   cd ~/.config/inkdrop/packages
   npm link inkdrop-custom-image-uploader
   ```

### Build

```bash
npm run build
```

## Contributing

Pull requests and issue reports are welcome!

## License

MIT License - See [LICENSE](LICENSE) file for details

## Changelog

### 1.0.0
- Initial release
- Support for Imgur, Cloudinary, SM.MS
- Basic drag-and-drop upload functionality
- Configuration interface

## Acknowledgments

- [Inkdrop](https://www.inkdrop.app/) - An excellent note-taking app
- All image hosting service providers
