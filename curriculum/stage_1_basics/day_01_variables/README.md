# Ngày 01: Biến số và Kiểu dữ liệu nguyên thủy (Variables & Data Types)

## 🎯 Mục tiêu bài học
Hôm nay bạn sẽ học cách khai báo biến, gán giá trị và làm việc với 4 kiểu dữ liệu nguyên thủy cơ bản trong Python:
- `int`: Số nguyên (ví dụ: `42`, `-7`)
- `float`: Số thực dấu phẩy động (ví dụ: `3.14`, `0.001`)
- `str`: Chuỗi ký tự (ví dụ: `"Python"`, `'PySphere'`)
- `bool`: Giá trị logic (`True` hoặc `False`)

## 💡 Lý thuyết cốt lõi
Trong Python, bạn không cần phải khai báo kiểu dữ liệu trước (Python là ngôn ngữ Dynamic Typing). Trình thông dịch sẽ tự suy diễn kiểu khi gán:

```python
age = 25              # Kiểu int
height = 1.75         # Kiểu float
name = "Alex"         # Kiểu str
is_learning = True    # Kiểu bool
```

Bạn có thể kiểm tra kiểu bằng hàm `type(x)` và ép kiểu:
```python
x = "100"
num = int(x)  # Chuyển đổi thành 100 (int)
```

---

## 💻 Đề bài thực hành
Viết hàm `format_user_profile(name, age, height, is_active)` nhận vào:
1. `name` (str): Họ tên người dùng
2. `age` (int hoặc str): Tuổi của người dùng (nếu là chuỗi thì cần ép kiểu thành int)
3. `height` (float): Chiều cao theo mét (ví dụ `1.75`)
4. `is_active` (bool): Trạng thái hoạt động

Hàm trả về một chuỗi văn bản theo định dạng chính xác:
`"[Tên] | Tuổi: [Tuổi] | Cao: [Chiều cao]m | Trạng thái: [Hoạt động/Tạm dừng]"`

*Ví dụ:*
`format_user_profile("Nguyen Van A", "20", 1.72, True)`
-> `"Nguyen Van A | Tuổi: 20 | Cao: 1.72m | Trạng thái: Hoạt động"`

