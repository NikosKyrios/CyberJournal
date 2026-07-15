---
title: What happens when you visit a Website?
description: From DNS lookup to TCP handshake to TLS encryption to the page appearing on the screen.
date: 2026-07-15
layout: layouts/base.njk
---

# What happens when you visit a Website?

## Step 1: DNS - Find the address

If you search `github.com`, the browser doesn't know where this lives. It uses an IP address that it gets from DNS (Domain Name System). DNS provides a name for every IP on the internet.

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>dig github.com</code></pre>
</div>

Without DNS, you would need to memorize IP addresses for every website.

## Step 2: TCP 

Now, the browser knows the address but it needs to create a connection before it sends any data. This is the TCP(Transmission Control Protocol) handshake.

You can watch this happen:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>curl -v https://github.com 2>&1 | head -30</code></pre>
</div>

**What each part does:**

- `curl -v` — fetch a URL with verbose output (shows everything happening)
- `2>&1` — redirect error output to standard output (verbose info goes to stderr by default)
- `| head -30` — show only the first 30 lines

Look for these lines in the output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>*   Trying 140.82.121.3:443...
* Connected to github.com (140.82.121.3) port 443 (#0)</code></pre>
</div>

Your computer just performed a TCP handshake with GitHub's server on port 443. The connection is open.

## Step 3: TLS

Port 443 means HTTPS — HTTP wrapped in TLS encryption. Before any web data flows, the browser and server perform a TLS handshake for encryption keys.

This is what puts the lock icon in your browser. Without it, anyone on the same Wi-Fi network could read every page you visit, every password you type, every message you send.

In the `curl -v` output, you'll see the TLS handshake:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3</code></pre>
</div>

**What happened here:**

- Your browser sent a **Client Hello**: "Here are the encryption methods I support."
- The server responded with a **Server Hello**: "We'll use this one." Plus its digital certificate proving it really is github.com.
- Both sides verified the certificate and agreed on encryption keys.

## Step 4: HTTP — Asking for the Page

Now the encrypted tunnel is open. Your browser asks for the page and the server responds. Run this to see both:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>curl -sI https://github.com</code></pre>
</div>

- `curl` — fetches a URL
- `-s` — silent mode, no progress bar
- `-I` — fetch headers only, not the full page

Output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>HTTP/2 200
content-type: text/html; charset=utf-8</code></pre>
</div>

**What each line means:**

- `HTTP/2 200` — success. The server has the page and is sending it.
- `content-type: text/html` — it's a webpage

That's it. Your browser receives this, then downloads the full HTML, CSS, and JavaScript to render the page you see.

## Why This Matters for Security

Every step is a potential attack surface:

- **DNS** can be poisoned (sending you to a fake site) 

- **TCP** can be hijacked if an attacker is on the same network
- **TLS** can be stripped (downgrading HTTPS to HTTP)

- **HTTP** requests can be intercepted if TLS is broken

Understanding each layer is understanding where attacks happen and how to defend against them.