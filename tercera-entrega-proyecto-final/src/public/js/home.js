

function addProductToCart(cart_id, product_id) {
    fetch(`/cart/${cart_id}/product/${product_id}`, {
        method: 'POST'
    })
        .then(response => {
            if (response.ok) {
                window.location.href = `http://localhost:8080/cart/`;
            } else {
                throw new Error('No se pudo añadir el producto al carrito.');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
};

