export const player = {
  gridX: 15, // Middle of 30-wide grid
  gridY: 11, // Middle of 22-high grid
  width: 20,
  height: 20,
  color: '#00ff00',
  targetGridX: 15,
  targetGridY: 11,
  speed: 0.1,

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
  },

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
  },

  setTarget(gridX, gridY) {
    this.targetGridX = gridX;
    this.targetGridY = gridY;
  },
};
