const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita la acción predeterminada de enviar el formulario
    console.log('llegue aca')
    // Obtengo los datos del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginUser = {
        email: email,
        password: password
    }
    const loginUserJSON = JSON.stringify(loginUser)
    // Realizo una solicitud AJAX (fetch) para enviar los datos al servidor
    try {
        const response = await fetch('/session/login', {
            method: 'POST',
            body: loginUserJSON,
            headers: {
                'Content-Type': 'application/json' // Indica que estás enviando JSON
            }
        })
        if (response.ok) {
            window.location.href = "/";
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

const register = (req, res) => {
    res.redirect('/login/register')
}

// const loginWithGithub = () => {
//     const email = 'peperoni.com';
//     const password = 'nose';
//     const loginUser = {
//         email: email,
//         password: password
//     }
//     const loginUserJSON = JSON.stringify(loginUser)
//     try {
//         const response = fetch('/session/github', {
//             method: 'POST',
//             body: loginUserJSON,
//             headers: {
//                 'Content-Type': 'application/json' // Indica que estás enviando JSON
//             }
//         })
//         if (response.ok) {
//             window.location.href = "/";
//         } else {
//             console.log('response')
//             console.log(response)
//             throw new Error('No se pudo completar la solicitud de Github: '+response);
//         }
//     }
//     catch (error) {
//         Swal.fire({
//             icon: 'error',
//             title: 'Oops...',
//             text: 'Something went wrong!'+error,
//             footer: '<a href="">Why do I have this issue?</a>'
//           })
//     };
// }