# Changelog

## Version 1.1.0

### ✨ Tính năng mới

- � **Anonymous Arrays**: Hỗ trợ format `[5]{fields}:` (không cần tên array)
- � **Siungle-line CSV**: Parse tất cả records trên 1 dòng liền mạch
- � **Impproved Parser**: Logic parse nâng cao cho continuous data

### �\* Cập nhật

- Thêm `parseAnonymousArray()` method
- Cải thiện `parseCompactArrayData()` cho single-line format
- Cập nhật content detection pattern
- Thêm test cases và demo files

## Version 1.0.0

### ✨ Tính năng chính

- 🎨 **4 Theme đẹp**: Dark, Light, Monokai, GitHub
- 🔄 **Chuyển đổi TOON ↔ JSON**: Chuyển đổi nhanh chóng giữa 2 định dạng
- 📋 **Copy nhanh**: Copy nội dung với 1 click
- 🌍 **Hỗ trợ Unicode đầy đủ**: Tiếng Việt, emoji, và tất cả ngôn ngữ
- 📊 **CSV Format**: Hỗ trợ compact array với quoted strings

### 🔧 Chi tiết kỹ thuật

#### Định dạng TOON được hỗ trợ:

1. **Simple key-value**

   ```toon
   name: John
   age: 30
   ```

2. **Nested objects**

   ```toon
   address:
     city: Hanoi
     country: Vietnam
   ```

3. **Simple arrays**

   ```toon
   tags[3]: javascript,python,go
   ```

4. **Compact arrays (CSV-like)**

   ```toon
   users[2]{id,name,role}:
   1,Alice,admin
   2,Bob,user
   ```

5. **Compact arrays with quoted strings** (NEW!)

   ```toon
   comments[2]{id,name,body}:
   1,John,"Text with, comma"
   2,Jane,"Multi-line\ntext here"
   ```

6. **Complex arrays**
   ```toon
   projects[2]:
   - id: 1
     name: Project A
   - id: 2
     name: Project B
   ```

#### Parser Features:

- ✅ CSV parsing với quoted strings
- ✅ Hỗ trợ dấu phẩy trong giá trị (wrapped in quotes)
- ✅ Hỗ trợ xuống dòng `\n` trong giá trị
- ✅ Escape sequences: `\n`, `\t`, `\"`, `\\`
- ✅ Unicode characters trong key names
- ✅ Tự động detect TOON content

### 📝 Files

- `manifest.json` - Chrome extension config (Manifest V3)
- `parser.js` - TOON ↔ JSON parser với CSV support + anonymous arrays
- `content.js` - Auto-detect và render TOON content
- `styles.css` - 4 themes với syntax highlighting
- `test-converter.html` - Offline converter tool (5 examples)
- `demo.html` - Demo file (English)
- `demo-vietnamese.html` - Demo file (Tiếng Việt)
- `demo-comments.html` - Demo file (CSV format)
- `demo-anonymous.html` - Demo file (Anonymous arrays) **NEW**

### 🧪 Testing

Sử dụng `test-parser.js` để test parser:

```bash
node test-parser.js
```

### 🚀 Installation

1. Thêm icons vào thư mục `icons/` (16x16, 48x48, 128x128)
2. Mở Chrome: `chrome://extensions/`
3. Bật "Developer mode"
4. Click "Load unpacked"
5. Chọn thư mục extension

### 🐛 Known Issues

None at this time!

### 📅 Release Dates

- **v1.1.0**: November 17, 2025 (Anonymous Arrays)
- **v1.0.0**: November 17, 2025 (Initial Release)
