# Hướng dẫn cài đặt TOON Viewer Extension

## Bước 1: Tạo Icons

Extension cần 3 file icon. Bạn có thể tạo nhanh bằng cách:

### Option A: Sử dụng online tool (Dễ nhất)

1. Truy cập https://favicon.io/favicon-generator/
2. Cấu hình:
   - Text: **T**
   - Background: **#007acc** (màu xanh)
   - Font: **Arial Bold**
   - Font Size: **80**
3. Click "Download" và giải nén
4. Copy 3 files vào thư mục `icons/`:
   - `favicon-16x16.png` → đổi tên thành `icon16.png`
   - `favicon-32x32.png` → đổi tên thành `icon48.png` (resize về 48x48 nếu cần)
   - `android-chrome-192x192.png` → đổi tên thành `icon128.png` (resize về 128x128)

### Option B: Sử dụng Python (Nếu có Python + Pillow)

```python
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    # Create blue background
    img = Image.new('RGB', (size, size), color='#007acc')
    draw = ImageDraw.Draw(img)

    # Draw white "T" letter
    font_size = int(size * 0.6)
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()

    text = "T"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    position = ((size - text_width) // 2, (size - text_height) // 2 - bbox[1])
    draw.text(position, text, fill='white', font=font)

    img.save(f'icons/{filename}')
    print(f'Created icons/{filename}')

# Create all icons
create_icon(16, 'icon16.png')
create_icon(48, 'icon48.png')
create_icon(128, 'icon128.png')
```

Chạy: `python create_icons.py`

## Bước 2: Load Extension vào Chrome

1. Mở Chrome browser
2. Truy cập `chrome://extensions/`
3. Bật **Developer mode** (toggle ở góc trên bên phải)
4. Click nút **Load unpacked**
5. Chọn thư mục chứa extension này
6. Extension sẽ xuất hiện trong danh sách với icon và tên "TOON Viewer"

## Bước 3: Test Extension

### Test 1: Demo files

1. Mở file `demo.html` trong Chrome
2. Extension sẽ tự động detect và hiển thị TOON content với syntax highlighting
3. Thử các tính năng:
   - Click "Convert to JSON" để chuyển đổi
   - Chọn theme khác từ dropdown
   - Click "Copy" để copy nội dung

### Test 2: Demo tiếng Việt

1. Mở file `demo-vietnamese.html`
2. Kiểm tra tiếng Việt hiển thị đúng

### Test 3: Demo CSV format

1. Mở file `demo-comments.html`
2. Kiểm tra compact array với quoted strings

### Test 4: Converter tool (offline)

1. Mở file `test-converter.html` trong browser
2. Click các nút Example để test
3. Thử convert TOON → JSON và ngược lại

## Troubleshooting

### Extension không xuất hiện

- Kiểm tra console trong `chrome://extensions/` xem có lỗi không
- Đảm bảo file `manifest.json` hợp lệ
- Đảm bảo có đủ 3 file icon trong thư mục `icons/`

### Content không được detect

- Kiểm tra xem trang có chứa `<pre>` tag với TOON content không
- Mở DevTools (F12) → Console để xem lỗi
- Extension chỉ hoạt động với trang có TOON format hợp lệ

### Syntax highlighting không đúng

- Kiểm tra file `styles.css` đã được load chưa
- Thử reload extension: click icon reload trong `chrome://extensions/`

### Parser lỗi

- Kiểm tra format TOON có đúng không
- Xem console để biết lỗi cụ thể
- Test với `test-parser.js`: `node test-parser.js`

## Uninstall

1. Truy cập `chrome://extensions/`
2. Tìm "TOON Viewer"
3. Click "Remove"

## Update Extension

Sau khi sửa code:

1. Truy cập `chrome://extensions/`
2. Tìm "TOON Viewer"
3. Click icon reload (🔄)
4. Refresh trang đang test

## Phát triển thêm

- Sửa `parser.js` để thêm logic parse
- Sửa `content.js` để thay đổi cách detect/render
- Sửa `styles.css` để thêm theme mới
- Test với `node test-parser.js` trước khi test trong browser

Chúc bạn sử dụng extension vui vẻ! 🎉
