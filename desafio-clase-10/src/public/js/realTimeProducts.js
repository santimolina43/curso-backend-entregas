
const socketClient = io();

socketClient.on('history', async data => {

    const arrayProducts = data
    const history = document.getElementById('history')
    history.innerHTML = '';
    arrayProducts.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - Precio: ${product.price}`;
        history.appendChild(li);
    });
})