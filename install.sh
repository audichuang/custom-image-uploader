#!/bin/bash

# 安裝腳本 - 將插件連結到 Inkdrop

# 檢查操作系統
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    INKDROP_DIR="${HOME}/.config/inkdrop/packages"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac OSX
    INKDROP_DIR="${HOME}/.config/inkdrop/packages"
elif [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    INKDROP_DIR="${APPDATA}/inkdrop/packages"
else
    echo "不支援的操作系統: $OSTYPE"
    exit 1
fi

# 創建 Inkdrop 插件目錄（如果不存在）
mkdir -p "$INKDROP_DIR"

# 取得當前目錄
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 創建軟連結
if [[ "$OSTYPE" == "win32" ]]; then
    # Windows 使用 mklink
    cmd //c "mklink /D \"$INKDROP_DIR\\inkdrop-custom-image-uploader\" \"$CURRENT_DIR\""
else
    # macOS 和 Linux 使用 ln
    ln -sf "$CURRENT_DIR" "$INKDROP_DIR/inkdrop-custom-image-uploader"
fi

echo "✅ 插件已成功安裝到 Inkdrop！"
echo "請重新啟動 Inkdrop 以載入新插件。"
