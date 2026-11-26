// Fonte única de verdade das avaliações registradas na sessão
const avaliacoes = [];

/**
 * Valida os dados de uma avaliação (função pura).
 * Retorna um objeto com { valido, mensagem }.
 */
function validarAvaliacao(dados) {
    const emailLimpo = dados.email.trim();
    const notaNumero = Number(dados.nota);

    if (!emailLimpo || !emailLimpo.includes("@")) {
        return { valido: false, mensagem: "Informe um e-mail válido." };
    }

    if (!dados.dataAssistido) {
        return { valido: false, mensagem: "Selecione a data em que assistiu ao filme." };
    }

    if (Number.isNaN(notaNumero) || notaNumero < 0 || notaNumero > 10) {
        return { valido: false, mensagem: "A nota deve ser um número entre 0 e 10." };
    }

    if (!dados.genero) {
        return { valido: false, mensagem: "Selecione um gênero de filme." };
    }

    return { valido: true, mensagem: "" };
}

/**
 * Calcula estatísticas das avaliações usando filter e reduce (função pura).
 */
function calcularEstatisticas(lista) {
    const total = lista.length;

    if (total === 0) {
        return {
            total: 0,
            media: "0.0",
            recomendados: 0
        };
    }

    const somaNotas = lista.reduce((acumulador, item) => acumulador + item.nota, 0);
    const recomendados = lista.filter((item) => item.recomendaria === "sim").length;

    return {
        total,
        media: (somaNotas / total).toFixed(1),
        recomendados
    };
}

/**
 * Atualiza o resumo estatístico e a lista na tela usando textContent.
 */
function renderizarAvaliacoes(lista, elementos) {
    const stats = calcularEstatisticas(lista);

    if (stats.total === 0) {
        elementos.resumo.textContent = "Nenhuma avaliação enviada nesta sessão ainda.";
    } else {
        elementos.resumo.textContent =
            `Total: ${stats.total} | Média das notas: ${stats.media} / 10 | Recomendam: ${stats.recomendados}`;
    }

    elementos.lista.textContent = "";

    // Percorre a lista com forEach e cria cada item usando textContent
    lista.forEach((item) => {
        const li = document.createElement("li");
        const recomendacaoTexto = item.recomendaria === "sim" ? "Recomenda" : "Não recomenda";
        li.textContent =
            `${item.email} — Nota: ${item.nota.toFixed(1)}/10 — Gênero: ${item.genero} — ${recomendacaoTexto} (${item.dataAssistido})`;
        elementos.lista.appendChild(li);
    });
}

function inicializarApp() {
    const form = document.getElementById("form-avaliacao");
    const feedback = document.getElementById("mensagem-feedback");
    const resumo = document.getElementById("estatisticas-avaliacoes");
    const lista = document.getElementById("lista-avaliacoes");

    if (!form || !feedback || !resumo || !lista) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("email-usuario");
        const dataInput = document.getElementById("data-assistido");
        const notaInput = document.getElementById("nota");
        const generoSelect = document.getElementById("genero");
        const radioSelecionado = form.querySelector('input[name="recomendaria"]:checked');

        const dadosBrutos = {
            email: emailInput ? emailInput.value : "",
            dataAssistido: dataInput ? dataInput.value : "",
            nota: notaInput ? notaInput.value : "",
            genero: generoSelect ? generoSelect.value : "",
            recomendaria: radioSelecionado ? radioSelecionado.value : "sim"
        };

        const validacao = validarAvaliacao(dadosBrutos);

        if (!validacao.valido) {
            feedback.textContent = validacao.mensagem;
            return;
        }

        avaliacoes.push({
            email: dadosBrutos.email.trim(),
            dataAssistido: dadosBrutos.dataAssistido,
            nota: Number(dadosBrutos.nota),
            genero: dadosBrutos.genero,
            recomendaria: dadosBrutos.recomendaria
        });

        feedback.textContent = "Avaliação registrada com sucesso!";
        renderizarAvaliacoes(avaliacoes, { resumo, lista });
        form.reset();
    });

    renderizarAvaliacoes(avaliacoes, { resumo, lista });
}

inicializarApp();