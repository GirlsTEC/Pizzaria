import { logOutButtonListener } from './scriptHeaderLogado.js';

const formAtualizaPerfil = document.getElementById('atualizaCliente');
const sairButton = document.getElementById('sair');

document.addEventListener('DOMContentLoaded', async () => {
    const formInput = document.getElementsByClassName('input-form');
    const response = await fetch('http://localhost:8080/api/cliente/search', {
        method: 'GET',
    });

    const data = await response.json();

    if(response.ok){
        formInput.namedItem('nome').value = data.nome;
        formInput.namedItem('telefone').value = data.telefone;
        formInput.namedItem('endereco').value = data.endereco;
    } else {
        console.log("ERRO: " + data.message);
    }
})

formAtualizaPerfil.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const senha = data.senha;
    const confirmaSenha = data.confirmaSenha;

    if (senha === confirmaSenha) {
        delete data.confirmaSenha;
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8080/api/cliente/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        }).then(res => {
            if (res.ok) {
                alert('Atualizado com sucesso!');
                location.reload();
            }
            return res.json();
        }).then(data => console.log(data.message))
            .catch(err => console.log("ERROR: " + err));
    } else {
        alert('As senhas não coincidem.');
    }
});

sairButton.addEventListener('click', async (event) => {
    event.preventDefault();
    alert('Você saiu da conta.');
    await logOutButtonListener();
});
