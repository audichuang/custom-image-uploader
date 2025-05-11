'use babel';

// 圖床配置 schema
const IMAGE_HOST_CONFIGS = {
  imgur: {
    name: 'Imgur',
    endpoint: 'https://api.imgur.com/3/upload',
    requiresAuth: true,
    authType: 'clientId',
    parseResponse: (data) => data.data.link
  },
  lsky: {
    name: 'Lsky',
    endpoint: null, // 將從設定中獲取
    requiresAuth: true,
    authType: 'bearerToken',
    parseResponse: (data) => data.data.links.url
  }
};

module.exports = {
  // 配置 schema - 這會在插件設定頁面中顯示
  config: {
    'defaultImageHost': {
      'title': 'Default Image Host Service',
      'type': 'string',
      'default': 'imgur',
      'enum': ['imgur', 'lsky'],
      'enumNames': ['Imgur', 'Lsky'],
      'description': 'Choose the default image hosting service'
    },
    // Imgur 配置區塊
    'imgurSection': {
      'type': 'boolean',
      'title': ' 📷 Imgur Settings',
      'description': 'Configure Imgur settings (only needed if using Imgur as your image host)',
      'default': false
    },
    'imgurClientId': {
      'type': 'string',
      'title': 'Imgur Client ID',
      'description': 'Your Imgur Client ID (get from https://api.imgur.com/oauth2/addclient)',
      'default': ''
    },
    // Lsky 配置區塊
    'lskySection': {
      'type': 'boolean',
      'title': ' 🌍 Lsky Settings',
      'description': 'Configure Lsky settings (only needed if using Lsky as your image host)',
      'default': false
    },
    'lskyEndpoint': {
      'type': 'string',
      'title': 'Lsky API Endpoint',
      'description': 'Your Lsky instance API endpoint (e.g., https://your-lsky.com/api/v1/upload)',
      'default': 'https://lskypor.audiweb.uk/api/v1/upload'
    },
    'lskyToken': {
      'type': 'string',
      'title': 'Lsky Token',
      'description': 'Your Lsky Bearer Token (example: Bearer 1|1bJbwlqBfnggmOMEZqXT5XusaIwqiZjCDs7r1Ob5)',
      'default': ''
    },
    // 通用設定
    'generalSection': {
      'type': 'boolean',
      'title': ' ⚙️  General Settings',
      'description': 'Configure general behavior of the plugin',
      'default': false
    },
    'showNotifications': {
      'type': 'boolean',
      'title': 'Show Notifications',
      'description': 'Show notifications on upload success or failure',
      'default': true
    },
    'retainOriginalPath': {
      'type': 'boolean',
      'title': 'Retain Original Link on Upload Failure',
      'description': 'Keep the original image URL when upload fails',
      'default': true
    }
  },
  
  activate() {
    // 綁定編輯器事件
    if (inkdrop.isEditorActive()) {
      this.handleEvent.bind(this)(inkdrop.getActiveEditor());
    } else {
      global.inkdrop.onEditorLoad(this.handleEvent.bind(this));
    }
  },
  
  deactivate() {
    // 移除事件監聽器
    const editor = inkdrop.getActiveEditor();
    if (editor && editor.cm) {
      editor.cm.off('drop', this.functionOnDrop);
      editor.cm.off('paste', this.functionOnPaste);
    }
  },
  
  handleEvent(editor) {
    const cm = editor.cm;
    this.functionOnDrop = this.insertImage.bind(this);
    this.functionOnPaste = this.handlePaste.bind(this);
    cm.on('drop', this.functionOnDrop);
    cm.on('paste', this.functionOnPaste);
  },
  
  handlePaste(cm, event) {
    const clipboardData = event.clipboardData || window.clipboardData;
    const items = clipboardData.items;
    
    if (!items) return false;
    
    // 獲取當前配置的圖床
    const currentHost = inkdrop.config.get('image-uploader-plugin.defaultImageHost') || 'imgur';
    
    // 檢查剪貼板中是否有圖片
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 如果是圖片文件
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        
        // 檢查是否已配置圖床
        if (!this.isImageHostConfigured(currentHost)) {
          this.showNotification(`Please configure ${IMAGE_HOST_CONFIGS[currentHost].name} service in settings first`);
          return false;
        }
        
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => {
          const cursorPosition = cm.getCursor();
          cm.replaceSelection('');
          cm.replaceRange('![Uploading...]()', cursorPosition);
          
          // 根據當前圖床選擇上傳方法
          if (currentHost === 'imgur') {
            this.uploadToImgur(e.target.result, (result) => {
              if (result.success) {
                this.handleUploadSuccess(cm, cursorPosition, result.url);
              } else {
                this.handleUploadFailure(cm, cursorPosition, '', result.error);
              }
            });
          } else if (currentHost === 'lsky') {
            this.uploadToLsky(blob, (result) => {
              if (result.success) {
                this.handleUploadSuccess(cm, cursorPosition, result.url);
              } else {
                this.handleUploadFailure(cm, cursorPosition, '', result.error);
              }
            });
          }
        };
        reader.readAsArrayBuffer(blob);
        return true;
      }
    }
    
    // 檢查是否有圖片 URL
    const text = clipboardData.getData('text/plain');
    if (text && this.isImageUrl(text)) {
      event.preventDefault();
      this.insertImage(cm, { dataTransfer: { getData: () => text } });
      return true;
    }
    
    return false;
  },
  
  isImageUrl(url) {
    try {
      new URL(url);
      // 檢查是否包含常見的圖片格式
      return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url) || 
             url.includes('imgur.com') || 
             url.includes('i.redd.it') ||
             url.includes('picsum.photos');
    } catch {
      return false;
    }
  },
  
  insertImage(cm, e) {
    const imageURL = e.dataTransfer.getData('url');
    if (!imageURL) {
      return false;
    }
    
    // 獲取當前配置的圖床
    const currentHost = inkdrop.config.get('image-uploader-plugin.defaultImageHost') || 'imgur';
    
    // 檢查是否已配置圖床
    if (!this.isImageHostConfigured(currentHost)) {
      this.showNotification(`Please configure ${IMAGE_HOST_CONFIGS[currentHost].name} service in settings first`);
      return false;
    }
    
    // 顯示上傳狀態
    const cursorPosition = cm.getCursor();
    cm.replaceSelection('');
    cm.replaceRange('![Uploading...]()', cursorPosition);
    
    this.fetchImage(imageURL, (imageArrayBuffer) => {
      if (!imageArrayBuffer) {
        this.handleUploadFailure(cm, cursorPosition, imageURL);
        return;
      }
      
      // 根據當前圖床選擇上傳方法
      if (currentHost === 'imgur') {
        this.uploadToImgur(imageArrayBuffer, (result) => {
          if (result.success) {
            this.handleUploadSuccess(cm, cursorPosition, result.url);
          } else {
            this.handleUploadFailure(cm, cursorPosition, imageURL, result.error);
          }
        });
      } else if (currentHost === 'lsky') {
        // 將 ArrayBuffer 轉換為 Blob
        const blob = new Blob([imageArrayBuffer]);
        this.uploadToLsky(blob, (result) => {
          if (result.success) {
            this.handleUploadSuccess(cm, cursorPosition, result.url);
          } else {
            this.handleUploadFailure(cm, cursorPosition, imageURL, result.error);
          }
        });
      }
    });
  },
  
  fetchImage(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(this.response);
        } else {
          console.error('下載圖片失敗:', xhr.statusText);
          callback(null);
        }
      }
    };
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', url);
    xhr.send();
  },
  
  uploadToImgur(imageArrayBuffer, callback) {
    const config = IMAGE_HOST_CONFIGS.imgur;
    const clientId = inkdrop.config.get('image-uploader-plugin.imgurClientId');
    
    if (!clientId) {
      callback({ success: false, error: 'Imgur Client ID not configured' });
      return;
    }
    
    const formData = new FormData();
    const blob = new Blob([imageArrayBuffer]);
    formData.append('image', blob);
    
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            const imageUrl = config.parseResponse(response);
            if (imageUrl) {
              callback({ success: true, url: imageUrl });
            } else {
              callback({ success: false, error: 'Failed to parse response' });
            }
          } catch (error) {
            callback({ success: false, error: 'Failed to parse response' });
          }
        } else {
          callback({ success: false, error: `HTTP ${xhr.status}: ${xhr.statusText}` });
        }
      }
    };
    
    xhr.open('POST', config.endpoint);
    xhr.setRequestHeader('Authorization', `Client-ID ${clientId}`);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(formData);
  },
  
  uploadToLsky(blob, callback) {
    const baseConfig = IMAGE_HOST_CONFIGS.lsky;
    const customEndpoint = inkdrop.config.get('image-uploader-plugin.lskyEndpoint');
    const token = inkdrop.config.get('image-uploader-plugin.lskyToken');
    
    if (!customEndpoint) {
      callback({ success: false, error: 'Lsky API endpoint not configured' });
      return;
    }
    
    if (!token) {
      callback({ success: false, error: 'Lsky Token not configured' });
      return;
    }
    
    const formData = new FormData();
    formData.append('file', blob);
    
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.status) {
              const imageUrl = baseConfig.parseResponse(response);
              if (imageUrl) {
                callback({ success: true, url: imageUrl });
              } else {
                callback({ success: false, error: 'Failed to parse response' });
              }
            } else {
              callback({ success: false, error: response.message || 'Unknown error' });
            }
          } catch (error) {
            callback({ success: false, error: 'Failed to parse response' });
          }
        } else {
          callback({ success: false, error: `HTTP ${xhr.status}: ${xhr.statusText}` });
        }
      }
    };
    
    // 使用自定義的 API 端點
    xhr.open('POST', customEndpoint);
    xhr.setRequestHeader('Authorization', token);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(formData);
  },
  
  handleUploadSuccess(cm, cursorPosition, imageUrl) {
    // 替換上傳中的文字
    const endPos = {
      line: cursorPosition.line,
      ch: cursorPosition.ch + 15 // '![Uploading...]()' length
    };
    
    const imageMarkdown = `![](${imageUrl})`;
    cm.replaceRange(imageMarkdown, cursorPosition, endPos);
    
    this.showNotification('Image uploaded successfully!');
  },
  
  handleUploadFailure(cm, cursorPosition, originalUrl, error = null) {
    const endPos = {
      line: cursorPosition.line,
      ch: cursorPosition.ch + 15
    };
    
    const retainOriginal = inkdrop.config.get('image-uploader-plugin.retainOriginalPath');
    let replacement;
    
    if (retainOriginal && originalUrl) {
      replacement = `[Upload failed: Click to view original](${originalUrl})`;
    } else {
      replacement = `[Upload failed, please retry]`;
    }
    
    cm.replaceRange(replacement, cursorPosition, endPos);
    
    const errorMsg = error ? `Image upload failed: ${error}` : 'Image upload failed!';
    this.showNotification(errorMsg, 'error');
  },
  
  isImageHostConfigured(hostName) {
    const config = IMAGE_HOST_CONFIGS[hostName];
    if (!config) return false;
    
    if (hostName === 'imgur') {
      const clientId = inkdrop.config.get('image-uploader-plugin.imgurClientId');
      return !!clientId;
    } else if (hostName === 'lsky') {
      const endpoint = inkdrop.config.get('image-uploader-plugin.lskyEndpoint');
      const token = inkdrop.config.get('image-uploader-plugin.lskyToken');
      return !!endpoint && !!token;
    }
    
    return false;
  },
  
  showNotification(message, type = 'info') {
    if (!inkdrop.config.get('image-uploader-plugin.showNotifications')) return;
    
    switch (type) {
      case 'error':
        inkdrop.notifications.addError(message);
        break;
      case 'warning':
        inkdrop.notifications.addWarning(message);
        break;
      default:
        inkdrop.notifications.addInfo(message);
    }
  }
};
