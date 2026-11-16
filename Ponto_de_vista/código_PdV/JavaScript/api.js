const urlBase = "https://ifsp.trojahn.uk/redesocial"

//Funções GET
export async function listarUsuarios() {
    const resposta = await fetch(`${urlBase}/usuarios/`);
    if (!resposta.ok){
        throw new Error("Erro ao receber respostas");
    }
    return resposta.json();
}

export async function checarUsuario() {
    const resposta = await fetch(`${urlBase}/usuarios/check`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
    });
    const dados = await resposta.json()
    if (!resposta.ok){
        throw new Error(dados.msg)
    }
    return dados;
}

export async function listarPosts(){
    const resposta = await fetch(`${urlBase}/posts/`);
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

export async function listarComentarios(id) {
    const resposta = await fetch(`${urlBase}/posts/${id}/comentarios`);
    const dados = await resposta.json();
    if (!resposta.ok){
        throw new Error(dados.msg);
    }
    return dados;
}

export async function  listarLikes(id) {
    const resposta = await fetch(`${urlBase}/posts/${id}/likes`);
    const dados = await resposta.json();
    if (!resposta.ok){
        throw new Error(dados.msg);
    }
    return dados;
}

//Funções POST
export async function cadastrarUsuario(login, senha, nome, img) {
    const resposta = await fetch(`${urlBase}/usuarios/`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({login, senha, nome, img})
    });
    const dados = await resposta.json();
    if (!resposta.ok){
        throw new Error(dados.msg)
    }
    return dados;
}

export async function enviarLogin(login, senha){
    const resposta = await fetch(`${urlBase}/usuarios/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({login, senha})
    });
    const dados = await resposta.json();
    if (!resposta.ok){
        throw new Error (dados.msg);
    }
    return dados;
}

export async function criarPost(texto, img){
    const resposta = await fetch(`${urlBase}/posts/`, {
        method: 'POST',
        headers: {'Content-Type':'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({texto, img})
    });
    const dados = await resposta.json();
    if (!resposta.ok){
        throw new Error(dados.msg);
    }
    return dados;
}

export async function adicionarComentario(texto, id){
    const resposta = await fetch(`${urlBase}/posts/${id}/comentarios`, {
        method: 'POST',
        headers: {'Content-Type':'application/json',
             Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({texto})
    })
    const dados = await resposta.json();
    if (!resposta.ok){
        throw new Error(dados.msg);
    }
    return dados;
}

export async function adicionarLike(id){
    const resposta = await fetch(`${urlBase}/posts/${id}/likes`,{
        method: 'POST',
        headers: {'Content-Type':'application/json',
             Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const dados = await resposta.json();
    if(!resposta.ok){
        throw new Error (dados.msg);
    }
    return dados;
}

//Funções PUT
export async function editarPost(texto, img, id){
    const resposta = await fetch(`${urlBase}/posts/${id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json',
             Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({texto, img})
    });
    const dados = await resposta.json();
    if (!resposta.ok){
        throw new Error(dados.msg);
    }
    return dados;
}

export async function editarComentario(texto, id){
    const resposta = await fetch(`${urlBase}/comentarios/${id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json',
             Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({texto})
    });
    const dados = await resposta.json();
    if (!resposta.ok){
        throw new Error(dados.msg);
    }
    return dados;
}

//Funções DELETE
export async function removerPost(id) {
    const resposta = await fetch(`${urlBase}/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
    });
    const dados = await resposta.json();
    if (!resposta.ok){
        throw new Error(dados.msg);
    }
    return dados;
}

export async function removerComentario(id){
    const resposta = await fetch(`${urlBase}/comentarios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
    });
    const dados = await resposta.json();
    if (!resposta.ok){
        throw new Error(dados.msg);
    }
    return dados;
}