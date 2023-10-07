const userForm = document.getElementById('userForm');
userForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita la acción predeterminada de enviar el formulario
    // Obtengo los datos del formulario
    const formData = new FormData(userForm);
    console.log(formData)
    // Realizo una solicitud AJAX (fetch) para enviar los datos al servidor
    try {
        const response = await fetch('/api/session', {
            method: 'POST',
            body: formData,
        })
        if (response.ok) {
            const user = {
                email: document.getElementById('email').value,
                role: 'user'
            } 
            req.session.user = user
            res.render('/')
        } else {
            throw new Error('No se pudo completar la solicitud: '+response);
        }
    }
    catch (error) {
            console.error('Error en la solicitud:', error);
    };
});

const register = (req, res) => {
    res.redirect('/login/register')
}

