import { verificarSessao, logout } from "./autenticacao.js";
import {
    listarUsuarios,
    listarPosts,
    criarPost,
    editarPost,
    removerPost,
    adicionarComentario,
    editarComentario,
    removerComentario,
    adicionarLike
} from "./api.js";

let usuarioLogado = null;
let mapaUsuarios = {}; // Guarda { id: { nome, img } } para mostrar foto e nome nos posts

async function iniciar() {
    usuarioLogado = await verificarSessao();
    atualizarTopo();
    await carregarDados();
}

function atualizarTopo() {
    if (usuarioLogado) {
        document.querySelector("#nomeUsuario").innerText = usuarioLogado.nome;
        if (usuarioLogado.img) {
            document.querySelector("#fotoUsuario").src = usuarioLogado.img;
        }
        document.querySelector("#linkLogin").style.display = "none";
        document.querySelector("#btnSair").style.display = "inline-block";
        document.querySelector("#secaoCriarPost").style.display = "block";
    }
}

// Botão Sair
document.querySelector("#btnSair").addEventListener("click", () => {
    logout();
    window.location.reload();
});

// Criar novo Post
document.querySelector("#formNovoPost").addEventListener("submit", async (e) => {
    e.preventDefault();
    const erroEl = document.querySelector("#erroPost");
    erroEl.innerText = "";

    const texto = document.querySelector("#textoNovoPost").value.trim();
    const img = document.querySelector("#imgNovoPost").value.trim();

    if (!texto && !img) {
        erroEl.innerText = "Escreva um texto ou coloque uma imagem.";
        return;
    }

    try {
        await criarPost(texto, img);
        document.querySelector("#formNovoPost").reset();
        await carregarDados(); // Recarrega o feed
    } catch (err) {
        erroEl.innerText = err.message || "Erro ao publicar.";
    }
});

// Busca usuários e posts no servidor e desenha na tela
async function carregarDados() {
    const container = document.querySelector("#listaPosts");
    try {
        const usuarios = await listarUsuarios();
        mapaUsuarios = {};
        for (let u of usuarios) {
            mapaUsuarios[u.id] = u;
        }

        const posts = await listarPosts();
        renderizarPosts(posts);
    } catch (err) {
        container.innerHTML = `<p class="erro">Erro ao carregar feed: ${err.message}</p>`;
    }
}

function renderizarPosts(posts) {
    const container = document.querySelector("#listaPosts");
    container.innerHTML = "";

    if (posts.length === 0) {
        container.innerHTML = "<p>Nenhuma publicação ainda.</p>";
        return;
    }

    // .reverse() para mostrar o post mais recente primeiro
    for (let post of posts.slice().reverse()) {
        const autor = mapaUsuarios[post.usuario] || { nome: "Usuário #" + post.usuario, img: "" };
        const fotoAutor = autor.img || "https://via.placeholder.com/35";
        const souDonoPost = usuarioLogado && usuarioLogado.id === post.usuario;
        const jaCurti = usuarioLogado && post.likes.some(l => l.usuario === usuarioLogado.id);
        
        const article = document.createElement("article");
        article.className = "card post";
        
        article.innerHTML = `
            <div class="post-header">
                <img src="${fotoAutor}" alt="Foto" width="35" height="35">
                <strong>${autor.nome}</strong>
                ${post.editado ? "<small>(editado)</small>" : ""}
                ${souDonoPost ? `
                    <div class="acoes">
                        <button class="btn-editar-post">Editar</button>
                        <button class="btn-excluir-post">Excluir</button>
                    </div>
                ` : ""}
            </div>
            <p>${post.texto || ""}</p>
            ${post.img ? `<img src="${post.img}" class="post-img" alt="Imagem do post">` : ""}
            
            <div class="post-footer">
                <button class="btn-like">${jaCurti ? "Descurtir" : "Curtir"} (${post.likes.length})</button>
            </div>

            <div class="comentarios">
                <h4>Comentários (${post.comentarios.length})</h4>
                <div class="lista-comentarios"></div>
                ${usuarioLogado ? `
                    <form class="form-comentario">
                        <input type="text" placeholder="Escreva um comentário..." required>
                        <button type="submit">Enviar</button>
                    </form>
                ` : "<small>Faça login para curtir ou comentar.</small>"}
            </div>
        `;

        // Eventos do Post
        article.querySelector(".btn-like").addEventListener("click", async () => {
            if (!usuarioLogado) return alert("Faça login para curtir!");
            try {
                await adicionarLike(post.id);
                await carregarDados();
            } catch (err) {
                alert(err.message);
            }
        });

        if (souDonoPost) {
            article.querySelector(".btn-excluir-post").addEventListener("click", async () => {
                if (!confirm("Excluir este post?")) return;
                try {
                    await removerPost(post.id);
                    await carregarDados();
                } catch (err) {
                    alert(err.message);
                }
            });

            article.querySelector(".btn-editar-post").addEventListener("click", async () => {
                const novoTexto = prompt("Editar texto do post:", post.texto);
                if (novoTexto === null) return;
                const novaImg = prompt("Editar URL da imagem:", post.img || "");
                try {
                    await editarPost(novoTexto, novaImg || "", post.id);
                    await carregarDados();
                } catch (err) {
                    alert(err.message);
                }
            });
        }

        // Renderizando Comentários do Post
        const listaComEl = article.querySelector(".lista-comentarios");
        for (let com of post.comentarios) {
            const autorCom = mapaUsuarios[com.usuario] || { nome: "Usuário #" + com.usuario, img: "" };
            const souDonoCom = usuarioLogado && usuarioLogado.id === com.usuario;

            const divCom = document.createElement("div");
            divCom.className = "comentario-item";
            divCom.innerHTML = `
                <img src="${autorCom.img || 'https://via.placeholder.com/24'}" width="24" height="24">
                <strong>${autorCom.nome}:</strong> <span>${com.texto}</span>
                ${com.editado ? "<small>(editado)</small>" : ""}
                ${souDonoCom ? `
                    <button class="btn-edit-com">Editar</button>
                    <button class="btn-del-com">Excluir</button>
                ` : ""}
            `;

            if (souDonoCom) {
                divCom.querySelector(".btn-del-com").addEventListener("click", async () => {
                    try {
                        await removerComentario(com.id);
                        await carregarDados();
                    } catch (err) {
                        alert(err.message);
                    }
                });

                divCom.querySelector(".btn-edit-com").addEventListener("click", async () => {
                    const novoCom = prompt("Editar comentário:", com.texto);
                    if (!novoCom) return;
                    try {
                        await editarComentario(novoCom, com.id);
                        await carregarDados();
                    } catch (err) {
                        alert(err.message);
                    }
                });
            }

            listaComEl.appendChild(divCom);
        }

        // Enviar Novo Comentário
        const formCom = article.querySelector(".form-comentario");
        if (formCom) {
            formCom.addEventListener("submit", async (e) => {
                e.preventDefault();
                const input = formCom.querySelector("input");
                try {
                    await adicionarComentario(input.value, post.id);
                    await carregarDados();
                } catch (err) {
                    alert(err.message);
                }
            });
        }

        container.appendChild(article);
    }
}

iniciar();