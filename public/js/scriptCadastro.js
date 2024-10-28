const senha = document.getElementById("senha");
const confirmaSenha = document.getElementById("confirmaSenha");
const icon = document.getElementsByClassName("passwordIcon")[0];

function alternarExibicao() {
    if (senha.type === 'password') {
        senha.setAttribute('type', 'text');
        confirmaSenha.setAttribute('type', 'text');
        icon.style.backgroundImage = 'url(/img/no-show.png)';
    } else {
        senha.setAttribute('type', 'password');
        confirmaSenha.setAttribute('type', 'password');
        icon.style.backgroundImage = 'url(/img/show.png)';
    }
}

const formUsuario = document.querySelector('#addCliente')

// Adiciona evento de 'submit' ao formulário
formUsuario.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.target).entries());

    fetch('http://localhost:8080/api/cliente/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(res => {
        if (res.ok) {
            location.replace('/login');
        }
        return res;
    }).then(data => console.log(data))
        .catch(err => console.log("ERROR: " + err));
});