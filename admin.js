
const API_URL = "http://localhost:3001/flowers";

const flowerForm = document.querySelector("#flower-form");
const flowerName = document.querySelector("#flower-name");
const flowerDescription = document.querySelector("#flower-description");
const flowerPrice = document.querySelector("#flower-price");
const flowerImage = document.querySelector("#flower-image");
const flowersList = document.querySelector("#admin-products");
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

    alert(isEditing ? "Flower updated successfully!" : "Flower added successfully!");
  } catch (error) {
    console.error("Saving flower failed:", error);
    alert("Could not save the flower. Please check that JSON Server is running.");
  }
});

// Cancel editing and clear the form
cancelEditButton.addEventListener("click", resetFlowerForm);

// Load flowers when the page opens
loadFlowers();
