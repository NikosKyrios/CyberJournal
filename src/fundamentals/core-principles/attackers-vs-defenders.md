---
title: Attackers vs Defenders - The two Sides of Cybersecurity
description: Understand Red and Blue team and why they use the same tools.
date: 2026-07-05
layout: layouts/base.njk
---

## The Two Mindsets

- <span class="glossary-term" data-term="red-team">Red Team</span> thinks: *"How would I break this system?"* They mimic attackers to find vulnerabilities before real criminals do.
- <span class="glossary-term" data-term="blue-team">Blue Team</span> thinks: *"How dod I stop the attackers?"* They defend systems, monitor threats, and respond to incidents.

Same skills, opposite goals.

## They use the same Tools

Take Nmap for example: 
An attacker uses it to find open ports on a target. A defender uses it to audit their own systems.

## Hands-On: Think like an Attacker

Run this:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>nmap localhost</code></pre>
</div>

Now, for each open port, ask yourself: *"If I was an attacker, what would I do with this?"*

| Port | Attacker's Question |
|------|---------------------|
| 22 (SSH) | Can I guess the password? Is it using an old version with known vulnerabilities? |
| 80 (HTTP) | Is the web server outdated? Can I find hidden directories? |
| 443 (HTTPS) | Is the encryption properly configured or is it using weak ciphers? |
| 3306 (MySQL) | Is the database password weak? Can I access it remotely? |

This is **reconnaissance** — the first phase of any attack. You're mapping the attack surface without actually breaking anything. This is legal on your own machine. Never do this to a target you don't own.

## Hands-On: Think Like a Defender

Run the same command as above.

This time, ask different questions:

| Port | Defender's Question |
|------|---------------------|
| 22 (SSH) | Do I actually need SSH running? If yes, is it updated? Is password login disabled in favor of keys? |
| 80 (HTTP) | Am I hosting a website? If not, why is this port open? |
| 3306 (MySQL) | Is the database only listening on <span class="glossary-term" data-term="localhost">localhost</span>? Is it exposed to the internet? |
| Any open port | Do I know what this is? If not, investigate immediately. |

This is **hardening** — shrinking your attack surface by closing unnecessary doors and locking the ones you need

## Real World: The Target Breach (2013)

In 2013, attackers stole 40 million credit card numbers from Target. Here's both perspectives:

**What the attackers did:** They stole credentials from a HVAC contractor (a third-party with network access), used them to enter Target's network, found a vulnerable server, and installed malware on payment terminals.

**What the defenders missed:** The HVAC contractor had more access than they needed. The payment systems weren't properly <span class="glossary-term" data-term="firewall">firewall</span>-separated from the rest of the network. Alerts from the security software were flagged but nobody investigated them in time.

The attackers didn't use anything fance. They just found open doors.

## Why Both Sides Matter

You can't defend agains what you don't understand. Every great defender knows how to attack. Every responsible attacker (<span class="glossary-term" data-term="ethical-hacker">ethical hacker</span>, <span class="glossary-term" data-term="penetration-tester">penetration tester</span>) works to improve defense.