import { fazerLogin, fazerCadastro, verificarSessao } from "./autenticacao.js";

// Se já estiver logado, redireciona direto para o index.html
verificarSessao().then(usuario => {
    if (usuario) window.location.href = "index.html";
});

// Evento de Login
document.querySelector("#formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const erroEl = document.querySelector("#erroLogin");
    erroEl.innerText = "";

    const login = document.querySelector("#loginUser").value;
    const senha = document.querySelector("#loginSenha").value;

    try {
        await fazerLogin(login, senha);
        window.location.href = "index.html";
    } catch (err) {
        erroEl.innerText = err.message || "Erro ao fazer login.";
    }
});

// Evento de Cadastro
document.querySelector("#formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const erroEl = document.querySelector("#erroCadastro");
    erroEl.innerText = "";

    const login = document.querySelector("#cadLogin").value;
    const nome = document.querySelector("#cadNome").value;
    const senha = document.querySelector("#cadSenha").value;
    const img = document.querySelector("#cadImg").value;

    try {
        await fazerCadastro(login, senha, nome, img);
        window.location.href = "index.html";
    } catch (err) {
        erroEl.innerText = err.message || "Erro ao cadastrar usuário.";
    }
});