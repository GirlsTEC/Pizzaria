// Função para arrumar o header
let logged = false;

document.addEventListener("DOMContentLoaded", async function HeaderFix() {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:8080/api/cliente/validate', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    if (response.ok) {
        logged = true;
    } else {
        // Tentar renovar o accessToken se o token tiver expirado
        await refreshAccessToken();
    }
    if(logged){
        const list = document.getElementById('menu');
        list.removeChild(list.lastElementChild);
        list.removeChild(list.lastElementChild);
        list.insertAdjacentHTML('beforeend', '<li><a href="/perfil">Perfil</a></li>');
        list.insertAdjacentHTML('beforeend', '<li><a id="logOut">Log-Out</a></li>');

        const logOut = document.getElementById('logOut');
        logOut.style.cursor = 'pointer';
        logOut.addEventListener('click', async function(event) {
            event.preventDefault();  // Impede o comportamento padrão de navegação
            await logOutButtonListener();
        });
    }
})

async function logOutButtonListener() {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:8080/api/cliente/logout', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });
}

// Função para obter um novo accessToken usando o refreshToken
async function refreshAccessToken() {
    const response = await fetch('http://localhost:8080/api/cliente/refresh', {
        method: 'GET',
        credentials: 'include', // Importante para enviar cookies
    });

    const data = await response.json();

    if (response.ok) {
        logged = true;
        localStorage.setItem('accessToken', data.token);
    } else{
        logged = false;
    }
}