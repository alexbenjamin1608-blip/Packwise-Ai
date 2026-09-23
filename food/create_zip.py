import os
import zipfile
import shutil
from pathlib import Path

def create_project_zip():
    base_dir = Path(r"C:\Users\AKASH\Desktop\food")
    desktop_zip = Path(r"C:\Users\AKASH\Desktop\PackWise_AI_PackSmart_SIH236.zip")
    local_zip = base_dir / "PackWise_AI_PackSmart_SIH236.zip"

    exclude_dirs = {"node_modules", "dist", ".git", "__pycache__", ".vscode", ".oxlintrc.json"}
    exclude_extensions = {".zip", ".pyc"}

    print(f"Archiving project from {base_dir} to {desktop_zip}...")

    with zipfile.ZipFile(desktop_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(base_dir):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]

            for file in files:
                ext = Path(file).suffix.lower()
                if ext in exclude_extensions:
                    continue
                if file.startswith("."):
                    continue

                full_path = Path(root) / file
                rel_path = full_path.relative_to(base_dir)

                # Skip if it is inside any excluded pattern
                parts = set(rel_path.parts)
                if parts & exclude_dirs:
                    continue

                zf.write(full_path, rel_path)

    # Copy to workspace root as well
    shutil.copyfile(desktop_zip, local_zip)

    size_mb = desktop_zip.stat().st_size / (1024 * 1024)
    print(f"[SUCCESS] PackSmart Zip Archive created successfully!")
    print(f"File 1: {desktop_zip} ({size_mb:.2f} MB)")
    print(f"File 2: {local_zip} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    create_project_zip()
