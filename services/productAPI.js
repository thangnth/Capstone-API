function apiGetproducts(searchValue) {
  return axios({
    url: "https://64a6ad22096b3f0fcc8043c6.mockapi.io/products",
    method: "GET",
    params: {
      name: searchValue || undefined, //nếu searchValue là truthy value thì lấy searchValue, nếu ko thì lấy giá trị là undefined
    }, //params có s
  });
}

function apiGetProductsById(productId) {
  return axios({
    url: `https://64a6ad22096b3f0fcc8043c6.mockapi.io/products/${productId}`,
    method: "GET",
  });
}
// product{name, price, image, description}
function apiCreateProduct(product) {
  return axios({
    url: "https://64a6ad22096b3f0fcc8043c6.mockapi.io/products",
    method: "POST",
    data: product,
  });
}

function apiUpdateProduct(productId, newProduct) {
  return axios({
    url: `https://64a6ad22096b3f0fcc8043c6.mockapi.io/products/${productId}`,
    method: "PUT",
    data: newProduct,
  });
}

function apiDeleteproduct(productId) {
  return axios({
    url: `https://64a6ad22096b3f0fcc8043c6.mockapi.io/products/${productId}`,
    method: "DELETE",
  });
}
