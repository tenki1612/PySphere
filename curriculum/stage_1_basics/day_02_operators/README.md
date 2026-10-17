# Ngày 02: Toán tử & Biểu thức (Operators & Expressions)

## 🎯 1. Tổng quan kiến thức

Trong lập trình Python, **biểu thức (expression)** là sự kết hợp giữa các giá trị, biến số và **toán tử (operators)** để tính toán và trả về một kết quả cụ thể.

---

## 🧮 2. Các nhóm toán tử cơ bản trong Python

### 2.1. Toán tử số học (Arithmetic Operators)
Python hỗ trợ đầy đủ các phép toán đại số cơ bản và nâng cao:

| Toán tử | Ý nghĩa | Ví dụ | Kết quả | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| `+` | Phép cộng | `15 + 7` | `22` | Hỗ trợ cả nối chuỗi: `"Py" + "Sphere"` |
| `-` | Phép trừ | `20 - 8` | `12` | |
| `*` | Phép nhân | `6 * 7` | `42` | Hỗ trợ nhân bản chuỗi: `"=" * 5` -> `"====="` |
| `/` | Phép chia số thực | `7 / 2` | `3.5` | **Luôn luôn trả về kiểu số thực (`float`)** |
| `//` | Phép chia lấy nguyên | `7 // 2` | `3` | Cắt bỏ phần thập phân (Floor division) |
| `%` | Phép chia lấy dư | `7 % 2` | `1` | Dùng nhiều để kiểm tra số chẵn/lẻ |
| `**` | Phép lũy thừa | `2 ** 3` | `8` | Tương đương \(2^3\) |

> [!NOTE]
> Trong Python 3, phép chia `/` ngay cả khi chia hết như `4 / 2` vẫn trả về kiểu số thực `2.0`. Nếu bạn muốn lấy kết quả nguyên, hãy dùng `//`.

---

### 2.2. Thứ tự ưu tiên phép toán (PEMDAS)
Khi một biểu thức chứa nhiều phép toán, Python tuân theo quy tắc ưu tiên toán học:
1. **P**arentheses: Ngoặc đơn `(...)` được ưu tiên tính trước nhất.
2. **E**xponents: Lũy thừa `**`.
3. **M**ultiplication & **D**ivision: `*`, `/`, `//`, `%` (tính từ trái sang phải).
4. **A**ddition & **S**ubtraction: `+`, `-` (tính từ trái sang phải).

```python
result = 10 + 2 * 3 ** 2  # 3 ** 2 = 9 -> 2 * 9 = 18 -> 10 + 18 = 28
result_bracket = (10 + 2) * 3 ** 2  # 12 * 9 = 108
```

> [!TIP]
> Hãy luôn dùng ngoặc đơn `()` khi viết các biểu thức phức tạp. Điều này giúp mã nguồn rõ ràng và tránh các lỗi logic tiềm ẩn.

---

### 2.3. Toán tử gán kết hợp (Assignment Operators)
Giúp rút gọn cú pháp khi cập nhật giá trị của một biến:

```python
score = 100
score += 10   # Tương đương: score = score + 10  (score = 110)
score -= 5    # Tương đương: score = score - 5   (score = 105)
score *= 2    # Tương đương: score = score * 2   (score = 210)
score /= 3    # Tương đương: score = score / 3   (score = 70.0)
```

---

### 2.4. Toán tử so sánh (Comparison Operators)
Toán tử so sánh luôn trả về giá trị kiểu boolean: `True` hoặc `False`.

- `==` : So sánh bằng về mặt giá trị (`5 == 5` -> `True`)
- `!=` : So sánh khác nhau (`5 != 3` -> `True`)
- `>`  : Lớn hơn (`10 > 5` -> `True`)
- `<`  : Nhỏ hơn (`4 < 2` -> `False`)
- `>=` : Lớn hơn hoặc bằng (`5 >= 5` -> `True`)
- `<=` : Nhỏ hơn hoặc bằng (`3 <= 4` -> `True`)

> [!WARNING]
> Đừng nhầm lẫn giữa toán tử gán `=` (gán giá trị cho biến) và toán tử so sánh `==` (kiểm tra hai giá trị có bằng nhau không).

---

### 2.5. Toán tử logic (Logical Operators)
Dùng để kết hợp nhiều điều kiện logic với nhau:

- `and` : Trả về `True` nếu **cả hai vế** đều là `True`.
- `or`  : Trả về `True` nếu **ít nhất một vế** là `True`.
- `not` : Đảo ngược giá trị chân lý (`not True` -> `False`, `not False` -> `True`).

```python
age = 22
has_license = True

# Kiểm tra đủ điều kiện lái xe
can_drive = (age >= 18) and has_license  # True

# Đánh giá đoản mạch (Short-circuit evaluation):
# - Với 'and', nếu vế trái False thì vế phải không được tính.
# - Với 'or', nếu vế trái True thì vế phải không được tính.
```

---

## 💻 3. Đề bài thực hành

Bạn đang xây dựng module tính tiền cho một sàn thương mại điện tử. Hãy viết hàm:

```python
def calculate_discounted_price(original_price: float, discount_percent: float, is_vip: bool) -> float:
```

### Yêu cầu chi tiết:
1. **Giảm giá cơ bản:** Áp dụng `discount_percent` (%) trên giá gốc `original_price`.
   - Giá sau giảm giá cơ bản = `original_price * (1 - discount_percent / 100)`
2. **Ưu đãi VIP:** Nếu khách hàng là hội viên VIP (`is_vip == True`), giảm tiếp **5%** nữa trên số tiền đã giảm ở bước 1.
   - Giá VIP = `giá_sau_bước_1 * 0.95`
3. **Làm tròn kết quả:** Làm tròn số tiền cuối cùng đến 2 chữ số thập phân bằng hàm `round(value, 2)`.

---

### 💡 Ví dụ minh họa:
```python
# Ví dụ 1:
calculate_discounted_price(100.0, 10.0, True)
# 1. Sau giảm giá 10%: 100 * 0.9 = 90.0
# 2. Khách VIP giảm tiếp 5%: 90.0 * 0.95 = 85.5
# Kết quả trả về: 85.5

# Ví dụ 2:
calculate_discounted_price(200.0, 25.0, False)
# 1. Sau giảm giá 25%: 200 * 0.75 = 150.0
# 2. Không phải VIP: giữ nguyên 150.0
# Kết quả trả về: 150.0
```
