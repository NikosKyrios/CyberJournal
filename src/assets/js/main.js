const toggle = document.getElementById('themeToggle');
const html = document.documentElement;

const saved = localStorage.getItem('theme');

if (saved === 'light') {
    html.setAttribute('data-theme', 'light');
}
else if (!saved && window.matchMedia('(prefers-color-scheme: light)').matches) {
    html.setAttribute('data-theme', 'light');
}

toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

//code blocks
document.querySelectorAll('.code-block').forEach(block => {
    const button = block.querySelector('.copy-btn');
    if (!button) return;

    button.addEventListener('click', () => {
        const code = block.querySelector('code').innerText;
        navigator.clipboard.writeText(code).then(() => {
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        });
    });
});

//Glossary
document.querySelectorAll('.glossary-term').forEach(term => {
    const key = term.dataset.term;
    if (!key) return;
    let tooltip = null;

    term.addEventListener('mouseenter', async () => {
        if (!window.glossaryData) {
            const res = await fetch('/assets/data/glossary.json');
            window.glossaryData = await res.json();
        }

        const entry = window.glossaryData[key];
        if (!entry) return;

        tooltip = document.createElement('div');
        tooltip.className = 'glossary-tooltip visible';
        tooltip.innerHTML = '<div class="tooltip-term">' + entry.term + '</div> <div class="tooltip-def">' +  entry.definition + '</div>';

        term.appendChild(tooltip);
    });
    term.addEventListener('mouseleave', () => {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    })
});

//OS Tabs
document.querySelectorAll('.os-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.os-tab');
    const parent = tabGroup.parentElement;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const os = tab.dataset.os;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const allPanels = [];
            let sibling = tabGroup.nextElementSibling;
            while (sibling) {
                if (sibling.classList.contains('os-panel')) {
                    allPanels.push(sibling);
                }
                sibling = sibling.nextElementSibling;
            }
            allPanels.forEach(p => p.classList.remove('active'));
            const panel = parent.querySelector(':scope > .os-panel[data-os="' + os + '"]');
            if (panel) panel.classList.add('active');
        });
    });

    if (tabs.length > 0) tabs[0].click();
});

//glossary page
const glossaryList = document.getElementById('glossary-list');
if (glossaryList) {
    fetch('/assets/data/glossary.json')
    .then(res => res.json())
    .then(data => {
        const terms = Object.values(data).sort((a, b) => a.term.localeCompare(b.term));
        glossaryList.innerHTML = terms.map(entry => 
            '<div class="glossary-entry">' +
                '<h3>' + entry.term + '</h3>' +
                '<p>' + entry.definition + '</p>' +
            '</div>'
        ).join('');
    });
}