const formProduct = document.querySelector('#productForm');
const productTitle = document.querySelector('#productTitle');
const productPrice = document.querySelector('#productPrice');
const productThumbnail = document.querySelector('#productThumbnail');
const contentTable = document.querySelector('#contentTable');

formProduct.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = productTitle.value;
  const price = productPrice.value;
  const thumbnail = productThumbnail.value;

  re = /^http.*.(jpeg|jpg|gif|png)$/;

  if (title !== "" && price !== "" && thumbnail !== "" && re.exec(thumbnail)) {
    socket.emit('products-to-server', {
      title: title,
      price: price,
      thumbnail: thumbnail
    })
  }
})

socket.on('products-from-server', (data) => {
  if (data.status !== 'error' && data.products.length > 0 ) {
    let productsPrint = data.products.map(product => {
      return `
      <tr>
        <th scope="row"> ${product.id} </th>
        <td> ${product.title} </td>
        <td> ${product.price} </td>
        <td><img src=${product.thumbnail} alt=${product.title} border="3" height="100" width="100" /></td>
      </tr>
      ` }
    ).join('');
    contentTable.innerHTML = productsPrint;
  } else if (!data.products.length > 0) {
    contentTable.innerHTML = `
    <tr>
      <td colspan="4">NO FOUND PRODUCT </td>
    </tr>`
  } else {
    contentTable.innerHTML = `
    <tr>
      <td colspan="4">${data.message}</td>
    </tr>`
  }
})