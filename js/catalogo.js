const classificarFilme = (nota) => {
    if (nota >= 9.0) return "Obra-Prima";
    if (nota >= 7.5) return "Muito Bom";
    if (nota >= 5.0) return "Regular";
    return "Fraco";
};

const abrirPerfilPelaGaleria = (poster) => {
    const painel = document.getElementById("perfil-filme");
    const capa = document.getElementById("perfil-capa");
    const tituloEl = document.getElementById("perfil-titulo");
    const metaEl = document.getElementById("perfil-meta");
    const sinopseEl = document.getElementById("perfil-sinopse");

    if (!painel || !capa || !tituloEl || !metaEl || !sinopseEl) return;

    const titulo = poster.dataset.titulo || poster.alt || "Filme sem título";
    const nota = Number(poster.dataset.nota || 0);
    const categoria = poster.dataset.categoria || "Geral";
    const imagemCapa = poster.getAttribute("src") || "assets/images/atvd.pj.jpg";
    const sinopse = poster.dataset.sinopse || `Sinopse indisponível para "${titulo}".`;

    capa.src = imagemCapa;
    capa.alt = `Capa do filme ${titulo}`;
    tituloEl.textContent = titulo;
    metaEl.textContent = `Gênero: ${categoria} • Nota: ${nota.toFixed(1)} / 10 • Classificação: ${classificarFilme(nota)}`;
    sinopseEl.textContent = sinopse;

    painel.style.display = "block";
    painel.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

const atualizarEstiloEstrela = (botao, favoritado) => {
    botao.dataset.favoritado = favoritado ? "true" : "false";
    botao.textContent = favoritado ? "★" : "☆";
    botao.style.color = favoritado ? "#ffd700" : "rgba(255, 255, 255, 0.75)";
    botao.style.background = favoritado ? "rgba(0, 0, 0, 0.75)" : "rgba(0, 0, 0, 0.35)";
    botao.style.borderColor = favoritado ? "#ffd700" : "rgba(255, 255, 255, 0.6)";
};

const renderizarFavoritos = () => {
    const galeria = document.getElementById("galeria-filmes");
    const listaFavoritos = document.getElementById("lista-favoritos");
    const mensagemVazia = document.getElementById("mensagem-sem-favoritos");

    if (!galeria || !listaFavoritos) return;

    listaFavoritos.innerHTML = "";
    const cards = galeria.querySelectorAll(".card-filme");
    let quantidadeFavoritos = 0;

    cards.forEach((card) => {
        const botao = card.querySelector(".btn-favorito");
        const poster = card.querySelector("img");
        if (!botao || !poster || botao.dataset.favoritado !== "true") return;

        quantidadeFavoritos += 1;

        const itemFavorito = document.createElement("div");
        itemFavorito.style.width = "120px";
        itemFavorito.style.textAlign = "center";

        const miniatura = document.createElement("img");
        miniatura.src = poster.getAttribute("src");
        miniatura.alt = poster.alt;
        miniatura.width = 120;
        miniatura.height = 180;
        miniatura.style.objectFit = "cover";
        miniatura.style.borderRadius = "6px";
        miniatura.style.border = "2px solid #ffd700";
        miniatura.style.cursor = "pointer";
        miniatura.addEventListener("click", () => abrirPerfilPelaGaleria(poster));

        const legenda = document.createElement("p");
        legenda.textContent = poster.dataset.titulo || poster.alt;
        legenda.style.margin = "6px 0 0 0";
        legenda.style.fontSize = "12px";
        legenda.style.color = "#ffffff";

        itemFavorito.appendChild(miniatura);
        itemFavorito.appendChild(legenda);
        listaFavoritos.appendChild(itemFavorito);
    });

    if (mensagemVazia) {
        mensagemVazia.style.display = quantidadeFavoritos === 0 ? "block" : "none";
    }
};

const configurarCliquesGaleria = () => {
    const galeria = document.getElementById("galeria-filmes");
    const botaoFechar = document.getElementById("fechar-perfil");
    const painel = document.getElementById("perfil-filme");

    if (botaoFechar && painel) {
        botaoFechar.addEventListener("click", () => {
            painel.style.display = "none";
        });
    }

    if (!galeria) return;

    galeria.querySelectorAll(".btn-favorito").forEach((botao) => {
        atualizarEstiloEstrela(botao, botao.dataset.favoritado === "true");
    });

    galeria.addEventListener("click", (evento) => {
        const botaoEstrela = evento.target.closest(".btn-favorito");
        if (botaoEstrela) {
            evento.stopPropagation();
            const estaFavoritado = botaoEstrela.dataset.favoritado === "true";
            atualizarEstiloEstrela(botaoEstrela, !estaFavoritado);
            renderizarFavoritos();
            return;
        }

        const poster = evento.target.closest("img");
        if (!poster) return;
        abrirPerfilPelaGaleria(poster);
    });

    renderizarFavoritos();
};

const atualizarInterfaceComProcessamento = () => {
    const linhas = document.querySelectorAll("#tabela-filmes tr");
    const painelEstatisticas = document.getElementById("conteudo-estatisticas");

    let totalFilmes = 0;
    let somaNotas = 0;
    let destaque = null;

    linhas.forEach((linha) => {
        const titulo = linha.dataset.titulo;
        const nota = Number(linha.dataset.nota);
        const alvoClassificacao = linha.querySelector(".classificacao-alvo");

        if (!Number.isNaN(nota)) {
            totalFilmes += 1;
            somaNotas += nota;

            if (!destaque || nota > destaque.nota) {
                destaque = { titulo, nota };
            }

            if (alvoClassificacao) {
                const classificacao = classificarFilme(nota);
                alvoClassificacao.textContent = classificacao;
                alvoClassificacao.style.color = nota >= 9.0 ? "#46d369" : "#ffffff";
            }
        }
    });

    if (painelEstatisticas) {
        const media = totalFilmes > 0 ? (somaNotas / totalFilmes).toFixed(1) : "0.0";
        const textoDestaque = destaque ? `${destaque.titulo} (${destaque.nota.toFixed(1)})` : "Nenhum";
        painelEstatisticas.innerHTML = `
            <strong>Total de filmes avaliados:</strong> ${totalFilmes} &nbsp;|&nbsp;
            <strong>Média geral:</strong> ${media} / 10 &nbsp;|&nbsp;
            <strong>Maior nota:</strong> ${textoDestaque}
        `;
    }
};

const configurarFormularioDinamico = () => {
    const formulario = document.getElementById("form-avaliacao");
    const tbody = document.getElementById("tabela-filmes");

    if (!formulario || !tbody) return;

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const tituloInput = document.getElementById("titulo-filme").value.trim();
        const notaInput = Number(document.getElementById("nota").value);
        const generoInput = document.getElementById("genero").value;

        if (!tituloInput || Number.isNaN(notaInput) || !generoInput) return;

        const novaLinha = document.createElement("tr");
        novaLinha.dataset.titulo = tituloInput;
        novaLinha.dataset.nota = notaInput.toString();
        novaLinha.dataset.categoria = generoInput;

        const colunaTitulo = document.createElement("td");
        colunaTitulo.textContent = tituloInput;

        const colunaNota = document.createElement("td");
        colunaNota.innerHTML = `<b>${notaInput.toFixed(1)} / 10</b>`;

        const colunaClassificacao = document.createElement("td");
        colunaClassificacao.className = "classificacao-alvo";
        colunaClassificacao.textContent = classificarFilme(notaInput);
        colunaClassificacao.style.color = notaInput >= 9.0 ? "#46d369" : "#ffffff";

        novaLinha.appendChild(colunaTitulo);
        novaLinha.appendChild(colunaNota);
        novaLinha.appendChild(colunaClassificacao);
        tbody.appendChild(novaLinha);

        formulario.reset();
        atualizarInterfaceComProcessamento();
        alert(`Avaliação para "${tituloInput}" adicionada e processada!`);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    atualizarInterfaceComProcessamento();
    configurarCliquesGaleria();
    configurarFormularioDinamico();
});