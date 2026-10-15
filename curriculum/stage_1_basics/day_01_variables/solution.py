def format_user_profile(name: str, age, height: float, is_active: bool) -> str:
    age_int = int(age)
    status_str = "Hoạt động" if is_active else "Tạm dừng"
    return f"{name} | Tuổi: {age_int} | Cao: {height}m | Trạng thái: {status_str}"
