export default function renderBalString(ctx, left, up, down, right) {
  ctx.beginPath();
  ctx.moveTo(left, down);
  ctx.lineTo(up, left);
  ctx.lineTo(right, down);
  ctx.stroke();
}