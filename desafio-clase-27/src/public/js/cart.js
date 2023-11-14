const socketClient = io();

function deleteProductFromCart(cid, pid) {
    fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                socketClient.emit('deletedOrAddedProductToCart', cid);
            } else {
                throw new Error('No se pudo completar la solicitud.');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
};

socketClient.on('cartProductsHistory', async data => {
    const arrayProducts = data.products
    const cartId = data._id
    const cartProducts = document.getElementById('table_body')
    cartProducts.innerHTML = '';
    arrayProducts.forEach(p => {
        const productsInCart = `
                <tr>
                    <td>
                        <img src="${p.product.thumbnail}" alt="${p.product.title}" class="img-thumbnail" width="100">
                    </td>
                    <td>
                        <h5>${p.product.title}</h5>
                        <p>${p.product.description}</p>
                    </td>
                    <td>${p.product.price}</td>
                    <td>
                        <div class="input-group">
                            <button class="btn btn-outline-secondary" type="button" onclick="decreaseQuantity('${p.product._id}')">-</button>
                            <input type="text" class="form-control" value="${p.quantity}" readonly>
                            <button class="btn btn-outline-secondary" type="button" onclick="increaseQuantity('${p.product._id}')">+</button>
                        </div>
                    </td>
                    <td>${p.quantity}*${p.product.price}</td>
                    <td>
                        <button class="btn btn-danger" onclick="deleteProductFromCart('${cartId}','${p.product._id}')">Eliminar</button>
                    </td>
                </tr>
        `
        cartProducts.insertAdjacentHTML('beforeend', productsInCart);
    });
})