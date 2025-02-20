export const player = {
  x: 400,
  y: 300,
  width: 20,
  height: 20,
  color: '#00ff00',
  targetX: 400, // Where player wants to go
  targetY: 300,
  speed: 2, // Pixels per frame

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );
  },

  move() {
    // Calculate distance to target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Move if not at target
    if (distance > this.speed) {
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * this.speed;
      this.y += Math.sin(angle) * this.speed;
    } else {
      // Snap to target if close enough
      this.x = this.targetX;
      this.y = this.targetY;
    }
  },

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  },
};
