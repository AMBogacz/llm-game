export function screenToGrid(x, y, offsetX, offsetY, tileWidth, tileHeight) {
  const adjustedX = x - offsetX;
  const adjustedY = y - offsetY;

  const gridX =
    (adjustedX / (tileWidth / 2) + adjustedY / (tileHeight / 2)) / 2;
  const gridY =
    (adjustedY / (tileHeight / 2) - adjustedX / (tileWidth / 2)) / 2;

  return {
    x: Math.round(gridX),
    y: Math.round(gridY),
  };
}
