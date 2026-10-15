"""Script to scaffold all 60 days of the curriculum taxonomy."""

import json
from pathlib import Path

CURRICULUM_DIR = Path(__file__).resolve().parent.parent.parent / "curriculum"

TOPICS = [
    # Stage 1: Basics (1-20)
    (1, 1, "variables", "Biến số & Kiểu dữ liệu nguyên thủy"),
    (1, 2, "operators", "Toán tử & Biểu thức"),
    (1, 3, "strings", "Chuỗi ký tự và Định dạng"),
    (1, 4, "string_methods", "Các phương thức xử lý chuỗi"),
    (1, 5, "lists", "Danh sách (Lists) cơ bản"),
    (1, 6, "list_methods", "Các phương thức thao tác danh sách"),
    (1, 7, "tuples", "Bộ dữ liệu bất biến (Tuples)"),
    (1, 8, "tuple_unpacking", "Unpacking và Slicing Tuples"),
    (1, 9, "sets", "Tập hợp (Sets) trong Python"),
    (1, 10, "set_operations", "Các phép toán tập hợp"),
    (1, 11, "dictionaries", "Từ điển (Dictionaries) cơ bản"),
    (1, 12, "dict_methods", "Thao tác từ điển nâng cao"),
    (1, 13, "conditionals", "Cấu trúc rẽ nhánh if-elif-else"),
    (1, 14, "nested_conditionals", "Cấu trúc điều kiện lồng nhau"),
    (1, 15, "while_loops", "Vòng lặp while cơ bản"),
    (1, 16, "loop_control", "Điều khiển vòng lặp break và continue"),
    (1, 17, "for_loops", "Vòng lặp for và duyệt tập hợp"),
    (1, 18, "range_enumerate", "Hàm range() và enumerate()"),
    (1, 19, "nested_loops", "Vòng lặp lồng nhau"),
    (1, 20, "basics_review", "Tổng kết & Thử thách Nền tảng Python"),
    # Stage 2: Functions & Error Handling (21-40)
    (2, 21, "functions", "Lập trình hàm & Scope"),
    (2, 22, "args_kwargs", "Tham số linh hoạt *args và **kwargs"),
    (2, 23, "variable_scope", "Quy tắc phạm vi biến LEGB"),
    (2, 24, "modules", "Mô-đun và Tái sử dụng mã nguồn"),
    (2, 25, "custom_modules", "Tự xây dựng package Python"),
    (2, 26, "list_comprehensions", "Kỹ thuật sinh List Comprehension"),
    (2, 27, "dict_comprehensions", "Kỹ thuật Dict & Set Comprehension"),
    (2, 28, "lambda_functions", "Hàm ẩn danh Lambda"),
    (2, 29, "higher_order_map_filter", "Hàm bậc cao map() và filter()"),
    (2, 30, "reduce_recursion", "Hàm reduce() và Đệ quy"),
    (2, 31, "type_hints", "Type Hinting & Kiểm soát kiểu"),
    (2, 32, "datetime_basics", "Xử lý Ngày giờ với Datetime"),
    (2, 33, "timezones", "Múi giờ & Định dạng thời gian"),
    (2, 34, "exceptions_try_except", "Xử lý ngoại lệ try-except"),
    (2, 35, "custom_exceptions", "Tự định nghĩa Custom Exception"),
    (2, 36, "regex_basics", "Biểu thức chính quy Regex cơ bản"),
    (2, 37, "regex_groups", "Trích xuất nhóm & Mẫu nâng cao Regex"),
    (2, 38, "file_io_text", "Đọc và ghi tập tin văn bản"),
    (2, 39, "file_io_json_csv", "Xử lý dữ liệu định dạng JSON & CSV"),
    (2, 40, "package_manager_pip", "Quản lý gói phụ thuộc với Pip"),
    # Stage 3: OOP, Data & Web (41-60)
    (3, 41, "classes", "Lớp & Đối tượng (OOP)"),
    (3, 42, "methods_attributes", "Phương thức & Thuộc tính đối tượng"),
    (3, 43, "inheritance", "Tính Kế thừa trong OOP"),
    (3, 44, "polymorphism", "Tính Đa hình & Nạp chồng"),
    (3, 45, "dunder_methods", "Phương thức đặc biệt Magic Methods"),
    (3, 46, "web_scraping_intro", "Nhập môn Web Scraping"),
    (3, 47, "beautifulsoup", "Trích xuất HTML với BeautifulSoup"),
    (3, 48, "virtual_environments", "Môi trường ảo venv & Poetry"),
    (3, 49, "math_statistics", "Toán học & Thống kê cơ bản"),
    (3, 50, "numpy_arrays", "Mảng đa chiều với NumPy"),
    (3, 51, "pandas_series", "Cấu trúc dữ liệu Pandas Series"),
    (3, 52, "pandas_dataframes", "Thao tác Bảng Pandas DataFrame"),
    (3, 53, "data_cleaning", "Làm sạch và Tiền xử lý dữ liệu"),
    (3, 54, "http_networking", "Giao thức HTTP & REST API"),
    (3, 55, "fastapi_intro", "Khởi tạo Web API với FastAPI"),
    (3, 56, "pydantic_validation", "Xác thực dữ liệu với Pydantic"),
    (3, 57, "mongodb_intro", "Cơ sở dữ liệu NoSQL & MongoDB"),
    (3, 58, "database_crud", "Thực hiện CRUD với Cơ sở dữ liệu"),
    (3, 59, "building_rest_api", "Xây dựng REST API hoàn chỉnh"),
    (3, 60, "capstone_deployment", "Dự án tốt nghiệp & Triển khai Cloud"),
]

STAGE_FOLDERS = {
    1: "stage_1_basics",
    2: "stage_2_functions",
    3: "stage_3_advanced",
}


def scaffold_all_lessons():
    """Generate directory structures and files for all 60 days."""
    created = 0
    for stage, day, slug, title in TOPICS:
        folder_name = STAGE_FOLDERS[stage]
        day_dir_name = f"day_{day:02d}_{slug}"
        target_dir = CURRICULUM_DIR / folder_name / day_dir_name

        if target_dir.exists():
            continue  # preserve existing deep exemplars

        target_dir.mkdir(parents=True, exist_ok=True)

        # README.md
        readme_content = f"""# Ngày {day:02d}: {title}

## 🎯 Mục tiêu bài học
Nắm vững kiến thức và kỹ năng thực hành về **{title}** trong lộ trình lập trình Python thực chiến.

## 💡 Lý thuyết cốt lõi
Hôm nay bạn sẽ tìm hiểu cú pháp, ứng dụng thực tế và cách áp dụng chuẩn PEP 8 cho chủ đề này.

## 💻 Đề bài thực hành
Viết hàm `solve_day_{day:02d}(data)` nhận vào dữ liệu và xử lý theo yêu cầu bài học.
"""
        (target_dir / "README.md").write_text(readme_content, encoding="utf-8")

        # starter.py
        starter_content = f"""def solve_day_{day:02d}(data):
    \"\"\"Giải bài tập Ngày {day:02d}: {title}\"\"\"
    # TODO: Cài đặt logic bài toán tại đây
    return data
"""
        (target_dir / "starter.py").write_text(starter_content, encoding="utf-8")

        # solution.py
        solution_content = f"""def solve_day_{day:02d}(data):
    return data
"""
        (target_dir / "solution.py").write_text(solution_content, encoding="utf-8")

        # test_cases.json
        test_cases = [
            {
                "name": f"Kiểm thử mặc định Ngày {day:02d}",
                "call": f"solve_day_{day:02d}('test')",
                "expected": "test",
            }
        ]
        (target_dir / "test_cases.json").write_text(
            json.dumps(test_cases, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        created += 1

    print(f"Scaffolded {created} missing curriculum lesson directories.")
    return created


if __name__ == "__main__":
    scaffold_all_lessons()

