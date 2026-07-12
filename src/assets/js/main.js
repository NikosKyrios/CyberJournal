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
    const panelContainer = tabGroup.parentElement;
    const allPanels = panelContainer.querySelectorAll(':scope > .os-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const os = tab.dataset.os;

            // Deactivate all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Find the index of this tab group among all tab groups
            const allTabGroups = Array.from(panelContainer.querySelectorAll(':scope > .os-tabs'));
            const groupIndex = allTabGroups.indexOf(tabGroup);
            
            // Collect panels that belong to this tab group
            const tabGroupElements = [];
            let current = tabGroup;
            while (current) {
                tabGroupElements.push(current);
                current = current.nextElementSibling;
                if (current && current.classList.contains('os-tabs')) break;
            }
            
            const groupPanels = tabGroupElements.filter(el => el.classList.contains('os-panel'));
            
            // Hide all panels in this group, then show the selected one
            groupPanels.forEach(p => p.classList.remove('active'));
            const panel = groupPanels.find(p => p.dataset.os === os);
            if (panel) panel.classList.add('active');
        });
    });

    // Activate first tab
    if (tabs.length > 0) {
        tabs[0].click();
    }
});

//glossary page
const glossaryList = document.getElementById('glossary-list');
const glossarySearch = document.getElementById('glossarySearch');
if (glossaryList) {
    let allTerms = [];
    fetch('/assets/data/glossary.json')
    .then(res => res.json())
    .then(data => {
        allTerms = Object.values(data).sort((a, b) => a.term.localeCompare(b.term));
        renderGlossary(allTerms);
    });

    function renderGlossary(terms) {
        if (terms.length === 0) {
            glossaryList.innerHTML = '<p class="empty-state">No terms found.</p>';
            return;
        }
        glossaryList.innerHTML = terms.map(entry => 
            '<div class="glossary-entry">' +
                '<h3>' + entry.term + '</h3>' +
                '<p>' + entry.definition + '</p>' +
            '</div>'
        ).join('');
    }

    if (glossarySearch) {
        glossarySearch.addEventListener('input', () => {
            const query = glossarySearch.value.toLowerCase().trim();
            if (query.length === 0) {
                renderGlossary(allTerms);
            }

            else {
                const filtered = allTerms.filter(t => 
                    t.term.toLowerCase().includes(query) || t.definition.toLowerCase().includes(query)
                );
                renderGlossary(filtered)
            }
        });
    }
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