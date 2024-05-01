import renderBubble from "./renderBubble.js";

export default function renderPentagon(count, ctx, gravitable) {
  var h = gravitable.height;
  var w = gravitable.width;

  ctx.save();

  ctx.translate(gravitable.x, gravitable.y);
  // ctx.strokeRect(-h, -w, h * 2, w * 2)

  renderBubble(ctx, w, h, count);

  ctx.rotate(gravitable.rot / 10);
  ctx.fillStyle = "#1F93FF";
  ctx.beginPath();
  var step = Math.PI * 2 * 0.2;
  for (let i = 0.5; i < 5; i++) {
    if (i == 0) ctx.moveTo(Math.sin(i * step) * h, Math.cos(i * step) * h);
    else ctx.lineTo(Math.sin(i * step) * h, Math.cos(i * step) * h);
  }
  // ctx.lineTo(-w, h)
  ctx.fill();
  ctx.restore();
}