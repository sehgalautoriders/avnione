"""Check the AVNI One website before it goes out, and write its build mark.

What it checks, on every .html page the site serves:
  1. The page is whole: it starts with <!doctype html>, has a <title> and a viewport line, and ends with </html>.
  2. Every local link and picture points to a file that exists. Local paths are RELATIVE (no leading "/"),
     because the site is served first at sehgalautoriders.github.io/avnione/ and later at avnione.com.
  3. Nothing private is on it: no e-mail address, no 10-digit mobile number, no key or token, no owner's name,
     no internal folder path (law 3 "Private means private" - the site is public by nature).
  4. Our words: the page speaks as "we", and never uses the word that our law bans for a half-done thing.
  5. Product pages (not the configurator, which has its own look) use the shared look: assets/site.css and assets/site.js.

The build mark (build.txt) is the first 12 signs of a SHA-256 over every served file except build.txt itself.
The release step reads it from the live site to prove the site serves this exact build. Nobody types it.

    python tools/check_site.py            check; fails if build.txt is not the mark of the files as they are now
    python tools/check_site.py --stamp    check, then write the new mark into build.txt
    python tools/check_site.py --root DIR check another copy (the release pipe checks its staged copy this way)
"""
import argparse
import hashlib
import os
import re
import sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", "tools", "docs", ".claude", "node_modules", "__pycache__"}
SKIP_FILES = {"build.txt", "README.md", ".gitattributes", ".git"}   # .git is a FILE in a git worktree (the pipe stages one)
OWN_LOOK_EXEMPT = {"computers/configure/index.html", "404.html"}

BAD = [
    (re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?"), "an e-mail address"),
    (re.compile(r"(?<![\d.])(?:\+91[\s-]?)?[6-9]\d{9}(?![\d.])"), "a 10-digit mobile number"),
    (re.compile(r"\b(?:sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{10,})"), "a key or token"),
    (re.compile(r"service_role|supabase\.co|BEGIN (?:RSA |EC )?PRIVATE KEY", re.I), "a key, a database address or a private key"),
    (re.compile(r"\bRavi\b|\bSehgal\b", re.I), "an owner's or a company's private name"),
    (re.compile(r"[A-Za-z]:\\\\?(?:Users|02 - OUR FILES)|/c/Users/|\\\\AVNI\\\\", re.I), "an internal folder path"),
    (re.compile(r"\bpartial(?:ly)?\b", re.I), "the banned word for a half-done thing"),
]
# Words allowed although they look like an e-mail (font and package names inside the configurator)
EMAIL_OK = re.compile(r"@(?:\d|media|keyframes|import|font-face|supports|page)", re.I)
REF = re.compile(r"""(?:href|src)\s*=\s*["']([^"'#?]+)(?:[?#][^"']*)?["']""", re.I)


def served_files(root):
    for dp, dns, fns in os.walk(root):
        dns[:] = sorted(d for d in dns if d not in SKIP_DIRS)
        for f in sorted(fns):
            rel = os.path.relpath(os.path.join(dp, f), root).replace("\\", "/")
            if rel in SKIP_FILES:
                continue
            yield rel


def mark(root):
    h = hashlib.sha256()
    for rel in served_files(root):
        h.update(rel.encode("utf-8") + b"\0")
        with open(os.path.join(root, rel), "rb") as fh:
            h.update(fh.read().replace(b"\r\n", b"\n"))   # the same mark on Windows and on GitHub
        h.update(b"\0")
    return h.hexdigest()[:12]


def check(root):
    faults = []
    pages = [r for r in served_files(root) if r.endswith(".html")]
    if "index.html" not in pages:
        faults.append("index.html: the home page is missing")
    for rel in pages:
        t = open(os.path.join(root, rel), encoding="utf-8").read()
        low = t.lower()
        if not low.lstrip().startswith("<!doctype html>"):
            faults.append(f"{rel}: does not start with <!doctype html>")
        if "<title>" not in low:
            faults.append(f"{rel}: no <title>")
        if 'name="viewport"' not in low:
            faults.append(f"{rel}: no viewport line (phones would show it tiny)")
        if not low.rstrip().endswith("</html>"):
            faults.append(f"{rel}: does not end with </html> (a broken file)")
        base = os.path.dirname(rel)
        for ref in REF.findall(t):
            ref = ref.strip()
            if not ref or "${" in ref or ref.startswith(("http://", "https://", "mailto:", "tel:", "data:", "javascript:", "//")):
                continue
            if ref.startswith("/"):
                faults.append(f"{rel}: '{ref}' starts with '/' - use a relative path")
                continue
            target = os.path.normpath(os.path.join(root, base, ref))
            if ref.endswith("/"):
                target = os.path.join(target, "index.html")
            if not os.path.exists(target):
                faults.append(f"{rel}: '{ref}' points to a file that does not exist")
        if rel not in OWN_LOOK_EXEMPT:
            for need in ("assets/site.css", "assets/site.js"):
                if need not in t:
                    faults.append(f"{rel}: does not use the shared look ({need})")
    for rel in served_files(root):
        if not rel.endswith((".html", ".css", ".js", ".txt", ".xml", ".svg", ".json", ".webmanifest")):
            continue
        t = open(os.path.join(root, rel), encoding="utf-8", errors="replace").read()
        for rx, what in BAD:
            for m in rx.finditer(t):
                s = m.group(0)
                if what == "an e-mail address" and (EMAIL_OK.search(s) or re.search(r"\.(png|jpg|svg|webp|js|css)$", s, re.I)):
                    continue
                line = t.count("\n", 0, m.start()) + 1
                faults.append(f"{rel}:{line}: carries {what}: '{s[:40]}'")
                break
    return faults, len(pages)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=HERE)
    ap.add_argument("--stamp", action="store_true", help="write the new build mark into build.txt")
    a = ap.parse_args()
    root = os.path.abspath(a.root)
    faults, n = check(root)
    m = mark(root)
    bt = os.path.join(root, "build.txt")
    if a.stamp and not faults:
        with open(bt, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(m + "\n")
    have = open(bt, encoding="utf-8").read().strip() if os.path.isfile(bt) else ""
    if have != m:
        faults.append(f"build.txt says '{have or 'nothing'}' but the files make '{m}' - run: python tools/check_site.py --stamp")
    if faults:
        print(f"FAILED - {len(faults)} fault(s) in {n} page(s):")
        for f in faults:
            print("  " + f)
        return 1
    print(f"OK - {n} page(s) checked, nothing private, every link found, build mark {m}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
