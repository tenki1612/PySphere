# Ngày 01: Nhập môn Python - Cú pháp cơ bản, Biến số & Kiểu dữ liệu

## 🎯 Mục tiêu bài học
Chào mừng bạn đến với **Ngày 01** của hành trình 60 ngày chinh phục Python thực chiến! Trong bài học mở đầu này, bạn sẽ làm quen với những nền móng cốt lõi nhất của ngôn ngữ Python:
1. **Lệnh in và xuất dữ liệu (`print`)** - Viết dòng code đầu tiên.
2. **Quy tắc thụt lề (Indentation)** - Nét độc đáo định hình khối lệnh trong Python.
3. **Chú thích mã nguồn (Comments)** - Ghi chú code chuyên nghiệp chuẩn PEP 8.
4. **Khai báo biến & Quy ước đặt tên** - Tư duy Dynamic Typing.
5. **4 Kiểu dữ liệu nguyên thủy cốt lõi** - `int`, `float`, `str`, `bool` và hàm kiểm tra `type()`.
6. **Ép kiểu dữ liệu (Type Casting)** - Chuyển đổi linh hoạt giữa các kiểu.

---

## 💡 Lý thuyết Cốt lõi & Cú pháp Cơ bản

### 1. Dòng code đầu tiên: Lệnh xuất dữ liệu `print()`
Trong Python, bạn dùng hàm `print()` để xuất dữ liệu hoặc kết quả tính toán ra màn hình console:
```python
print("Hello, PySphere!")  # In chuỗi văn bản
print(2026)                # In số nguyên
print(10 + 20)             # In kết quả biểu thức (30)
```

---

### 2. Quy tắc Thụt lề (Indentation) - Cột sống của Python
Khác với C/C++ hay Java dùng cặp ngoặc nhọn `{}` để bao bọc khối lệnh, **Python dùng thụt lề (khoảng trắng)** để xác định khối mã:
- Chuẩn PEP 8 quy định: Sử dụng **4 khoảng trắng (4 spaces)** cho mỗi cấp độ thụt lề (hoặc 1 phím Tab).
- Các dòng lệnh cùng một khối phải có cùng khoảng cách thụt lề thẳng hàng.

```python
# Đúng cú pháp thụt lề:
if True:
    print("Dòng này thụt lề 4 spaces, thuộc khối if")
    print("Dòng này cũng cùng khối")
```

---

### 3. Chú thích mã nguồn (Comments)
Chú thích giúp giải thích ý nghĩa logic của mã nguồn mà không bị trình thông dịch thực thi:
- **Chú thích đơn dòng:** Bắt đầu bằng ký tự thăng `#`.
- **Chú thích nhiều dòng (Docstring):** Sử dụng 3 dấu ngoặc kép `"""..."""` hoặc `'''...'''`.

```python
# Đây là chú thích 1 dòng: Tính tổng tiền
total = 100

"""
Đây là Docstring nhiều dòng,
thường dùng để viết tài liệu hướng dẫn cho hàm, lớp hoặc module.
"""
```

---

### 4. Khai báo Biến số & Quy ước đặt tên (PEP 8)
Python là ngôn ngữ **Dynamic Typing (Định kiểu động)**: Bạn không cần khai báo kiểu dữ liệu như `int x = 10;`, chỉ cần gán giá trị bằng toán tử `=`:
- **Quy ước đặt tên biến chuẩn PEP 8 (`snake_case`):**
  - Viết thường toàn bộ, các từ phân tách bằng dấu gạch dưới: `user_name`, `total_price`, `is_active`.
  - Phân biệt chữ HOA và chữ thường (Case-sensitive): `age` và `Age` là hai biến hoàn toàn khác nhau.
  - Tên biến **không** được bắt đầu bằng chữ số (ví dụ: `1user` là sai, `user_1` là đúng).
  - Không trùng với từ khóa hệ thống (`for`, `if`, `class`, `def`...).

---

### 5. Bốn Kiểu Dữ liệu Nguyên thủy (Primitive Data Types)
Python cung cấp 4 kiểu cơ bản nhất:
1. `int` (Integer): Số nguyên không giới hạn độ dài (ví dụ: `42`, `-10`, `0`).
2. `float` (Floating-point): Số thực chứa phần thập phân (ví dụ: `3.14159`, `-0.5`, `1.0`).
3. `str` (String): Chuỗi ký tự đặt trong cặp nháy đơn `'...'` hoặc nháy kép `"..."` (ví dụ: `"Python"`, `'PySphere'`).
4. `bool` (Boolean): Giá trị chân lý logic, chỉ có 2 giá trị viết hoa chữ đầu: `True` hoặc `False`.

Kiểm tra kiểu dữ liệu của biến bất kỳ bằng hàm `type()`:
```python
x = 100
print(type(x))  # Kết quả: <class 'int'>
```

---

### 6. Ép kiểu dữ liệu (Type Casting)
Khi người dùng nhập dữ liệu hoặc đọc từ tập tin, dữ liệu thường ở dạng chuỗi (`str`). Ta cần ép kiểu để tính toán:
```python
age_str = "25"
age_num = int(age_str)      # Chuyển chuỗi "25" thành số nguyên 25
height_float = float("1.75") # Chuyển chuỗi "1.75" thành số thực 1.75
status_str = str(True)      # Chuyển bool True thành chuỗi "True"
```

---

## 💻 Đề bài thực hành Ngày 01

Hãy viết hàm `format_user_profile(name, age, height, is_active)` thực hiện các yêu cầu:
1. Nhận vào 4 tham số:
   - `name` (str): Họ tên người học.
   - `age`: Tuổi (có thể truyền vào dạng `int` hoặc `str` số, hãy ép kiểu an toàn về `int`).
   - `height` (float): Chiều cao theo mét (ví dụ `1.72`).
   - `is_active` (bool): Trạng thái học tập (`True` là đang hoạt động, `False` là tạm dừng).
2. Chuẩn hóa chuỗi hiển thị theo mẫu chính xác:
   `"[Tên] | Tuổi: [Tuổi] | Cao: [Chiều cao]m | Trạng thái: [Hoạt động/Tạm dừng]"`

*Ví dụ:*
```python
format_user_profile("Nguyen Van A", "20", 1.72, True)
# Trả về: "Nguyen Van A | Tuổi: 20 | Cao: 1.72m | Trạng thái: Hoạt động"

format_user_profile("Tran Thi B", 25, 1.65, False)
# Trả về: "Tran Thi B | Tuổi: 25 | Cao: 1.65m | Trạng thái: Tạm dừng"
```
