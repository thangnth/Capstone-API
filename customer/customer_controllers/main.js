//ultils DOM
function getElement(selector) {
  return document.querySelector(selector);
}

//Display products in storre
getProduct();
function getProduct() {
  apiGetproducts()
    .then((response) => {
      //Call display function
      display(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
// Display products on Store
function display(products) {
  let html = products.reduce((result, value) => {
    let product = new Product(
      value.id,
      value.name,
      value.display,
      value.os,
      value.price,
      value.camera,
      value.ram,
      value.rom,
      value.img
    );
    return (
      result +
      `
      <div class="banner_item">
      <div class="item_header mb-10">
          <i></i>
          <em>In Stock</em>
      </div>
      <div class="item_body d-flex justify-content-center">
          <img class="product-img" src="${product.img}" alt="${product.name}" width="100px" height="140px">
      </div>
      <div class="item_bottom">
        <h5 class="product-name">${product.name}</h5>
        <div class="product-details">
              <p>Display : ${product.display}</p>
              <p>Operation System : ${product.os}</p>
              <p>Camera : ${product.camera}</p>
              <p>RAM : ${product.ram}</p>
              <p>ROM : ${product.rom}</p>
        </div>
        <div class="purchase">
          <div>Price ($) :  <span class="product-price">${product.price}</span></div>

            <button class="btn-add btn-pink" onclick="addToCart(${product.id})">Add to cart<i class="fas fa-chevron-right"></i></button>

        </div>
      </div>
    </div>
      `
    );
  }, []);
  getElement(".banner_content").innerHTML = html;
}

// Shopping Carts
// Open & close modal close
//Hidden Cart modal as default
getElement("#cart-modal").style.display = "none";
//Open Cart Modal
getElement("#shopping-cart").onclick = () => {
  getElement("#cart-modal").style.display = "block";
};
//Close cart modal
getElement(".modal-close").onclick = () => {
  getElement(".modal").style.display = "none";
};

// Add new product into carts
let carts = [];
let item = { id: "", name: "", img: "", price: "" };
function addToCart(productId) {
  apiGetProductsById(productId)
    .then((response) => {
      let product = response.data;
      // Đưa sản phẩm vào giỏ hàng
      let found = carts.find((item) => {
        return product.id === item.id;
      });

      if (!found) {
        // Add new item into carts
        let newItem = {
          id: product.id,
          name: product.name,
          img: product.img,
          price: product.price,
        };
        carts = [...carts, { ...newItem, quantity: 1 }];
        //built the HTML Structure for cart when add new product
        let htmlCart = carts.reduce((result, item, index) => {
          return (
            result +
            `
            <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>
              <img
                src="${item.img}"
                alt="${item.name}"
                width="70px"
                height="70px"
              />
            </td>
            <td>${item.price}</td>
            <td>
               <button id="qty-down" class="btn-qty mr-10" onclick="quantityDown(${
                 item.id
               })">
                    <i class="fas fa-chevron-left"></i>
                </button>
                 ${item.quantity}
                <button id="qty-up" class="btn-qty ml-10" onclick="quantityUp(${
                  item.id
                })">
                     <i class="fas fa-chevron-right"></i>
                </button>
            </td>
            <td>
            ${item.quantity * item.price}
            </td>
            <td><button class="btn-pink" onclick="clearItem(${
              item.id
            })">Clear</button></td>
          </tr>
          `
          );
        }, []);

        getElement("#cart-PDList").innerHTML = htmlCart;
      } else {
        // HTML Update quantity for existing item in carts
        let newCarts = carts.map((item) => {
          if (product.id === item.id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        carts = newCarts;
        let htmlCart = carts.map((item, index) => {
          return `
          <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>
            <img
              src="${item.img}"
              alt="${item.name}"
              width="70px"
              height="70px"
            />
          </td>
          <td>${item.price}</td>
          <td>
             <button id="qty-down" class="btn-qty mr-10" onclick="quantityDown(${
               item.id
             })">
                  <i class="fas fa-chevron-left"></i>
              </button>
               ${item.quantity}
              <button id="qty-up" class="btn-qty ml-10" onclick="quantityUp(${
                item.id
              })">
                   <i class="fas fa-chevron-right"></i>
              </button>
          </td>
          <td>
          ${item.quantity * item.price}
          </td>
          <td>
          <button class="btn-pink" onclick="clearItem(${
            item.id
          })">Clear</button>
          </td>
        </tr>
          `;
        });
        getElement("#cart-PDList").innerHTML = htmlCart;
      }
      let amount = carts.reduce((result, item, index) => {
        return result + item.quantity * item.price;
      }, 0);

      getElement("#amount").innerHTML = amount;

      // Count total quantity in carts
      let totalQuantity = carts.reduce((result, item) => {
        return result + item.quantity;
      }, 0);
      getElement("#count-quantity").innerHTML = totalQuantity;
    })

    .catch((error) => {
      console.log(error);
    });
}

//Button - decrease quantity in carts
function quantityDown(productId) {
  apiGetProductsById(productId)
    .then((response) => {
      let product = response.data;
      let newCarts = carts.map((item) => {
        if (item.id === product.id) {
          let quantity = item.quantity;
          if (quantity === 1) {
            getElement(".quantity-annouce").hidden = false;
            return { ...item };
          } else {
            getElement(".quantity-annouce").hidden = true;
            return { ...item, quantity: item.quantity - 1 };
          }
        }
      });
      carts = newCarts;
      let htmlCart = carts.map((item, index) => {
        return `
        <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>
          <img
            src="${item.img}"
            alt="${item.name}"
            width="70px"
            height="70px"
          />
        </td>
        <td>${item.price}</td>
        <td>
           <button id="qty-down" class="btn-qty mr-10" onclick="quantityDown(${
             item.id
           })">
                <i class="fas fa-chevron-left"></i>
            </button>
             ${item.quantity}
            <button id="qty-up" class="btn-qty ml-10" onclick="quantityUp(${
              item.id
            })">
                 <i class="fas fa-chevron-right"></i>
            </button>
            <p class="quantity-annouce" hidden>Quantity is at least one</p>
        </td>
        <td>
        ${item.quantity * item.price}
        </td>
        <td>
        <button class="btn-pink" onclick="clearItem(${item.id})">Clear</button>
        </td>
      </tr>
        `;
      });
      getElement("#cart-PDList").innerHTML = htmlCart;
      let amount = carts.reduce((result, item, index) => {
        return result + item.quantity * item.price;
      }, 0);

      getElement("#amount").innerHTML = amount;

      let totalQuantity = carts.reduce((result, item) => {
        return result + item.quantity;
      }, 0);
      getElement("#count-quantity").innerHTML = totalQuantity;
    })
    .catch((error) => {
      console.log(error);
    });
}

//Button - increase quantity in carts
function quantityUp(productId) {
  apiGetProductsById(productId)
    .then((response) => {
      let product = response.data;
      let newCarts = carts.map((item) => {
        if (item.id === product.id) {
          getElement(".quantity-annouce").hidden = true;
          return { ...item, quantity: item.quantity + 1 };
        }
        console.log(item.quantity);
        return item;
      });

      carts = newCarts;

      let htmlCart = carts.map((item, index) => {
        return `
        <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>
          <img
            src="${item.img}"
            alt="${item.name}"
            width="70px"
            height="70px"
          />
        </td>
        <td>${item.price}</td>
        <td>
           <button id="qty-down" class="btn-qty mr-10" onclick="quantityDown(${
             item.id
           })">
                <i class="fas fa-chevron-left"></i>
            </button>
             ${item.quantity}
            <button id="qty-up" class="btn-qty ml-10" onclick="quantityUp(${
              item.id
            })">
                 <i class="fas fa-chevron-right"></i>
            </button>
        </td>
        <td>
        ${item.quantity * item.price}
        </td>
        <td>
        <button class="btn-pink" onclick="clearItem(${item.id})">Clear</button>
        </td>
      </tr>
        `;
      });
      getElement("#cart-PDList").innerHTML = htmlCart;
      let amount = carts.reduce((result, item, index) => {
        return result + item.quantity * item.price;
      }, 0);

      getElement("#amount").innerHTML = amount;

      let totalQuantity = carts.reduce((result, item) => {
        return result + item.quantity;
      }, 0);
      getElement("#count-quantity").innerHTML = totalQuantity;
    })
    .catch((error) => {
      console.log(error);
    });
}

console.log("carts", carts);

function clearItem(productId) {
  apiGetProductsById(productId)
    .then((response) => {
      let product = response.data;
      let newCarts = carts.filter((item) => {
        return item.id !== product.id;
      });
      carts = newCarts;

      let htmlCart = carts.map((item, index) => {
        return `
        <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>
          <img
            src="${item.img}"
            alt="${item.name}"
            width="70px"
            height="70px"
          />
        </td>
        <td>${item.price}</td>
        <td>
           <button id="qty-down" class="btn-qty mr-10" onclick="quantityDown(${
             item.id
           })">
                <i class="fas fa-chevron-left"></i>
            </button>
             ${item.quantity}
            <button id="qty-up" class="btn-qty ml-10" onclick="quantityUp(${
              item.id
            })">
                 <i class="fas fa-chevron-right"></i>
            </button>
        </td>
        <td>
        ${item.quantity * item.price}
        </td>
        <td>
        <button class="btn-pink" onclick="clearItem(${item.id})">Clear</button>
        </td>
      </tr>
        `;
      });
      getElement("#cart-PDList").innerHTML = htmlCart;
      let amount = carts.reduce((result, item, index) => {
        return result + item.quantity * item.price;
      }, 0);

      getElement("#amount").innerHTML = amount;

      let totalQuantity = carts.reduce((result, item) => {
        return result + item.quantity;
      }, 0);
      getElement("#count-quantity").innerHTML = totalQuantity;
    })
    .catch((error) => {
      console.log(error);
    });
}
// Button - clearCarts
function clearCart() {
  getElement("#cart-PDList").innerHTML = "";
  getElement("#amount").innerHTML = "";
  getElement("#count-quantity").innerHTML = "";
}
