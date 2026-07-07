---
title: Common Ports and Protocols — What's Running on Your Machine Right Now?
description: Learn ports by seeing them live on your own system.
date: 2026-07-04
layout: layouts/base.njk
---

# Common Ports and Protocols — What's Running on Your Machine Right Now?

## What's a Port, Actually?

Think of an <span class="glossary-term" data-term="ip-address">IP address</span> like an apartment building. The <span class="glossary-term" data-term="port">port</span> is the apartment number. Data needs both to reach the right application.

- Your computer has one IP address (the building)
- But it runs many programs: a browser, Spotify, a game, <span class="glossary-term" data-term="ssh">SSH</span>
- Each program listens on a different port so traffic goes to the right place


## The Ports You'll Actually Encounter

Here are the ports that matter. Don't just read the table — come back after you've run the commands later in this article and everything will click.

| Port | Protocol | What It Does |
|------|----------|--------------|
| 22 | <span class="glossary-term" data-term="ssh">SSH</span> | Remote login to servers — if you've ever connected to a Raspberry Pi, you used this |
| 53 | <span class="glossary-term" data-term="dns">DNS</span> | Turns domain names into IPs — every website visit starts here |
| 80 | <span class="glossary-term" data-term="http">HTTP</span> | Unencrypted web traffic — your browser uses this by default |
| 443 | <span class="glossary-term" data-term="https">HTTPS</span> | Encrypted web traffic — the lock icon in your browser |
| 3389 | <span class="glossary-term" data-term="rdp">RDP</span> | Remote Desktop for Windows — a huge attack target, never expose this to the internet |

## TCP vs UDP — The Two Ways Data Moves

Every port you just saw uses one of two <span class="glossary-term" data-term="protocol">protocols</span> underneath: <span class="glossary-term" data-term="tcp">TCP</span> or <span class="glossary-term" data-term="udp">UDP</span>.

| | TCP | UDP |
|---|---|---|
| **Stands for** | Transmission Control Protocol | User Datagram Protocol |
| **Reliability** | Guaranteed — lost packets get resent | No guarantees — some data might not make it |
| **Speed** | Slower because of all the checking | Fast — no time spent confirming |
| **Used for** | Websites, file downloads, emails, SSH | Video calls, online games, live streams, DNS |

## See What's Listening on Your Machine

Open your terminal and run the command for your operating system. Click your OS below:

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
  <pre><code>lsof -i -P -n | grep LISTEN</code></pre>
</div>

- **`lsof`** means "list open files" — on Unix systems, network connections are files too
- **`-i`** shows network connections
- **`-P`** shows port numbers instead of service names
- **`-n`** shows IP addresses instead of hostnames
- **`grep LISTEN`** filters to only programs waiting for connections

Here's what the output might look like:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>Spotify   789  user  12u  IPv4  0t0  TCP *:57621 (LISTEN)
postgres  1023 user  7u   IPv6  0t0  TCP [::1]:5432 (LISTEN)
node      5678 user  18u  IPv6  0t0  TCP [::1]:3000 (LISTEN)</code></pre>
</div>

**What each column means:**

- **`COMMAND`** (first column) — the name of the program. `Spotify`, `postgres`, `node`. This tells you exactly what's listening.
- **`PID`** (second column) — Process ID. A unique number. If you need to stop the program, you'd use `kill 789`.
- **`USER`** (third column) — who started the process. Usually you, but sometimes `root`.
- **`TYPE`** and **`DEVICE`** — internal details, ignore these for now.
- **`NODE`** — the IP address it's bound to. `*` means "listen on all interfaces" (accessible from anywhere on the network). `[::1]` or `127.0.0.1` means <span class="glossary-term" data-term="localhost">localhost</span> only (your own machine, safe from external connections).
- **`NAME`** (last column) — the port number and state. `*:57621 (LISTEN)` means port 57621 is open and waiting.

</div>

<div class="os-panel" data-os="linux">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>ss -tlnp</code></pre>
</div>

- **`ss`** is the modern replacement for `netstat` on Linux
- **`-t`** shows <span class="glossary-term" data-term="tcp">TCP</span> connections
- **`-l`** shows only listening sockets
- **`-n`** shows port numbers instead of service names
- **`-p`** shows the process using each socket

Example output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>State   Local Address:Port   Process
LISTEN  0.0.0.0:22           sshd
LISTEN  127.0.0.1:5432       postgres
LISTEN  0.0.0.0:443          nginx</code></pre>
</div>

**What each column means:**

- **`State`** — `LISTEN` means waiting for connections
- **`Local Address:Port`** — `0.0.0.0:22` means port 22, accessible from anywhere. `127.0.0.1:5432` means port 5432, localhost only.
- **`Process`** — which program. `sshd` is the SSH server.

</div>

<div class="os-panel" data-os="windows">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Windows (PowerShell)</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>netstat -an | findstr LISTENING</code></pre>
</div>

- **`netstat`** shows network statistics and active connections
- **`-a`** shows all connections and listening ports
- **`-n`** shows addresses and port numbers in numerical form
- **`findstr LISTENING`** filters to only ports waiting for connections

Example output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>TCP    0.0.0.0:135       LISTENING
TCP    0.0.0.0:445       LISTENING
TCP    127.0.0.1:3306    LISTENING
TCP    0.0.0.0:3389      LISTENING</code></pre>
</div>

**What each column means:**

- **`Local Address`** — `0.0.0.0:445` means port 445, accessible from anywhere. `127.0.0.1:3306` means port 3306, localhost only.
- **`State`** — **`LISTENING`** means waiting for connections. **`ESTABLISHED`** means someone is actively connected right now.

</div>

## Talk to a Port Manually

You can speak raw <span class="glossary-term" data-term="http">HTTP</span> yourself. Try this:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">macOS / Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>curl -I https://example.com</code></pre>
</div>

On Windows, use PowerShell:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Windows (PowerShell)</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>Invoke-WebRequest -Uri https://example.com -Method Head | Select-Object -ExpandProperty Headers</code></pre>
</div>

The `-I` flag (or `-Method Head` on Windows) fetches only the headers — no body, just metadata. Here's what a typical response looks like:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>HTTP/2 200
content-type: text/html; charset=UTF-8
server: ECS (dce/26A4)</code></pre>
</div>

**What each line means:**

- **`HTTP/2 200`** — the <span class="glossary-term" data-term="protocol">protocol</span> version and status code. 200 means "OK, here you go."
- **`content-type`** — what kind of data the server is sending back. `text/html` means a webpage.
- **`server`** — what software is running the show. Attackers look at this to find vulnerable versions.

Now try it on a site you visit daily. Swap `example.com` for anything else.

---

## Scan Yourself with Nmap

<span class="glossary-term" data-term="nmap">Nmap</span> is the industry-standard port scanner. Install it first:


<div class="os-panel active" data-os="mac">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">macOS</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>brew install nmap</code></pre>
</div>

</div>

<div class="os-panel" data-os="linux">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux (Debian/Ubuntu)</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo apt install nmap</code></pre>
</div>

</div>

<div class="os-panel" data-os="windows">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Windows</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>winget install nmap</code></pre>
</div>

</div>

Once installed, scan your own machine:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash / PowerShell</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>nmap localhost</code></pre>
</div>

Here's example output from a typical machine:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>PORT     STATE    SERVICE
22/tcp   open     ssh
80/tcp   open     http
443/tcp  open     https
3306/tcp open     mysql
8080/tcp open     http-proxy</code></pre>
</div>

**What each column means:**

- **`PORT`** — the port number and protocol. These are the doors.
- **`STATE`** — `open` means something is listening. `closed` means nothing there. `filtered` means a <span class="glossary-term" data-term="firewall">firewall</span> is blocking the scan.
- **`SERVICE`** — what Nmap thinks is running there based on common conventions.

**What this output tells you:** This machine has SSH, two web servers, and MySQL all running. That's a large attack surface. If any of those services are outdated or misconfigured, an attacker has many ways in.

This is exactly how an attacker starts — but you're doing it to yourself, which is safe and legal. **Never run nmap against a target you don't own or have explicit written permission to scan.**
## Why Attackers Care About Ports

Every open port is a door. If port 22 (SSH) is open to the internet with a weak password, an attacker can <span class="glossary-term" data-term="brute-force">brute-force</span> their way in. If port 3389 (RDP) is exposed, they can attempt to exploit known Windows vulnerabilities.

There's a search engine called [Shodan](https://www.shodan.io/) that scans the entire internet and lists devices by open port. People accidentally expose databases, security cameras, and industrial systems this way.

**Rule of thumb:** If you don't need a port open, close it. Every listening service expands your attack surface — the total number of ways an attacker can get in.