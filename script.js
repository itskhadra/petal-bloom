
const API_URL = "http://localhost:3000/flowers";
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

bagLink.addEventListener("click", (event) => {
  event.preventDefault();
  openBag();
});

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
