import { createCanvas, loadImage } from "@napi-rs/canvas";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

/**
 * Remove fundo branco (ou quase branco) de uma imagem — salva PNG com transparência.
 */
async function removeWhiteBackground(inputPath, outputPath, threshold = 30) {
  const img = await loadImage(inputPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > 255 - threshold && g > 255 - threshold && b > 255 - threshold) {
      data[i + 3] = 0; // transparente
    }
  }
  ctx.putImageData(imageData, 0, 0);
  const buffer = canvas.toBuffer("image/png");
  writeFileSync(outputPath, buffer);
  console.log(`OK (fundo branco removido): ${outputPath}`);
}

/**
 * Remove fundo preto (ou quase preto) de uma imagem — salva PNG com transparência.
 */
async function removeBlackBackground(inputPath, outputPath, threshold = 30) {
  const img = await loadImage(inputPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r < threshold && g < threshold && b < threshold) {
      data[i + 3] = 0; // transparente
    }
  }
  ctx.putImageData(imageData, 0, 0);
  const buffer = canvas.toBuffer("image/png");
  writeFileSync(outputPath, buffer);
  console.log(`OK (fundo preto removido): ${outputPath}`);
}

// mascote preto em fundo branco
await removeWhiteBackground(join(publicDir, "logo-icon-dark.png"), join(publicDir, "logo-icon-dark.png"), 30);
// logo completa preta em fundo branco
await removeWhiteBackground(join(publicDir, "logo-full-dark.png"), join(publicDir, "logo-full-dark.png"), 30);
// mascote branco em fundo preto
await removeBlackBackground(join(publicDir, "logo-icon-light.png"), join(publicDir, "logo-icon-light.png"), 30);
// logo completa branca em fundo preto
await removeBlackBackground(join(publicDir, "logo-full-light.png"), join(publicDir, "logo-full-light.png"), 30);
// mascote colorido em fundo branco
await removeWhiteBackground(join(publicDir, "logo-icon-color.png"), join(publicDir, "logo-icon-color.png"), 30);

console.log("\nTodas as logos processadas com sucesso!");
