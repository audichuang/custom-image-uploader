# Image Uploader for Inkdrop

A plugin that automatically uploads dropped image URLs to various image hosting services.

## Features

- 🌟 Support for Imgur and Lsky image hosting
- 🎯 Drag and drop image URLs to upload
- 📋 Paste images from clipboard
- 🔄 Switch between image hosting services
- 🔐 Secure API key storage
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

### Imgur Setup

1. Go to [Imgur API](https://api.imgur.com/oauth2/addclient) to register an application
2. Choose "Anonymous usage without user authorization"
3. After registration, copy your Client ID
4. In Inkdrop: Preferences → Plugins → image-uploader-plugin
5. Paste your Client ID in the "Imgur Client ID" field

### Lsky Setup

1. Get your Lsky API Token from your Lsky instance
2. The token format should be: "Bearer 1|xxxxxx" 
3. In Inkdrop: Preferences → Plugins → image-uploader-plugin
4. Paste your token in the "Lsky Token" field

## Usage

### Ways to Upload Images

1. **Drag and Drop**: Drag an image URL from any source and drop it into the editor
2. **Paste Image**: Copy an image to clipboard and paste (Cmd+V) in the editor
3. **Paste URL**: Copy an image URL and paste it into the editor

The plugin will automatically:
- Download the image (for URLs)
- Upload to your selected image host
- Insert the hosted image into your note

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Default Image Host Service | Choose between Imgur and Lsky | Imgur |
| Imgur Client ID | Your Imgur API Client ID | (empty) |
| Lsky Token | Your Lsky Bearer Token | (empty) |
| Show Notifications | Display upload status notifications | Yes |
| Retain Original Link on Upload Failure | Keep original URL when upload fails | Yes |

## Commands

- Switch image hosting service through settings

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
