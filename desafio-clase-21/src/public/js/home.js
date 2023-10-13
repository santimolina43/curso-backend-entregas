function addProductToCart(pid) {
    fetch('/api/carts/651d70aee46c0698f0e4d87c/product/'+pid, {
        method: 'POST'
    })
        .then(response => {
            if (response.ok) {
                window.location.href = 'http://localhost:8080/cart/651d70aee46c0698f0e4d87c';
            } else {
                throw new Error('No se pudo añadir el producto al carrito.');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
};