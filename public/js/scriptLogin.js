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

    const data = await response.json();
    if (response.ok) {
        console.log('Acesso concedido:', data.token);
        localStorage.setItem('accessToken', data.token);
        location.replace('/perfil');
    } else {
        alert('Usuário inexistente');
        console.error('Erro de login:', data.message);
    }
});