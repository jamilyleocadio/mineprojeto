# Projeto: Consumo de APIs e Manipulação Dinâmica do DOM

Repositório criado para a entrega dos exercícios práticos de JavaScript envolvendo manipulação de dados, assincronismo, tratamento de estados de tela e consumo das APIs ViaCEP e PokéAPI.

## Reflexão (Para Pensar - Parte 4)

**Pergunta:** Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?

**Resposta:**
O uso de `await` sequencial executa as requisições de forma bloqueante: o código aguarda a primeira Promise resolver completamente para só então iniciar a chamada da próxima. Isso faz com que o tempo total de execução seja a soma exata do tempo de resposta de cada requisição individual ($Tempo_1 + Tempo_2 + Tempo_3$). 

Em contrapartida, o `Promise.all` dispara todas as requisições em paralelo. Ele envia todas as solicitações de rede simultaneamente e aguarda em bloco até que todas terminem. Dessa forma, o tempo total de espera é limitado apenas pela requisição mais lenta da lista (o tempo da maior Promise isolada), otimizando drasticamente o desempenho e a performance de rede da aplicação.
