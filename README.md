# TOON Viewer - Chrome Extension

Extension Chrome để xem và chuyển đổi định dạng TOON với syntax highlighting và nhiều theme.

## Tính năng

- ✨ Tự động phát hiện và hiển thị nội dung TOON
- 🔄 Chuyển đổi giữa TOON ↔ JSON
- 🎨 4 theme: Dark, Light, Monokai, GitHub
- 📋 Copy nội dung nhanh chóng
- 🎯 Syntax highlighting đẹp mắt

## Cài đặt

1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật "Developer mode" ở góc trên bên phải
3. Click "Load unpacked"
4. Chọn thư mục chứa extension này

## Sử dụng

1. Mở file .toon hoặc trang web có nội dung TOON
2. Extension sẽ tự động phát hiện và hiển thị với syntax highlighting
3. Sử dụng nút "Convert to JSON" để chuyển đổi sang JSON
4. Chọn theme yêu thích từ dropdown menu
5. Click "Copy" để copy nội dung

## Định dạng TOON

TOON là định dạng dữ liệu compact, dễ đọc:

### Ví dụ 1: Object đơn giản

```toon
orgName: Tech Avengers
established: 2024
public: false
headquarters:
  city: New York
  country: USA
```

### Ví dụ 2: Array compact

```toon
users[2]{id,name,role}:
1,Alice,admin
2,Bob,user
```

### Ví dụ 3: Array phức tạp

```toon
projects[2]:
- id: p-101
  name: Nexus
  team[2]{id,name}:
  1,Tony
  2,Bruce
- id: p-102
  name: Vision
  team[1]{id,name}:
  3,Wanda
```

## Phát triển

Extension được xây dựng với:

- Manifest V3
- Vanilla JavaScript
- CSS3 với nhiều theme
- Parser tùy chỉnh cho định dạng TOON

## License

MIT
