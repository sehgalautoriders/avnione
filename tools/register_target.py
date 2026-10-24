"""Connect the AVNI One website (WP-0066) to Release Control as its own Stage 2 target: AVNI-ONE-WEB, chain avni-one-web.

The same road AVNI 3D Design Studio (WP-0063) and AVNI Architect (WP-0064) took: through the release module, under the release
authority (the pipe's own key, read the way avni_release.py release reads it), with a copy of targets.json kept before the change and
a SET-PRODUCTION baseline ("nothing installed yet") so the first release has a base. Running it twice changes nothing.

    python tools/register_target.py
"""
import datetime as dt
import io
import os
import shutil
import subprocess
import sys

SENTINEL_TOOLS = r"C:\02 - OUR FILES\Access to all drives\AVNI\90 - WORKTREES\Active\WP-0038 - AVNI SENTINEL\tools"
sys.path.insert(0, SENTINEL_TOOLS)
import avni_release as rel  # noqa: E402

REPO = r"C:\02 - OUR FILES\Access to all drives\AVNI\90 - WORKTREES\Active\WP-0066 - AVNI ONE WEB"
TID, CHAIN = "AVNI-ONE-WEB", "avni-one-web"
INSTALLED = r"C:\02 - OUR FILES\Access to all drives\AVNI\Release Control\Installed\AVNI-ONE-WEB.json"


def phase(name):
    return [{"type": "cmd", "argv": [
        "pwsh", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File",
        "{staging}\\" + CHAIN + "\\tools\\release\\AvniOneWeb-Release.ps1",
        "-Phase", name, "-Rc", "{rc}", "-Staging", "{staging}", "-Build", "{build}",
        "-Commit", "{candidate[" + CHAIN + "]}", "-RcRoot", "{rc_root}"]}]


TARGET = {
    "title": ("AVNI One website - avnione.com (main) and avnione.in (sends visitors to it). A static site on GitHub Pages "
              "(github.com/sehgalautoriders/avnione, public by nature, nothing private on it). One folder per product page: /computers, "
              "/3dstudio, later /<name> (order of 23-10-2026: 'We need this for avnione.com and avnione.in - avnione.com/computers, "
              "/3dstudio etc'). Stage 2, independent of AVNI.exe. Released only by its own tools\\release\\AvniOneWeb-Release.ps1 from the "
              "candidate: install = push to main on GitHub, live check = the site serves the candidate's build.txt mark."),
    "stage": 2,
    "chains": {CHAIN: {"repo": REPO, "branch": "main", "advance": True}},
    "installed": [{"chain": CHAIN, "type": "json-key", "file": INSTALLED, "key": "commit"}],
    "identity": [{"type": "json-value", "json": INSTALLED, "key": "commit", "equals": "{commit[" + CHAIN + "]}"}],
    "version_format": "AVNI One Web r{n}",
    "clean_staging": True,
    "road_test": True,
    "executor": {p: phase(p) for p in ("build", "test", "snapshot", "install", "verify", "rollback")},
}


def main():
    if not rel.is_authority() and os.path.isfile(rel.KEY):
        os.environ["AVNI_RELEASE_AUTHORITY"] = io.open(rel.KEY, encoding="utf-8").read().strip()   # the pipe's own mechanics
    rel.need_authority("register AVNI-ONE-WEB")
    t = rel.targets()
    if TID in t["targets"]:
        print(f"{TID} is already connected in {rel.TARGETS}")
    else:
        bak = rel.TARGETS + f".bak-{dt.datetime.now():%d-%m-%Y_%H%M}-before-avni-one-web"
        shutil.copy2(rel.TARGETS, bak)
        t["targets"][TID] = TARGET
        rel.write_json(rel.TARGETS, t)
        print(f"{TID} connected in {rel.TARGETS} (copy before the change: {bak})")
    first = subprocess.run(["git", "-C", REPO, "rev-list", "--max-parents=0", "main"], capture_output=True, text=True, check=True).stdout.split()[0]
    con = rel.connect()
    with rel.Tx(con):
        p = con.execute("SELECT commit_sha FROM production WHERE target=? AND chain=?", (TID, CHAIN)).fetchone()
        if not p:
            con.execute("INSERT INTO production(target, chain, commit_sha, release_id, version, at) VALUES (?,?,?,?,?,?)",
                        (TID, CHAIN, first, "BASELINE", None, rel.now()))
            rel.log(con, "SET-PRODUCTION", f"{TID}/{CHAIN}", True, f"{first} (new website registered; nothing installed yet)")
            print(f"baseline {TID}/{CHAIN} = {first[:10]} (nothing installed yet)")
        else:
            print(f"baseline already set: {p['commit_sha'][:10]}")
        rel.log(con, "NEW-TARGET", TID, True, f"AVNI One website <- {REPO} @main (WP-0066)")
        rel.mirror(con)
    return 0


if __name__ == "__main__":
    sys.exit(main())
