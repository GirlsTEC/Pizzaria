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
    } else {
        console.error('Erro de login:', resData.message);
    }
});

// Função para obter um novo accessToken usando o refreshToken
async function refreshAccessToken() {
    const response = await fetch('/refresh', {
        method: 'GET',
        credentials: 'include', // Importante para enviar cookies
    });

    const data = await response.json();
    if (response.ok) {
        console.log('Novo accessToken:', data.token);
        localStorage.setItem('accessToken', data.token);
    } else {
        console.error('Erro ao renovar o token:', data.message);
    }
}

// Função para acessar uma rota protegida
async function accessProtectedRoute() {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch('/validate', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    if (response.ok) {
        console.log(data);
    } else {
        console.error('Erro ao acessar a rota protegida:', data.message);
        // Tentar renovar o accessToken se o token tiver expirado
        await refreshAccessToken();
    }
}