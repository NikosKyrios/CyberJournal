---
title: Crack Your First Password (Ethically) with Hashcat
description: Create a fake password hash and crack it yourself. Learn why weak passwords are dangerous, on your own machine.
date: 2026-07-07
layout: layouts/base.njk
---

## ⚠️ Read This First

**Cracking passwords that aren't yours is illegal.** What you're about to do is only legal because you're cracking a hash you created yourself, on your own machine. Do not use these tools against anyone else's accounts, systems, or stolen password databases. Doing so is a criminal offense in most countries.

This exercise teaches you how attackers think so you can defend against them — not so you can become one.

## What Actually Happens When You Set a Password

When you create an account on a website, you type a password like `mypassword123`. The website doesn't store that password. Instead, it runs it through a mathematical function that scrambles it into something unrecognizable.

<div class="code-block">
    <div class="code-header">
        <div class="code-dots"><span></span><span></span><span></span></div>
        <span class="code-lang">bash</span>
        <button class="copy-btn">Copy</button>
    </div>
    <pre><code>echo -n "mypassword123" | sha256sum</code></pre>
</div>

Output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>6b3a55e0...something long and random...</code></pre>
</div>

That output is a **hash**. It's a one-way function: you can turn a password into a hash, but you can't turn a hash back into a password. So even if someone steals the database, they don't get your actual password — they get a pile of hashes.

But here's the catch: they can try guessing.

## What is `sha256sum`?

`sha256sum` is a command-line tool that generates a SHA-256 hash from input. SHA-256 was designed by the NSA and is used everywhere — from verifying file downloads to Bitcoin mining.

- **SHA** stands for Secure Hash Algorithm.
- **256** means the output is always 256 bits (64 characters in hex).
- It's **deterministic**: the same input always produces the same output.
- It's **one-way**: you can't work backwards from a hash to the original input.

Try it yourself with different inputs and watch the output change completely, even if you only change one character:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>echo -n "hello" | sha256sum
echo -n "Hello" | sha256sum</code></pre>
</div>

Notice the two hashes are completely different, even though the inputs differ by just one capital letter. This is called the **avalanche effect** — a tiny change in input produces a massive change in output, making hashes unpredictable and secure.

Here's a real example of what a hash looks like:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>echo -n "iloveyou" | sha256sum</code></pre>
</div>

Output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>6a0436eecdad379345d804a9e4861a46e2135054879760acaf85871b26deadbeef  -</code></pre>
</div>

## How Attackers Crack Passwords

Since hashes can't be reversed, attackers use two strategies:

- **Dictionary attack:** Take a list of common passwords (like `password`, `123456`), hash each one, and check if any match the stolen hash. If your password is in that list, it's cracked in seconds.
- **Brute-force attack:** Try every possible combination of characters. Slow for long passwords, instant for short ones.

Your job: create a hash, then crack it yourself to see how easy it is.

## Step 1: Create a Fake Password Hash

Pick a deliberately weak password — something a real person might use that definitely exists in common wordlists. Let's use `iloveyou`:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>echo -n "iloveyou" | sha256sum | awk '{print $1}' > hash.txt</code></pre>
</div>

**What each part does:**

- `echo -n "iloveyou"` — prints the password without a trailing newline (`-n` is important; without it, you'd hash the password plus an invisible newline character)
- `|` — the pipe, sends the output of the left command as input to the right command
- `sha256sum` — generates the SHA-256 hash
- `awk '{print $1}'` — extracts only the hash, discarding the filename that sha256sum appends
- `> hash.txt` — saves the hash to a file called `hash.txt`

This creates a file containing just the hash. Pretend you just stole this from a database. Now let's crack it.

## Step 2: Install Hashcat

Hashcat is the world's fastest password cracking tool. It runs on your GPU for maximum speed.

**macOS:**

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">macOS</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>brew install hashcat</code></pre>
</div>

**Linux (Debian/Ubuntu):**

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo apt install hashcat</code></pre>
</div>

**Windows:**

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Windows</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>winget install hashcat</code></pre>
</div>

## Step 3: Get a Wordlist

Hashcat needs a list of passwords to try. The most famous wordlist is `rockyou.txt` — a real password list from a 2009 data breach of the RockYou social media site. It contains over 14 million real passwords that actual humans used.

Download it:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>curl -L -o rockyou.txt https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt</code></pre>
</div>

**What each flag means:**

- `curl` — a tool for downloading files from the internet
- `-L` — follow redirects if the URL points somewhere else
- `-o rockyou.txt` — save the downloaded file as `rockyou.txt`

This file is about 140MB — it'll take a few seconds to download.

## Step 4: Crack the Hash

Run Hashcat with a dictionary attack:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>hashcat -m 1400 -a 0 hash.txt rockyou.txt</code></pre>
</div>

**What each part does:**

- `hashcat` — the password cracking tool
- `-m 1400` — tells Hashcat this is a SHA-256 hash. Different hash types have different mode numbers (MD5 is 0, SHA-1 is 100, SHA-256 is 1400)
- `-a 0` — attack mode 0 is a straight dictionary attack. Hashcat will hash every word in `rockyou.txt` and compare it to your hash
- `hash.txt` — the file containing the hash you want to crack
- `rockyou.txt` — the wordlist to try (14 million real passwords)

After a few seconds (or less), you should see something like:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>[hash]:iloveyou</code></pre>
</div>

You just cracked your first password. `iloveyou` was in the wordlist because millions of people actually used it. That's why dictionary attacks work.

## Why This Worked So Fast

`iloveyou` is a terrible password. It's a common phrase with no numbers, no capitals, no special characters. `rockyou.txt` contains millions of similar passwords — including this exact one — so Hashcat found it almost instantly.

Now try hashing something stronger and see what happens:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>echo -n "xk9#mP2zLq" | sha256sum | awk '{print $1}' > hash2.txt
hashcat -m 1400 -a 0 hash2.txt rockyou.txt</code></pre>
</div>

**What each part does:**

- `echo -n "xk9#mP2zLq"` — prints the strong password without a trailing newline
- `| sha256sum` — generates the SHA-256 hash
- `| awk '{print $1}'` — extracts only the hash, discarding the filename
- `> hash2.txt` — saves the hash to a new file called `hash2.txt`
- `hashcat -m 1400 -a 0 hash2.txt rockyou.txt` — runs the same dictionary attack against the new hash

Hashcat will run through the entire wordlist and find... nothing. The status will say **"Exhausted"** with **"Recovered: 0/1"** — meaning it tried every single word in rockyou.txt and none of them matched. That password isn't in the list. It would take a pure brute-force attack millions of years to crack it.

**Length beats complexity. A long password of random words beats a short password of weird symbols.**

## What Websites Do to Protect You

If all websites stored raw SHA-256 hashes, attackers would crack them exactly like you just did. So good websites add **salt** — a random string appended to your password before hashing it.
