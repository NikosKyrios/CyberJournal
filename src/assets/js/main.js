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

    function showTooltip() {
        if (!window.glossaryData) {
            fetch('/assets/data/glossary.json')
            .then(res => res.json())
            .then(data => {
                window.glossaryData = data;
                buildTooltip();
            });
        }
        else {
            buildTooltip();
        }
    }

    function buildTooltip() {
        const entry = window.glossaryData[key];
        if (!entry) return;

        if (tooltip) tooltip.remove();

        tooltip = document.createElement('div');
        tooltip.className = 'glossary-tooltip visible';
        tooltip.innerHTML = '<div class="tooltip-term">' + entry.term + '</div><div class="tooltip-def">' + entry.definition + '</div>';
        term.appendChild(tooltip);
    }
    function hideTooltip() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }

    // Desktop: hover
    term.addEventListener('mouseenter', showTooltip);
    term.addEventListener('mouseleave', hideTooltip);

    // Mobile: tap
    term.addEventListener('click', function(e) {
        if (tooltip) {
            hideTooltip();
        } else {
            e.preventDefault();
            showTooltip();
        }
    });
});

// Close tooltip when tapping elsewhere
document.addEventListener('click', function(e) {
    if (!e.target.closest('.glossary-term')) {
        const tooltips = document.querySelectorAll('.glossary-tooltip');
        tooltips.forEach(t => t.remove());
    }
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

//mobile menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const dropdowns = document.querySelectorAll('.dropdown');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
});

dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            e.preventDefault();
            dropdown.classList.toggle('open');
        }
    });
});

//Search
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchInput && searchResults) {
    let articles = [];

    fetch('/articles.json')
        .then(res => res.json())
        .then(data => {
            articles = data;
        });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.classList.remove('visible');
            searchResults.innerHTML = '';
            return;
        }

        const matches = articles.filter(a => 
            a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)
        ).slice(0, 5);

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="search-result-empty">No articles found.</div>';
        }
        else {
            searchResults.innerHTML = matches.map(a =>
                '<a href="' + a.url + '" class="search-result-item">' +
                '<div class="result-title">' + a.title + '</div>' +
                '<div class="result-desc">' + a.description + '</div>' +
                '</a>'  
            ).join('');
        }
        searchResults.classList.add('visible');
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            searchResults.classList.remove('visible');
        }
    });
}

//Sidebar toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '◂' : '▸';
    });
}