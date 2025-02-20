import { Camera } from './camera.js';

export function drawGrid(ctx, camera) {
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;

  for (let y = 0; y <= camera.gridHeight; y++) {
    for (let x = 0; x <= camera.gridWidth; x++) {
      const screenX = camera.offsetX + (x - y) * (camera.tileWidth / 2);
      const screenY = camera.offsetY + (x + y) * (camera.tileHeight / 2);

      ctx.beginPath();
      ctx.moveTo(screenX, screenY - camera.tileHeight / 2);
      ctx.lineTo(screenX + camera.tileWidth / 2, screenY);
      ctx.lineTo(screenX, screenY + camera.tileHeight / 2);
      ctx.lineTo(screenX - camera.tileWidth / 2, screenY);
      ctx.closePath();
      ctx.stroke();
    }
  }
}
