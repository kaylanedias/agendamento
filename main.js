// Aguarda o DOM estar completamente carregado antes de executar o script
document.addEventListener("DOMContentLoaded", function () {
    // 1. Pega o botão de login pelo ID
    const loginButton = document.getElementById("btn-login");

    // 2. "ouvinte de evento" de clique no botão
    if (loginButton) {
        loginButton.addEventListener("click", function (event) {
            validarLogin(event);
        });
    }
});

// 3. Usuário pré-definido
const usuarioValido = "admin";
const senhaValida = "12345";

// 4. Validação do login
function validarLogin(event) {
    event.preventDefault();
    const usuarioDigitado = document.getElementById("usuario").value;
    const senhaDigitada = document.getElementById("password").value;
    const mensagemErro = document.getElementById("mensagem-erro");

    if (usuarioDigitado === usuarioValido && senhaDigitada === senhaValida) {
        console.log("Login realizado com sucesso!");
        localStorage.setItem("usuarioLogado", "true");
        window.location.href = "agendamento.html";
    } else {
        console.log("Credenciais incorretas.");
        mensagemErro.textContent = "Usuário ou senha inválidos. Tente novamente.";
        mensagemErro.style.display = "block";
    }
}

// 5. Verifcação de login
function verificarLoginAgendamento() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado || usuarioLogado !== "true") {
        console.warn("Acesso negado. Usuário não logado.");
        window.location.href = "index.html";
    } else {
        console.log("Acesso permitido. Usuário logado.");
    }
}

// 6. Verifica e define a data mínima para o campo data
function definirDataMinima() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataMinima = `${ano}-${mes}-${dia}`;
    const dataInput = document.getElementById("data");
    if (dataInput) {
        dataInput.min = dataMinima;
    }
}

// 7. Preenche o formulário de agendamento com dados existentes para edição.
function preencherFormularioParaEdicao(id) {
    console.log("Modo de Edição ativado para ID:", id);
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const agendamento = agendamentos.find(ag => ag.id === Number(id));

    if (!agendamento) {
        console.error("Agendamento não encontrado para edição.");
        return;
    }

    document.getElementById("edit-id").value = agendamento.id;
    document.getElementById("nome").value = agendamento.paciente;
    document.getElementById("email").value = agendamento.email;
    document.getElementById("telefone").value = agendamento.telefone;
    document.getElementById("idade").value = agendamento.idade;
    document.getElementById("data").value = agendamento.data;
    document.getElementById("hora").value = agendamento.hora;
    document.getElementById("especialidade").value = agendamento.especialidade;
    document.getElementById("medico").value = agendamento.medico;
    document.getElementById("sintomas").value = agendamento.sintomas;

    const valorRadio = agendamento.conveniado.toLowerCase();
    document.getElementById(`conveniado-${valorRadio}`).checked = true;

    document.querySelectorAll('input[name="servico"]').forEach(check => check.checked = false);
    if (agendamento.servicosAdicionais) {
        agendamento.servicosAdicionais.forEach(servico => {
            const check = document.querySelector(`input[value="${servico}"]`);
            if (check) {
                check.checked = true;
            }
        });
    }
    document.getElementById("btnSalvar").textContent = "Atualizar Agendamento";
}

// 8. Exclui um agendamento do localStorage pelo ID.
function excluirAgendamento(id) {
    console.log("Excluindo agendamento com ID:", id);
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const novosAgendamentos = agendamentos.filter(function (ag) {
        return ag.id !== Number(id);
    });
    localStorage.setItem("agendamentos", JSON.stringify(novosAgendamentos));
    carregarAgendamentos();
}

// 9. Função principal para carregar os agendamentos na tela.
function carregarAgendamentos() {
    console.log("Carregando agendamentos do localStorage...");
    const container = document.getElementById("lista-agendamentos-container");
    const msgVazia = document.getElementById("sem-agendamentos");
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

    if (agendamentos.length === 0) {
        msgVazia.style.display = "block";
        container.style.display = "none";
        console.log("Nenhum agendamento encontrado.");
    } else {
        msgVazia.style.display = "none";
        container.style.display = "block";
        container.innerHTML = "";

        agendamentos.forEach(function (ag) {
            const card = document.createElement("div");
            card.className = "agendamento-card";
            card.innerHTML = `
                <h3>
                    ${ag.paciente}
                    <span>${formatarData(ag.data)} às ${ag.hora}</span>
                </h3>
                <p><strong>Médico:</strong> ${ag.medico}</p>
                <p><strong>Especialidade:</strong> ${ag.especialidade}</p>
                <p><strong>E-mail:</strong> ${ag.email || "Não informado"}</p>
                <p><strong>Telefone:</strong> ${ag.telefone || "Não informado"}</p>
                <p><strong>Idade:</strong> ${ag.idade || "Não informada"}</p>
                <p><strong>Convênio:</strong> ${ag.conveniado}</p>
                <p><strong>Sintomas:</strong> ${ag.sintomas || "Nenhum"}</p>
                <div class="card-botoes">
                    <button class="btn-card btn-edit" data-id="${ag.id}">Editar</button>
                    <button class="btn-card btn-delete" data-id="${ag.id}">Excluir</button>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

// 10. Formatação de Data
function formatarData(dataISO) {
    if (!dataISO) return "Data indefinida";
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

// 11. Função de Logout 
function fazerLogout() {
    console.log("Deslogando usuário...");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

// Cadastrar e atualizar o Agendamento
function cadastrarAgendamento(event) {
    event.preventDefault();
    const idEmEdicao = document.getElementById("edit-id").value;

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const idade = document.getElementById("idade").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const especialidade = document.getElementById("especialidade").value;
    const medicoSelect = document.getElementById("medico");
    const medicoTexto = medicoSelect.options[medicoSelect.selectedIndex].text;
    const sintomas = document.getElementById("sintomas").value;
    const conveniadoInput = document.querySelector('input[name="conveniado"]:checked');
    const conveniadoValor = conveniadoInput ? conveniadoInput.value : "nao";
    const conveniadoTexto = (conveniadoValor === "sim") ? "Sim" : "Não";
    const servicosInputs = document.querySelectorAll('input[name="servico"]:checked');
    const servicos = [];
    servicosInputs.forEach(function (input) {
        servicos.push(input.value);
    });

    if (!nome) {
        alert("Por favor, preencha o nome do paciente.");
        return;
    }
    if (idade && (idade < 0 || idade > 120)) {
        alert("A idade deve ser um valor válido entre 0 e 120 anos.");
        return;
    }

    const agendamento = {
        paciente: nome,
        email: email,
        telefone: telefone,
        idade: idade,
        data: data,
        hora: hora,
        especialidade: especialidade,
        medico: medicoTexto,
        conveniado: conveniadoTexto,
        servicosAdicionais: servicos,
        sintomas: sintomas
    };

    const agendamentosSalvos = JSON.parse(localStorage.getItem("agendamentos")) || [];

    if (idEmEdicao) {
        agendamento.id = Number(idEmEdicao);
        const indiceParaAtualizar = agendamentosSalvos.findIndex(ag => ag.id === Number(idEmEdicao));
        if (indiceParaAtualizar !== -1) {
            agendamentosSalvos[indiceParaAtualizar] = agendamento;
            console.log("Agendamento ATUALIZADO:", agendamento);
            alert("Agendamento atualizado com sucesso!");
        } else {
            console.error("Erro ao tentar atualizar: ID não encontrado.");
        }
    } else {
        agendamento.id = Date.now();
        agendamentosSalvos.push(agendamento);
        console.log("Agendamento CRIADO:", agendamento);
        alert("Consulta salva com sucesso!");
    }

    localStorage.setItem("agendamentos", JSON.stringify(agendamentosSalvos));
    document.getElementById("formCadastro").reset();
    document.getElementById("edit-id").value = "";
    document.getElementById("btnSalvar").textContent = "Salvar Agendamento";
    window.location.href = "lista.html";
}

// Roda o código apenas se estivermos na página de agendamento
if (document.body.classList.contains("page-agendamento")) {
    
    // 1. Funções de inicialização
    verificarLoginAgendamento();
    definirDataMinima();

    // 2. Procura por ID na URL
    const urlParams = new URLSearchParams(window.location.search);
    const idParaEditar = urlParams.get('id');

    // 3. Chama a função global
    if (idParaEditar) {
        preencherFormularioParaEdicao(idParaEditar);
    }

    // 4. Adiciona o submit listener
    const form = document.getElementById("formCadastro");
    if (form) {
        form.addEventListener("submit", cadastrarAgendamento);
    }
}

// Roda o código apenas se estivermos na página de lista
if (document.body.classList.contains("page-lista")) {

    // 1. Funções de inicialização
    verificarLoginAgendamento();
    carregarAgendamentos();

    // 2. Evento para delegar cliques (Editar/Excluir)
    const container = document.getElementById("lista-agendamentos-container");
    if (container) {
        container.addEventListener("click", function (event) {
            
            if (event.target.classList.contains("btn-delete")) {
                const idParaExcluir = event.target.dataset.id;
                if (confirm("Tem certeza que deseja excluir este agendamento?")) {
                    excluirAgendamento(idParaExcluir);
                }
            }
            
            else if (event.target.classList.contains("btn-edit")) {
                const idParaEditar = event.target.dataset.id;
                window.location.href = `agendamento.html?id=${idParaEditar}`;
            }
        });
    }
}

// "Ouvinte" para o botão de logout (procura em qualquer página)
const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
    btnLogout.addEventListener("click", fazerLogout);
}