function validateFlower(flower) {
  return Boolean(
    flower.name &&
    flower.description &&
    flower.image &&
    Number.isFinite(Number(flower.price)) &&
    Number(flower.price) > 0
  );
}

function getBagCount(bag) {
  return bag.reduce((total, item) => total + item.quantity, 0);
}

function getBagTotal(bag) {
  return bag.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
}

if (typeof module !== "undefined") {
  module.exports = { validateFlower, getBagCount, getBagTotal };
}
