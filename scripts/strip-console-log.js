const fs = require("node:fs/promises");
const path = require("node:path");

const CHUNKS_DIR = path.join(process.cwd(), ".next", "static", "chunks");

async function collectChunkFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectChunkFiles(fullPath);
      }

      if (entry.isFile() && fullPath.endsWith(".js")) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}

async function stripConsoleLogFromChunks() {
  try {
    const files = await collectChunkFiles(CHUNKS_DIR);
    let updatedFilesCount = 0;

    for (const filePath of files) {
      const source = await fs.readFile(filePath, "utf8");
      if (!source.includes("console.log(")) {
        continue;
      }

      const sanitized = source.replaceAll("console.log(", "console.debug(");
      await fs.writeFile(filePath, sanitized, "utf8");
      updatedFilesCount += 1;
    }

    if (updatedFilesCount > 0) {
      console.info(`strip-console-log: sanitized ${updatedFilesCount} chunk file(s).`);
    }
  } catch (error) {
    console.error("strip-console-log: failed to sanitize build chunks.");
    if (error instanceof Error) {
      console.error(`${error.name}: ${error.message}`);
    }
    process.exitCode = 1;
  }
}

void stripConsoleLogFromChunks();
