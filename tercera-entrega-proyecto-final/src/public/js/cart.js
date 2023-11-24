const socketClient = io();

function deleteProductFromCart(cid, pid) {
    fetch(`/cart/${cid}/product/${pid}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.status == "error") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.payload
                })
            } else {
                socketClient.emit('deletedOrAddedProductToCart', cid);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
};

function finishPurchase(cid) {
    console.log(cid)
    // pendiente hacer un chequeo del stock para dar un aviso al usuario que
    // los productos sin stock no se sumaran en el ticket
    // const products = checkProductsStock(cid)
    // console.log("products")
    // console.log(products)
    fetch(`/cart/${cid}/purchase/`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.status == "error") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.payload
                })
            } else {
                console.log(data.payload)
                window.location.href = `/cart/view/${cid}/purchase/${data.payload._id.toString()}`;
            }
        })
        .catch(error => {
            console.error('Error en la solicitud: '+data.payload, error);
        });
};


checkProductsStock = async (cid) => {
    console.log(cid)
    const products = await fetch(`/cart/${cid}`, {
                                method: 'GET'
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.status == "error") {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Oops...',
                                            text: data.payload
                                        })
                                    } else {
                                        console.log("data.payload")
                                        console.log(data.payload)
                                        return data.payload
                                    }
                                })
                                .catch(error => {
                                    console.error('Error en la solicitud: '+data.payload, error);
                                });
    return products
};


socketClient.on('cartProductsHistory', async data => {
    const arrayProducts = data.products
    const cartId = data._id
    const cartProducts = document.getElementById('table_body')
    cartProducts.innerHTML = '';
    arrayProducts.forEach(p => {
        const subTotal = p.product.price * p.quantity
        const productsInCart = `
                <tr>
                    <td>
                        <img src="${p.product.thumbnail}" alt="${p.product.title}" class="img-thumbnail" width="100">
                    </td>
                    <td>
                        <h5>${p.product.title}</h5>
                        <p>${p.product.description}</p>
                    </td>
                    <td>$${p.product.price}</td>
                    <td>
                        <div class="input-group">
                            <button class="btn btn-outline-secondary" type="button" onclick="decreaseQuantity('${p.product._id}')">-</button>
                            <input type="text" class="form-control" value="${p.quantity}" readonly>
                            <button class="btn btn-outline-secondary" type="button" onclick="increaseQuantity('${p.product._id}')">+</button>
                        </div>
                    </td>
                    <td>$${subTotal}</td>
                    <td>
                        <button class="btn btn-danger" onclick="deleteProductFromCart('${cartId}','${p.product._id}')">Eliminar</button>
                    </td>
                </tr>
        `
        cartProducts.insertAdjacentHTML('beforeend', productsInCart);
    });
})