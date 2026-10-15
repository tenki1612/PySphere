def process_scores(*scores, bonus: float = 0.0, scale: float = 1.0) -> dict:
    if not scores:
        return {"count": 0, "average": 0.0, "max": 0.0, "min": 0.0}

    processed = [min(100.0, round((s * scale) + bonus, 2)) for s in scores]
    return {
        "count": len(processed),
        "average": round(sum(processed) / len(processed), 2),
        "max": max(processed),
        "min": min(processed),
    }

