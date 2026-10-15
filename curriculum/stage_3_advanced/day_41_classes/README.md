# Ngày 41: Lớp & Đối tượng trong Python (Classes & Objects)

## 🎯 Mục tiêu bài học
- Tư duy Lập trình Hướng đối tượng (OOP).
- Khởi tạo thuộc tính với phương thức đặc biệt `__init__`.
- Con trỏ `self` tham chiếu đến instance hiện tại.
- Xây dựng phương thức thể hiện (Instance methods) và đóng gói trạng thái.

## 💻 Đề bài thực hành
Xây dựng lớp `BankAccount` đại diện cho tài khoản ngân hàng:
1. `__init__(self, owner: str, initial_balance: float = 0.0)`: Khởi tạo chủ tài khoản `owner` và số dư ban đầu `balance` (mặc định 0.0). Nếu `initial_balance < 0`, gán số dư bằng `0.0`.
2. `deposit(self, amount: float) -> bool`: Nạp tiền vào tài khoản. Nếu `amount > 0`, cộng vào `balance` và trả về `True`. Ngược lại trả về `False`.
3. `withdraw(self, amount: float) -> bool`: Rút tiền. Nếu `0 < amount <= self.balance`, trừ tiền và trả về `True`. Nếu không đủ số dư hoặc số tiền âm, trả về `False`.
4. `get_balance(self) -> float`: Trả về số dư hiện tại đã làm tròn 2 chữ số thập phân.

