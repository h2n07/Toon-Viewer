// TOON Parser - Convert between TOON and JSON formats

class ToonParser {
	// Parse TOON to JSON
	static toonToJson(toonText) {
		const lines = toonText
			.trim()
			.split('\n')
			.filter((line) => line.trim());
		let result = {};
		let currentPath = [result];
		let currentIndent = 0;
		let arrayContext = [];
		let isRootArray = false;

		for (let line of lines) {
			const indent = line.search(/\S/);
			const trimmed = line.trim();

			if (trimmed.startsWith('-')) {
				// Array item with dash notation
				const itemData = trimmed.substring(1).trim();
				this.parseArrayItem(itemData, arrayContext, currentPath);
			} else if (trimmed.includes(':')) {
				// Line with colon - could be key:value or array header
				const [key, value] = trimmed.split(':', 2);
				const cleanKey = key.trim();
				const cleanValue = value.trim();

				if (indent < currentIndent) {
					const diff = Math.floor((currentIndent - indent) / 2);
					for (let i = 0; i < diff; i++) {
						currentPath.pop();
						if (arrayContext.length > 0) arrayContext.pop();
					}
				}

				currentIndent = indent;

				// Check if this is anonymous array format
				if (cleanKey.match(/^\[(\d+)\](?:\{(.+?)\})?$/u)) {
					const arrayResult = this.parseAnonymousArray(cleanKey, cleanValue);
					if (arrayResult !== null) {
						result = arrayResult;
						isRootArray = true;
						// Set up context for multi-line data
						const anonymousMatch = cleanKey.match(/^\[(\d+)\](?:\{(.+?)\})?$/u);
						if (anonymousMatch && anonymousMatch[2] && cleanValue === '') {
							arrayContext.push({
								key: null,
								fields: anonymousMatch[2].split(','),
								parent: null,
								rootArray: result,
							});
						}
					}
				} else {
					this.parseKeyValue(cleanKey, cleanValue, currentPath, arrayContext);
				}
			} else if (
				arrayContext.length > 0 &&
				arrayContext[arrayContext.length - 1].fields
			) {
				// Compact array data line (no colon, no dash)
				this.parseArrayItem(trimmed, arrayContext, currentPath);
			}
		}

		return result;
	}

	static parseKeyValue(key, value, currentPath, arrayContext) {
		const current = currentPath[currentPath.length - 1];

		// Check for array notation: key[n] or anonymous [n] - support Unicode characters
		const arrayMatch = key.match(/^(.+?)\[(\d+)\](?:\{(.+?)\})?$/u);
		const anonymousArrayMatch = key.match(/^\[(\d+)\](?:\{(.+?)\})?$/u);

		if (arrayMatch) {
			const [, arrayKey, count, fields] = arrayMatch;

			if (fields) {
				// Compact array format: users[2]{id,name,role}:
				if (!current[arrayKey]) current[arrayKey] = [];

				if (value === '') {
					// Multi-line format - data on next lines
					arrayContext.push({
						key: arrayKey,
						fields: fields.split(','),
						parent: current,
					});
				} else {
					// Data after colon - could be single-line or multi-line
					const fieldList = fields.split(',');
					const fieldCount = fieldList.length;

					// Check if data contains newlines
					if (value.includes('\n')) {
						// Multi-line: split by newlines
						const dataLines = this.splitDataLines(value);
						dataLines.forEach((line) => {
							const values = this.parseCSVLine(line);
							const obj = {};
							fieldList.forEach((field, i) => {
								obj[field.trim()] = this.parseValue(values[i] || '');
							});
							current[arrayKey].push(obj);
						});
					} else {
						// Single-line: parse as continuous CSV data
						const records = this.parseCompactArrayData(value, fieldCount);
						records.forEach((record) => {
							const obj = {};
							fieldList.forEach((field, i) => {
								obj[field.trim()] = this.parseValue(record[i] || '');
							});
							current[arrayKey].push(obj);
						});
					}
				}
			} else if (value === '') {
				// Array with object items: projects[2]:
				if (!current[arrayKey]) current[arrayKey] = [];
				currentPath.push(current[arrayKey]);
				arrayContext.push({ key: arrayKey, parent: current });
			} else {
				// Simple array: techStack[3]: Python,React,Kubernetes
				current[arrayKey] = value.split(',').map((v) => v.trim());
			}
		} else if (anonymousArrayMatch) {
			// Anonymous array format: [5]{postId,id,name,email,body}:
			const [, count, fields] = anonymousArrayMatch;

			if (fields) {
				// Return as root array instead of object with array property
				const fieldList = fields.split(',');
				const fieldCount = fieldList.length;

				// Clear current object and make it an array
				Object.keys(current).forEach((key) => delete current[key]);
				const resultArray = [];

				if (value === '') {
					// Multi-line format - data on next lines
					arrayContext.push({
						key: null, // null key indicates root array
						fields: fieldList,
						parent: null,
						rootArray: resultArray,
					});
				} else {
					// Data after colon - could be single-line or multi-line
					if (value.includes('\n')) {
						// Multi-line: split by newlines
						const dataLines = this.splitDataLines(value);
						dataLines.forEach((line) => {
							const values = this.parseCSVLine(line);
							const obj = {};
							fieldList.forEach((field, i) => {
								obj[field.trim()] = this.parseValue(values[i] || '');
							});
							resultArray.push(obj);
						});
					} else {
						// Single-line: parse as continuous CSV data
						const records = this.parseCompactArrayData(value, fieldCount);
						records.forEach((record) => {
							const obj = {};
							fieldList.forEach((field, i) => {
								obj[field.trim()] = this.parseValue(record[i] || '');
							});
							resultArray.push(obj);
						});
					}
				}

				// Replace current object with array
				return resultArray;
			}
		} else if (value === '') {
			// Nested object
			current[key] = {};
			currentPath.push(current[key]);
		} else {
			// Simple value
			current[key] = this.parseValue(value);
		}
	}

	// Parse compact array data that might be on single line
	// Format: field1,field2,"quoted,field",field4nextRecordField1,field2...
	// No delimiter between records - they just continue after last field
	static parseCompactArrayData(text, fieldCount) {
		const records = [];
		let i = 0;

		while (i < text.length) {
			const record = [];
			let fieldsParsed = 0;

			while (fieldsParsed < fieldCount && i < text.length) {
				let value = '';
				let inQuotes = false;
				let escapeNext = false;

				// Skip leading whitespace
				while (i < text.length && text[i] === ' ') i++;

				// Parse one field
				while (i < text.length) {
					const char = text[i];

					if (escapeNext) {
						value += char;
						escapeNext = false;
						i++;
						continue;
					}

					if (char === '\\') {
						value += char;
						escapeNext = true;
						i++;
						continue;
					}

					if (char === '"') {
						inQuotes = !inQuotes;
						value += char;
						i++;
						continue;
					}

					if (char === ',' && !inQuotes) {
						// End of field (not last field in record)
						i++;
						break;
					}

					// If we've parsed enough fields-1, next non-comma char ends this field
					if (fieldsParsed === fieldCount - 1 && !inQuotes) {
						// Last field - continues until we hit a digit (start of next record)
						// or end of string
						if (value.length > 0 && /\d/.test(char) && value.endsWith('"')) {
							// We've hit the start of next record
							break;
						}
					}

					value += char;
					i++;
				}

				record.push(value.trim());
				fieldsParsed++;
			}

			if (record.length === fieldCount) {
				records.push(record);
			} else if (record.length > 0) {
				// Partial record at end
				records.push(record);
			}
		}

		return records;
	}

	// Split data lines while respecting quoted strings
	static splitDataLines(text) {
		const lines = [];
		let current = '';
		let inQuotes = false;

		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			const prevChar = i > 0 ? text[i - 1] : '';

			if (char === '"' && prevChar !== '\\') {
				inQuotes = !inQuotes;
				current += char;
			} else if (char === '\n' && !inQuotes) {
				if (current.trim()) {
					lines.push(current.trim());
				}
				current = '';
			} else {
				current += char;
			}
		}

		if (current.trim()) {
			lines.push(current.trim());
		}

		return lines;
	}

	static parseArrayItem(itemData, arrayContext, currentPath) {
		if (arrayContext.length === 0) return;

		const context = arrayContext[arrayContext.length - 1];

		if (context.fields) {
			// Compact format with CSV parsing (supports quoted strings)
			const values = this.parseCSVLine(itemData);
			const obj = {};
			context.fields.forEach((field, i) => {
				obj[field.trim()] = this.parseValue(values[i] || '');
			});

			if (context.rootArray) {
				// Anonymous array - push to root array
				context.rootArray.push(obj);
			} else {
				// Named array - push to parent[key]
				context.parent[context.key].push(obj);
			}
		} else {
			// Regular object item
			const arr = currentPath[currentPath.length - 1];
			const newObj = {};
			arr.push(newObj);
			currentPath.push(newObj);

			if (itemData.includes(':')) {
				const [key, value] = itemData.split(':', 2);
				newObj[key.trim()] = this.parseValue(value.trim());
			}
		}
	}

	// Parse CSV line with support for quoted strings containing commas
	static parseCSVLine(line) {
		const values = [];
		let current = '';
		let inQuotes = false;
		let i = 0;

		while (i < line.length) {
			const char = line[i];

			if (char === '"') {
				if (inQuotes && line[i + 1] === '"') {
					// Escaped quote
					current += '"';
					i += 2;
					continue;
				}
				inQuotes = !inQuotes;
				i++;
			} else if (char === ',' && !inQuotes) {
				values.push(current.trim());
				current = '';
				i++;
			} else {
				current += char;
				i++;
			}
		}

		values.push(current.trim());
		return values;
	}

	static parseValue(value) {
		// Remove surrounding quotes if present
		if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1);
			// Unescape newlines and other escape sequences
			value = value
				.replace(/\\n/g, '\n')
				.replace(/\\t/g, '\t')
				.replace(/\\"/g, '"');
			return value;
		}

		if (value === 'true') return true;
		if (value === 'false') return false;
		if (value === 'null') return null;
		if (/^-?\d+$/.test(value)) return parseInt(value, 10);
		if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
		return value;
	}

	// Convert JSON to TOON
	static jsonToToon(jsonObj, indent = 0) {
		let result = [];
		const spaces = '  '.repeat(indent);

		for (const [key, value] of Object.entries(jsonObj)) {
			if (Array.isArray(value)) {
				result.push(...this.arrayToToon(key, value, indent));
			} else if (typeof value === 'object' && value !== null) {
				result.push(`${spaces}${key}:`);
				result.push(...this.jsonToToon(value, indent + 1));
			} else {
				result.push(`${spaces}${key}: ${value}`);
			}
		}

		return result;
	}

	static arrayToToon(key, arr, indent) {
		const spaces = '  '.repeat(indent);
		const result = [];

		if (arr.length === 0) {
			result.push(`${spaces}${key}[0]:`);
			return result;
		}

		// Check if all items are objects with same keys
		if (
			arr.every(
				(item) =>
					typeof item === 'object' && item !== null && !Array.isArray(item)
			)
		) {
			const firstKeys = Object.keys(arr[0]);
			const allSameKeys = arr.every((item) => {
				const keys = Object.keys(item);
				return (
					keys.length === firstKeys.length &&
					keys.every((k) => firstKeys.includes(k))
				);
			});

			if (allSameKeys && firstKeys.length <= 10) {
				// Use compact format with proper CSV escaping
				result.push(`${spaces}${key}[${arr.length}]{${firstKeys.join(',')}}:`);
				arr.forEach((item) => {
					const values = firstKeys.map((k) => this.escapeCSVValue(item[k]));
					result.push(`${spaces}${values.join(',')}`);
				});
				return result;
			}
		}

		// Check if all items are primitives
		if (arr.every((item) => typeof item !== 'object' || item === null)) {
			result.push(`${spaces}${key}[${arr.length}]: ${arr.join(',')}`);
			return result;
		}

		// Use expanded format for complex arrays
		result.push(`${spaces}${key}[${arr.length}]:`);
		arr.forEach((item) => {
			if (typeof item === 'object' && item !== null) {
				result.push(
					`${spaces}- ${Object.entries(item)
						.map(([k, v]) => `${k}: ${v}`)
						.join('\n' + spaces + '  ')}`
				);
			} else {
				result.push(`${spaces}- ${item}`);
			}
		});

		return result;
	}

	// Escape CSV value if it contains comma, newline, or quotes
	static escapeCSVValue(value) {
		if (value === null || value === undefined) return '';

		const strValue = String(value);

		// Check if value needs quoting
		if (
			strValue.includes(',') ||
			strValue.includes('\n') ||
			strValue.includes('"')
		) {
			// Escape quotes by doubling them and wrap in quotes
			return `"${strValue.replace(/\n/g, '\\n').replace(/"/g, '\\"')}"`;
		}

		return strValue;
	}

	// Parse anonymous array format: [5]{postId,id,name,email,body}:
	static parseAnonymousArray(key, value) {
		const anonymousMatch = key.match(/^\[(\d+)\](?:\{(.+?)\})?$/u);

		if (anonymousMatch) {
			const [, count, fields] = anonymousMatch;

			if (fields) {
				const fieldList = fields.split(',');
				const fieldCount = fieldList.length;
				const resultArray = [];

				if (value !== '') {
					// Data after colon - could be single-line or multi-line
					if (value.includes('\n')) {
						// Multi-line: split by newlines
						const dataLines = this.splitDataLines(value);
						dataLines.forEach((line) => {
							const values = this.parseCSVLine(line);
							const obj = {};
							fieldList.forEach((field, i) => {
								obj[field.trim()] = this.parseValue(values[i] || '');
							});
							resultArray.push(obj);
						});
					} else {
						// Single-line: parse as continuous CSV data
						const records = this.parseCompactArrayData(value, fieldCount);
						records.forEach((record) => {
							const obj = {};
							fieldList.forEach((field, i) => {
								obj[field.trim()] = this.parseValue(record[i] || '');
							});
							resultArray.push(obj);
						});
					}
				}

				return resultArray;
			}
		}

		return null;
	}
}

// Make available globally
if (typeof window !== 'undefined') {
	window.ToonParser = ToonParser;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
	module.exports = ToonParser;
}
