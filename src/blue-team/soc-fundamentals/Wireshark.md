---
title: Introduction to Wireshark - See your Network Traffic live
description: Inspect packets on your own network. Watch DNS requests, TCP handshakes, and HTTP traffic.
date: 2026-07-15
layout: layouts/base.njk
---

# Introduction to Wireshark - See your Network Traffic live

## What is Wireshark?

Wireshark is a popular network protocol analyzer. It captures every packet on your computer and lets you inspect them.

Blue teams use it to investigate suspicious connections. Red teams use it to understand what information leaks during an attack.

## Install Wireshark

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
  <pre><code>brew install --cask wireshark</code></pre>
</div>

</div>

<div class="os-panel" data-os="linux">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>sudo apt install wireshark</code></pre>
</div>

During install, it'll ask if non-superusers should capture packets. Select **Yes**.

</div>

<div class="os-panel" data-os="windows">

Download from **https://www.wireshark.org/download.html** and run the installer. Make sure to check **Install Npcap** when prompted — this is what lets Wireshark capture packets.

</div>

## Start Your First Capture

1. Open Wireshark. You'll see a list of network interfaces — Wi-Fi, Ethernet.
2. Double-click your active interface (usually the one with the moving line graph next to it).
3. Packets start flooding in immediately. Every ping, every DNS query, every open website tab is generating traffic.

Let it run for 30 seconds, then click the red **Stop** button in the toolbar.

You just captured a snapshot of everything your computer was saying on the network.

## The Three Panes

- **Top pane (Packet List):** Every packet captured. Columns show time, source IP, destination IP, protocol and some info.
- **Bottom left pane (Packet Details):** The selected packet broken down layer by layer - Ethernet, IP, TCP, TLS, HTTP.
- **Bottom right pane (Packet bytes):** Raw data in hex.

## Filter Out the Noise

Type into the filter bar at the top:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Wireshark filter</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>dns
http
tcp
tls
ip.addr == 140.82.121.3</code></pre>
</div>

**What each filter means:**

- `dns` — domain name lookups
- `http` — unencrypted web traffic
- `tcp` — TCP connections (handshakes, data transfer, connection close)
- `tls` — encrypted traffic (Client Hello, Server Hello, certificate exchange)
- `ip.addr == 140.82.121.3` — all packets to or from GitHub's IP address

## Why This Matters for Security

- **Plain HTTP exposes everything.** If you visit an HTTP site, anyone on the same Wi-Fi can see the full URL, any form data you submit, and every page you view. Wireshark shows you exactly what an attacker would see.
- **DNS leaks information.** Even with HTTPS, your DNS queries are often unencrypted. Someone watching can see every domain you visit, even if they can't see which pages.
- **Malware calls home.** Infected machines often send signals to command-and-control servers. Blue teams spot this in Wireshark — unusual connections at unusual times to unusual IPs.
