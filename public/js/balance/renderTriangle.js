import renderBubble from "./renderBubble.js";

export default function renderTriangle(count, ctx, gravitable) {
  var h = gravitable.height;
  var w = gravitable.width;

  ctx.save();

  ctx.translate(gravitable.x, gravitable.y);
  // ctx.strokeRect(-h, -w, h * 2, w * 2)

  renderBubble(ctx, w, h, count);

  ctx.rotate(gravitable.rot / 10);
  ctx.fillStyle = "#B14EFF";
  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.lineTo(w, h);
  ctx.lineTo(-w, h);
  ctx.fill();
  ctx.restore();
}