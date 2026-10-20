#!/usr/bin/env python3
"""Write fair/precache.json: every file the kiosk needs offline, with sizes.

The version is a hash of all file contents, so any change — copy, code or an
image — makes tablets download the new set on their next online start.
Run after every edit to anything under fair/ (no dependencies needed).
"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {"tools"}
SKIP_FILES = {"precache.json", "sw.js", "README.md", ".DS_Store"}


def main():
    files = []
    digest = hashlib.sha256()
    for path in sorted(ROOT.rglob("*")):
        rel = path.relative_to(ROOT)
        if path.is_dir() or rel.parts[0] in SKIP_DIRS or path.name in SKIP_FILES or path.name.startswith("."):
            continue
        data = path.read_bytes()
        digest.update(str(rel).encode())
        digest.update(hashlib.sha256(data).digest())
        files.append({"url": rel.as_posix(), "bytes": len(data)})
    # the page itself first, the film last, so a slow connection gets a usable kiosk soonest
    files.sort(key=lambda f: (f["url"] != "index.html", f["url"].endswith(".mp4"), f["url"]))
    manifest = {"version": digest.hexdigest()[:12], "files": files}
    (ROOT / "precache.json").write_text(json.dumps(manifest, indent=1) + "\n")
    total = sum(f["bytes"] for f in files)
    print(f"precache.json: {len(files)} files, {total / 1e6:.1f} MB, version {manifest['version']}")


if __name__ == "__main__":
    main()
