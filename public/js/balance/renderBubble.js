export default function renderBubble(ctx, x, y, count) {
  ctx.save();
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.font = "11px arial";
  ctx.fillText(count, x - 3, y - 26);
  ctx.fillStyle = "rgb(255, 255, 255, 0.85)";

  ctx.beginPath();
  ctx.ellipse(x, y - 30, 10, 7, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}