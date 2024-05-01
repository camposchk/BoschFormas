export default function gravity(ctx, x, y, width, height, gravitables) {
  ctx.save();
  ctx.translate(x, y);

  for (const [key, gravitable] of Object.entries(gravitables)) {
    gravitable.draw(gravitable.count, ctx, gravitable);

    gravitable.move(0, 0.1);
    if (gravitable.bottom() > height)
      gravitable.bounceY(height - gravitable.height);
    if (gravitable.right() > width)
      gravitable.bounceX(width - gravitable.width);
    if (gravitable.x < gravitable.width) gravitable.bounceX(gravitable.width);
  }
  ctx.restore();
}