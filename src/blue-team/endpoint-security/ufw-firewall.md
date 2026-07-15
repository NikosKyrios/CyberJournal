---
title: Set Up a Firewall rule with UFW
description: Block and allow ports on your machine. See how defenders control access using the simplest firewall.
date: 2026-07-15
layout: layouts/base.njk
---

# Set Up a Firewall rule with UFW

## What is a Firewall?

A firewall is a filter between your computer and network. It decides which connections get in and which not.

UFW (Uncomplicated Firewall) is the simplest firewall you can use.

## Install UFW

UFW is Linux-only. If you're on macOS, you already have a firewall built in — we'll cover both.

**Linux (Debian/Ubuntu):**

UFW is usually pre-installed. Check with:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo ufw status</code></pre>
</div>

If it says "command not found":

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo apt install ufw</code></pre>
</div>

**macOS:**

macOS uses a different firewall called `pf` (Packet Filter). It's already built in — no install needed. Check if it's running:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">macOS</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo pfctl -s info</code></pre>
</div>

macOS also has an application firewall in **System Settings → Network → Firewall**. It's less flexible than UFW but protects you automatically. For learning firewall concepts, UFW on Linux is the best tool. The rules and logic are identical across all firewalls — only the commands differ.


**Windows:** UFW is Linux/macOS only. Windows has its own firewall accessible through `wf.msc` (Windows Firewall with Advanced Security) or via PowerShell with `New-NetFirewallRule`. This article focuses on UFW, but the concepts are identical.

## Check Your Firewall Status

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo ufw status</code></pre>
</div>

If it's your first time, you'll likely see:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>Status: inactive</code></pre>
</div>

Your firewall is off. Every port you saw in the nmap scan is open for business. Let's fix that.

## Enable the Firewall

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo ufw enable</code></pre>
</div>

Output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>Firewall is active and enabled on system startup</code></pre>
</div>

UFW's default policy is:
- Block all incoming connections
- Allow all outgoing connections

This means nobody can connect to your machine, but you can still browse the web, check email, and use apps normally. Outgoing traffic is fine — incoming is blocked unless you explicitly allow it.

## Allow a Port

Now let's say you're running a web server on port 80 and want people to reach it.

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo ufw allow 80</code></pre>
</div>

**What this does:** Opens port 80 for incoming TCP and UDP connections. Now check the status:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo ufw status</code></pre>
</div>

Output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>Status: active

To                         Action      From
--                         ------      ----
80                         ALLOW       Anywhere</code></pre>
</div>

Port 80 is now open. Anyone can connect.

## Block a Port

Changed your mind? Close it:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo ufw deny 80</code></pre>
</div>

Or remove the rule entirely:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo ufw delete allow 80</code></pre>
</div>

## Allow a Specific IP Address

Maybe you only want your home computer to reach your server. Allow only that IP:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo ufw allow from 192.168.1.50 to port 22</code></pre>
</div>

**What this does:** Only the machine at `192.168.1.50` can connect to port 22 (SSH). Everyone else is blocked. This is how you harden a server — SSH is open, but only for you.

## Allow by Service Name

UFW knows common services by name:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https</code></pre>
</div>

This is equivalent to allowing ports 22, 80, and 443.

## Enable Logging

Want to see what your firewall is blocking? Turn on logs:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo ufw logging on</code></pre>
</div>

Logs go to `/var/log/ufw.log` on Linux. Check them:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo tail -f /var/log/ufw.log</code></pre>
</div>

Now you can watch blocked connections in real time — just like in the logs article. Every blocked attempt is a potential attack that your firewall stopped.

## Connect It Back: Test with Nmap

Run a scan before and after enabling UFW:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>nmap localhost</code></pre>
</div>

With UFW disabled, you'll see open ports. With UFW enabled (and only port 80 allowed), you'll see only port 80 open — everything else is filtered.