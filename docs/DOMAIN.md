# avnione.com and avnione.in - pointing the names at our website

Written 24-10-2026 for the AVNI One website (WP-0066).

## What it is

Both names were bought at BigRock on 16-10-2026. On 24-10-2026 they still had no address records, so typing them shows nothing.
Our website lives on GitHub Pages. Four address records at BigRock tell the internet that avnione.com means GitHub Pages.

## Who does what

1. **We (done by the pipe):** the site is live on its GitHub address, and the avnione.in forwarder already claims avnione.in on GitHub.
2. **Ravi (one sign-in at BigRock, about 10 minutes):** add the records below for both names.
3. **We (by ourselves after that):** a watcher sees the records answer, then a release adds the file `CNAME` (avnione.com) to the site,
   GitHub issues the free lock-icon certificate, and we switch "Enforce HTTPS" on.

## The records (same for avnione.com and for avnione.in)

BigRock > Sign in > Domains > the name > **Manage DNS** > **A Records** tab > Add A Record, four times:

| Type | Host name | Value (points to) | TTL |
|---|---|---|---|
| A | leave empty (or @) | 185.199.108.153 | 1 hour |
| A | leave empty (or @) | 185.199.109.153 | 1 hour |
| A | leave empty (or @) | 185.199.110.153 | 1 hour |
| A | leave empty (or @) | 185.199.111.153 | 1 hour |

Then the **CNAME Records** tab > Add CNAME Record, once:

| Type | Host name | Value (points to) | TTL |
|---|---|---|---|
| CNAME | www | sehgalautoriders.github.io | 1 hour |

These four numbers are GitHub Pages' published addresses (docs.github.com, "Managing a custom domain for your GitHub Pages site").

## What happens when it goes wrong

- A record typed wrong: the name shows nothing or GitHub's 404. Fix the record at BigRock. Nothing on our side breaks.
- Records added but the site still on the GitHub address: the CNAME release has not run yet. It runs by itself when the names answer.
- HTTPS not ready: GitHub needs up to 24 hours for the certificate. The site works on http meanwhile.

## Why avnione.in is a separate small site

GitHub Pages gives one custom name per site. avnione.in is a second, tiny site (`tools/avnione-in`) whose only job is to send
every visitor to the same page on avnione.com (avnione.in/computers goes to avnione.com/computers). The pipe pushes it at every release.
