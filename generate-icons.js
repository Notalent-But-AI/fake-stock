// Generate PWA icons using canvas
const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size, filename) {
  const c = createCanvas(size, size);
  const ctx = c.getContext('2d');

  // Background - Kiwoom orange gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#f37021');
  grad.addColorStop(1, '#e85d0f');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.22);
  ctx.fill();

  // Flame icon
  const cx = size / 2;
  const cy = size * 0.42;
  const s = size / 5;

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 1.6);
  ctx.bezierCurveTo(cx - s * 0.3, cy - s * 0.8, cx - s * 1.2, cy - s * 0.2, cx - s * 1.2, cy + s * 0.6);
  ctx.bezierCurveTo(cx - s * 1.2, cy + s * 1.5, cx - s * 0.5, cy + s * 2, cx, cy + s * 2);
  ctx.bezierCurveTo(cx + s * 0.5, cy + s * 2, cx + s * 1.2, cy + s * 1.5, cx + s * 1.2, cy + s * 0.6);
  ctx.bezierCurveTo(cx + s * 1.2, cy - s * 0.2, cx + s * 0.3, cy - s * 0.8, cx, cy - s * 1.6);
  ctx.fill();

  // Inner flame
  ctx.fillStyle = '#f37021';
  ctx.beginPath();
  const iy = cy + s * 0.3;
  ctx.moveTo(cx, iy - s * 0.4);
  ctx.bezierCurveTo(cx - s * 0.15, iy, cx - s * 0.5, iy + s * 0.3, cx - s * 0.5, iy + s * 0.7);
  ctx.bezierCurveTo(cx - s * 0.5, iy + s * 1.1, cx - s * 0.2, iy + s * 1.3, cx, iy + s * 1.3);
  ctx.bezierCurveTo(cx + s * 0.2, iy + s * 1.3, cx + s * 0.5, iy + s * 1.1, cx + s * 0.5, iy + s * 0.7);
  ctx.bezierCurveTo(cx + s * 0.5, iy + s * 0.3, cx + s * 0.15, iy, cx, iy - s * 0.4);
  ctx.fill();

  // Text "영웅문" at bottom
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${size * 0.1}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('영웅문S#', cx, size * 0.88);

  fs.writeFileSync(filename, c.toBuffer('image/png'));
  console.log(`Generated ${filename}`);
}

generateIcon(192, 'icon-192.png');
generateIcon(512, 'icon-512.png');
console.log('Done!');
