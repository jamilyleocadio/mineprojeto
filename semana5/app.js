// ==========================================
// PARTE 1 – Manipulação e Validação de Dados
// ==========================================
const pedidos = [
    { cliente: "Bia", valor: 120.00, status: "pago" },
    { cliente: "Carlos", valor: -50.00, status: "pago" }, // Inválido (valor <= 0)
    { cliente: "", valor: 80.00, status: "pago" },      // Inválido (cliente vazio)
    { cliente: "Ana", valor: 250.50, status: "pendente" },// Inválido (status não é pago)
    { cliente: "João", valor: 75.25, status: "pago" }
];

console.log("=== PARTE 1: RESULTADOS DO EXERCÍCIO GUIADO ===");

// 1. Validar e filtrar (cliente não vazio, valor > 0 e status "pago")
const pedidosValidosEpagos = pedidos.filter(pedido => {
    const clienteValido = typeof pedido.cliente === "string" && pedido.cliente.trim() !== "";
    const valorValido = typeof pedido.valor === "number" && pedido.valor > 0;
    const statusPago = pedido.status === "pago";
    
    return clienteValido && valorValido && statusPago;
});

// 2. Calcular o total faturado usando reduce
const totalFaturado = pedidosValidosEpagos.reduce((acumulador, pedido) => acumulador + pedido.valor, 0);

// 3. Gerar textos no formato "Cliente — R$ Valor" usando toFixed(2)
const textosFormatados = pedidosValidosEpagos.map(pedido => {
    return `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`;
});

console.log("Pedidos Válidos formatados:", textosFormatados);
console.log(`Total faturado: R$ ${totalFaturado.toFixed(2)}`);


// ==========================================
// PARTE 2 – Mini Projeto: Buscador de CEP
// ==========================================
const cepForm = document.getElementById("cep-form");
const cepInput = document.getElementById("cep-input");
const cepBtn = document.getElementById("cep-btn");
const cepStatus = document.getElementById("cep-status");
const cepResult = document.getElementById("cep-result");
const cepHistory = document.getElementById("cep-history");

const historicoCEPs = [];

cepForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recarregar a página
    
    // Limpar resultados anteriores
    cepResult.replaceChildren();
    cepStatus.textContent = "";

    // Validação do CEP: limpar espaços e verificar regex (8 dígitos exatos)
    const cepLimpo = cepInput.value.trim();
    const regexCep = /^\d{8}$/;

    if (!regexCep.test(cepLimpo)) {
        cepStatus.textContent = "Erro: CEP inválido! Deve conter exatamente 8 dígitos numéricos.";
        cepStatus.className = "error";
        return;
    }

    // Estado 1: Carregando
    cepStatus.textContent = "Buscando...";
    cepStatus.className = "loading";
    cepBtn.disabled = true;

    try {
        // Uso de AbortSignal.timeout(5000) para evitar travamentos de rede
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
            signal: AbortSignal.timeout(5000)
        });

        // Verificação de erro HTTP
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Estado 3: Vazio / Não Encontrado pela API
        if (data.erro) {
            cepStatus.textContent = "CEP não encontrado.";
            cepStatus.className = "error";
            return;
        }

        // Estado 4: Sucesso
        cepStatus.textContent = ""; // Limpa o aviso de status
        
        const dl = document.createElement("dl");
        
        const campos = [
            { dt: "Rua", dd: data.logradouro || "Não informada" },
            { dt: "Bairro", dd: data.bairro || "Não informado" },
            { dt: "Cidade", dd: data.localidade },
            { dt: "UF", dd: data.uf }
        ];

        campos.forEach(item => {
            const dt = document.createElement("dt");
            dt.textContent = item.dt;
            const dd = document.createElement("dd");
            dd.textContent = item.dd;
            dl.appendChild(dt);
            dl.appendChild(dd);
        });

        cepResult.appendChild(dl);

        // Bônus: Salvar no histórico
        adicionarAoHistorico({ cep: cepLimpo, cidade: data.localidade, uf: data.uf });

    } catch (error) {
        // Estado 2: Erro (Falha de rede ou timeout)
        cepStatus.textContent = "Falha na conexão ou tempo limite excedido. Tente novamente.";
        cepStatus.className = "error";
        console.error("Erro no fetch do CEP:", error);
    } finally {
        // Reabilitar botão
        cepBtn.disabled = false;
    }
});

function adicionarAoHistorico(info) {
    historicoCEPs.push(info);
    cepHistory.replaceChildren(); // Limpa e reconstrói a lista do histórico de forma segura
    
    historicoCEPs.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `CEP: ${item.cep} — ${item.cidade}/${item.uf}`;
        cepHistory.appendChild(li);
    });
}


// ==========================================
// PARTE 3 – Tarefa de Casa: Desafio Mini Pokédex
// ==========================================
const pokeForm = document.getElementById("poke-form");
const pokeInput = document.getElementById("poke-input");
const pokeBtn = document.getElementById("poke-btn");
const pokeStatus = document.getElementById("poke-status");
const pokeResult = document.getElementById("poke-result");

pokeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    pokeResult.replaceChildren();
    pokeStatus.textContent = "";

    const nomePokemon = pokeInput.value.trim().toLowerCase();

    if (!nomePokemon) {
        pokeStatus.textContent = "Por favor, digite o nome de um Pokémon.";
        pokeStatus.className = "error";
        return;
    }

    // Estado 1: Carregando
    pokeStatus.textContent = "Buscando Pokémon...";
    pokeStatus.className = "loading";
    pokeBtn.disabled = true;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`, {
            signal: AbortSignal.timeout(5000)
        });

        // Estado 2/3: Tratamento de erro HTTP (Ex: 404 - Pokémon não encontrado)
        if (!response.ok) {
            if (response.status === 404) {
                pokeStatus.textContent = "Pokémon não encontrado.";
                pokeStatus.className = "error";
                return;
            }
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Estado 4: Sucesso
        pokeStatus.textContent = "";

        const container = document.createElement("div");

        // Nome
        const h3 = document.createElement("h3");
        h3.textContent = data.name.toUpperCase();
        container.appendChild(h3);

        // Imagem (Sprite)
        const img = document.createElement("img");
        img.src = data.sprites.front_default;
        img.alt = `Imagem de ${data.name}`;
        container.appendChild(img);

        // Tipos
        const pTipos = document.createElement("p");
        const tiposStr = data.types.map(t => t.type.name).join(", ");
        pTipos.textContent = `Tipo(s): ${tiposStr}`;
        container.appendChild(pTipos);

        pokeResult.appendChild(container);

    } catch (error) {
        pokeStatus.textContent = "Falha na conexão ao buscar o Pokémon.";
        pokeStatus.className = "error";
        console.error("Erro no fetch da Pokédex:", error);
    } finally {
        pokeBtn.disabled = false;
    }
});