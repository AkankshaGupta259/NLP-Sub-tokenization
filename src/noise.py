import random

def inject_typographic_noise(text, intensity=0.1):
    chars = list(text)
    for i in range(len(chars)):
        if random.random() < intensity:
            # Simple swap noise
            if i < len(chars) - 1:
                chars[i], chars[i+1] = chars[i+1], chars[i]
    return "".join(chars)

def simulate_ocr_error(text):
    # Common OCR misreads
    replacements = {'o': '0', 'l': '1', 's': '5', 'i': '!'}
    return "".join([replacements.get(c, c) if random.random() < 0.05 else c for c in text])