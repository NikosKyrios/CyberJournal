---
title: Google Dorking - Find Hidden Information with Search Engines
description: Use Google search to find exposed files, login pages, and hidden directories.
date: 2026-07-15
layout: layouts/base.njk
---

# Google Dorking - Find Hidden Information with Search Engines

## What is Google Dorking?

Google Dorking is the procedure of using advanced search operators to find information that shouldn't be public. Penetration testers and journalists use it daily to discover exposed databases, login pages, configuration files, security cameras.


**⚠️ Read this first:** Everything you search for today is publicly indexed by Google. You're not bypassing any security — you're just searching smarter than most people. However, accessing a system you find this way without permission is illegal. Search, observe, learn. Don't click on things you shouldn't.

## First Operator: `site:`

Limit results to a single website.

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Google search</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>site:stanford.edu</code></pre>
</div>

**What this does:** Shows only pages from `stanford.edu`. No subdomains excluded — everything under that domain.

## Find Specific File Types: `filetype:`

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Google search</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>site:stanford.edu filetype:pdf</code></pre>
</div>

**What this does:** Shows every PDF Google found on Stanford's domain.

Common file types:
- `filetype:pdf` 
- `filetype:docx` 
- `filetype:xlsx` — spreadsheets (sometimes contains passwords or user lists)
- `filetype:ppt` 
- `filetype:txt` — plain text files (often config files or notes)
- `filetype:sql` — database dumps (extremely dangerous if exposed)

## Search Inside Page Titles: `intitle:`

The page title is what appears in your browser tab. It's different from the body text, and you can search it specifically.

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Google search</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>intitle:"index of" "parent directory"</code></pre>
</div>

**What this does:** Finds web servers with directory listing enabled — pages that show every file in a folder like a file browser. These often contain backups, old versions, or files that were never meant to be public.

## Search Inside URLs: `inurl:`

Search for keywords that appear in the web address itself.

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Google search</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>inurl:admin login</code></pre>
</div>

**What this does:** Finds login pages where the word "admin" appears in the URL. Many admin panels are hidden behind URLs like `/admin`, `/administrator`, `/wp-admin`, or `/panel`.

Common inurl targets:
- `inurl:admin` — admin panels
- `inurl:phpmyadmin` — database management interfaces
- `inurl:config` — configuration files
- `inurl:backup` — backup files

The minus sign removes results containing a specific word or operator.

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Google search</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>site:stanford.edu -inurl:www</code></pre>
</div>

**What this does:** Shows pages from `stanford.edu` that are NOT on `www.stanford.edu`.

## Exact Phrase Matching: `"quotes"`

Putting words in quotes tells Google to find that exact phrase, not just those words scattered across a page.

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Google search</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>site:stanford.edu "password" filetype:txt</code></pre>
</div>

**What this does:** Finds text files on Stanford's domain that contain the word "password." This occasionally turns up configuration files, notes, or scripts with credentials in them.

## Combine Everything: Build a Real Dork

The power of dorking comes from combining operators. Here's a search that finds exposed database backup files:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Google search</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>intitle:"index of" "backup" filetype:sql</code></pre>
</div>

Or one that finds login pages on education sites:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Google search</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>site:.edu inurl:login</code></pre>
</div>

## How Defenders Protect Against Dorking

If you run a website, you don't want your admin panel or backup files showing up in Google. Defenders use several techniques:

- **`robots.txt`** — a file that tells search engines what not to index. But it's voluntary — malicious crawlers ignore it.
- **Authentication** — put admin panels behind a login page. Google can't index what it can't reach.
- **Noindex meta tags** — HTML tags that tell Google to exclude a specific page.
- **Regular dorking audits** — search for your own domain with these operators and see what comes up. Better you find it than an attacker.