# Image Uploader for Inkdrop

A simple plugin that automatically uploads images to Imgur or Lsky image hosting services.

## Features

- 🌟 Support for Imgur and Lsky
- 🎯 Drag and drop image URLs
- 📋 Paste images from clipboard
- 🔄 Switch between services
- 🌍 Custom Lsky endpoints

## Installation

```bash
cd /path/to/custom-image-uploader
ipm link --dev
```

Restart Inkdrop after installation.

## Configuration Guide

Due to Inkdrop's settings system limitations, all options are always visible. However, you only need to configure options for your chosen service:

### Step 1: Choose Your Service
1. Open: Preferences → Plugins → image-uploader-plugin
2. Select either **📷 Imgur (Simple)** or **🌍 Lsky (Custom)**

### Step 2: Configure Your Choice

#### If you chose Imgur:
- Fill in **[📷 Imgur Only] Client ID**
- Get it from [Imgur API](https://api.imgur.com/oauth2/addclient)
- Choose "Anonymous usage"
- **Ignore all Lsky settings**

#### If you chose Lsky:
- Fill in **[🌍 Lsky Only] API Endpoint**
- Fill in **[🌍 Lsky Only] Token**
- **Ignore Imgur settings**

## Usage

- **Drag & Drop**: Drop image URLs into editor
- **Paste**: Copy/paste images (Cmd+V)
- **Automatic**: Images upload to your chosen service

## Settings Reference

| Setting | When to Use | Example |
|---------|-------------|---------|
| Choose Your Image Host | Always | Select Imgur or Lsky |
| [📷 Imgur Only] Client ID | When using Imgur | abc123xyz |
| [🌍 Lsky Only] API Endpoint | When using Lsky | https://your.lsky.com/api/v1/upload |
| [🌍 Lsky Only] Token | When using Lsky | Bearer 1\|xxx |
| Show Notifications | Always | ✓ Enabled |
| Retain Original Link | Always | ✓ Enabled |

## Troubleshooting

**Problem**: Too many settings visible  
**Solution**: This is a limitation of Inkdrop. Just ignore settings for the service you're not using.

**Problem**: Not sure which settings to fill  
**Solution**: Look for the emoji markers - 📷 for Imgur, 🌍 for Lsky

## License

MIT
