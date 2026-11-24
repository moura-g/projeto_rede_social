import {
    listarPosts, postPorId, criarPost, editarPost, removerPost,
    listarComentarios, adicionarComentario, editarComentario, removerComentario,
    listarLikes, adicionarLike, listarUsuarios
} from "./api.js";

export async function carregarFeed() {
    const posts = await listarPosts();
    const usuarios = await listarUsuarios();
    
    const todosUsuarios = {};
    usuarios.forEach(u => {
        todosUsuarios[u.id] = u;
    });

    posts.sort((a,b)=> {return new Date (b.data) - new Date (a.data)});
    
    return {posts, todosUsuarios};
}

export async function buscarPost(idPost) {
    return postPorId(idPost);
}

export async function publicarPost(texto, img = null){
    if (texto === ''){
        throw new Error("Escreva algo antes de postar.");
    }
    return criarPost(texto, img);
}

export async function atualizarPost(texto, img = null, idPost) {
    if (texto === '') {
        throw new Error('O post não pode ficar vazio.');
    }
    return editarPost(texto, img, idPost);
}

export async function excluirPost(idPost) {
    return removerPost(idPost);
}

//-------------------LIKE-------------------
export async function curtirPost(idPost) {
    return adicionarLike(idPost);
}

export async function buscarLikes(idPost){
    return listarLikes(idPost);
}

export async function usuarioCurtiu(post, usuario){
    if(!usuario){
        return false;
    }
    for (let i = 0; i < post.likes.length; i++) {
        if (post.likes[i].usuario === usuario.id) {
            return true;
        }
    }

    return false;
}

export async function buscarComentarios(idPost) {
    return listarComentarios(idPost);
}

export async function comentarPost(idPost, texto) {
    if (texto === '') {
        throw new Error('Escreva algo antes de comentar.');
    }
    return adicionarComentario(texto, idPost);
}

export async function atualizarComentario(texto, idComentario) {
    if (texto === '') {
        throw new Error('O comentário não pode ficar vazio.');
    }
    return editarComentario(texto, idComentario);
}

export async function excluirComentario(idComentario) {
    return removerComentario(idComentario);
}

export function ehDono(item, usuario) {
    if (!usuario){ 
        return false;
    }
    return item.usuario === usuario.id;
}