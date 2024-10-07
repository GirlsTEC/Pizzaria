function atualizarDados() {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha === confirmarSenha && senha !== "") {
        alert('Dados atualizados com sucesso!');
        // Aqui você pode adicionar o código para enviar os dados para o servidor
    } else {
        alert('As senhas não coincidem ou estão vazias.');
    }
}

function sair() {
    alert('Você saiu da conta.');
    // Aqui você pode adicionar redirecionamento ou logout
}
