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

    galeria.addEventListener("click", (evento) => {
        const poster = evento.target.closest("img");
        if (!poster) return;
        abrirPerfilPelaGaleria(poster);
    });
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