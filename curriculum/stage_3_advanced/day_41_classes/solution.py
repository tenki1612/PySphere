class BankAccount:
    def __init__(self, owner: str, initial_balance: float = 0.0):
        self.owner = owner
        self.balance = max(0.0, float(initial_balance))

    def deposit(self, amount: float) -> bool:
        if amount > 0:
            self.balance += amount
            return True
        return False

    def withdraw(self, amount: float) -> bool:
        if 0 < amount <= self.balance:
            self.balance -= amount
            return True
        return False

    def get_balance(self) -> float:
        return round(self.balance, 2)
