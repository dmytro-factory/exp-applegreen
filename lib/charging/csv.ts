/**
 * Minimal RFC-4180-ish CSV parser: supports double-quoted fields, escaped
 * quotes ("") and commas/newlines inside quotes. Sufficient for the static
 * Applegreen station/charger datasets in /data.
 */
export function parseCsv(input: string): Record<string, string>[] {
  const rows = parseRows(input.trim());
  if (rows.length === 0) {
    return [];
  }

  const [header, ...body] = rows;
  return body
    .filter((cells) => cells.length > 0 && cells.some((cell) => cell.length > 0))
    .map((cells) => {
      const record: Record<string, string> = {};
      header.forEach((key, index) => {
        record[key] = (cells[index] ?? "").trim();
      });
      return record;
    });
}

function parseRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") {
        i += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}
