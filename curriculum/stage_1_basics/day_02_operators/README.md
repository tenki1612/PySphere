# Ngày 02: Toán tử & Biểu thức (Operators & Expressions)

## 🎯 Mục tiêu bài học
Nắm vững các toán tử trong Python:
- Toán tử số học: `+`, `-`, `*`, `/`, `//` (chia nguyên), `%` (chia lấy dư), `**` (lũy thừa).
- Toán tử so sánh: `==`, `!=`, `>`, `<`, `>=`, `<=`.
- Toán tử logic: `and`, `or`, `not`.

## 💻 Đề bài thực hành
Viết hàm `calculate_discounted_price(original_price: float, discount_percent: float, is_vip: bool) -> float`
1. Giảm giá ban đầu: `discount_percent` (%) áp dụng trên `original_price`.
2. Nếu khách hàng là VIP (`is_vip == True`), giảm thêm 5% nữa trên giá đã giảm.
3. Làm tròn kết quả 2 chữ số thập phân (`round(..., 2)`).

*Ví dụ:*
`calculate_discounted_price(100.0, 10.0, True)`
- Giá sau giảm 10%: `90.0`
- Giảm thêm 5% VIP: `90.0 * 0.95 = 85.5`
- Trả về: `85.5`
