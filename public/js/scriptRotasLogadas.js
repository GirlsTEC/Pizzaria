// Função para acessar as rotas
document.addEventListener("DOMContentLoaded", async function accessProtectedRoute() {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:8080/api/cliente/validate', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    if (response.ok) {
        if(location.pathname === '/login' || location.pathname === '/cadastro') location.replace('/perfil');
        console.log(data);
    } else {
        if(location.pathname === '/perfil') console.error('Erro ao acessar a rota protegida:', data.message);
        // Tentar renovar o accessToken se o token tiver expirado
        await refreshAccessToken(accessToken);
    }
})

// Função para obter um novo accessToken usando o refreshToken
async function refreshAccessToken(accessToken) {
    const response = await fetch('http://localhost:8080/api/cliente/refresh', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include', // Importante para enviar cookies
    });

    const data = await response.json();

    if (response.ok) {
        console.log(data.message);
        localStorage.setItem('accessToken', data.token);
        if(location.pathname === '/login' || location.pathname === '/cadastro') {
            location.replace('/perfil');
        }
    } else {
        if(location.pathname === '/perfil') {
            console.error('Erro ao renovar o token:', data.message);
            location.replace('/login');
        }
    }
}