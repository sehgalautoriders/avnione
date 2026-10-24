# WP-0066 - AVNI One website (avnione.com / avnione.in)

Born 24-10-2026 on Ravi's order of 23-10-2026: "We need this for avnione.com and avnione.in - avnione.com/computers, /3dstudio
etc we will decide the rest later but somethings like that /abc". GO given 24-10-2026.

## What it is

Our public website. One static site (plain HTML, CSS and JavaScript, no server) that GitHub Pages serves.
avnione.com is the main address. avnione.in sends every visitor to the same page on avnione.com.

## Why we need it

AVNI One is the name we show to the world (brand set 16-10-2026, `AVNI\Brand\AVNI One`). Each product gets its own short address:
/computers for AVNI Computers, /3dstudio for AVNI 3D Design Studio, and any later /name the same way.

## How a new page is added

1. Make a folder with the short name, for example `abc/`.
2. Put `index.html` inside it. Copy the top and bottom of `computers/index.html`, so it uses the shared look
   (`/assets/site.css`, `/assets/site.js`).
3. Add one card for it on the home page (`index.html`, the "Our products" part) and one line in `sitemap.xml`.
4. Run `python tools/check_site.py --stamp`. It checks every page and writes the new build mark in `build.txt`.
5. Commit, submit and release through the pipe. The page is live at avnione.com/abc within a few minutes.

## Rules for this repo

- It is public by nature. No keys, no customer data, no staff names, nothing private (law 3 "Private means private").
  `tools/check_site.py` refuses a site that carries an e-mail address, a 10-digit phone number or a key.
- Every fact on a page must be true today. A thing we have not built is written as "coming", never as ready.
- No paid service is connected. All pictures and moving scenes are drawn by our own code.
- Installed only by Release Control (`tools/release/AvniOneWeb-Release.ps1`): install = push to `main` on GitHub,
  live check = the site serves the same `build.txt` mark.
