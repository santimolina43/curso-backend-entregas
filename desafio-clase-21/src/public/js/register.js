
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita la acción predeterminada de enviar el formulario
    // Obtengo los datos del formulario
    const formData = new FormData(registerForm);
    const first_name = document.getElementById('first_name').value; 
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    // Verifico que las contraseñas sean iguales
    if (password !== confirmPassword) throw new Error('[ERR] Contraseñas diferentes');
    const newUser = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        password: password
    }
    const newUserJSON = JSON.stringify(newUser)
    // Realizo una solicitud AJAX (fetch) para enviar los datos al servidor
    try {
        const response = await fetch('/api/session/register', {
            method: 'POST',
            body: newUserJSON,
            headers: {
                'Content-Type': 'application/json' // Indica que estás enviando JSON
            }
        })
        if (response.ok) {
            window.location.href = "/login";
        } else {
            throw new Error('No se pudo completar la solicitud: '+response);
        }
    }
    catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'+error,
            footer: '<a href="">Why do I have this issue?</a>'
        })
    };
});
