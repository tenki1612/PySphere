# Ngày 21: Lập trình Hàm & Phạm vi Biến (Functions & Variable Scope)

## 🎯 Mục tiêu bài học
- Khai báo hàm với từ khóa `def`, tham số mặc định (default parameters).
- Tham số linh hoạt: `*args` (tuple vị trí) và `**kwargs` (dictionary từ khóa).
- Phạm vi biến: Local, Enclosing, Global, Built-in (Quy tắc LEGB).

## 💻 Đề bài thực hành
Viết hàm `process_scores(*scores, bonus: float = 0.0, scale: float = 1.0) -> dict`
1. `*scores`: Nhận bất kỳ số lượng điểm số nào (float/int). Nếu không có điểm nào truyền vào, trả về `{"count": 0, "average": 0.0, "max": 0.0, "min": 0.0}`.
2. Áp dụng công thức tính điểm mới cho từng điểm: `new_score = (score * scale) + bonus`. Điểm tối đa không vượt quá `100.0`.
3. Trả về một dictionary chứa:
   - `"count"`: Số lượng điểm
   - `"average"`: Điểm trung bình (làm tròn 2 chữ số thập phân)
   - `"max"`: Điểm cao nhất sau khi tính
   - `"min"`: Điểm thấp nhất sau khi tính
