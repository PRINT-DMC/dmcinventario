let inventory = [];
let productToDelete = null;

function generateUniqueId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Letras y números
    let id = 'ID-';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }
    return id;
}

function showAddProductForm() {
    document.getElementById('add-form-section').classList.remove('hidden');
    document.getElementById('update-form-section').classList.add('hidden');
    document.getElementById('inventory-section').classList.add('hidden');
    document.getElementById('add-product-form').reset();
    document.getElementById('add-form-title').textContent = 'Agregar Producto';
    document.getElementById('product-id').value = '';
}

function showUpdateProductForm() {
    document.getElementById('add-form-section').classList.add('hidden');
    document.getElementById('update-form-section').classList.remove('hidden');
    document.getElementById('inventory-section').classList.add('hidden');
}

function hideForm() {
    document.getElementById('add-form-section').classList.add('hidden');
    document.getElementById('update-form-section').classList.add('hidden');
    loadInventory();
}

function hideUpdateForm() {
    document.getElementById('update-form-section').classList.add('hidden');
    loadInventory();
}

function loadInventory() {
    document.getElementById('add-form-section').classList.add('hidden');
    document.getElementById('update-form-section').classList.add('hidden');
    document.getElementById('inventory-section').classList.remove('hidden');
    updateInventoryTable();
}

function handleAddProduct() {
    const id = document.getElementById('product-id').value || generateUniqueId(); // Usa un nuevo ID si no se proporciona uno
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const category = document.getElementById('category').value;

    if (name && !isNaN(price) && !isNaN(quantity) && category) {
        if (inventory.some(item => item.id === id)) {
            // Actualiza el producto existente
            const index = inventory.findIndex(item => item.id === id);
            if (index !== -1) {
                inventory[index] = { id, name, price, quantity, category };
            }
        } else {
            // Añade un nuevo producto
            const newProduct = { id, name, price, quantity, category };
            inventory.push(newProduct);
        }
        hideForm();
    }
}

function handleUpdateProduct() {
    const id = document.getElementById('update-id').value;
    const name = document.getElementById('update-name').value;
    const price = parseFloat(document.getElementById('update-price').value);
    const quantity = parseInt(document.getElementById('update-quantity').value, 10);
    const category = document.getElementById('update-category').value;

    if (name && !isNaN(price) && !isNaN(quantity) && category) {
        const index = inventory.findIndex(item => item.id === id);
        if (index !== -1) {
            inventory[index] = { id, name, price, quantity, category };
        }
        hideUpdateForm();
    }
}

function updateInventoryTable(filteredInventory = inventory) {
    const tableBody = document.querySelector('#inventory-table tbody');
    tableBody.innerHTML = '';

    filteredInventory.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = 
            `<td>${product.id}</td> <!-- Muestra el ID del producto -->
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>${product.category}</td>
            <td><button onclick="editProduct('${product.id}')">Actualizar</button></td>
            <td><button onclick="deleteProduct('${product.id}')">Eliminar</button></td>`;
        tableBody.appendChild(row);
    });
}

function editProduct(id) {
    const product = inventory.find(item => item.id === id);
    if (product) {
        document.getElementById('update-name').value = product.name;
        document.getElementById('update-price').value = product.price;
        document.getElementById('update-quantity').value = product.quantity;
        document.getElementById('update-category').value = product.category;
        document.getElementById('update-id').value = product.id;
        showUpdateProductForm();
    }
}

function deleteProduct(id) {
    showConfirmationModal(id);
}

function showConfirmationModal(id) {
    productToDelete = id;
    document.getElementById('confirmation-modal').classList.remove('hidden');
}

function hideConfirmationModal() {
    document.getElementById('confirmation-modal').classList.add('hidden');
}

function confirmDelete() {
    if (productToDelete) {
        inventory = inventory.filter(item => item.id !== productToDelete);
        loadInventory();
        productToDelete = null;
    }
    hideConfirmationModal();
}

document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
document.getElementById('cancel-delete').addEventListener('click', hideConfirmationModal);

function searchInventory() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredInventory = inventory.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm) ||
        product.id.toLowerCase().includes(searchTerm) // Añadido para buscar por ID
    );
    updateInventoryTable(filteredInventory);
}