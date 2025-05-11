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
  cloudinary: {
    name: 'Cloudinary',
    endpoint: 'https://api.cloudinary.com/v1_1/{cloudName}/image/upload',
    requiresAuth: false,
    requiresCloudName: true,
    requiresUploadPreset: true,
    parseResponse: (data) => data.secure_url
  },
  sm_ms: {
    name: 'SM.MS',
    endpoint: 'https://smms.app/api/v2/upload',
    requiresAuth: true,
    authType: 'bearerToken',
    parseResponse: (data) => data.data.url
  }
};

module.exports = {
  // 配置 schema - 這會在插件設定頁面中顯示
  config: {
    defaultImageHost: {
      title: 'Default Image Host Service',
      type: 'string',
      default: 'imgur',
      enum: Object.keys(IMAGE_HOST_CONFIGS),
      enumNames: Object.values(IMAGE_HOST_CONFIGS).map(config => config.name),
      description: 'Choose the default image hosting service'
    },
    imgur: {
      type: 'object',
      title: 'Imgur Settings',
      properties: {
        clientId: {
          type: 'string',
          title: 'Client ID',
          description: 'Your Imgur Client ID (https://api.imgur.com/oauth2/addclient)',
          default: ''
        }
      }
    },
    cloudinary: {
      type: 'object',
      title: 'Cloudinary Settings',
      properties: {
        cloudName: {
          type: 'string',
          title: 'Cloud Name',
          description: 'Your Cloudinary Cloud Name',
          default: ''
        },
        uploadPreset: {
          type: 'string',
          title: 'Upload Preset',
          description: 'Your Cloudinary Upload Preset',
          default: ''
        }
      }
    },
    sm_ms: {
      type: 'object',
      title: 'SM.MS Settings',
      properties: {
        apiKey: {
          type: 'string',
          title: 'API Key',
          description: 'Your SM.MS API Key (https://smms.app/home/apitoken)',
          default: ''
        }
      }
    },
    showNotifications: {
      type: 'boolean',
      title: 'Show Notifications',
      description: 'Show notifications on upload success or failure',
      default: true
    },
    retainOriginalPath: {
      type: 'boolean',
      title: 'Retain Original Link on Upload Failure',
      description: 'Keep the original image URL when upload fails',
      default: true
    }
  },
  
  activate() {
    // 註冊命令
    inkdrop.commands.add(document.body, {
      'custom-image-uploader:switch-to-imgur': () => this.setImageHost('imgur'),
      'custom-image-uploader:switch-to-cloudinary': () => this.setImageHost('cloudinary'),
      'custom-image-uploader:switch-to-sm_ms': () => this.setImageHost('sm_ms'),
      'custom-image-uploader:upload-from-clipboard': () => this.uploadFromClipboard(),
    });
    
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
    }
    
    // 移除命令
    inkdrop.commands.remove(document.body, 'custom-image-uploader:switch-to-imgur');
    inkdrop.commands.remove(document.body, 'custom-image-uploader:switch-to-cloudinary');
    inkdrop.commands.remove(document.body, 'custom-image-uploader:switch-to-sm_ms');
    inkdrop.commands.remove(document.body, 'custom-image-uploader:upload-from-clipboard');
  },
  
  handleEvent(editor) {
    const cm = editor.cm;
    this.functionOnDrop = this.insertImage.bind(this);
    cm.on('drop', this.functionOnDrop);
  },
  
  insertImage(cm, e) {
    const imageURL = e.dataTransfer.getData('url');
    if (!imageURL) {
      return false;
    }
    
    // 獲取當前配置的圖床
    const currentHost = inkdrop.config.get('inkdrop-custom-image-uploader.defaultImageHost');
    
    // 檢查是否已配置
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
      
      // 上傳到圖床
      this.uploadToImageHost(imageArrayBuffer, currentHost, (result) => {
        if (result.success) {
          this.handleUploadSuccess(cm, cursorPosition, result.url);
        } else {
          this.handleUploadFailure(cm, cursorPosition, imageURL, result.error);
        }
      });
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
  
  uploadToImageHost(imageArrayBuffer, hostName, callback) {
    const config = IMAGE_HOST_CONFIGS[hostName];
    const settings = inkdrop.config.get(`inkdrop-custom-image-uploader.${hostName}`);
    
    if (!config) {
      callback({ success: false, error: 'Unsupported image hosting service' });
      return;
    }
    
    // 構建端點 URL
    let endpoint = config.endpoint;
    if (config.requiresCloudName && settings.cloudName) {
      endpoint = endpoint.replace('{cloudName}', settings.cloudName);
    }
    
    const formData = new FormData();
    const blob = new Blob([imageArrayBuffer]);
    
    // 根據不同圖床設定表單數據
    if (hostName === 'imgur') {
      formData.append('image', blob);
    } else if (hostName === 'cloudinary') {
      formData.append('file', blob);
      if (settings.uploadPreset) {
        formData.append('upload_preset', settings.uploadPreset);
      }
    } else {
      formData.append('image', blob);
    }
    
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
    
    xhr.open('POST', endpoint);
    
    // 設定認證標頭
    if (config.requiresAuth) {
      if (config.authType === 'clientId' && settings.clientId) {
        xhr.setRequestHeader('Authorization', `Client-ID ${settings.clientId}`);
      } else if (config.authType === 'bearerToken' && settings.apiKey) {
        xhr.setRequestHeader('Authorization', `Bearer ${settings.apiKey}`);
      }
    }
    
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
    
    const retainOriginal = inkdrop.config.get('inkdrop-custom-image-uploader.retainOriginalPath');
    let replacement;
    
    if (retainOriginal) {
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
    const settings = inkdrop.config.get(`inkdrop-custom-image-uploader.${hostName}`);
    
    if (!config || !settings) return false;
    
    if (config.requiresAuth) {
      if (config.authType === 'clientId' && !settings.clientId) return false;
      if (config.authType === 'bearerToken' && !settings.apiKey) return false;
    }
    
    if (config.requiresCloudName && !settings.cloudName) return false;
    if (config.requiresUploadPreset && !settings.uploadPreset) return false;
    
    return true;
  },
  
  setImageHost(hostName) {
    if (!IMAGE_HOST_CONFIGS[hostName]) {
      this.showNotification(`Unsupported image hosting service: ${hostName}`, 'error');
      return;
    }
    
    if (!this.isImageHostConfigured(hostName)) {
      this.showNotification(`Please configure ${IMAGE_HOST_CONFIGS[hostName].name} service in settings first`, 'warning');
      return;
    }
    
    inkdrop.config.set('inkdrop-custom-image-uploader.defaultImageHost', hostName);
    this.showNotification(`Switched to image host: ${IMAGE_HOST_CONFIGS[hostName].name}`);
  },
  
  showNotification(message, type = 'info') {
    if (!inkdrop.config.get('inkdrop-custom-image-uploader.showNotifications')) return;
    
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
  },
  
  // 新增功能：從剪貼板上傳圖片
  uploadFromClipboard() {
    // 這個功能可以在未來實作
    this.showNotification('This feature is not yet implemented', 'warning');
  }
};
