
import { verificarSessao, logout } from "./autenticacao.js";
import { carregarFeed, curtirPost, usuarioCurtiu, comentarPost, ehDono, excluirComentario, atualizarComentario, publicarPost, atualizarPost, excluirPost } from "./posts.js";

let usuarioLogado = null;

async function mostrarFeed() {
    const { posts, todosUsuarios } = await carregarFeed();

    const feed = document.querySelector("#feed");
    feed.innerHTML = "";

    for (const post of posts) {
        const autor = todosUsuarios[post.usuario];

        let nomeAutor = "Usuário desconhecido";
        let fotoAutor = "";

        if (autor) {
            nomeAutor = autor.nome;

            if (autor.img) {
                fotoAutor = autor.img;
            }
        }

        const elementoPost = document.createElement("article");
        elementoPost.classList.add("post");

        let htmlImagem = "";

        if (post.img) {
            htmlImagem = `
        <img src="${post.img}" alt="Imagem da publicação" class="imagem-post">
    `;
        }

        let htmlFoto = "";

        if (fotoAutor !== "") {
            htmlFoto = `
                <img src="${fotoAutor}"
                     alt="Foto de ${nomeAutor}"
                     class="foto-perfil">
            `;
        } else {
            htmlFoto = `<div class="foto-perfil">👤</div>`;
        }
        let htmlComentarios = "";
        const quantidadeComentarios = post.comentarios.length;

        if (post.comentarios) {
            for (const comentario of post.comentarios) {
                const autorComentario = todosUsuarios[comentario.usuario];

                let nomeComentario = "Usuário desconhecido";
                let fotoComentario = "";

                let htmlExcluir = "";
                let htmlEditar = "";

                if (usuarioLogado && ehDono(comentario, usuarioLogado)) {
                    htmlExcluir = `
                <button class="botao-excluir-comentario">
                    Excluir
                </button>
                `;

                    htmlEditar = `
                <button class="botao-editar-comentario">
                Editar
                </button>
                 `;

                }
                if (autorComentario) {
                    nomeComentario = autorComentario.nome;
                    if (autorComentario.img) {
                        fotoComentario = autorComentario.img;
                    }
                }

                let htmlFotoComentario = "";

                if (fotoComentario !== "") {
                    htmlFotoComentario = `
                <img src="${fotoComentario}" class="foto-perfil" alt="Foto de ${nomeComentario}">
                `;
                } else {
                    htmlFotoComentario = `<div class="foto-perfil">👤</div>`;
                }

                htmlComentarios += `
                <div class="comentario">
                ${htmlFotoComentario}
                <div>
                <strong>${nomeComentario}</strong>
                <p>${comentario.texto}</p>
                ${htmlExcluir}
                ${htmlEditar}
                </div>
                </div>
                `;
            }
        }

        let htmlAcoes = "";
        const quantidadeLikes = post.likes.length;

        if (usuarioLogado) {
            const jaCurtiu = await usuarioCurtiu(post, usuarioLogado);

            if (jaCurtiu) {
                htmlAcoes = `
            <button disabled>Você curtiu</button>
            <span>${quantidadeLikes} curtidas</span>
        `;
            } else {
                htmlAcoes = `
            <button class="botao-curtir">Curtir</button>
            <span>${quantidadeLikes} curtidas</span>
        `;
            }

        } else {
            htmlAcoes = `
        <a href="./login.html">Entre para curtir</a>
        <span>${quantidadeLikes} curtidas</span>
    `;
        }

        let htmlEditarPost = "";
        let htmlExcluirPost = "";

        if (usuarioLogado && ehDono(post, usuarioLogado)) {
            htmlEditarPost = `
        <button class="botao-editar-post">
            Editar publicação
        </button>
    `;
            htmlExcluirPost = `
        <button class="botao-excluir-post">
            Excluir publicação
        </button>
    `;
        }

        let htmlFormulario = "";

        if (usuarioLogado) {
            htmlFormulario = `
        <form class="form-comentario">
            <input
                type="text"
                class="texto-comentario"
                placeholder="Escreva um comentário..."
                required
            >
            <button type="submit">Comentar</button>
        </form>
    `;
        } else {
            htmlFormulario = `
        <a href="./login.html">Entre para comentar</a>
    `;
        }

        elementoPost.innerHTML = `
            <div class="autor-post">
                ${htmlFoto}
                <h3>${nomeAutor}</h3>
            </div>

            <p>${post.texto}</p>

            ${htmlImagem}

            <div class="acoes-post">
                ${htmlAcoes}
                ${htmlEditarPost}
                ${htmlExcluirPost}
                <p>${quantidadeComentarios} comentários</p>
            </div>

            <div class="lista-comentarios">
            ${htmlComentarios}
            </div>

            ${htmlFormulario}
        `;

        feed.appendChild(elementoPost);

        const botoesExcluir = elementoPost.querySelectorAll(".botao-excluir-comentario");

        for (let i = 0; i < botoesExcluir.length; i++) {
            botoesExcluir[i].addEventListener("click", async () => {

                const idComentario = post.comentarios[i].id;

                try {
                    await excluirComentario(idComentario);
                    await mostrarFeed();
                } catch (erro) {
                    alert(erro.message);
                }

            });
        }

        const botoesEditar = elementoPost.querySelectorAll(".botao-editar-comentario");

        for (let i = 0; i < botoesEditar.length; i++) {
            botoesEditar[i].addEventListener("click", async () => {

                const comentario = post.comentarios[i];

                const novoTexto = prompt("Digite o novo comentário:", comentario.texto);

                if (novoTexto === null) {
                    return;
                }

                try {
                    await atualizarComentario(novoTexto.trim(), comentario.id);
                    await mostrarFeed();
                } catch (erro) {
                    alert(erro.message);
                }

            });
        }

        const botaoEditarPost = elementoPost.querySelector(".botao-editar-post");

        if (botaoEditarPost) {
            botaoEditarPost.addEventListener("click", async () => {

                const novoTexto = prompt("Edite sua publicação:", post.texto);

                if (novoTexto === null) {
                    return;
                }

                const novaImagem = prompt("URL da nova imagem (deixe vazio para remover):", post.img || "");

                if (novaImagem === null) {
                    return;
                }

                try {
                    await atualizarPost(novoTexto.trim(), novaImagem.trim() || null, post.id);
                    await mostrarFeed();
                } catch (erro) {
                    alert(erro.message);
                }

            });
        }

        const botaoExcluirPost = elementoPost.querySelector(".botao-excluir-post");

        if (botaoExcluirPost) {
            botaoExcluirPost.addEventListener("click", async () => {
                const confirmar = confirm("Tem certeza que deseja excluir esta publicação?");

                if (confirmar) {
                    try {
                        await excluirPost(post.id);
                        await mostrarFeed();
                    } catch (erro) {
                        alert(erro.message);
                    }
                }
            });
        }

        const botaoCurtir = elementoPost.querySelector(".botao-curtir");

        if (botaoCurtir) {
            botaoCurtir.addEventListener("click", async () => {
                try {
                    await curtirPost(post.id);
                    await mostrarFeed();
                } catch (erro) {
                    alert(erro.message);
                }
            });
        }
        const formularioComentario = elementoPost.querySelector(".form-comentario");

        if (formularioComentario) {
            formularioComentario.addEventListener("submit", async (evento) => {
                evento.preventDefault();

                const campoComentario = formularioComentario.querySelector(".texto-comentario");
                const texto = campoComentario.value.trim();

                try {
                    await comentarPost(post.id, texto);
                    await mostrarFeed();
                } catch (erro) {
                    alert(erro.message);
                }
            });
        }
    };
}

async function iniciar() {
    usuarioLogado = await verificarSessao();

    const areaUsuario = document.querySelector("#area-usuario");

    if (usuarioLogado) {
        areaUsuario.innerHTML = `
            <span>Olá, ${usuarioLogado.nome}!</span>
            <button type="button" id="botao-logout">Sair</button>
        `;

        const areaNovoPost = document.querySelector("#area-novo-post");

        areaNovoPost.innerHTML = `
    <form id="form-novo-post">
        <textarea
            id="texto-novo-post"
            placeholder="O que você está pensando?"
            required
        ></textarea>

        <input
            type="url"
            id="imagem-novo-post"
            placeholder="URL da imagem (opcional)"
        >

        <button type="submit">Publicar</button>
    </form>
`;
        const formularioPost = document.querySelector("#form-novo-post");

        formularioPost.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const texto = document.querySelector("#texto-novo-post").value.trim();
            console.log("Texto digitado:", texto)
            const img = document.querySelector("#imagem-novo-post").value.trim();

            try {
                await publicarPost(texto, img || null);

                formularioPost.reset();

                await mostrarFeed();

            } catch (erro) {
                alert(erro.message);
            }
        });

        document.querySelector("#botao-logout").addEventListener("click", () => {
            logout();
            window.location.href = "./login.html";
        });

    } else {
        areaUsuario.innerHTML = `
            <a href="./login.html">Entrar</a>
        `;
    }

    try {
        await mostrarFeed();
    } catch (erro) {
        document.querySelector("#feed").textContent =
            "Não foi possível carregar as publicações.";

        mensagem.textContent = erro.message;
    }
}

iniciar();