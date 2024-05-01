import renderPlate from "./renderPlate.js";

export default function renderBalance(ctx, x, y, scale, balance) {
  balance.tilt(0.05);
  var pos = balance.currPos / 2;

  var xOffSet = Math.abs(pos) * 50 - 100;
  var yOffSet = pos * 75;

  var scaledX = balance.x * scale;
  var scaledY = balance.y * scale;

  var bs = [-50 * scale, 0 * scale, 80 * scale, 50 * scale];
  var plateSize = 100 * scale;

  ctx.save();
  ctx.translate(x, y);

  // AXIS
  ctx.save();
  ctx.translate(scaledX, scaledY);
  ctx.rotate(pos);
  ctx.beginPath();
  ctx.roundRect(-100 * scale, -5 * scale, 200 * scale, 10 * scale, 5 * scale);
  ctx.fill();
  ctx.restore();

  // LEFT PLATE
  renderPlate(
    ctx,
    xOffSet * scale,
    (50 - yOffSet) * scale,
    plateSize,
    balance.leftPlate,
    bs
  );

  // RIGHT PLATE
  renderPlate(
    ctx,
    (balance.x - xOffSet) * scale,
    (balance.y + 50 + yOffSet) * scale,
    plateSize,
    balance.rightPlate,
    bs
  );

  // AXIS BALL
  ctx.beginPath();
  ctx.arc(scaledX, scaledY, 10 * scale, 0, 2 * Math.PI);
  ctx.fill();

  // ctx.fillRect();
  ctx.beginPath();
  ctx.roundRect(
    (balance.x - 5) * scale,
    scaledY,
    10 * scale,
    200 * scale,
    5 * scale
  );
  ctx.fill();

  ctx.restore();
}