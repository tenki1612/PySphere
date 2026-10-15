def calculate_discounted_price(original_price: float, discount_percent: float, is_vip: bool) -> float:
    price_after_discount = original_price * (1 - discount_percent / 100)
    if is_vip:
        price_after_discount = price_after_discount * 0.95
    return round(price_after_discount, 2)
