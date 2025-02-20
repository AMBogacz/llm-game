export class Player {
  gridX: number = 15;
  gridY: number = 11;
  width: number = 20;
  height: number = 20;
  color: string = '#00ff00';
  targetGridX: number = 15;
  targetGridY: number = 11;
  speed: number = 0.1;

  draw(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    tileWidth: number,
    tileHeight: number,
  ): void {
    const screenX = offsetX + (this.gridX - this.gridY) * (tileWidth / 2);
    const screenY = offsetY + (this.gridX + this.gridY) * (tileHeight / 2);

    ctx.fillStyle = this.color;
    ctx.fillRect(
      screenX - this.width / 2,
      screenY - this.height / 2,
      this.width,
      this.height,
    );
  }

  move(): void {
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

  setTarget(gridX: number, gridY: number): void {
    this.targetGridX = gridX;
    this.targetGridY = gridY;
  }
}
