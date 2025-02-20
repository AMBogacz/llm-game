export const player = {
  x: 400,
  y: 300,
  width: 20,
  height: 20,
  color: '#00ff00',

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );
  },
};
