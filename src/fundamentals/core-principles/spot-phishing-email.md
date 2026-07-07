---
title: Spot a Phishing Email in 60 seconds
description: Learn the red flags that give away fake emails - and how to inspect them safely without clicking them.
date: 2026-07-07
layout: layouts/base.njk
---

#  Spot a Phishing Email in 60 seconds

## What is Phishing?

**Phishing** is when someone sends you a fake email pretending to be someone you trust (bank, school, Spotify). The goal is to trick you into clicking a link, opening an attachment, or handing over a password.

It's the most common cyberattack on the planet. And you can spot one in under a minute.

## The 60-Second Checklist

Every phishing email has tells. Run through these 4 checks before you click anything.

<br>

### 1. Who Is It Actually From?

<br>

Look at the sender's email address - not the display name, the actual address.

<div class="code-block">
    <div class="code-header">
        <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-lang">example</span>
            <button class="copy-btn">Copy</button>
    </div>
    <pre><code>From: Netflix Support -> netflix-support@gmail.com
                        ^^^^^^^^^^^^^^^^^^^^^^^^^
                Not @netflix.com — this is a Gmail address</code></pre>
</div>

Legitimate companies don't use `@gmail.com`, `@yahoo.com`, or `@outlook.com`. Netflix sends from `@netflix.com`. Your bank sends from their own domain. Always.

<br>

### 2. Are They Pressuring You?

<br>

Phishing emails create false urgency:

- "Your account will be suspended in 24 hours!"
- "Unusual login detected - verify immediately!"
- "You've won! Claim within 1 hour or lose it!"

<br>

### 3. Where Does That Link Actually Go?

<br>

Hover your mouse over any link or button. **Do not click it.** Look at the bottom-left corner of your browser — the real URL appears there.

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">example</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>What you see:  https://www.netflix.com/account
Where it goes: http://netf1ix-verify.ru/login
                      ^^^^^^^^       ^^
                      Lookalike      Russian domain</code></pre>
</div>

Attackers use lookalike domains: `netf1ix.com` (one instead of L), `paypa1.com` (one instead of L), `amaz0n.com` (zero instead of O).

<br>

### 4. Are There Weird Mistakes?

<br>

Real companies have editors. Phishing emails often have:

- Bad grammar and spelling errors
- "Dear valued customer" instead of your actual name
- Pixelated or stretched logos
- Weird formatting, mismatched fonts
- Attachments you weren't expecting (invoices, receipts, voicemails)

None of these are proof alone. But together with the other checks, they paint a clear picture.

## A Real Example

Here's what a typical phishing email looks like. Every element is designed to trick you.

> **From:** PayPal Service <paypal@secure-accounts.net>
> **Subject:** URGENT: Your account has been limited
>
> Dear Customer,
>
> We detected unusual activity on your PayPal account. To prevent permanent closure, verify your identity immediately by clicking the link below.
>
> **[Verify My Account →](http://paypa1-secure.com/login)**
>
> Failure to verify within 24 hours will result in account suspension.
>
> Regards,
> PayPal Security Team

**Red flags in this email:**

- Sender address is `@secure-accounts.net`, not `@paypal.com`
- "Dear Customer" instead of your name (they don't know who you are)
- Creates urgency: "24 hours or your account is suspended"
- The link goes to `paypa1-secure.com` (lookalike domain with the number 1)
- Threatens negative consequences if you don't act

Every single one of these is a deliberate psychological trick. Now you can spot them.

## Go Deeper: Check the Email Headers

<br>

Every email carries hidden metadata called **headers**. They show the actual path the email took to reach you. If the headers don't match the sender, it's fake.

**In Gmail:** Open the email → three dots (top-right) → **Show original**.

**In Outlook:** Open the email → three dots → **View message source**.

Look for these lines:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">email headers</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>Return-Path: scammer@evil-domain.ru

Received: from mail.evil-domain.ru (evil-domain.ru [192.168.1.1])
Authentication-Results: spf=fail smtp.mailfrom=evil-domain.ru</code></pre>

</div>


**What to look for:**

- **Return-Path** — should match the sender's domain. If it says `@evil-domain.ru` but claims to be from PayPal, it's fake.
- **SPF (Sender Policy Framework)** — checks if the sending server is authorized. `spf=fail` means it's not.
- **DKIM (DomainKeys Identified Mail)** — a digital signature that proves the email wasn't tampered with. If it's missing or invalid, suspicious.

You don't need to memorize these. Just know that headers exist and that `fail` is bad.

## How to Safely Inspect a Suspicious Link

If you're curious where a link goes but don't want to click it:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>curl -I http://paypa1-secure.com/login</code></pre>
</div>

**What each part does:**

- `curl` — fetches data from a URL without opening it in a browser
- `-I` — fetches only the headers, not the full page (safer)

This shows you where the link actually leads — what server responds, whether it redirects somewhere else — without ever rendering the page or exposing your browser.


## What To Do If You Spot a Phishing Email

**If you haven't clicked anything:**

<ol style="padding-left: 2rem;">
  <li>Don't click any links. Don't open attachments.</li>
  <li>Report it using your email provider's "Report phishing" button.</li>
  <li>Delete it.</li>
</ol>

<br>

**If you already clicked the link but didn't enter anything:**

<ol style="padding-left: 2rem;">
  <li>Close the page immediately.</li>
  <li>Run a malware scan (Windows Defender or Malwarebytes).</li>
  <li>You're probably fine — most phishing pages only work if you type in your password.</li>
</ol>

<br>

**If you entered your password on a phishing page:**

<ol style="padding-left: 2rem;">
  <li>Change that password immediately on the real website.</li>
  <li>Enable multi-factor authentication (MFA) if you haven't already.</li>
  <li>Check for unfamiliar logins in your account settings.</li>
  <li>If you reused that password anywhere else, change it there too.</li>
</ol>