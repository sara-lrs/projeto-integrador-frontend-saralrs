/**
 * Arquivo de Lógica e Manipulação do DOM - CineCrítica
 * Atende aos requisitos das Aulas 09 (Lógica, Condicionais e Laços) 
 * e 11 (Funções Avançadas, Métodos de Array e Manipulação do DOM).
 */

// 1. FUNÇÃO PURA: Classifica a nota utilizando estruturas condicionais (Aula 09)
const classificarFilme = (nota) => {
    if (typeof nota !== 'number' || Number.isNaN(nota)) return "Inválido";
    
    if (nota >= 9.0) return "🌟 Obra-prima";
    if (nota >= 8.0) return "🔥 Altamente Recomendado";
    if (nota >= 6.0) return "👍 Mediano / Bom";
    return "⚠️ Evite";
};

// 2. FUNÇÃO PURA: Coleta dados dos elementos da tabela usando leitura de dataset (Aula 11)
const extrairDadosTabela = () => {
    const linhas = document.querySelectorAll("#tabela-filmes tr");
    const listaFilmes = [];

    linhas.forEach((linha) => {
        const titulo = linha.getAttribute("data-titulo");
        const nota = Number(linha.getAttribute("data-nota"));
        const categoria = linha.getAttribute("data-categoria");

        if (titulo && !Number.isNaN(nota)) {
            listaFilmes.push({ titulo, nota, categoria });
        }
    });

    return listaFilmes;
};

// 3. FUNÇÃO DE EFEITO COLATERAL: Atualiza visualmente o DOM com base nos dados processados
const atualizarInterfaceComProcessamento = () => {
    const filmes = extrairDadosTabela();
    const linhas = document.querySelectorAll("#tabela-filmes tr");

    // Processamento usando .map() e atribuição de classes/textos dinâmicos (Aula 11)
    linhas.forEach((linha, indice) => {
        const filme = filmes[indice];
        if (filme) {
            const alvoClassificacao = linha.querySelector(".classificacao-alvo");
            const classificacaoTexto = classificarFilme(filme.nota);
            
            alvoClassificacao.textContent = classificacaoTexto;
            
            // Estilização dinâmica condicional via classList
            if (filme.nota >= 9.0) {
                alvoClassificacao.style.color = "#46d369"; // Verde Netflix para destaques
            } else {
                alvoClassificacao.style.color = "#ffa00a"; // Amarelo/Laranja
            }
        }
    });

    // Uso de métodos funcionais de Array (.reduce para média e .filter para contagens)
    const totalFilmes = filmes.length;
    const somaNotas = filmes.reduce((acumulador, atual) => acumulador + atual.nota, 0);
    const mediaGeral = totalFilmes > 0 ? (somaNotas / totalFilmes).toFixed(2) : 0;

    const obrasPrimas = filmes.filter(f => f.nota >= 9.0).length;

    // Injeção de painel analítico dinâmico no DOM (Aula 11)
    const painelEstatisticas = document.getElementById("conteudo-estatisticas");
    if (painelEstatisticas) {
        painelEstatisticas.innerHTML = `
            • Total de filmes analisados na base: <b>${totalFilmes}</b><br>
            • Média geral de notas da crítica: <b>${mediaGeral} / 10</b><br>
            • Obras-primas catalogadas (Nota >= 9.0): <b>${obrasPrimas}</b>
        `;
    }
};

// 4. MANIPULAÇÃO DE EVENTOS DE FORMULÁRIO (Adicionando novos elementos dinamicamente ao DOM)
const configurarFormularioDinamico = () => {
    const formulario = document.getElementById("form-avaliacao");

    if (formulario) {
        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault(); // Evita o recarregamento padrão da página

            // Captura de valores dos inputs com validação (Aula 09)
            const tituloInput = document.getElementById("titulo-filme").value.trim();
            const notaInput = Number(document.getElementById("nota").value);
            const generoInput = document.getElementById("genero").value;

            if (!tituloInput || Number.isNaN(notaInput) || !generoInput) {
                alert("Por favor, preencha todos os campos corretamente.");
                return;
            }

            // Criação de um novo elemento tr via createElement (Aula 11)
            const tbody = document.getElementById("tabela-filmes");
            const novaLinha = document.createElement("tr");
            
            // Atribuindo atributos data-* para manter o padrão de leitura
            novaLinha.setAttribute("data-titulo", tituloInput);
            novaLinha.setAttribute("data-nota", notaInput);
            novaLinha.setAttribute("data-categoria", generoInput);

            // Uso estrito de textContent para segurança contra XSS (Aula 11)
            const colunaTitulo = document.createElement("td");
            colunaTitulo.textContent = tituloInput;

            const colunaNota = document.createElement("td");
            const negritoNota = document.createElement("b");
            negritoNota.textContent = `${notaInput.toFixed(1)} / 10`;
            colunaNota.appendChild(negritoNota);

            const colunaClassificacao = document.createElement("td");
            colunaClassificacao.textContent = classificarFilme(notaInput);
            colunaClassificacao.style.color = notaInput >= 9.0 ? "#46d369" : "#ffa00a";

            // Anexando colunas à linha e linha ao corpo da tabela (append)
            novaLinha.appendChild(colunaTitulo);
            novaLinha.appendChild(colunaNota);
            novaLinha.appendChild(colunaClassificacao);
            tbody.appendChild(novaLinha);

            // Reseta o formulário e atualiza as estatísticas globais
            formulario.reset();
            atualizarInterfaceComProcessamento();
            
            alert(`Avaliação para "${tituloInput}" adicionada e processada com sucesso!`);
        });
    }
};

// Inicialização das funções assim que o DOM estiver totalmente carregado
document.addEventListener("DOMContentLoaded", () => {
    atualizarInterfaceComProcessamento();
    configurarFormularioDinamico();
});