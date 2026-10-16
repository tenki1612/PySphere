import asyncio
import json
import os
import re
from pathlib import Path
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, init_db
from app.models.lesson import Lesson

CURRICULUM_DIR = Path(__file__).resolve().parent.parent.parent / "curriculum"


def parse_lesson_directory(day_dir: Path):
    """Parse a day curriculum directory and extract metadata."""
    dir_name = day_dir.name  # e.g. day_01_variables
    match = re.match(r"day_(\d+)_(.+)", dir_name)
    if not match:
        return None

    day_number = int(match.group(1))
    slug = match.group(2).replace("_", "-")

    # Determine stage
    parent_name = day_dir.parent.name
    if "stage_1" in parent_name:
        stage = 1
        topic = "Nền tảng Python"
    elif "stage_2" in parent_name:
        stage = 2
        topic = "Hàm & Xử lý lỗi"
    elif "stage_3" in parent_name:
        stage = 3
        topic = "OOP & Ứng dụng Web"
    else:
        stage = 1
        topic = "Tổng quan"

    # Read README.md for title and description
    readme_path = day_dir / "README.md"
    title = f"Ngày {day_number:02d}: {slug.capitalize()}"
    description_md = "Nội dung bài học đang được cập nhật."
    if readme_path.exists():
        content = readme_path.read_text(encoding="utf-8")
        description_md = content
        # Extract first h1 as title if present
        first_line = content.split("\n")[0]
        if first_line.startswith("# "):
            title = first_line.replace("# ", "").strip()

    # Read starter.py
    starter_path = day_dir / "starter.py"
    starter_code = ""
    if starter_path.exists():
        starter_code = starter_path.read_text(encoding="utf-8")

    # Read solution.py
    solution_path = day_dir / "solution.py"
    solution_code = ""
    if solution_path.exists():
        solution_code = solution_path.read_text(encoding="utf-8")

    # Read test_cases.json
    test_cases_path = day_dir / "test_cases.json"
    test_cases = []
    if test_cases_path.exists():
        try:
            test_cases = json.loads(test_cases_path.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"Warning: Failed to parse {test_cases_path}: {e}")

    # Map algorithm-focused days that require visualizer Canvas
    ALGORITHM_DAYS = {
        5: "sorting",
        6: "sorting",
        15: "loop_traversal",
        17: "loop_traversal",
        19: "nested_loops",
        20: "sorting",
        30: "recursion_tree",
        50: "array_matrix",
    }
    has_vis = day_number in ALGORITHM_DAYS
    vis_type = ALGORITHM_DAYS.get(day_number)

    return {
        "stage": stage,
        "day_number": day_number,
        "slug": f"day-{day_number:02d}-{slug}",
        "title": title,
        "topic": topic,
        "description_md": description_md,
        "starter_code": starter_code,
        "solution_code": solution_code,
        "test_cases": test_cases,
        "xp_reward": 50,
        "has_visualizer": has_vis,
        "visualizer_type": vis_type,
    }


async def seed_curriculum():
    """Populate database with curriculum lessons."""
    await init_db()
    async with AsyncSessionLocal() as session:
        count = 0
        if not CURRICULUM_DIR.exists():
            print(f"Curriculum directory not found at {CURRICULUM_DIR}")
            return 0

        # Scan all subdirectories
        for root, dirs, _ in os.walk(CURRICULUM_DIR):
            for d in sorted(dirs):
                if d.startswith("day_"):
                    day_path = Path(root) / d
                    lesson_data = parse_lesson_directory(day_path)
                    if not lesson_data:
                        continue

                    # Check if exists
                    stmt = select(Lesson).where(
                        Lesson.day_number == lesson_data["day_number"]
                    )
                    res = await session.execute(stmt)
                    existing = res.scalar_one_or_none()

                    if existing:
                        for k, v in lesson_data.items():
                            setattr(existing, k, v)
                    else:
                        lesson = Lesson(**lesson_data)
                        session.add(lesson)

                    count += 1

        await session.commit()
        print(f"Successfully seeded {count} lessons into database.")
        return count


if __name__ == "__main__":
    asyncio.run(seed_curriculum())

