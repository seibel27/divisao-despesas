
let nomes = [];
let itens = [];

function mostrarEtapa(id) {
  document.querySelectorAll('section').forEach(sec => {
    sec.classList.remove('active');
    sec.style.display = 'none';
  });
  const target = document.getElementById(id);
  target.classList.add('active');
  target.style.display = 'block';
}

function atualizarNomes() {
  const num = parseInt(document.getElementById('numPessoas').value);
  const container = document.getElementById('nomesContainer');
  container.innerHTML = '';
  nomes = [];
  for (let i = 0; i < num; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Pessoa ${i + 1}`;
    input.id = `nome-${i}`;
    container.appendChild(input);
  }
}

function avancarParaItens() {
  const container = document.getElementById('nomesContainer');
  nomes = [];
  for (let i = 0; i < container.children.length; i++) {
    const nome = container.children[i].value.trim();
    nomes.push(nome || `Pessoa ${i + 1}`);
  }
  atualizarConsumidores();
  atualizarSubtotais();
  mostrarEtapa('itens');
}

function atualizarConsumidores() {
  const container = document.getElementById('consumidoresContainer');
  container.innerHTML = '<strong>Quem consumiu?</strong><br>';
  nomes.forEach((nome, index) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = index;
    label.appendChild(checkbox);
    label.append(` ${nome}`);
    container.appendChild(label);
    container.appendChild(document.createElement('br'));
  });
}

function adicionarItem() {
  const nome = document.getElementById('itemNome').value;
  const valor = parseFloat(document.getElementById('itemValor').value);
  const checkboxes = document.querySelectorAll('#consumidoresContainer input[type="checkbox"]');
  const consumidores = [];
  checkboxes.forEach(cb => {
    if (cb.checked) consumidores.push(parseInt(cb.value));
  });
  if (!nome || isNaN(valor) || consumidores.length === 0) {
    alert('Preencha o nome, valor e selecione pelo menos um consumidor.');
    return;
  }
  itens.push({ nome, valor, consumidores });
  atualizarListaItens();
  document.getElementById('itemNome').value = '';
  document.getElementById('itemValor').value = '';
  checkboxes.forEach(cb => cb.checked = false);
  atualizarSubtotais();
}

function atualizarListaItens() {
  const lista = document.getElementById('listaItens');
  lista.innerHTML = '';
  itens.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.nome} - R$${item.valor.toFixed(2)} - ${item.consumidores.map(i => nomes[i]).join(', ')} <button onclick="removerItem(${index})" class="remove-btn">x</button>`;
    lista.appendChild(li);
  });
}

function atualizarSubtotais() {
  let subtotais = Array(nomes.length).fill(0);
  let totalGrupo = 0;
  itens.forEach(item => {
    const parte = item.valor / item.consumidores.length;
    totalGrupo += item.valor;
    item.consumidores.forEach(i => {
      subtotais[i] += parte;
    });
  });
  const lista = document.getElementById('subtotaisLista');
  lista.innerHTML = '';
  subtotais.forEach((valor, i) => {
    const li = document.createElement('li');
    li.textContent = `${nomes[i]}: R$${valor.toFixed(2)}`;
    lista.appendChild(li);
  });
  document.getElementById('totalGrupo').textContent = totalGrupo.toFixed(2);
}

function avancarParaTaxa() {
  const container = document.getElementById('taxaContainer');
  container.innerHTML = '';
  nomes.forEach((nome, index) => {
    container.innerHTML += `<p><strong>${nome}</strong><br>
    Deseja pagar taxa de serviço? <input type="checkbox" id="pagaTaxa-${index}" checked>
    Taxa (%): <input type="number" id="valorTaxa-${index}" value="10" step="0.1"></p>`;
  });
  mostrarEtapa('taxas');
}

function calcularTotais() {
  let totais = Array(nomes.length).fill(0);
  itens.forEach(item => {
    const parte = item.valor / item.consumidores.length;
    item.consumidores.forEach(i => {
      totais[i] += parte;
    });
  });
  totais = totais.map((valor, i) => {
    const pagaTaxa = document.getElementById(`pagaTaxa-${i}`).checked;
    const taxa = parseFloat(document.getElementById(`valorTaxa-${i}`).value);
    if (pagaTaxa && !isNaN(taxa)) {
      return valor + (valor * taxa / 100);
    }
    return valor;
  });
  document.getElementById('totalFinal').textContent = totais.reduce((a, b) => a + b, 0).toFixed(2);
  const lista = document.getElementById('totaisLista');
  lista.innerHTML = '';
  totais.forEach((valor, i) => {
    const li = document.createElement('li');
    li.textContent = `${nomes[i]} deve pagar: R$${valor.toFixed(2)}`;
    lista.appendChild(li);
  });
  mostrarEtapa('resultado');
}

function removerItem(index) {
  itens.splice(index, 1);
  atualizarListaItens();
  atualizarSubtotais();
}

function recomecarApp() {
  nomes = [];
  itens = [];
  document.getElementById('numPessoas').value = 2;
  document.getElementById('nomesContainer').innerHTML = '';
  document.getElementById('listaItens').innerHTML = '';
  document.getElementById('subtotaisLista').innerHTML = '';
  document.getElementById('totalGrupo').textContent = '0.00';
  document.getElementById('taxaContainer').innerHTML = '';
  document.getElementById('totaisLista').innerHTML = '';
  document.getElementById('totalFinal').textContent = '0.00';
  atualizarNomes();
  mostrarEtapa('setup');
}

window.onload = () => atualizarNomes();
