# Icons

Để extension hoạt động đầy đủ, bạn cần thêm 3 file icon vào thư mục này:

- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## Cách tạo icons nhanh:

### Option 1: Sử dụng online tool

1. Truy cập https://favicon.io/favicon-generator/
2. Tạo icon với chữ "T" (cho TOON)
3. Download và đổi tên file

### Option 2: Sử dụng emoji

1. Truy cập https://favicon.io/emoji-favicons/
2. Chọn emoji phù hợp (ví dụ: 📄 hoặc 🔄)
3. Download và đổi tên file

### Option 3: Tạo bằng code (nếu có Python + Pillow)

```python
from PIL import Image, ImageDraw, ImageFont

def create_icon(size):
    img = Image.new('RGB', (size, size), color='#007acc')
    draw = ImageDraw.Draw(img)

    # Draw "T" letter
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

    return img

# Create icons
create_icon(16).save('icon16.png')
create_icon(48).save('icon48.png')
create_icon(128).save('icon128.png')
```

Sau khi có icons, extension sẽ sẵn sàng để load vào Chrome!
