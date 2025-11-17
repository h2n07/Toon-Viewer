// Content script to detect TOON content and inject viewer

(function () {
	'use strict';

	// Check if page contains TOON content
	function isToonContent() {
		const body = document.body;
		if (!body || body.children.length > 1) return false;

		const pre = body.querySelector('pre');
		if (!pre) return false;

		const text = pre.textContent.trim();

		// Check for TOON format patterns - support Unicode/Vietnamese
		const toonPatterns = [
			/^[^\s:]+:/mu, // key: value
			/^[^\s:]+\[\d+\]:/mu, // array[n]:
			/^\[\d+\](?:\{[^}]+\})?:/mu, // anonymous array: [5]{fields}:
			/^  [^\s:]+:/mu, // indented key
			/^- [^\s:]+:/mu, // array item
		];

		return toonPatterns.some((pattern) => pattern.test(text));
	}

	// Initialize viewer
	function initViewer() {
		const pre = document.querySelector('pre');
		const toonText = pre.textContent;

		// Clear body and inject viewer
		document.body.innerHTML = '';

		// Create viewer container
		const container = document.createElement('div');
		container.id = 'toon-viewer';
		document.body.appendChild(container);

		// Create toolbar
		const toolbar = document.createElement('div');
		toolbar.className = 'toon-toolbar';
		toolbar.innerHTML = `
      <div class="toolbar-left">
        <button id="toggle-format" class="btn">Convert to JSON</button>
        <button id="copy-btn" class="btn">Copy</button>
      </div>
      <div class="toolbar-right">
        <label for="theme-select">Theme:</label>
        <select id="theme-select" class="theme-select">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="monokai">Monokai</option>
          <option value="github">GitHub</option>
        </select>
      </div>
    `;
		container.appendChild(toolbar);

		// Create content area
		const content = document.createElement('pre');
		content.id = 'toon-content';
		content.className = 'toon-content';
		container.appendChild(content);

		// State
		let currentFormat = 'toon';
		let currentTheme = localStorage.getItem('toon-viewer-theme') || 'dark';
		let originalToon = toonText;
		let jsonData = null;

		// Apply theme
		function applyTheme(theme) {
			document.body.className = `theme-${theme}`;
			localStorage.setItem('toon-viewer-theme', theme);
		}

		// Render content
		function render() {
			if (currentFormat === 'toon') {
				content.innerHTML = highlightToon(originalToon);
			} else {
				if (!jsonData) {
					try {
						jsonData = ToonParser.toonToJson(originalToon);
					} catch (e) {
						content.textContent = 'Error parsing TOON: ' + e.message;
						return;
					}
				}
				content.innerHTML = highlightJson(JSON.stringify(jsonData, null, 2));
			}
		}

		// Syntax highlighting for TOON - support Unicode/Vietnamese
		function highlightToon(text) {
			return text
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(
					/^(  *)([^\s:]+)(\[\d+\])?(\{[^}]+\})?:/gmu,
					(match, indent, key, array, fields) => {
						let result = indent;
						result += `<span class="key">${key}</span>`;
						if (array) result += `<span class="array-notation">${array}</span>`;
						if (fields) result += `<span class="fields">${fields}</span>`;
						result += '<span class="punctuation">:</span>';
						return result;
					}
				)
				.replace(/^(  *)- /gm, '$1<span class="array-marker">-</span> ')
				.replace(/: (true|false|null)\b/gu, ': <span class="boolean">$1</span>')
				.replace(/: (-?\d+\.?\d*)\b/gu, ': <span class="number">$1</span>')
				.replace(/: ([^,\n]+)/gu, (match, value) => {
					if (!value.match(/^<span/)) {
						return `: <span class="string">${value}</span>`;
					}
					return match;
				});
		}

		// Syntax highlighting for JSON
		function highlightJson(text) {
			return text
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
				.replace(/: "([^"]*)"/g, ': <span class="string">"$1"</span>')
				.replace(/: (true|false|null)/g, ': <span class="boolean">$1</span>')
				.replace(/: (-?\d+\.?\d*)/g, ': <span class="number">$1</span>')
				.replace(/([{}[\],])/g, '<span class="punctuation">$1</span>');
		}

		// Event listeners
		document.getElementById('toggle-format').addEventListener('click', () => {
			if (currentFormat === 'toon') {
				currentFormat = 'json';
				document.getElementById('toggle-format').textContent =
					'Convert to TOON';
			} else {
				currentFormat = 'toon';
				document.getElementById('toggle-format').textContent =
					'Convert to JSON';
			}
			render();
		});

		document.getElementById('copy-btn').addEventListener('click', () => {
			const text = content.textContent;
			navigator.clipboard.writeText(text).then(() => {
				const btn = document.getElementById('copy-btn');
				const originalText = btn.textContent;
				btn.textContent = 'Copied!';
				setTimeout(() => (btn.textContent = originalText), 1500);
			});
		});

		document.getElementById('theme-select').addEventListener('change', (e) => {
			currentTheme = e.target.value;
			applyTheme(currentTheme);
		});

		// Initialize
		document.getElementById('theme-select').value = currentTheme;
		applyTheme(currentTheme);
		render();
	}

	// Run on page load
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			if (isToonContent()) {
				initViewer();
			}
		});
	} else {
		if (isToonContent()) {
			initViewer();
		}
	}
})();
