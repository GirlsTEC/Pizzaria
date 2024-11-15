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

const formCadastro = document.querySelector('#addCliente')

// Adiciona evento de 'submit' ao formulário
formCadastro.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.target).entries());

    if (data.senha === data.confirmaSenha && data.senha !== "") {
        fetch('http://localhost:8080/api/cliente/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => {
            if (res.ok) {
                alert('Cadastrado com sucesso!');
                location.replace('/login');
            }
            return res.json();
        }).then(data => console.log(data.message))
            .catch(err => console.log("ERROR: " + err));
    } else {
        alert('As senhas não coincidem ou estão vazias.');
    }
});