import renderBubble from "./renderBubble.js";

export default function renderSquare(count, ctx, gravitable) {
  var h = gravitable.height;
  var w = gravitable.width;

  ctx.save();

  ctx.translate(gravitable.x, gravitable.y);
  // ctx.strokeRect(-h, -w, h * 2, w * 2)

  renderBubble(ctx, w, h, count);

  ctx.rotate(gravitable.rot / 10);
  ctx.fillStyle = "#E00420";
  ctx.fillRect(-w, -h, w * 2, h * 2);
  ctx.restore();
}