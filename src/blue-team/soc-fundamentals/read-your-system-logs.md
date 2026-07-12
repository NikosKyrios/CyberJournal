---
title: Read Your Own System Logs
description: Open your logs and see every login, error and connection on your machine. FIRST blue team skill.
date: 2026-07-12
layout: layouts/base.njk
---

# Read Your Own System Logs

## What are logs, and why should I care?

Every time something happens on your computer—a login, a crash, or a network connection—it leaves a trace. This trace is a **log entry**: a timestamped line of text telling you that something happened at a specific time.

Logs are a blue team's best friend. When an attacker breaks in, they leave evidence behind. Logs are how defenders find that evidence and figure out what happened.

## Where do logs live?


<br>

### macOS

Logs live in `/var/log/`. The main one is `system.log`.


### Linux

Your logs live in `/var/log/`. The main ones are `syslog` and `auth.log`.


### Windows

Windows uses Event Viewer instead of text files. Press `Windows + R`, type `eventvwr`, and press Enter.


## See who logged in

One of the first things a defender checks: who accessed this machine?

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
  <pre><code>last</code></pre>
</div>


- `last` — displays login history from `/var/log/wtmp`

Example output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>username  console   Mon Jul  6 09:23   still logged in
username  console   Sun Jul  5 18:45 - 22:30  (03:45)
reboot    ~         Sun Jul  5 18:44</code></pre>
</div>

**What each column means:**

- `username` — who logged in
- `console` — where they logged in from (console means physically at the machine; `ttys001` means a terminal window; `pts/0` means remote)
- `Mon Jul 6 09:23` — when the session started
- `still logged in` or `- 22:30` — when it ended
- `(03:45)` — session duration

If you see a login at 3 AM from an IP you don't recognize, that's worth investigating.

</div>

<div class="os-panel" data-os="linux">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>last</code></pre>
</div>

- `last` — displays login history from `/var/log/wtmp`

Example output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>username  pts/0     192.168.1.5    Mon Jul  6 09:23   still logged in
username  tty1       :0             Sun Jul  5 18:45 - 22:30  (03:45)
reboot    system boot               Sun Jul  5 18:44</code></pre>
</div>

**What each column means:**

- `username` — who logged in
- `pts/0` — which terminal (remote sessions show an IP here)
- `192.168.1.5` — the IP address they connected from
- `Mon Jul 6 09:23` — when the session started
- `still logged in` or `- 22:30` — when it ended
- `(03:45)` — session duration

</div>

<div class="os-panel" data-os="windows">

<br>

In Event Viewer, expand **Windows Logs** in the left sidebar, then click **Security**. Look for event ID **4624** (successful login) and event ID **4625** (failed login).

**What to look for:**

- Event ID `4624` — someone logged in successfully
- Event ID `4625` — someone tried and failed
- Multiple 4625 events in a row from the same IP is a brute-force attempt

</div>

## Find Failed Logins

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
  <pre><code>cat /var/log/system.log | grep "Failed" | tail -20</code></pre>
</div>

**What each part does:**

- `cat` — reads the file and outputs its contents
- `/var/log/system.log` — the main system log on macOS
- `grep "Failed"` — filters lines containing the word "Failed"
- `tail -20` — shows only the last 20 matching lines

</div>

<div class="os-panel" data-os="linux">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>cat /var/log/auth.log | grep "Failed" | tail -20</code></pre>
</div>

**What each part does:**

- `cat` — reads the file
- `/var/log/auth.log` — authentication log on Linux (logins, sudo, SSH attempts)
- `| grep "Failed"` — filters for failed attempts
- `tail -20` — last 20 lines

Example output:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">output</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>Jul  6 14:23:15 server sshd[1234]: Failed password for root from 45.67.89.10 port 22
Jul  6 14:23:16 server sshd[1234]: Failed password for root from 45.67.89.10 port 22
Jul  6 14:23:17 server sshd[1234]: Failed password for root from 45.67.89.10 port 22
Jul  6 14:23:18 server sshd[1234]: Failed password for root from 45.67.89.10 port 22</code></pre>
</div>

**What this tells you:** Someone at IP `45.67.89.10` is trying to guess the root password over SSH. Four attempts in four seconds. That's not a typo.

</div>

<div class="os-panel" data-os="windows">

<br>

In Event Viewer → **Windows Logs** → **Security**, click **Filter Current Log** in the right sidebar. Type `4625` in the event ID field and click OK.

Each 4625 event shows:
- The account name they tried
- The source IP address
- The time of the attempt

Multiple 4625 events from the same IP = someone is trying to break in.

</div>

## Look for Errors and Crashes

Not everything in logs is an attack. Sometimes applications crash or services fail to start. Defenders look at these too — a crashing security tool is a vulnerability.

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
  <pre><code>cat /var/log/system.log | grep -i "error" | tail -10</code></pre>
</div>

</div>
<div class="os-panel" data-os="linux">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>cat /var/log/syslog | grep -i "error" | tail -10</code></pre>
</div>

</div>

<div class="os-panel" data-os="windows">

<br>

In Event Viewer → **Windows Logs** → **System**, look for entries with Level: **Error** or **Critical**. These are marked with a red exclamation mark. Click any entry to see the details below.

</div>

## Track Network Connections Your Machine Made


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
  <pre><code>cat /var/log/system.log | grep -i "network" | tail -10</code></pre>
</div>

You can also see live network connections right now:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">macOS</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>lsof -i -P -n</code></pre>
</div>

</div>

<div class="os-panel" data-os="linux">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>cat /var/log/syslog | grep -i "network" | tail -10</code></pre>
</div>

For live connections:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>ss -tunap</code></pre>
</div>

</div>

<div class="os-panel" data-os="windows">

<br>

In Event Viewer → **Windows Logs** → **Security**, look for event ID **5156** (network connection allowed by Windows Filtering Platform). Each entry shows source IP, destination IP, and port.

</div>

## Follow a Log in Real Time

So far you've been reading old logs. But you can also watch logs live as events happen. This is how SOC analysts monitor systems — a live feed of everything occurring right now.

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
  <pre><code>tail -f /var/log/system.log</code></pre>
</div>


- `tail -f` — "follow" mode. Instead of showing the last 10 lines and exiting, it stays open and prints new lines as they're written to the file

Open a second terminal and run a command. You'll see the log entry appear in the first terminal in real time. Press `Ctrl + C` to stop.

</div>

<div class="os-panel" data-os="linux">

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">Linux</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>tail -f /var/log/auth.log</code></pre>
</div>

Open another terminal and try to SSH into your own machine with a wrong password. Watch the failed attempt appear instantly in the first terminal. This is what defenders see during an attack.

</div>

<div class="os-panel" data-os="windows">

<br>

Event Viewer updates in real time automatically. Click **Refresh** in the right sidebar or press `F5` to see the latest events. You can also right-click a log and select **Clear Log** to start fresh and watch new events come in.

</div>

## How Attackers Try to Cover Their Tracks

If an attacker gets into a system, they'll try to delete the logs that show them breaking in. Commands like these exist:

<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">bash (do not run)</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>echo "" > /var/log/auth.log
history -c</code></pre>
</div>

The first command empties the auth log. The second clears the shell history so you can't see what commands they ran. This is why defenders send logs to a remote server in real time — so attackers can't delete the evidence.
