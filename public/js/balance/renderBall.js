import renderBubble from "./renderBubble.js";

export default function renderBall(count, ctx, gravitable) {
  var h = gravitable.height;
  var w = gravitable.width;
  ctx.save();

  ctx.translate(gravitable.x, gravitable.y);
  //   ctx.strokeRect(-h, -w, 2 * h, 2 * w)

  renderBubble(ctx, w, h, count);

  ctx.rotate(gravitable.rot / 10);
  ctx.fillStyle = "#00C92C";
  ctx.beginPath();
  ctx.arc(0, 0, h, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}