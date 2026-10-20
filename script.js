
 // @ts-nocheck
"use strict";

/* ==========================================
   VEXORA — PRODUITS
   ========================================== */

const products = [
  {
    id: 1,
    name: "Pantalon classique",
    category: "Homme",
    price: 12000,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700",
    description: "Pantalon élégant et confortable pour les sorties et les occasions spéciales.",
    colors: [
      { name: "Noir", hex: "#171717" },
      { name: "Beige", hex: "#c5ad88" },
      { name: "Marron", hex: "#795438" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 2,
    name: "Sac élégant",
    category: "Femme",
    price: 18000,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700",
    description: "Un sac raffiné pour compléter votre tenue.",
    colors: [
      { name: "Noir", hex: "#171717" },
      { name: "Marron", hex: "#795438" },
      { name: "Beige", hex: "#d7c3a4" }
    ],
    sizes: ["Taille unique"]
  },
  {
    id: 3,
    name: "Bijou doré",
    category: "Bijoux",
    price: 7500,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700",
    description: "Un bijou raffiné pour compléter votre style.",
    colors: [
      { name: "Or", hex: "#c5a04c" },
      { name: "Argent", hex: "#c4c7cb" }
    ],
    sizes: ["Taille unique"]
  },
  {
    id: 4,
    name: "Tissu de qualité",
    category: "Tissus",
    price: 10000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700",
    description: "Un tissu pour réaliser vos créations. Prix de démonstration.",
    colors: [
      { name: "Noir", hex: "#171717" },
      { name: "Blanc", hex: "#ffffff" },
      { name: "Marron", hex: "#795438" }
    ],
    sizes: ["2 mètres", "3 mètres", "5 mètres"]
  },
  {
    id: 5,
    name: "T-shirt essentiel",
    category: "Homme",
    price: 6500,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700",
    description: "Un t-shirt polyvalent facile à porter au quotidien.",
    colors: [
      { name: "Blanc", hex: "#ffffff" },
      { name: "Noir", hex: "#171717" },
      { name: "Marron", hex: "#795438" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 6,
    name: "Sac moderne",
    category: "Accessoires",
    price: 14000,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
    description: "Un accessoire pratique au design intemporel.",
    colors: [
      { name: "Noir", hex: "#171717" },
      { name: "Marron", hex: "#795438" }
    ],
    sizes: ["Taille unique"]
  }
];

/* ==========================================
   VARIABLES
   ========================================== */

let cart = [];
let favorites = [];
let selectedCategory = "Tout";
let favoritesOnly = false;
let activeProductId = null;
let selectedColor = "";
let selectedSize = "";

const $ = id => document.getElementById(id);

const productList = $("product-list");
const productCount = $("product-count");
const emptyMessage = $("empty-message");
const searchInput = $("search-input");
const clearSearch = $("clear-search");
const categoryList = $("category-list");
const cartCount = $("cart-count");
const productDialog = $("product-dialog");
const dialogContent = $("dialog-content");
const cartDialog = $("cart-dialog");
const cartItems = $("cart-items");
const cartTotal = $("cart-total");

/* ==========================================
   OUTILS
   ========================================== */

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

/* ==========================================
   AFFICHAGE DES PRODUITS
   ========================================== */

function displayProducts() {
  if (!productList) return;

  const query = searchInput.value.trim().toLocaleLowerCase("fr");

  const filtered = products.filter(product => {
    const categoryMatches =
      selectedCategory === "Tout" ||
      product.category === selectedCategory;

    const searchable = (
      product.name + " " +
      product.category + " " +
      product.description
    ).toLocaleLowerCase("fr");

    return categoryMatches &&
      searchable.includes(query) &&
      (!favoritesOnly || favorites.includes(product.id));
  });

  productList.innerHTML = filtered.map(product => {
    const favorite = favorites.includes(product.id);

    return `
      <article class="product-card" data-product="${product.id}">
        <div class="product-photo">
          <img
            src="${product.image}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
            data-open-product="${product.id}"
            style="cursor:pointer"
          >

          <button type="button"
            class="favorite-btn ${favorite ? "active" : ""}"
            data-favorite="${product.id}"
            aria-label="Ajouter ou retirer des favoris"
            aria-pressed="${favorite}">
            ${favorite ? "♥" : "♡"}
          </button>
        </div>

        <div class="product-info">
          <p class="product-category">${escapeHTML(product.category)}</p>
          <h3>${escapeHTML(product.name)}</h3>
          <p class="product-description">${escapeHTML(product.description)}</p>
          <p class="product-price">${formatPrice(product.price)}</p>

          <div class="product-actions">
            <button type="button" class="details-btn"
              data-details="${product.id}">Détails</button>
            <button type="button" class="add-cart"
              data-add="${product.id}">+ Panier</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  productCount.textContent =
    filtered.length + (filtered.length > 1 ? " articles" : " article");

  emptyMessage.hidden = filtered.length > 0;
}

/* ==========================================
   CLICS PRODUITS ET PHOTOS
   ========================================== */

productList.addEventListener("click", function(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const favoriteButton = target.closest("[data-favorite]");
  if (favoriteButton) {
    toggleFavorite(Number(favoriteButton.dataset.favorite));
    return;
  }

  const detailsButton = target.closest("[data-details]");
  if (detailsButton) {
    openProductDetails(Number(detailsButton.dataset.details));
    return;
  }

  const addButton = target.closest("[data-add]");
  if (addButton) {
    addToCart(Number(addButton.dataset.add));
    return;
  }

  const image = target.closest("[data-open-product]");
  if (image) {
    openProductDetails(Number(image.dataset.openProduct));
    return;
  }

  const card = target.closest(".product-card");
  if (card) {
    openProductDetails(Number(card.dataset.product));
  }
});

/* ==========================================
   CATÉGORIES
   ========================================== */

categoryList.addEventListener("click", function(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;
  favoritesOnly = false;

  categoryList.querySelectorAll(".category-chip").forEach(chip => {
    chip.classList.toggle("active", chip === button);
  });

  $("favorites-nav").classList.remove("selected");
  displayProducts();
});

/* ==========================================
   RECHERCHE
   ========================================== */

searchInput.addEventListener("input", function() {
  clearSearch.hidden = searchInput.value.length === 0;
  displayProducts();
});

$("search-form").addEventListener("submit", function(event) {
  event.preventDefault();
  displayProducts();
});

clearSearch.addEventListener("click", function() {
  searchInput.value = "";
  clearSearch.hidden = true;
  displayProducts();
});

/* ==========================================
   FAVORIS
   ========================================== */

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(favoriteId => favoriteId !== id);
  } else {
    favorites.push(id);
  }

  displayProducts();

  if (activeProductId === id && productDialog.open) {
    renderProductDetails(id);
  }
}

/* ==========================================
   FICHE DÉTAILLÉE
   ========================================== */

function openProductDetails(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  activeProductId = id;
  selectedColor = product.colors[0].name;
  selectedSize = product.sizes[0];

  renderProductDetails(id);

  if (!productDialog.open) {
    productDialog.showModal();
  }
}

function renderProductDetails(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const favorite = favorites.includes(id);

  const colorsHTML = product.colors.map(color => {
    const selected = color.name === selectedColor;

    return `
      <button type="button"
        class="variant-color ${selected ? "chosen" : ""}"
        data-color="${escapeHTML(color.name)}"
        aria-label="${escapeHTML(color.name)}"
        aria-pressed="${selected}"
        title="${escapeHTML(color.name)}">
        <span style="background-color:${color.hex}"></span>
      </button>
    `;
  }).join("");

  const sizesHTML = product.sizes.map(size => {
    const selected = size === selectedSize;

    return `
      <button type="button"
        class="variant-size ${selected ? "chosen" : ""}"
        data-size="${escapeHTML(size)}"
        aria-pressed="${selected}">
        ${escapeHTML(size)}
      </button>
    `;
  }).join("");

  dialogContent.innerHTML = `
    <img class="dialog-image"
      src="${product.image}"
      alt="${escapeHTML(product.name)}">

    <div class="detail-title-row">
      <div>
        <p class="product-category">${escapeHTML(product.category)}</p>
        <h2 class="dialog-title">${escapeHTML(product.name)}</h2>
      </div>

      <button type="button"
        id="detail-favorite"
        class="detail-favorite ${favorite ? "active" : ""}"
        aria-label="Ajouter aux favoris"
        aria-pressed="${favorite}">
        ${favorite ? "♥" : "♡"}
      </button>
    </div>

    <p class="detail-price">${formatPrice(product.price)}</p>

    <section class="variant-section">
      <h3>Couleurs disponibles</h3>
      <div class="variant-colors">${colorsHTML}</div>
      <p class="selected-variant">
        Couleur : <strong>${escapeHTML(selectedColor)}</strong>
      </p>
    </section>

    <section class="variant-section">
      <h3>Tailles disponibles</h3>
      <div class="variant-sizes">${sizesHTML}</div>
      <p class="selected-variant">
        Taille : <strong>${escapeHTML(selectedSize)}</strong>
      </p>
    </section>

    <section class="detail-description">
      <h3>Description</h3>
      <p>${escapeHTML(product.description)}</p>
    </section>

    <button type="button" id="detail-add-cart" class="gold-button">
      Ajouter au panier
    </button>
  `;
}

dialogContent.addEventListener("click", function(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const colorButton = target.closest("[data-color]");
  if (colorButton) {
    selectedColor = colorButton.dataset.color;
    renderProductDetails(activeProductId);
    return;
  }

  const sizeButton = target.closest("[data-size]");
  if (sizeButton) {
    selectedSize = sizeButton.dataset.size;
    renderProductDetails(activeProductId);
    return;
  }

  if (target.closest("#detail-favorite")) {
    toggleFavorite(activeProductId);
    return;
  }

  if (target.closest("#detail-add-cart")) {
    addToCart(activeProductId, selectedColor, selectedSize);
    productDialog.close();
  }
});

$("dialog-close").addEventListener("click", function() {
  productDialog.close();
});

/* ==========================================
   PANIER
   ========================================== */

function addToCart(id, color, size) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const chosenColor = color || product.colors[0].name;
  const chosenSize = size || product.sizes[0];

  const existing = cart.find(item =>
    item.id === id &&
    item.color === chosenColor &&
    item.size === chosenSize
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      color: chosenColor,
      size: chosenSize,
      quantity: 1
    });
  }

  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Votre panier est vide.</p>";
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-line">
        <div>
          <strong>${escapeHTML(item.name)}</strong>
          <p>Couleur : ${escapeHTML(item.color)}</p>
          <p>Taille : ${escapeHTML(item.size)}</p>
          <p>${formatPrice(item.price)} × ${item.quantity}</p>
        </div>
        <div>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
          <div>
            <button type="button" data-decrease="${index}">−</button>
            <button type="button" data-increase="${index}">+</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  cartCount.textContent = String(
    cart.reduce((sum, item) => sum + item.quantity, 0)
  );

  cartTotal.textContent = formatPrice(
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
}

cartItems.addEventListener("click", function(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const decrease = target.closest("[data-decrease]");
  const increase = target.closest("[data-increase]");

  if (!decrease && !increase) return;

  const index = Number(
    decrease ? decrease.dataset.decrease : increase.dataset.increase
  );

  const item = cart[index];
  if (!item) return;

  if (decrease) {
    item.quantity--;

    if (item.quantity <= 0) {
      cart.splice(index, 1);
    }
  } else {
    item.quantity++;
  }

  renderCart();
});

$("cart-nav").addEventListener("click", function() {
  renderCart();
  if (!cartDialog.open) cartDialog.showModal();
});

$("cart-close").addEventListener("click", function() {
  cartDialog.close();
});

/* ==========================================
   AFFICHER LES FAVORIS
   ========================================== */

$("favorites-nav").addEventListener("click", function() {
  favoritesOnly = !favoritesOnly;

  $("favorites-nav").classList.toggle("selected", favoritesOnly);

  if (favoritesOnly) {
    selectedCategory = "Tout";

    categoryList.querySelectorAll(".category-chip").forEach(chip => {
      chip.classList.toggle("active", chip.dataset.category === "Tout");
    });
  }

  displayProducts();
  $("produits").scrollIntoView({ behavior: "smooth" });
});

/* ==========================================
   AUTRES BOUTONS ET COMMANDES WHATSAPP
   ========================================== */

const orderForm = document.getElementById("order-form");

// Numéro WhatsApp du vendeur : indicatif du pays + numéro
const WHATSAPP_NUMBER = "221788325185";

orderForm.addEventListener("submit", function(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Votre panier est vide. Ajoutez d'abord un produit.");
    return;
  }

  const name = $("customer-name").value.trim();
  const phone = $("customer-phone").value.trim();
  const address = $("customer-address").value.trim();
  const notes = $("order-notes").value.trim();

  if (!name || !phone || !address) {
    alert("Veuillez remplir votre nom, téléphone et adresse.");
    return;
  }

  const items = cart.map(function(item) {
    return "- " + item.name +
      " | Couleur : " + item.color +
      " | Taille : " + item.size +
      " | Quantité : " + item.quantity +
      " | Sous-total : " + formatPrice(item.price * item.quantity);
  }).join("\n");

  const total = cart.reduce(function(sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  const message =
    "Bonjour VEXORA ! Je souhaite passer une commande.\n\n" +
    "CLIENT\n" +
    "Nom : " + name + "\n" +
    "Téléphone : " + phone + "\n" +
    "Adresse de livraison : " + address + "\n\n" +
    "ARTICLES\n" + items + "\n\n" +
    "TOTAL : " + formatPrice(total) + "\n" +
    (notes ? "\nPrécisions : " + notes + "\n" : "") +
    "\nMerci de confirmer ma commande et les modalités de livraison.";

  const whatsappURL =
    "https://wa.me/" + WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(message);

  // Ouvre WhatsApp dans une nouvelle fenêtre ou un nouvel onglet.
  const whatsappWindow = window.open(whatsappURL, "_blank");

  if (!whatsappWindow) {
    alert(
      "L'ouverture automatique a été bloquée. " +
      "Essayez d'ouvrir VEXORA dans Chrome pour continuer."
    );
  }
});

$("notification-btn").addEventListener("click", function() {
  alert("Bienvenue chez VEXORA !");
});

document.querySelectorAll(".nav-item[href]").forEach(function(link) {
  link.addEventListener("click", function() {
    document.querySelectorAll(".nav-item").forEach(function(item) {
      item.classList.remove("selected");
    });

    link.classList.add("selected");
  });
});

/* ==========================================
   DÉMARRAGE
   ========================================== */

displayProducts();
renderCart();
  
