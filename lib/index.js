'use babel';

// 圖床配置 schema
const IMAGE_HOST_CONFIGS = {
  imgur: {
    name: 'Imgur',
    endpoint: 'https://api.imgur.com/3/upload',
    requiresAuth: true,
    authType: 'clientId',
    parseResponse: (data) => data.data.link
  }
};

module.exports = {
  // 配置 schema - 這會在插件設定頁面中顯示
  config: {
    'imgurClientId': {
      'type': 'string',
      'title': 'Imgur Client ID',
      'description': 'Your Imgur Client ID (get from https://api.imgur.com/oauth2/addclient)',
      'default': ''
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
    }
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
    
    // 檢查是否已配置 Imgur
    if (!this.isImageHostConfigured('imgur')) {
      this.showNotification(`Please configure Imgur Client ID in settings first`);
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
      
      // 上傳到 Imgur
      this.uploadToImgur(imageArrayBuffer, (result) => {
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
    if (hostName !== 'imgur') return false;
    
    const clientId = inkdrop.config.get('image-uploader-plugin.imgurClientId');
    return !!clientId;
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
  },
  
  // 新增功能：從剪貼板上傳圖片
  uploadFromClipboard() {
    // 這個功能可以在未來實作
    this.showNotification('This feature is not yet implemented', 'warning');
  }
};
