import fs from "fs/promises";

export async function extractPdfText(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);

  const { CanvasFactory } = await import("pdf-parse/worker");

  const { PDFParse } = await import("pdf-parse");

  const parser = new PDFParse({
    data: buffer,
    CanvasFactory,
  });

  try {
    const result = await parser.getText();

    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}
