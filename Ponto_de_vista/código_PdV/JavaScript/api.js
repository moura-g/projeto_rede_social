const urlBase = "https://ifsp.trojahn.uk/redesocial"

export async function listarUsuarios() {
    const resposta = await fetch(`${urlBase}/usuarios`);
    if (!resposta.ok){
        throw new Error("Erro ao receber respostas");
    }
    return resposta.json();
}

export async function checarUsuario() {
    const resposta = await fetch(`${urlBase}/usuarios/check`);
    const dados = await resposta.json()
    if (!resposta.ok){
        throw new Error(dados.msg)
    }
    return dados;
}

export async function listarPosts(){
    const resposta = await fetch(`${urlBase}/posts`);
    const dados = await resposta.json()
    if (!resposta.ok){
        throw new Error(dados.msg)
    }
    return dados;
}

export async function postPorId(id){
    const resposta = await fetch(`${urlBase}/posts/${id}`);
    const dados = await resposta.json()
    if (!resposta.ok){
        throw new Error(dados.msg);
    }
    return dados;
}