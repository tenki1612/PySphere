class BankAccount:
    """Mô phỏng tài khoản ngân hàng đơn giản với các nghiệp vụ nạp/rút tiền an toàn."""

    def __init__(self, owner: str, initial_balance: float = 0.0):
        # TODO: Khởi tạo self.owner và self.balance (không để âm)
        pass

    def deposit(self, amount: float) -> bool:
        # TODO: Nạp tiền nếu amount > 0
        pass

    def withdraw(self, amount: float) -> bool:
        # TODO: Rút tiền nếu 0 < amount <= self.balance
        pass

    def get_balance(self) -> float:
        # TODO: Trả về số dư làm tròn 2 chữ số thập phân
        pass
