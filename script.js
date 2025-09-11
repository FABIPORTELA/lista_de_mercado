// ===== VARIÁVEIS GLOBAIS =====
let shoppingItems = [];
let shoppingHistory = [];
let editingIndex = -1;

// ===== SISTEMA DE LOGIN =====
const LOGIN_CREDENTIALS = {
    username: 'fabiana',
    password: '12345'
};

function showLogin() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('mainScreen').classList.remove('active');
}

function showMainScreen() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    updateUI();
}

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const alertElement = document.getElementById('loginAlert');

    if (username === LOGIN_CREDENTIALS.username && password === LOGIN_CREDENTIALS.password) {
        alertElement.textContent = 'Login realizado com sucesso!';
        alertElement.className = 'alert success';
        alertElement.style.display = 'block';

        setTimeout(() => {
            showMainScreen();
            document.getElementById('loginForm').reset();
            alertElement.style.display = 'none';
        }, 1000);
    } else {
        alertElement.textContent = 'Usuário ou senha incorretos!';
        alertElement.className = 'alert error';
        alertElement.style.display = 'block';

        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 3000);
    }
}

function handleLogout() {
    showLogin();
    document.getElementById('loginAlert').style.display = 'none';
}

// ===== GERENCIAMENTO DE ITENS =====
function addItem(name, quantity, price) {
    const item = {
        id: Date.now() + Math.random(),
        name: name.trim(),
        quantity: parseInt(quantity) || 1,
        price: parseFloat(price) || 0,
        purchased: false,
        dateAdded: new Date()
    };

    if (editingIndex >= 0) {
        shoppingItems[editingIndex] = item;
        editingIndex = -1;
    } else {
        shoppingItems.push(item);
    }

    updateUI();
}

function removeItem(index) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        shoppingItems.splice(index, 1);
        updateUI();
    }
}

function editItem(index) {
    const item = shoppingItems[index];
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemPrice').value = item.price;
    editingIndex = index;
}

function togglePurchased(index) {
    shoppingItems[index].purchased = !shoppingItems[index].purchased;
    updateUI();
}

function clearList() {
    if (shoppingItems.length === 0) return;

    if (confirm('Deseja finalizar a compra atual e mover para o histórico?')) {
        const purchasedItems = shoppingItems.filter(item => item.purchased);
        const totalSpent = calculatePurchasedTotal();

        if (purchasedItems.length > 0) {
            const historyEntry = {
                id: Date.now(),
                date: new Date(),
                items: purchasedItems,
                total: totalSpent
            };
            shoppingHistory.unshift(historyEntry);
        }

        shoppingItems = [];
        updateUI();
    }
}

// ===== CÁLCULOS =====
function calculateTotal() {
    return shoppingItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculatePurchasedTotal() {
    return shoppingItems.reduce((total, item) => {
        if (item.purchased) {
            return total + (item.price * item.quantity);
        }
        return total;
    }, 0);
}

// ===== INTERFACE DO USUÁRIO =====
function updateUI() {
    renderShoppingList();
    renderHistory();
    updateStats();
    updateClearButton();
}

function renderShoppingList() {
    const listElement = document.getElementById('shoppingList');
    if (!listElement) return;

    if (shoppingItems.length === 0) {
        listElement.innerHTML = '<li class="item"><div class="item-info"><div class="item-name">Nenhum item na lista</div><div class="item-details">Adicione itens usando o formulário acima</div></div></li>';
        return;
    }

    let html = '';
    for (let i = 0; i < shoppingItems.length; i++) {
        const item = shoppingItems[i];
        const itemTotal = item.price * item.quantity;

        html += '<li class="item ' + (item.purchased ? 'purchased' : '') + '">' +
            '<div class="item-info">' +
            '<div class="item-name">' + escapeHtml(item.name) + '</div>' +
            '<div class="item-details">' +
            'Qtd: ' + item.quantity + ' | ' +
            'Preço unit: R$ ' + item.price.toFixed(2) + ' | ' +
            'Total: R$ ' + itemTotal.toFixed(2) +
            '</div>' +
            '</div>' +
            '<div class="item-actions">' +
            '<button class="btn-small btn-toggle" onclick="togglePurchased(' + i + ')">' +
            (item.purchased ? 'Desfazer' : 'Comprar') +
            '</button>' +
            '<button class="btn-small btn-edit" onclick="editItem(' + i + ')">Editar</button>' +
            '<button class="btn-small btn-delete" onclick="removeItem(' + i + ')">Remover</button>' +
            '</div>' +
            '</li>';
    }

    listElement.innerHTML = html;
}

function renderHistory() {
    const historyElement = document.getElementById('historyList');
    if (!historyElement) return;

    if (shoppingHistory.length === 0) {
        historyElement.innerHTML = '<div class="history-item"><div class="history-header">Nenhum histórico</div><div class="history-items">Suas compras finalizadas aparecerão aqui</div></div>';
        return;
    }

    let html = '';
    for (let i = 0; i < shoppingHistory.length; i++) {
        const entry = shoppingHistory[i];
        const date = entry.date.toLocaleDateString('pt-BR');
        const time = entry.date.toLocaleTimeString('pt-BR');

        let itemsHtml = '';
        for (const item of entry.items) {
            itemsHtml += `${escapeHtml(item.name)} (Qtd: ${item.quantity}, Preço unit: R$ ${item.price.toFixed(2)})<br>`;
        }

        html += `
            <div class="history-item">
                <div class="history-header">Compra em ${date} às ${time} - Total: R$ ${entry.total.toFixed(2)}</div>
                <div class="history-items">${itemsHtml}</div>
            </div>
        `;
    }

    historyElement.innerHTML = html;
}

function updateStats() {
    const totalItems = shoppingItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = calculateTotal();

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = `R$ ${totalPrice.toFixed(2)}`;
}

function updateClearButton() {
    const clearBtn = document.getElementById('clearListBtn');
    clearBtn.disabled = shoppingItems.length === 0;
}

// Função para escapar HTML e evitar injeção
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

// ===== EVENTOS =====
document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('logoutBtn').addEventListener('click', handleLogout);

document.getElementById('itemForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('itemName').value;
    const quantity = document.getElementById('itemQuantity').value;
    const price = document.getElementById('itemPrice').value;

    if (!name.trim()) {
        alert('Por favor, insira o nome do item.');
        return;
    }

    addItem(name, quantity, price);

    // Limpar formulário após adicionar
    this.reset();
});

document.getElementById('clearListBtn').addEventListener('click', clearList);

// Inicializa a interface
updateUI();
