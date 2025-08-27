const ptBRLong = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
const toKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,"0");
  const d = String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`; // YYYY-MM-DD
};

let dataAtual = new Date();            // começa no dia de hoje
let compromissos = JSON.parse(localStorage.getItem("compromissos")) || {};

const dataEl = document.getElementById("data");
const horariosDiv = document.getElementById("horarios");
const btnAnterior = document.getElementById("anterior");
const btnProximo = document.getElementById("proximo");
const btnHoje = document.getElementById("hoje");
const btnAgendar = document.getElementById("agendarBtn");
const btnLimpar = document.getElementById("limpar-dia");

function renderDia() {
    dataEl.textContent = dataAtual.toLocaleDateString("pt-BR", ptBRLong);
    horariosDiv.innerHTML = "";
    const chave = toKey(dataAtual);
    for(let h = 9; h <= 19; h++){
        const hora = String(h).padStart(2,"0") + ":00";

        const linha = document.createElement("div");
        linha.className = "horario";

        const labelHora = document.createElement("div");
        labelHora.className = "hora";
        labelHora.textContent = hora;

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Livre";
        input.setAttribute("data-hora", hora);
        input.value = compromissos[chave]?.[hora] || "";

        linha.appendChild(labelHora);
        linha.appendChild(input);
        horariosDiv.appendChild(linha);
    }
}

btnAnterior.addEventListener("click", () => {
    dataAtual.setDate(dataAtual.getDate() - 1);
    renderDia();
});

btnProximo.addEventListener("click", () => {
    dataAtual.setDate(dataAtual.getDate() + 1);
    renderDia();
});

btnHoje.addEventListener("click", () => {
    const hoje = new Date();
    dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    renderDia();
});

btnAgendar.addEventListener("click", () => {
    const chave = toKey(dataAtual);
    const dados = {};

    document.querySelectorAll("#horarios input").forEach(input => {
        const hora = input.getAttribute("data-hora");
        const val = input.value.trim();
        if(val !== "") dados[hora] = val;
    });

    if(Object.keys(dados).length > 0){
        compromissos[chave] = dados;
    } else {
        delete compromissos[chave];
    }

    localStorage.setItem("compromissos", JSON.stringify(compromissos));
    btnAgendar.textContent = "Agendado!";
    setTimeout(() => btnAgendar.textContent = "Agendar", 2000);
});

btnLimpar.addEventListener("click", () => {
    const chave = toKey(dataAtual);
    if(confirm("Tem certeza que deseja apagar todos os horários deste dia?")){
        delete compromissos[chave];
        localStorage.setItem("compromissos", JSON.stringify(compromissos));
        renderDia();
    }
});

renderDia();





btnAgendar.addEventListener("click", () => {
    const chave = toKey(dataAtual);
    const dados = {};
    const nome = document.getElementById("nomePessoa").value.trim() || "Alguém";

    document.querySelectorAll("#horarios input").forEach(input => {
        const hora = input.getAttribute("data-hora");
        const val = input.value.trim();
        if(val !== "") dados[hora] = val;
    });

    if(Object.keys(dados).length > 0){
        compromissos[chave] = dados;
    } else {
        delete compromissos[chave];
    }

    localStorage.setItem("compromissos", JSON.stringify(compromissos));

    // cria mensagem para o WhatsApp
    const numero = "551399999999"; // seu número no formato internacional
    let mensagem = `Novo compromisso agendado por ${nome}:\n`;
    for(const [hora, desc] of Object.entries(dados)){
        mensagem += `🕒 ${hora} → ${desc}\n`;
    }

    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;
    
    // abre WhatsApp Web ou App
    window.open(url, "_blank");

    btnAgendar.textContent = "Agendado!";
    setTimeout(() => btnAgendar.textContent = "Agendar", 2000);
});

