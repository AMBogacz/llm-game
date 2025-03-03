export class Player {
  constructor(id, name, color) {
    this.id = id || '';
    this.name = name || '';
    this.gridX = 15;
    this.gridY = 11;
    this.width = 20;
    this.height = 20;
    this.color = color || '#00ff00';
    this.targetGridX = 15;
    this.targetGridY = 11;
    this.speed = 0.1;
  }

  draw(ctx, offsetX, offsetY, tileWidth, tileHeight) {
    const screenX = offsetX + (this.gridX - this.gridY) * (tileWidth / 2);
    const screenY = offsetY + (this.gridX + this.gridY) * (tileHeight / 2);

    ctx.fillStyle = this.color;
    ctx.fillRect(
      screenX - this.width / 2,
      screenY - this.height / 2,
      this.width,
      this.height,
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, screenX, screenY - this.height / 2 - 5);
  }

  drawOther(ctx, offsetX, offsetY, tileWidth, tileHeight, label) {
    const screenX = offsetX + (this.gridX - this.gridY) * (tileWidth / 2);
    const screenY = offsetY + (this.gridX + this.gridY) * (tileHeight / 2);

    ctx.fillStyle = '#888888';
    ctx.fillRect(
      screenX - this.width / 2,
      screenY - this.height / 2,
      this.width,
      this.height,
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, screenX, screenY - this.height / 2 - 5);
  }

  move() {
    const dx = this.targetGridX - this.gridX;
    const dy = this.targetGridY - this.gridY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.speed) {
      const angle = Math.atan2(dy, dx);
      this.gridX += Math.cos(angle) * this.speed;
      this.gridY += Math.sin(angle) * this.speed;
    } else {
      this.gridX = this.targetGridX;
      this.gridY = this.targetGridY;
    }
  }

  setTarget(gridX, gridY) {
    this.targetGridX = gridX;
    this.targetGridY = gridY;
  }
}
