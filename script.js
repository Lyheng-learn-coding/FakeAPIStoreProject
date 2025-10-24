function getCartFromLocalStorage() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCartToLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getFavPro() {
  const favCart = localStorage.getItem("favCart");
  return favCart ? JSON.parse(favCart) : [];
}

function saveFavCartToLocalStorage(favCart) {
  localStorage.setItem("favCart", JSON.stringify(favCart));
}

function addToCart(product, quantityToAdd) {
  // console.log(`Adding ${quantityToAdd} of:`, product);
  let cart = getCartFromLocalStorage();
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += quantityToAdd;
  } else {
    product.quantity = quantityToAdd;
    cart.push(product);
  }

  saveCartToLocalStorage(cart);
  console.log("Cart after adding:", getCartFromLocalStorage());
  updateCartCount();
  Swal.fire({
    title: "Success!",
    text: `Quantity of ${product.title} : ${quantityToAdd} added to cart.`,
    icon: "success",
    timer: 3000,
    showConfirmButton: false,
  });
}

function addToFav(product) {
  let favCart = getFavPro();
  const existingProductIndex = favCart.findIndex(
    (item) => item.id === product.id
  );

  let added = false;
  if (existingProductIndex > -1) {
    favCart.splice(existingProductIndex, 1);
  } else {
    const favProduct = { ...product };
    delete favProduct.quantity;
    favCart.push(favProduct);
    added = true;
  }
  saveFavCartToLocalStorage(favCart);
  updateFavCount();
  return added;
}

function updateCartCount() {
  const proCountElements = document.querySelectorAll(".proCount");
  const cart = getCartFromLocalStorage();
  const totalCount = cart.length;

  proCountElements.forEach((el) => {
    if (totalCount > 0) {
      el.textContent = totalCount;
      el.classList.remove("invisible");
    } else {
      el.classList.add("invisible");
    }
  });
}

function updateFavCount() {
  const favCountElements = document.querySelectorAll(".proFavCount");
  const favCart = getFavPro();
  const totalCount = favCart.length;

  favCountElements.forEach((el) => {
    if (totalCount > 0) {
      el.textContent = totalCount;
      el.classList.remove("invisible");
    } else {
      el.classList.add("invisible");
    }
  });
}

function displayFavPro(favProduct) {
  const proContainer = document.getElementById("productContainer");
  const favContainer = document.querySelector("#favoriteContainer");
  const asideNav = document.getElementById("asideNav");
  const navbarMobile = document.getElementById("navbarMobile");
  const h2Title = document.querySelector("#h2-title");
  const swiper = document.querySelector(".swiper");
  const btnOpenNav = document.querySelector("#btnOpenNav");
  const btnBackForFav = document.getElementById("btnBackForFav");
  const btnBackgoHome = document.querySelector("#btnBack");

  if (proContainer) proContainer.classList.add("hidden");
  if (asideNav) asideNav.classList.remove("md:flex");
  if (h2Title) h2Title.classList.remove("hidden");
  if (swiper) swiper.style.display = "none";
  if (btnOpenNav) btnOpenNav.classList.add("hidden");
  if (btnBackForFav) btnBackForFav.classList.remove("hidden");
  if (favContainer) favContainer.classList.add("grid");

  if (!favContainer) return;

  if (!favProduct || favProduct.length === 0) {
    favContainer.innerHTML = `<p class="text-center text-2xl text-[red] col-span-full">No Favorite Products</p>`;
    return;
  }

  favContainer.innerHTML = favProduct
    .map(
      (p) => `
   <div
          class="rounded-[10px] p-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] overflow-x-hidden relative"
        >
        <button class="absolute right-[10px]  flex justify-center items-center backdrop-blur-[20px] bg-[#e0e0e0]  rounded-[50%] p-[5px] w-[30px] h-[30px] btnRemoveFav" data-fav-proid="${p.id}">
              <i class="fa-solid fa-xmark"></i>
        </button>

          <img
                        src="${p.image}"
                        alt="${p.title}"
                        class="w-[100%] h-[200px] object-contain hover:scale-[1.1] transition-all duration-[0.3s] imgClick"
                        data-proid = "${p.id}" />
          <div class="mt-[20px] flex flex-col gap-2.5">
            <p class="text-[1rem] font-bold">${p.title}</p>
            <p class="text-[1rem] font-[300]">${p.category}</p>
            <p class="text-[1rem]">$${p.price}</p>
          </div>
        </div>
 `
    )
    .join("");
}

function displayAllPro(products, proContainer) {
  if (!proContainer) return;
  const favCart = getFavPro();

  proContainer.innerHTML = products
    .map((p) => {
      const isFavorite = favCart.some((favItem) => favItem.id === p.id);
      const heartClass = isFavorite ? "fa-solid" : "fa-regular";
      const colorClass = isFavorite ? "text-[red]" : "";

      return `
           <div
          class="rounded-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] overflow-x-hidden p-[20px] mt-[20px] relative"
        >
        <button class="favButton ${colorClass} absolute right-[10px] top-[10px] cursor-pointer backdrop-blur-[20px] bg-[#e0e0e0] rounded-[50%] p-[5px] w-[30px] h-[30px]" data-favproid="${p.id}">
            <i class="fa-heart ${heartClass}"></i>
        </button>
            <img
            src="${p.image}"
            alt="${p.title}"
            class="imgClick w-[100%] h-[240px] object-contain transform hover:scale-[1.1] transition-all duration-[0.3s] py-[20px] px-[10px]"
            data-proid = "${p.id}"/>
          <div class="mt-[20px] flex flex-col gap-2.5">
            <p class="text-[1rem] font-bold">${p.title}</p>
            <p class="text-[1rem] font-[300]">${p.category}</p>
            <p class="text-[1rem]">$${p.price}</p>
          </div>
        </div>
   `;
    })
    .join("");
}

function displayDetail(product, detailContainer) {
  if (!detailContainer) return;
  detailContainer.innerHTML = `
     <div
        class="flex justify-center items-center flex-col md:flex-row gap-[60px] bg-[#ffffff] rounded-[20px] py-[20px] px-[20px] md:mt-[200px] mt-[100px]"
      >
        <div class="md:size-80 size-50">
          <img
            src="${product.image}"
            alt="${product.title}"
            class="size-[100%] transform hover:scale-[1.1] transition-all duration-[0.3s]"
          />
        </div>

        <div class="flex flex-col gap-[10px] max p-[10px]">
          <h2 class="font-bold text-2xl max-w-prose text-[#84a98c]">${product.title}</h2>
          <h2 class="font-bold text-2xl text-[#84a98c]">$${product.price}</h2>
          <h2 class="text-[1.3rem] font-bold text-[#84a98c]">Description</h2>
          <p class="text-[1rem] max-w-prose text-justify">
              ${product.description}
          </p>
          <div>
            <div class="flex items-center">
              <button
                class="btnAddCart py-[10px] px-[20px] bg-[#52796f] text-white transform hover:scale-[1.1] transition-all duration-[0.3s]"
                data-proid="${product.id}">
                Add to cart
              </button>
              <div class="flex items-center ml-[20px]">
                <button
                  id="btnDecre"
                  class="py-[10px] px-[15px] text-[1rem] bg-[#52796f] rounded-[5px] text-white"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span id="quantityItem" class="text-[1.2rem] mx-[15px]">1</span>
                <button
                  id="btnIncre"
                  class="py-[10px] px-[15px] text-[1rem] bg-[#52796f] rounded-[5px] text-white"
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  `;
}

function displayCart(cartTable) {
  if (!cartTable) {
    console.error("Cart table element not found!");
    return;
  }

  const cart = getCartFromLocalStorage();
  console.log("Cart contents on page load:", cart);
  const cartSummary = document.getElementById("cart-summary");

  let tableBody = cartTable.querySelector("tbody");
  if (!tableBody) {
    tableBody = document.createElement("tbody");
    cartTable.appendChild(tableBody);
  }

  tableBody.innerHTML = "";

  if (cart.length === 0) {
    console.log("Cart is empty.");
    const row = tableBody.insertRow();
    row.innerHTML = `<td colspan="5" class="text-center text-2xl py-4 text-[red] font-bold">Your cart is empty.</td>`;
    if (cartSummary) cartSummary.style.display = "none";
    return;
  }

  console.log("Cart has items, preparing to display.");
  if (cartSummary) cartSummary.style.display = "flex";

  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * (item.quantity || 1);
    total += itemTotal;
    const row = tableBody.insertRow();
    row.className =
      "tblRow border border-solid border-[#ccc] border-r-0 border-l-0 py-[20px]";
    row.innerHTML = `
            <td class="flex justify-center">
                <img src="${item.image}" alt="${
      item.title
    }" class="w-[100px] h-[100px]" />
            </td>
            <td class="font-bold p-[10px] text-[0.7rem] md:text-[1rem]">${
              item.title
            }</td>
            <td class="font-bold text-center">$${item.price.toFixed(2)}</td>
            <td class="font-bold text-center">${item.quantity || 1}</td>
            <td class="font-bold text-center">
                <button class="btnRemoveFromCart" data-proid="${item.id}">
                    <img src="../img/trash-bin.gif" alt="Remove" class="size-9" />

                </button>
            </td>
        `;
  });

  console.log("Finished displaying cart items.");
  const totalSpan = document.querySelector("#cart-summary p span");
  if (totalSpan) {
    totalSpan.textContent = `$${total.toFixed(2)}`;
  } else {
    console.error("Total span not found to update price.");
  }
}

function removeFromCart(productId) {
  let cart = getCartFromLocalStorage();
  cart = cart.filter((item) => item.id !== productId);
  saveCartToLocalStorage(cart);
  updateCartCount();
  displayCart(document.getElementById("cart-table"));
}

const favContainer = document.querySelector("#favoriteContainer");
function removeFromFavCart(productId) {
  let cart = getFavPro();
  cart = cart.filter((item) => item.id !== productId);
  saveFavCartToLocalStorage(cart);
  updateFavCount();
  displayFavPro(getFavPro());
}

document.addEventListener("DOMContentLoaded", () => {
  const openNav = document.querySelector("#btnOpenNav");
  const removeNav = document.querySelector("#btnRemoveNav");
  const navBarMobile = document.getElementById("navbarMobile");
  const proContainer = document.getElementById("productContainer");
  const detailContainer = document.getElementById("detailContainer");
  const btnBack = document.getElementById("btnBack");
  const cartTable = document.getElementById("cart-table");
  const cartButtons = document.querySelectorAll(".btnCart");
  const favContainer = document.querySelector("#favoriteContainer");
  const btnCartFavorite = document.querySelector(".btnCartFavorite");
  const btnBackForFav = document.getElementById("btnBackForFav");

  updateCartCount();
  updateFavCount();

  // btn back for for fav
  if (btnBackForFav) {
    const proContainer = document.getElementById("productContainer");
    const favContainer = document.querySelector("#favoriteContainer");
    const asideNav = document.getElementById("asideNav");
    const h2Title = document.querySelector("#h2-title");
    const swiper = document.querySelector(".swiper");

    btnBackForFav.addEventListener("click", (e) => {
      e.preventDefault();
      if (proContainer) proContainer.classList.remove("hidden");
      if (asideNav) asideNav.classList.add("md:flex");
      if (h2Title) h2Title.classList.add("hidden");
      if (swiper) swiper.style.display = "block";
      if (favContainer) favContainer.classList.remove("grid");
    });
  }

  if (btnCartFavorite) {
    btnCartFavorite.addEventListener("click", (e) => {
      e.preventDefault();
      let showFavProduct = getFavPro();
      displayFavPro(showFavProduct);
    });
  }

  if (favContainer) {
    favContainer.addEventListener("click", (e) => {
      const btnRemoveFav = e.target.closest(".btnRemoveFav");
      if (btnRemoveFav) {
        const favCartId = parseInt(btnRemoveFav.dataset.favProid);
        removeFromFavCart(favCartId);
        return;
      }

      const clickedImage = e.target.closest(".imgClick");
      if (clickedImage) {
        const proID = clickedImage.dataset.proid;
        window.location.href = `../html/detail.html?id=${proID}`;
        return;
      }
    });
  }

  cartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../html/Cart.html";
    });
  });

  if (proContainer) {
    if (openNav && navBarMobile) {
      openNav.addEventListener("click", (e) => {
        e.preventDefault();
        if (navBarMobile.classList.contains("left-[-100%]")) {
          navBarMobile.classList.remove("left-[-100%]");
          navBarMobile.classList.add("left-[0]");
        }
      });
    }
    if (removeNav && navBarMobile) {
      removeNav.addEventListener("click", (e) => {
        e.preventDefault();
        if (navBarMobile.classList.contains("left-[0]")) {
          navBarMobile.classList.remove("left-[0]");
          navBarMobile.classList.add("left-[-100%]");
        }
      });
    }

    const categoryButtons = [
      { selector: ".btnAll", url: "https://fakestoreapi.com/products" },
      {
        selector: ".btnMen",
        url: "https://fakestoreapi.com/products/category/men%27s%20clothing",
      },
      {
        selector: ".btnWomen",
        url: "https://fakestoreapi.com/products/category/women%27s%20clothing",
      },
      {
        selector: ".btnJew",
        url: "https://fakestoreapi.com/products/category/jewelery",
      },
      {
        selector: ".btnElec",
        url: "https://fakestoreapi.com/products/category/electronics",
      },
    ];

    categoryButtons.forEach(({ selector, url }) => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              if (!data || data.length === 0) {
                proContainer.innerHTML = `<p class ="text-center text-2xl text-[red]">No Product Found</p>`;
              } else {
                displayAllPro(data, proContainer);
              }
            });
        });
      });
    });

    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => displayAllPro(data, proContainer));

    proContainer.addEventListener("click", (e) => {
      const clickedImage = e.target.closest(".imgClick");
      if (clickedImage) {
        const proID = clickedImage.dataset.proid;
        window.location.href = `../html/detail.html?id=${proID}`;
        return;
      }

      const favButton = e.target.closest(".favButton");
      if (favButton) {
        const proID = favButton.dataset.favproid;
        fetch(`https://fakestoreapi.com/products/${proID}`)
          .then((res) => res.json())
          .then((product) => {
            const added = addToFav(product);
            const icon = favButton.querySelector("i");
            if (added) {
              icon.classList.remove("fa-regular");
              icon.classList.add("fa-solid");
              favButton.classList.add("text-[red]");
            } else {
              icon.classList.remove("fa-solid");
              icon.classList.add("fa-regular");
              favButton.classList.remove("text-[red]");
            }
          });
      }
    });

    const btnRandom = document.querySelector(".btnRandom");
    if (btnRandom) {
      btnRandom.addEventListener("click", (e) => {
        e.preventDefault();
        const randomId = Math.floor(Math.random() * 20) + 1;

        fetch(`https://fakestoreapi.com/products/${randomId}`)
          .then((res) => res.json())
          .then((product) => {
            console.log(product);
            displayAllPro([product], proContainer);
          });
      });
    }
  }

  if (detailContainer) {
    let quantity = 1;

    if (btnBack) {
      btnBack.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "./index.html";
      });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
      fetch(`https://fakestoreapi.com/products/${productId}`)
        .then((res) => res.json())
        .then((product) => {
          displayDetail(product, detailContainer);
        });
    }

    detailContainer.addEventListener("click", (e) => {
      if (e.target.closest("#btnIncre")) {
        quantity++;
        document.getElementById("quantityItem").textContent = quantity;
      }

      if (e.target.closest("#btnDecre")) {
        if (quantity > 1) {
          quantity--;
          document.getElementById("quantityItem").textContent = quantity;
        }
      }

      const btn = e.target.closest(".btnAddCart");
      if (btn) {
        const proID = btn.dataset.proid;
        fetch(`https://fakestoreapi.com/products/${proID}`)
          .then((res) => res.json())
          .then((product) => {
            addToCart(product, quantity);
          });
      }
    });
  }

  if (cartTable) {
    displayCart(cartTable);

    cartTable.addEventListener("click", (e) => {
      const removeButton = e.target.closest(".btnRemoveFromCart");
      if (removeButton) {
        const productId = parseInt(removeButton.dataset.proid);
        removeFromCart(productId);
      }
    });
  }
});

const btnCheckout = document.getElementById("btnCheckout");
const cartTable = document.getElementById("cart-table");
if (btnCheckout) {
  btnCheckout.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("cart");
    updateCartCount();
    displayCart(cartTable);

    Swal.fire({
      title: "Your order has been placed",
      text: "Check your order in the order confirmation. Thank you for shopping with Lyheng Store!",
      icon: "success",
      confirmButtonColor: "#52796f",
      confirmButtonText: "Return to home page!",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = ".index.html";
      }
    });
  });
}
