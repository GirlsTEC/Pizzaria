const formLogin = document.querySelector('#loginCliente');

// Adiciona evento de 'submit' ao formulário
formLogin.addEventListener('submit', async (event) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(event.target).entries());

    const response = await fetch('/api/cliente/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const resData = await response.json();
    if (response.ok) {
        console.log('Acesso concedido:', resData.token);
        localStorage.setItem('accessToken', resData.token);
        location.replace('/perfil');
    } else {
        console.error('Erro de login:', resData.message);
    }
});