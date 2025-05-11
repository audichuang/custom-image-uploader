# Image Uploader for Inkdrop

A lightweight plugin that automatically uploads dropped image URLs to Imgur.

## Features

- 🔥 Simple and focused - uploads to Imgur only
- 🎯 Drag and drop image URLs to upload
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

## Usage

1. Copy an image URL from any source
2. Drag and drop the URL into Inkdrop editor
3. The plugin will automatically:
   - Download the image
   - Upload to Imgur
   - Insert the hosted image into your note

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Imgur Client ID | Your Imgur API Client ID | (empty) |
| Show Notifications | Display upload status notifications | Yes |
| Retain Original Link on Upload Failure | Keep original URL when upload fails | Yes |

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
