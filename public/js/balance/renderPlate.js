import gravity from "./gravity.js";
import renderBalString from "./renderBalString.js";

export default function renderPlate(ctx, plateX, plateY, size, items, string) {
  ctx.save();
  ctx.translate(plateX, plateY);

  // RENDER ITEMS
  gravity(ctx, -size * 0.5, -size * 0.23, size, size, items);

  // STRING LEFT
  renderBalString(ctx, string[0], string[1], string[2], string[3]);

  // PLATE
  ctx.rotate(-0.875);
  ctx.beginPath();
  ctx.arc(0, 0, size, 1.75, Math.PI);
  ctx.fill();
  ctx.restore();
}