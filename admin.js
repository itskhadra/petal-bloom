
const API_URL = "http://localhost:3001/flowers";
const ORDERS_URL = "http://localhost:3001/orders";

const flowerForm = document.querySelector("#flower-form");
const flowerName = document.querySelector("#flower-name");
const flowerDescription = document.querySelector("#flower-description");
const flowerPrice = document.querySelector("#flower-price");
const flowerImage = document.querySelector("#flower-image");
const flowersList = document.querySelector("#admin-products");
const ordersList = document.querySelector("#admin-orders");
const cancelEditButton = document.querySelector("#cancel-edit");
const submitButton = document.querySelector("#save-flower");

let editingFlowerId = null;

// Reset the form and return to adding a new flower
function resetFlowerForm() {
  flowerForm.reset();
  editingFlowerId = null;
  submitButton.textContent = "Add flower";
  cancelEditButton.hidden = true;
}

// Load and display flowers
async function loadFlowers() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Could not load flowers");
    }

    const flowers = await response.json();
    flowersList.innerHTML = "";

    if (flowers.length === 0) {
      flowersList.textContent = "No flowers added yet.";
      return;
    }

    flowers.forEach((flower) => {
      const card = document.createElement("div");
      card.className = "admin-flower-card";

      const image = document.createElement("img");
      image.src = flower.image;
      image.alt = flower.name;
      image.style.width = "100px";
      image.onerror = () => {
        image.style.display = "none";
      };

      const name = document.createElement("h3");
      name.textContent = flower.name;

      const description = document.createElement("p");
      description.textContent = flower.description;

      const price = document.createElement("p");
      price.textContent = `Ksh ${flower.price}`;

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = "Edit";

      editButton.addEventListener("click", () => {
        flowerName.value = flower.name;
        flowerDescription.value = flower.description;
        flowerPrice.value = flower.price;
        flowerImage.value = flower.image;

        editingFlowerId = flower.id;
        submitButton.textContent = "Update flower";
        cancelEditButton.hidden = false;

        flowerForm.scrollIntoView({ behavior: "smooth" });
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", async () => {
        if (!confirm(`Delete ${flower.name}?`)) {
          return;
        }

        try {
          const deleteResponse = await fetch(
            `${API_URL}/${flower.id}`,
            { method: "DELETE" }
          );

          if (!deleteResponse.ok) {
            throw new Error("Could not delete flower");
          }

          if (editingFlowerId === flower.id) {
            resetFlowerForm();
          }

          await loadFlowers();
        } catch (error) {
          console.error(error);
          alert("Could not delete the flower. Please check the API server.");
        }
      });

      card.append(
        image,
        name,
        description,
        price,
        editButton,
        deleteButton
      );

      flowersList.appendChild(card);
    });
  } catch (error) {
    console.error("Loading flowers failed:", error);
    flowersList.textContent =
      "Could not load flowers. Check that JSON Server is running on port 3001.";
  }
}

// Load and display customer orders
async function loadOrders() {
  try {
    const response = await fetch(ORDERS_URL);

    if (!response.ok) {
      throw new Error("Could not load customer orders");
    }

    const orders = await response.json();
    ordersList.innerHTML = "";

    if (!Array.isArray(orders) || orders.length === 0) {
      ordersList.textContent = "No customer orders yet.";
      return;
    }

    orders.forEach((order) => {
      const card = document.createElement("article");
      card.className = "admin-order-card";

      const heading = document.createElement("h3");
      heading.textContent = `Order #${order.id}`;

      const customer = document.createElement("p");
      customer.textContent = `Customer: ${order.customerName || "Not provided"}`;

      const phone = document.createElement("p");
      phone.textContent = `Phone: ${order.phone || "Not provided"}`;

      const address = document.createElement("p");
      address.textContent =
        `Delivery address: ${order.deliveryAddress || "Not provided"}`;

      const itemsHeading = document.createElement("h4");
      itemsHeading.textContent = "Flowers ordered";

      const itemsList = document.createElement("ul");

      (Array.isArray(order.items) ? order.items : []).forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent =
          `${item.name} × ${item.quantity} — Ksh ${
            Number(item.price) * Number(item.quantity)
          }`;
        itemsList.appendChild(listItem);
      });

      const total = document.createElement("p");
      total.textContent = `Total: Ksh ${Number(order.total || 0).toLocaleString()}`;

      const status = document.createElement("p");
      status.textContent = `Status: ${order.status || "Pending"}`;
      const updateStatusButton = document.createElement("button");
updateStatusButton.type = "button";
updateStatusButton.textContent = "Mark as Completed";

updateStatusButton.addEventListener("click", async () => {
  try {
    const response = await fetch(`${ORDERS_URL}/${order.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "Completed" })
    });

    if (!response.ok) {
      throw new Error("Could not update order status");
    }

    alert("Order marked as completed!");
    await loadOrders();
  } catch (error) {
    console.error(error);
    alert("Could not update order status. Please try again.");
  }
});

      const date = document.createElement("p");
      const parsedDate = new Date(order.createdAt);

      date.textContent = Number.isNaN(parsedDate.getTime())
        ? "Date: Not available"
        : `Date: ${parsedDate.toLocaleString()}`;

      card.append(
        heading,
        customer,
        phone,
        address,
        itemsHeading,
        itemsList,
        total,
        status,
        updateStatusButton,
        date
      );

      ordersList.appendChild(card);
    });
  } catch (error) {
    console.error("Loading customer orders failed:", error);
    ordersList.textContent =
      "Could not load customer orders. Check that JSON Server is running on port 3001.";
  }
}

// Add a new flower or update an existing one
flowerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const flower = {
    name: flowerName.value.trim(),
    description: flowerDescription.value.trim(),
    price: Number(flowerPrice.value),
    image: flowerImage.value.trim(),
    category: "Flowers"
  };

  if (
    !flower.name ||
    !flower.description ||
    !flower.image ||
    !Number.isFinite(flower.price) ||
    flower.price <= 0
  ) {
    alert("Please complete every field and enter a price greater than zero.");
    return;
  }

  const isEditing = editingFlowerId !== null;
  const url = isEditing
    ? `${API_URL}/${editingFlowerId}`
    : API_URL;

  try {
    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(flower)
    });

    if (!response.ok) {
      throw new Error("Could not save flower");
    }

    resetFlowerForm();
    await loadFlowers();

    alert(
      isEditing
        ? "Flower updated successfully!"
        : "Flower added successfully!"
    );
  } catch (error) {
    console.error("Saving flower failed:", error);
    alert("Could not save the flower. Please check that JSON Server is running.");
  }
});

// Cancel editing and clear the form
cancelEditButton.addEventListener("click", resetFlowerForm);

// Load flowers and orders when the page opens
loadFlowers();
loadOrders();
