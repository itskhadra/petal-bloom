
const API_URL = "http://127.0.0.1:3000/flowers";

const form = document.querySelector("#flower-form");
const flowerId = document.querySelector("#flower-id");
const nameInput = document.querySelector("#flower-name");
const descriptionInput = document.querySelector("#flower-description");
const priceInput = document.querySelector("#flower-price");
const imageInput = document.querySelector("#flower-image");
const saveButton = document.querySelector("#save-flower");
const cancelButton = document.querySelector("#cancel-edit");
const message = document.querySelector("#admin-message");
const productList = document.querySelector("#admin-products");

async function loadFlowers() {
  try {
    message.textContent = "Loading flowers...";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Could not load flowers.");
    }

    const flowers = await response.json();
    productList.replaceChildren();

    if (flowers.length === 0) {
      productList.textContent = "No flowers found.";
    }

    flowers.forEach((flower) => {
      const card = document.createElement("article");
      card.className = "product-card";

      const title = document.createElement("h3");
      title.textContent = flower.name;

      const description = document.createElement("p");
      description.textContent = flower.description;

      const price = document.createElement("strong");
      price.textContent =
        `Ksh ${Number(flower.price).toLocaleString("en-KE")}`;

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editFlower(flower));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteFlower(flower));

      card.append(
        title,
        description,
        price,
        editButton,
        deleteButton
      );

      productList.appendChild(card);
    });

    message.textContent = "";
  } catch (error) {
    message.textContent =
      "Could not load flowers. Check that your API server is running.";
    console.error(error);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const flower = {
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    price: Number(priceInput.value),
    image: imageInput.value.trim()
  };

  try {
    const isEditing = flowerId.value !== "";
    const url = isEditing
      ? `${API_URL}/${encodeURIComponent(flowerId.value)}`
      : API_URL;

    const response = await fetch(url, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(flower)
    });

    if (!response.ok) {
      throw new Error("Could not save flower.");
    }

    message.textContent = isEditing
      ? "Flower updated successfully!"
      : "Flower added successfully!";

    resetForm();
    await loadFlowers();
  } catch (error) {
    message.textContent = "Could not save flower. Please try again.";
    console.error(error);
  }
});

function editFlower(flower) {
  flowerId.value = flower.id;
  nameInput.value = flower.name;
  descriptionInput.value = flower.description;
  priceInput.value = flower.price;
  imageInput.value = flower.image;

  saveButton.textContent = "Save changes";
  cancelButton.hidden = false;
  message.textContent = "Editing " + flower.name;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteFlower(flower) {
  if (!window.confirm(`Delete ${flower.name}?`)) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/${encodeURIComponent(flower.id)}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Could not delete flower.");
    }

    message.textContent = "Flower deleted successfully!";
    await loadFlowers();
  } catch (error) {
    message.textContent = "Could not delete flower. Please try again.";
    console.error(error);
  }
}

function resetForm() {
  form.reset();
  flowerId.value = "";
  saveButton.textContent = "Add flower";
  cancelButton.hidden = true;
}

cancelButton.addEventListener("click", resetForm);

loadFlowers();
