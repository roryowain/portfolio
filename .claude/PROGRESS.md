
## 2026-09-07: INCIDENT. robots.txt was blocking Googlebot from the whole site (fixed)

**What happened.** On 24 Aug `Allow: /` was removed from the `User-agent: *` group
(to stop first-match parsers ignoring Disallow rules elsewhere). On this site the
`*` group had no other rules, so it became empty. Under Google's grammar (RFC
9309) a User-agent line with no rules merges with the next User-agent line, even
across blank lines and comments, so `*` inherited CCBot's `Disallow: /`. Google
read the file as "disallow everything for everyone". GSC alerted on 6 Sep:
"pages in a sitemap blocked by robots.txt".

**Why it was missed.** The change was validated with Python's urllib.robotparser,
which treats a blank line as a group boundary and therefore passed the file.
The two parsers disagree on precisely this case.

**Damage.** Contained. One URL recorded as blocked (`/ai-for-distribution/`,
last crawled 25 Aug). The 4 indexed pages were still indexed when the fix
landed; Google had not yet recrawled the rest.

**Fix.** `Allow: /` restored in the `*` group (pushed 17:14, live within a
minute on GitHub Pages). "Validate fix" started in GSC 07/09. New validator
`Lead Generation/analytics/robots_check.py` parses the Google way and fails the
24 Aug file while passing all six live sites. Memory saved so the same mistake
is not repeated: never validate robots.txt with urllib.robotparser.

**Also checked.** expatclub.co.za flagged 1 URL blocked: `/api/me`, under the
deliberate `/api/` Disallow. Correct, left alone.
