const {
  validateFlower,
  getBagCount,
  getBagTotal
} = require("../flower-utils");

describe("Petal Bloom flower data", () => {
  const flowers = [
    {
      id: "1",
      name: "Blush Peonies",
      description: "Soft, romantic, and full of charm",
      image: "peonies.jpg",
      price: 1800
    },
    {
      id: "2",
      name: "Garden Tulips",
      description: "Fresh stems for brighter days",
      image: "tulips.jpg",
      price: 1500
    },
    {
      id: "3",
      name: "Sweetheart Roses",
      description: "A timeless gesture of affection",
      image: "roses.jpg",
      price: 3000
    }
  ];

  test("has three original flowers", () => {
    expect(flowers).toHaveLength(3);
  });

  test("every flower has a name and description", () => {
    flowers.forEach((flower) => {
      expect(flower.name).toBeTruthy();
      expect(flower.description).toBeTruthy();
    });
  });

  test("every flower has a positive price", () => {
    flowers.forEach((flower) => {
      expect(flower.price).toBeGreaterThan(0);
    });
  });

  test("accepts a valid flower", () => {
    expect(validateFlower(flowers[0])).toBe(true);
  });

  test("rejects a flower with no name", () => {
    expect(validateFlower({ ...flowers[0], name: "" })).toBe(false);
  });

  test("rejects a flower with an invalid price", () => {
    expect(validateFlower({ ...flowers[0], price: -10 })).toBe(false);
  });

  test("counts items in the shopping bag", () => {
    expect(getBagCount([
      { quantity: 2 },
      { quantity: 3 }
    ])).toBe(5);
  });

  test("calculates the shopping bag total", () => {
    expect(getBagTotal([
      { price: 200, quantity: 2 },
      { price: 300, quantity: 1 }
    ])).toBe(700);
  });

  test("returns zero for an empty shopping bag", () => {
    expect(getBagCount([])).toBe(0);
    expect(getBagTotal([])).toBe(0);
  });
});
