
const API_URL = "https://petal-bloom.onrender.com/flowers";
const ORDERS_URL = "https://petal-bloom.onrender.com/orders";
const productGrid = document.querySelector(".product-grid");
const bagCount = document.querySelector("#bag-count");
const bagLink = document.querySelector(".bag-link");

let flowers = [];
let bag = [];

try {
  bag = JSON.parse(localStorage.getItem("petalBloomBag") || "[]");
  if (!Array.isArray(bag)) bag = [];
} catch {
  bag = [];
}

function saveBag() {
  localStorage.setItem("petalBloomBag", JSON.stringify(bag));
  updateBagCount();
}

function updateBagCount() {
  const total = bag.reduce((sum, item) => sum + item.quantity, 0);
  bagCount.textContent = total;
}

const bagStyles = document.createElement("style");
bagStyles.textContent = `
.bag-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(30, 20, 20, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.bag-overlay[hidden] { display: none; }
.bag-dialog {
  background: #fffaf5;
  color: #4b342d;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 28px;
  border-radius: 12px;
  box-sizing: border-box;
}
.bag-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.bag-heading h2 { margin-top: 0; }
.bag-close, .bag-remove {
  cursor: pointer;
  padding: 8px 12px;
  border: 1px solid #d7b9ad;
  background: transparent;
  color: inherit;
  border-radius: 6px;
}
.bag-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #eadbd2;
}
.bag-item img {
  width: 76px;
  height: 86px;
  object-fit: cover;
  border-radius: 6px;
}
.bag-item-info { flex: 1; }
.bag-item-info h3 { margin: 0 0 6px; }
.bag-item-info p { margin: 5px 0; }
.bag-total {
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 22px;
}
`;
document.head.appendChild(bagStyles);

const bagOverlay = document.createElement("div");
bagOverlay.className = "bag-overlay";
bagOverlay.hidden = true;

const bagDialog = document.createElement("section");
bagDialog.className = "bag-dialog";
bagDialog.setAttribute("role", "dialog");
bagDialog.setAttribute("aria-modal", "true");
bagDialog.setAttribute("aria-label", "Your shopping bag");

const bagHeading = document.createElement("div");
bagHeading.className = "bag-heading";

const bagTitle = document.createElement("h2");
bagTitle.textContent = "Your flower bag";

const closeButton = document.createElement("button");
closeButton.className = "bag-close";
closeButton.type = "button";
closeButton.textContent = "Close";
closeButton.addEventListener("click", closeBag);

bagHeading.append(bagTitle, closeButton);

const bagContent = document.createElement("div");
bagDialog.append(bagHeading, bagContent);
bagOverlay.appendChild(bagDialog);
document.body.appendChild(bagOverlay);

function openBag() {
  renderBag();
  bagOverlay.hidden = false;
}

function closeBag() {
  bagOverlay.hidden = true;
}

if (bagLink) {
  bagLink.addEventListener("click", (event) => {
    event.preventDefault();
    openBag();
  });
}

bagOverlay.addEventListener("click", (event) => {
  if (event.target === bagOverlay) closeBag();
});

function renderBag() {
  bagContent.replaceChildren();

  if (bag.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent =
      "Your bag is empty. Add some flowers from our shop!";
    bagContent.appendChild(emptyMessage);
    return;
  }

  let totalPrice = 0;

  bag.forEach((item) => {
    totalPrice += Number(item.price) * item.quantity;

    const row = document.createElement("article");
    row.className = "bag-item";

    const image = document.createElement("img");
    image.src = item.image || "";
    image.alt = item.name;

    const info = document.createElement("div");
    info.className = "bag-item-info";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent =
      `Ksh ${Number(item.price).toLocaleString("en-KE")}`;

    const quantity = document.createElement("p");
    quantity.textContent = `Quantity: ${item.quantity}`;

    info.append(name, price, quantity);

    const removeButton = document.createElement("button");
    removeButton.className = "bag-remove";
    removeButton.type = "button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      bag = bag.filter((flower) => String(flower.id) !== String(item.id));
      saveBag();
      renderBag();
    });

    row.append(image, info, removeButton);
    bagContent.appendChild(row);
  });

  const total = document.createElement("p");
  total.className = "bag-total";
  total.textContent =
    `Total: Ksh ${totalPrice.toLocaleString("en-KE")}`;

  bagContent.appendChild(total);

  // Checkout form
  const checkoutForm = document.createElement("form");
  checkoutForm.className = "checkout-form";

  const checkoutHeading = document.createElement("h3");
  checkoutHeading.textContent = "Complete your order";

  const customerName = document.createElement("input");
  customerName.type = "text";
  customerName.placeholder = "Your full name";
  customerName.required = true;
  customerName.setAttribute("aria-label", "Your full name");

  const customerPhone = document.createElement("input");
  customerPhone.type = "tel";
  customerPhone.placeholder = "Your phone number";
  customerPhone.required = true;
  customerPhone.setAttribute("aria-label", "Your phone number");

  const deliveryAddress = document.createElement("textarea");
  deliveryAddress.placeholder = "Delivery address";
  deliveryAddress.required = true;
  deliveryAddress.setAttribute("aria-label", "Delivery address");

  const placeOrderButton = document.createElement("button");
  placeOrderButton.type = "submit";
  placeOrderButton.textContent = "Place order";

  checkoutForm.append(
    checkoutHeading,
    customerName,
    customerPhone,
    deliveryAddress,
    placeOrderButton
  );

  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const order = {
      customerName: customerName.value.trim(),
      phone: customerPhone.value.trim(),
      deliveryAddress: deliveryAddress.value.trim(),
      items: bag.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity
      })),
      total: bag.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      ),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    placeOrderButton.disabled = true;
    placeOrderButton.textContent = "Placing order...";

    try {
      const response = await fetch(ORDERS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        throw new Error("Order could not be saved");
      }

      bag = [];
      saveBag();
      renderBag();

      alert("Your order was placed successfully!");
    } catch (error) {
      console.error("Order submission failed:", error);
      placeOrderButton.disabled = false;
      placeOrderButton.textContent = "Place order";
      alert(
        "Could not place your order. Please check that JSON Server is running."
      );
    }
  });

  bagContent.appendChild(checkoutForm);

}

async function loadFlowers() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Could not load flowers");
    }

    flowers = await response.json();
    productGrid.replaceChildren();

    flowers.forEach((flower) => {
      const card = document.createElement("article");
      card.className = "product-card";

      const imageLink = document.createElement("a");
      imageLink.className = "product-image";
      imageLink.href = "#shop";

      const image = document.createElement("img");
      image.src = flower.image;
      image.alt = `${flower.name} flower arrangement`;
      imageLink.appendChild(image);

      const details = document.createElement("div");
      details.className = "product-details";

      const information = document.createElement("div");

      const name = document.createElement("h3");
      name.textContent = flower.name;

      const description = document.createElement("p");
      description.textContent = flower.description;

      const price = document.createElement("strong");
      price.textContent =
        `Ksh ${Number(flower.price).toLocaleString("en-KE")}`;

      information.append(name, description, price);

      const button = document.createElement("button");
      button.className = "add-button";
      button.type = "button";
      button.textContent = "+";
      button.setAttribute("aria-label", `Add ${flower.name} to bag`);

      button.addEventListener("click", () => {
        const existing = bag.find(
          (item) => String(item.id) === String(flower.id)
        );

        if (existing) {
          existing.quantity++;
        } else {
          bag.push({ ...flower, quantity: 1 });
        }

        saveBag();

        button.textContent = "Added ✓";
        setTimeout(() => {
          button.textContent = "+";
        }, 1000);
      });

      details.append(information, button);
      card.append(imageLink, details);
      productGrid.appendChild(card);
    });

    if (flowers.length === 0) {
      productGrid.textContent = "No flowers available yet.";
    }
  } catch (error) {
    console.error("Error loading flowers:", error);
    productGrid.textContent =
      "Could not load flowers. Please check that the API server is running.";
  }
}

updateBagCount();
loadFlowers();

async function loadExternalProducts() {
  try {
    const response = await fetch(
      "https://dummyjson.com/products?limit=5"
    )

    if (!response.ok) {
      throw new Error("Could not load external products");
    }

    const data = await response.json();
    console.log("DummyJSON products:", data.products);
  } catch (error) {
    console.error("DummyJSON error:", error);
  }
}

loadExternalProducts();

