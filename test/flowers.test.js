
describe("Petal Bloom flower data", () => {
  const flowers = [
    {
      id: "1",
      name: "Blush Peonies",
      description: "Soft, romantic, and full of charm",
      price: 1800
    },
    {
      id: "2",
      name: "Garden Tulips",
      description: "Fresh stems for brighter days",
      price: 1500
    },
    {
      id: "3",
      name: "Sweetheart Roses",
      description: "A timeless gesture of affection",
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
});
