
import { fazerLogin, fazerCadastro } from "./autenticacao.js";


const formularioLogin = document.getElementById("form-login");
const formularioCadastro = document.getElementById("form-cadastro");

const areaLogin = document.getElementById("formulario-login");
const areaCadastro = document.getElementById("formulario-cadastro");

const mensagem = document.getElementById("mensagem");


document.getElementById("ir-cadastro").addEventListener("click", () => {
    areaLogin.hidden = true;
    areaCadastro.hidden = false;
    mensagem.textContent = "";
});


document.getElementById("ir-login").addEventListener("click", () => {
    areaCadastro.hidden = true;
    areaLogin.hidden = false;
    mensagem.textContent = "";
});


formularioLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const login = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    try {
        await fazerLogin(login, senha);
        window.location.href = "./index.html";
    } catch (erro) {
        mensagem.textContent = erro.message;
    }
});


formularioCadastro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("nome-cadastro").value;
    const login = document.getElementById("login-cadastro").value;
    const senha = document.getElementById("senha-cadastro").value;
    const img = document.getElementById("foto-cadastro").value.trim();

    try {
        await fazerCadastro(login, senha, nome, img || null);
        window.location.href = "./index.html";
    } catch (erro) {
        mensagem.textContent = erro.message;
    }
});
