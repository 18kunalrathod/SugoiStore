/* === Hamburger sidebar toggle === */
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");

if (hamburger && sidebar && closeBtn) {
  hamburger.addEventListener("click", () => {
    sidebar.style.width = "300px";
  });

  closeBtn.addEventListener("click", () => {
    sidebar.style.width = "0";
  });
}

/* === Cart initialization === */
let cart = [];
if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
}

/* === Fetch products === */
let products = [];
fetch("product.json")
  .then((res) => res.json())
  .then((data) => {
    products = data;

    // Display first 4 products on landing page
    displayLandingProducts(products);

    // Display all products on catalog page
    displayAllProducts(products);
  })
  .catch((err) => console.error("Error fetching products:", err));

/* === Display 4 products on landing page === */
function displayLandingProducts(productList) {
  const container = document.getElementById("display-four-products");
  if (!container) return;

  const searchInput = document.getElementById("searchInput");
  const listToDisplay =
    searchInput && searchInput.value.trim() !== ""
      ? productList
      : productList.slice(0, 4);

  container.innerHTML = "";

  if (listToDisplay.length === 0) {
    container.innerHTML = "<p>No products found 😢</p>";
    return;
  }

  listToDisplay.forEach((product) => {
    const { image, title, price, category } = product;
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${image}" alt="${title}" class="fourProductList">
      <h3>${title}</h3>
      <p><strong>₹${Math.floor(price).toLocaleString("en-IN")}</strong></p>
      <p class="category">${category}</p>
    `;

    container.appendChild(card);
  });
}

/* === Display all products on catalog page === */
function displayAllProducts(productList) {
  const container = document.getElementById("display-all-products");
  if (!container) return;

  container.innerHTML = "";

  if (productList.length === 0) {
    container.innerHTML = "<p>No products found 😢</p>";
    return;
  }

  productList.forEach((product) => {
    const { id, image, title, price, category } = product;
    const card = document.createElement("div");
    card.className = "product-card-all";

    card.innerHTML = `
      <img src="${image}" alt="${title}" class="catalog-product">
      <h3>${title}</h3>
      <p><strong>₹${Math.floor(price).toLocaleString("en-IN")}</strong></p>
      <p class="category">${category}</p>
      <button class="add-to-cart" data-id="${id}">Add to Cart</button>
    `;

    container.appendChild(card);
  });
}

/* === Live search === */
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    );

    // Update both landing and catalog if present
    displayLandingProducts(filteredProducts);
    displayAllProducts(filteredProducts);
  });
}

/* === Add to Cart === */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const productId = e.target.dataset.id;
    const product = products.find((p) => p.id == productId);
    addToCart(product);
  }
});

/* === Add product to cart === */
function addToCart(product) {
  if (!product) return;

  const existing = cart.find((item) => item.id == product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.title} added to cart!`);
}

/* === Display cart items (for cart page) === */
function displayCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach(({ id, title, price, quantity, image }) => {
    total += price * quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${image}" alt="${title}" width="100">
      <h3>${title}</h3>
      <p>₹${Math.floor(price).toLocaleString("en-IN")}</p>
      <p>Quantity: ${quantity}</p>
      <button class="remove-from-cart" data-id="${id}">Remove</button>
    `;

    container.appendChild(div);

    div.querySelector(".remove-from-cart").addEventListener("click", () => {
      removeFromCart(id);
    });
  });

  totalEl.innerHTML = `<strong>Total: ₹${Math.floor(total).toLocaleString("en-IN")}</strong>`;
}

/* === Remove item from cart === */
function removeFromCart(id) {
  cart = cart.filter((item) => item.id != id);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// If on cart page, display cart immediately
if (document.getElementById("cart-items")) {
  displayCart();
}
