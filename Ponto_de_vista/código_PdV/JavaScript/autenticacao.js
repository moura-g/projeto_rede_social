import { enviarLogin, checarUsuario, cadastrarUsuario } from "./api.js";

export async function fazerLogin(login, senha) {
    const dados = await enviarLogin(login, senha);
    localStorage.setItem('token', dados.token);
    localStorage.setItem('usuario', JSON.stringify(dados.usuario));
    return dados.usuario;
}

export async function fazerCadastro(login, senha, nome, img){
    await cadastrarUsuario(login, senha, nome, img);
    return fazerLogin(login, senha);
}

export function obterUsuarioLogado() {
    const dadoUser = localStorage.getItem('usuario');
    if (dadoUser){
        return JSON.parse(dadoUser);
    }
    else{
        return null;
    }
}

export function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');  
}

export async function verificarSessao() {
    if (!localStorage.getItem('token')){
            return null;
        }

    try{
        await checarUsuario();
        return obterUsuarioLogado();
    }
    catch(err){
        logout();
        return null;
    }
}