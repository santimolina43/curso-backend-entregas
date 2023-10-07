const userForm = document.getElementById('userForm');
userForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita la acción predeterminada de enviar el formulario
    // Obtengo los datos del formulario
    const formData = new FormData(userForm);
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const newUser = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        password: password
    }
    
    console.log(newUser)

    const newUserJSON = JSON.stringify(newUser)

    // Realizo una solicitud AJAX (fetch) para enviar los datos al servidor
    try {
        const response = await fetch('/api/session', {
            method: 'POST',
            body: newUserJSON,
            headers: {
                'Content-Type': 'application/json' // Indica que estás enviando JSON
            }
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

