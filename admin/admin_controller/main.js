// function -  utils
function getElement(selector) {
  return document.querySelector(selector);
}
// Open form
document.getElementById("btn-model-product").onclick = () => {
  // Open form
  document.getElementById("myModal").style.display = "block";
  getElement("#PDID").disabled = true;
  // Create button Add
  getElement(".modal-footer").innerHTML = `
  <button class="btn-modal" onclick="createProduct()">Add</button>
  `;
};
//Button Đóng form nhập liệu
document.getElementById("modal-close").onclick = () => {
  document.getElementById("myModal").style.display = "none";
  getElement("#PDID").value = "";
  getElement("#PDID").disabled = false;
  getElement("#PDName").value = "";
  getElement("#PDPrice").value = "";
  getElement("#PDImage").value = "";
  getElement("#PDDisplay").value = "";
  getElement("#PDOS").value = "";
  getElement("#PDCamera").value = "";
  getElement("#PDRAM").value = "";
  getElement("#PDROM").value = "";
};
// --------------------
getProduct();
//Get product
function getProduct() {
  apiGetproducts()
    .then((response) => {
      console.log(response.data);
      //   Goi hàm display để hiển thị ra giao diện
      display(response.data);
    })

    .catch((error) => {
      console.log(error);
    });
}
//Display product List
function display(products) {
  let html = products.reduce((result, value, index) => {
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
    <tr>
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td><img src="${product.img}" width="80px" height="80px" alt="${product.name}"></td>
    <td>
      <p class="txt-left">Display : ${product.display}</p>
      <p class="txt-left">Operation System : ${product.os}</p>
      <p class="txt-left">Camera : ${product.camera}</p>
      <p class="txt-left">RAM : ${product.ram}</p>
      <p class="txt-left">ROM : ${product.rom}</p>
    </td>
    <td><button class="btn-red" onclick="selectProduct('${product.id}')">View</button>
    <button class="btn-red" onclick="deleteProduct('${product.id}')">Delete</button></td>

    </tr>`
    );
  }, "");
  document.getElementById("tbl_product-list").innerHTML = html;
}

// Add product - TESTED
function createProduct() {
  getElement("#PDID").disabled = true;
  // B1 : DOM & Khoi tao object product
  let product = {
    name: getElement("#PDName").value,
    display: getElement("#PDDisplay").value,
    os: getElement("#PDOS").value,
    price: +getElement("#PDPrice").value,
    camera: getElement("#PDCamera").value,
    ram: getElement("#PDRAM").value,
    rom: getElement("#PDROM").value,
    img: getElement("#PDImage").value,
  };

  // B2 : Gọi API thêm sản phẩm
  apiCreateProduct(product)
    .then(() => {
      return apiGetproducts();
    })
    .then((response) => {
      display(response.data);
      //   ẩn model :
      getElement("#myModal").style.display = "none";
    })
    .catch((error) => {
      console.log(error);
    });
}

// Delete Product - TESTED
function deleteProduct(productId) {
  apiDeleteproduct(productId)
    .then(() => {
      // Xoa thanh cong
      return apiGetproducts();
    })
    .then((response) => {
      display(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
// Show product onto form for updating - TESTED
function selectProduct(productId) {
  // Hien thi model
  getElement("#myModal").style.display = "block";
  //Modify Model title
  getElement(".modal_title").innerHTML = "UPDATING PRODUCT";
  // Create button Update & Cancel
  getElement(".modal-footer").innerHTML = `
  <button class="btn-modal">Cancel</button>
  <button class="btn-modal" onclick="updateProduct('${productId}')">Update</button>
  `;
  // Call api to get product object by it's Id
  apiGetProductsById(productId)
    // Show product property onto form
    .then((response) => {
      let product = response.data;
      getElement("#PDID").value = product.id;
      getElement("#PDName").value = product.name;
      getElement("#PDPrice").value = product.price;
      getElement("#PDImage").value = product.img;
      getElement("#PDDisplay").value = product.display;
      getElement("#PDCamera").value = product.camera;
      getElement("#PDOS").value = product.os;
      getElement("#PDRAM").value = product.ram;
      getElement("#PDROM").value = product.rom;
    })
    .catch((error) => {
      console.log(error);
    });
}

// Update product - TESTED
function updateProduct(productId) {
  // DOM & khởi tạo object product
  let newProduct = {
    name: getElement("#PDName").value,
    display: getElement("#PDDisplay").value,
    os: getElement("#PDOS").value,
    price: +getElement("#PDPrice").value,
    camera: getElement("#PDCamera").value,
    ram: getElement("#PDRAM").value,
    rom: getElement("#PDROM").value,
    img: getElement("#PDImage").value,
    // id: getElement("#PDID").value,
  };
  //Call API to update product to products array
  apiUpdateProduct(productId, newProduct)
    // get products arr after updated product
    .then(() => {
      return apiGetproducts();
    })
    // Call funct display to show products on screen
    .then((response) => {
      display(response.data);
      //clear information on form after update
      getElement("#PDID").value = "";
      getElement("#PDID").disabled = false;
      getElement("#PDName").value = "";
      getElement("#PDPrice").value = "";
      getElement("#PDImage").value = "";
      getElement("#PDDisplay").value = "";
      getElement("#PDOS").value = "";
      getElement("#PDCamera").value = "";
      getElement("#PDRAM").value = "";
      getElement("#PDROM").value = "";
      //Close form modal after display product list
      getElement("#myModal").style.display = "none";
    })
    .catch((error) => {
      console.log(error);
    });
}
// Tìm kiếm bằng URL query : trên URL mock API: ?name=iphone
// Khi người dùng enter thì thực hiện tìm kiếm : sử dụng hàm sự kiện onkeypress. Nếu key của event là enter thì thực hiện tìm kiếm
getElement("#txtSearch").onkeypress = (event) => {
  if (event.key !== "Enter") {
    //Lưu ý Enter không phải enter
    return;
  }
  apiGetproducts(event.target.value)
    .then((response) => {
      display(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
