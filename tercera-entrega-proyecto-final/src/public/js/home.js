

function addProductToCart(cart_id, product_id) {
    const quantity = JSON.stringify({quantity: 1})
    fetch(`/cart/${cart_id}/product/${product_id}`, {
        method: 'POST',
        body: quantity,
        headers: {
            'Content-Type': 'application/json' // Indica que estás enviando JSON
        }
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

function restProductFromCart(cart_id, product_id) {
    const quantity = JSON.stringify({quantity: -1})
    fetch(`/cart/${cart_id}/product/${product_id}`, {
        method: 'POST',
        body: quantity,
        headers: {
            'Content-Type': 'application/json' // Indica que estás enviando JSON
        }
    })
        .then(response => {
            if (response.ok) {
                window.location.href = `http://localhost:8080/cart/`;
            } else {
                throw new Error('No se pudo restar el producto al carrito.');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
};