import { screenToGrid } from './utils.js';

export class Camera {
  constructor(canvasWidth, canvasHeight) {
    this.offsetX =
      (canvasWidth -
        (this.gridWidth + this.gridHeight) * (this.tileWidth / 2)) /
        2 +
      this.tileWidth / 2;
    this.offsetY =
      (canvasHeight -
        (this.gridWidth + this.gridHeight) * (this.tileHeight / 2)) /
      2;
    this.tileWidth = 40;
    this.tileHeight = 20;
    this.gridWidth = 30;
    this.gridHeight = 22;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.clickTimer = null;
    this.CLICK_THRESHOLD = 200;
  }

  startDragging(mouseX, mouseY) {
    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;

    this.clickTimer = setTimeout(() => {
      this.isDragging = true;
      this.clickTimer = null;
    }, this.CLICK_THRESHOLD);
  }

  drag(mouseX, mouseY) {
    if (this.isDragging) {
      const deltaX = mouseX - this.lastMouseX;
      const deltaY = mouseY - this.lastMouseY;
      this.offsetX += deltaX;
      this.offsetY += deltaY;
      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;
    }
  }

  stopDragging(mouseX, mouseY, onClick) {
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;

      const rect = document
        .getElementById('gameCanvas')
        .getBoundingClientRect();
      const clickX = mouseX - rect.left;
      const clickY = mouseY - rect.top;

      const gridPos = screenToGrid(
        clickX,
        clickY,
        this.offsetX,
        this.offsetY,
        this.tileWidth,
        this.tileHeight,
      );
      if (
        gridPos.x >= 0 &&
        gridPos.x < this.gridWidth &&
        gridPos.y >= 0 &&
        gridPos.y < this.gridHeight
      ) {
        onClick(gridPos.x, gridPos.y);
      }
    }
    this.isDragging = false;
  }

  cancelDragging() {
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
    }
    this.isDragging = false;
  }
}
