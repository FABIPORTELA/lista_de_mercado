}

function calculatePurchasedTotal() {
    return shoppingItems.reduce(function(total, item) {
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
                    'Preço unit: R$ ' + item
