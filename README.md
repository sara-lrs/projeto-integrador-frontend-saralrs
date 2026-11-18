# projeto-integrador-frontend-saralrs
 Este projeto é uma plataforma web voltada para amantes de cinema, reunindo informações sobre lançamentos, visões críticas e coberturas de grandes premiações. O objetivo principal é oferecer uma interface intuitiva e dinâmica onde usuários possam acompanhar as novidades do cinema mundial, ler análises detalhadas e conferir os filmes mais aclamados pela crítica.


O projeto está bem estruturado e apresenta bom uso de HTML semântico, com elementos como `<header>`, `<main>`, `<section>`, `<footer>`, além de uma boa organização do formulário com `<fieldset>`, `<legend>` e `<label>`. A tabela também está bem estruturada. Como pequenas melhorias, seria interessante evitar o uso de `<br>` para espaçamento, deixando essa parte para o CSS, além de utilizar `scope="col"` nos cabeçalhos da tabela e transferir o `border` e o `width` para o CSS. No geral, não foram identificados erros graves de HTML, apenas alguns pontos que podem ser aprimorados para deixar o código mais organizado, semântico e acessível. Fora isso, ótimo código.
Avaliado por: Thiago Teotônio - 27/08/2026

- Avaliação
O projeto CineCrítica está bem organizado e cumpre bem a proposta. O JavaScript está em arquivo separado com `defer`, as funções são claras e gostei do uso de `reduce` e `filter` para as estatísticas e de `textContent` para evitar XSS.

- Como melhorias, sugiro mover os estilos inline para um arquivo CSS, usar textos alternativos mais descritivos nas imagens da galeria, validar a nota entre 0 e 10 também no JavaScript e ajustar os comentários que citam `.map()` e `classList`, já que o código usa `forEach` e `style`.
Fora isso, parabéns pelo trabalho!
- Avaliado por: Débora Lima - 18/11/2026
