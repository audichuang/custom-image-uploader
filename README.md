# Image Uploader for Inkdrop

A plugin that automatically uploads dropped image URLs to various image hosting services.

## Features

- 🌟 Support for Imgur and Lsky image hosting
- 🎯 Drag and drop image URLs to upload
- 📋 Paste images from clipboard
- 🔄 Switch between image hosting services
- 🔐 Secure API key storage
- 🌍 Custom Lsky instance support
- 💬 Upload success/failure notifications
- 🔗 Option to retain original links on failure

## Installation

### From Local Development

```bash
cd /path/to/custom-image-uploader
ipm link --dev
```

Then restart Inkdrop.

## Configuration

Configure the plugin in Inkdrop: Preferences → Plugins → image-uploader-plugin

### 1. Select Default Image Host

Choose between Imgur and Lsky as your default image hosting service.

### 2. Configure Your Selected Service

#### Imgur Setup

1. Go to [Imgur API](https://api.imgur.com/oauth2/addclient) to register an application
2. Choose "Anonymous usage without user authorization"
3. After registration, copy your Client ID
4. Paste your Client ID in the "Imgur Client ID" field

#### Lsky Setup

1. Enter your Lsky instance API endpoint:
   - Default: `https://lskypor.audiweb.uk/api/v1/upload`
   - Custom: `https://your-lsky.com/api/v1/upload`
2. Get your Lsky API Token from your Lsky instance
3. Enter your token in the "Lsky Token" field
   - Format: `Bearer 1|xxxxxx`

### 3. Configure General Settings

- **Show Notifications**: Enable/disable upload status notifications
- **Retain Original Link on Upload Failure**: Keep original URL when upload fails

## Usage

### Ways to Upload Images

1. **Drag and Drop**: Drag an image URL from any source and drop it into the editor
2. **Paste Image**: Copy an image to clipboard and paste (Cmd+V) in the editor
3. **Paste URL**: Copy an image URL and paste it into the editor

The plugin will automatically:
- Download the image (for URLs)
- Upload to your selected image host
- Insert the hosted image into your note

## Settings Overview

| Setting | Description | Default |
|---------|-------------|---------|
| **Default Image Host Service** | Choose between Imgur and Lsky | Imgur |
| **📷 Imgur Settings** | | |
| └─ Imgur Client ID | Your Imgur API Client ID | (empty) |
| **🌍 Lsky Settings** | | |
| └─ Lsky API Endpoint | Your Lsky instance URL | https://lskypor.audiweb.uk/api/v1/upload |
| └─ Lsky Token | Your Lsky Bearer Token | (empty) |
| **⚙️ General Settings** | | |
| └─ Show Notifications | Display upload status | Yes |
| └─ Retain Original Link | Keep URL on failure | Yes |

## Development

```bash
# Clone the project
git clone [repository-url]
cd custom-image-uploader

# Install dependencies
npm install

# Link for development
ipm link --dev

# Make changes and reload Inkdrop (Cmd+R)
```

## License

MIT

## Contributing

Issues and pull requests are welcome!
