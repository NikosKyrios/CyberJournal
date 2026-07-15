---
title: Encrypt a File in 30 Seconds with GPG
description: Encrypt and decrypt files with a password using GPG via terminal.
date: 2026-07-15
layout: layouts/base.njk
---

# Encrypt a File in 30 Seconds with GPG

## What is GPG?

GPG (GNU Privacy Guard) is a free, open-source tool that encrypts files so only someone with the password can read them.

## Install GPG

**macOS:**

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">macOS</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>brew install gnupg</code></pre>
</div>

**Linux:**

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo apt install gnupg</code></pre>
</div>

**Windows:**

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Windows</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>winget install GnuPG.GnuPG</code></pre>
</div>

## Create a Test File

Make something worth protecting. A secret message:

<div class="code-block">
    <div class="code-header">
        <div class="code-dots"><span></span><span></span><span></span></div>
        <span class="code-lang">bash</span>
        <button class="copy-btn">Copy</button>
    </div>
    <pre><code>echo "The password for the server is: xk9#mP2zLq" > secret.txt</code></pre>
</div>

Check it:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>cat secret.txt</code></pre>
</div>

## Encrypt the File

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>gpg --symmetric --cipher-algo AES256 secret.txt</code></pre>
</div>

**What each flag means:**

- `gpg` — the encryption tool
- `--symmetric` — use a password (as opposed to public/private keys). Same password encrypts and decrypts.
- `--cipher-algo AES256` — use AES-256 encryption, a military-grade algorithm trusted globally

Try to read the encrypted file:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>cat secret.txt.gpg</code></pre>
</div>

Gibberish. Unreadable. That's what an attacker sees. Without the password, it's mathematically impossible to reverse.

Now, delete the original!

Clear the cache:


<div class="os-tabs">
  <button class="os-tab active" data-os="mac">macOS</button>
  <button class="os-tab" data-os="linux">Linux</button>
  <button class="os-tab" data-os="windows">Windows</button>
</div>

<div class="os-panel active" data-os="mac">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">macOS</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>gpg-connect-agent reloadagent /bye</code></pre>
</div>

</div>

<div class="os-panel" data-os="linux">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>gpg-connect-agent reloadagent /bye</code></pre>
</div>

</div>

<div class="os-panel" data-os="windows">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Windows (PowerShell)</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>gpg-connect-agent killagent /bye
gpg-connect-agent /bye</code></pre>
</div>

</div>

## Decrypt the File

Now bring your secret back:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>gpg --decrypt secret.txt.gpg</code></pre>
</div>

Enter your password. The original message appears in the terminal. To save it to a file:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>gpg --decrypt secret.txt.gpg > secret.txt</code></pre>
</div>

Read it:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>cat secret.txt</code></pre>
</div>


## Symmetric vs Asymmetric Encryption

**Symmetric Encryption** contains one password, shared between sender and receiver. It's fast and simple.

**Asymmetric encryption** uses two keys: a public key (anyone can encrypt with it) and a private key (only you can decrypt).

## How reliable is AES-256

AES-256 is the encryption standard used by the US government. Cracking it by brute force — trying every possible key combination — would take billions of years.

The weak link, though, isn't the encryption. It's the password. If you use `password123`, it doesn't matter that AES-256 is unbreakable — an attacker will just guess the password.

## Real-World Uses

- **Journalists** encrypt files before sending them to sources. If intercepted, the file is useless.
- **Companies** encrypt customer data so a breach reveals gibberish, not credit card numbers.
- **Anyone** encrypts their hard drive (macOS FileVault, Windows BitLocker) using the same AES encryption you just ran.
