from PIL import Image, ImageDraw, ImageFont

def make_preview(template_name, header_color, accent_color, file_name):
    # Canvas
    width, height = 400, 500
    img = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(img)

    # Header
    draw.rectangle([0, 0, width, 100], fill=header_color)
    draw.text((20, 35), "John Doe", fill="white", font=None, anchor=None)
    draw.text((20, 65), "john@example.com | +91-9876543210", fill="white", font=None)

    # Section lines
    y = 130
    for section in ["Education", "Experience", "Skills"]:
        draw.text((30, y), section, fill=accent_color)
        draw.rectangle([30, y + 20, 370, y + 22], fill=accent_color)
        y += 70

    # Footer band
    draw.rectangle([0, height - 20, width, height], fill=accent_color)

    # Save
    img.save(f"static/previews/{file_name}", "PNG")
    print(f"✅ Created {file_name}")


# --- Generate all three ---
make_preview("modern", "#1E4DB4", "#508CFF", "modern_preview.png")
make_preview("creative", "#28A079", "#63D8A2", "creative_preview.png")
make_preview("simple", "#333333", "#888888", "simple_preview.png")
