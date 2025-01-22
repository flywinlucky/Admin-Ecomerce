let categories = [];
let products = []; // Lista de produse
let productCounter = 1; // Counter for unique product IDs
let categoryCounter = 1; // Counter for unique category IDs

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadProducts();
});

function addCategory() {
    const categoryName = document.getElementById('categoryName').value.trim();
    if (categoryName) {
        categories.push(categoryName);
        updateCategories();
        saveCategories(); // Save categories to Local Storage
        document.getElementById('categoryName').value = ''; // Clear input
    } else {
        alert("Introduceți un nume valid pentru categorie.");
    }
}

function updateCategories() {
    const categoriesContainer = document.getElementById('categoriesContainer');
    categoriesContainer.innerHTML = ''; // Clear previous categories

    categories.forEach((category, index) => {
        const categoryButton = document.createElement('button');
        categoryButton.textContent = category;
        categoryButton.className = 'categoryButton';
        categoryButton.onclick = () => selectCategory(category, index);
        categoriesContainer.appendChild(categoryButton);
    });
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories)); // Save categories to Local Storage
}

function loadCategories() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
        updateCategories();
    }
}

function selectCategory(category, index) {
    document.getElementById('selectedCategory').textContent = category;
    document.getElementById('itemFormContainer').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; // Show overlay
    document.getElementById('id').value = `${categoryCounter}-${productCounter}`; // Set unique ID based on category and product counter
    productCounter++; // Increment product counter
    filterProductsByCategory(category); // Filter products by selected category
}

function filterProductsByCategory(category) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = ''; // Clear previous products

    const filteredProducts = products.filter(product => product.category === category);
    filteredProducts.forEach(product => {
        displayProduct(product); // Display each product in the selected category
    });

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p>Nu există produse disponibile în această categorie.</p>';
    }
}

function saveProduct() {
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const images = document.getElementById('images').value.split(',').map(img => img.trim());
    const category = document.getElementById('selectedCategory').textContent;
    const description = document.getElementById('description').value;

    // Get optional fields
    const isTrending = document.getElementById('isTrending').checked;
    const old_price = document.getElementById('old_price').value || null; // Allow empty
    const out_Of_stock = document.getElementById('out_Of_stock').checked;
    const isNew = document.getElementById('isNew').checked;
    const product_sizes = document.getElementById('product_sizes').value.split(',').map(size => size.trim()).filter(size => size !== '');

    const product = {
        id: id,
        name: name,
        price: price,
        images: images,
        category: category,
        description: description,
        isTrending: isTrending,
        old_price: old_price,
        out_Of_stock: out_Of_stock,
        isNew: isNew,
        product_sizes: product_sizes.length > 0 ? product_sizes : null // Allow empty array
    };

    // If editing, update the product in the array
    const existingProductIndex = products.findIndex(prod => prod.id === id);
    if (existingProductIndex !== -1) {
        products[existingProductIndex] = product; // Update the existing product
    } else {
        products.push(product); // Add new product if not editing
    }

    saveProductsToJSON(); // Save products to JSON
    displayProduct(product); // Display the product in the admin panel
    resetProductForm(); // Reset form after saving
}

function loadProducts() {
    fetch('json/products.json')
        .then(response => response.json())
        .then(data => {
            products = data; // Save the products to the global variable
            data.forEach(product => {
                displayProduct(product); // Display each product
            });
        })
        .catch(error => console.error('Error loading products:', error));
}

function displayProduct(product) {
    const productsContainer = document.getElementById('productsContainer');

    // Eliminați produsul existent din DOM dacă există
    const existingProduct = document.querySelector(`.product[data-id="${product.id}"]`);
    if (existingProduct) {
        existingProduct.remove();
    }

    // Creați noul element pentru produs
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.setAttribute('data-id', product.id); // Adăugați un atribut pentru identificare
    productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>ID: ${product.id}</p>
        <p>Price: ${product.price} MDL</p>
        <p>Description: ${product.description}</p>
        <p>Category: ${product.category}</p>
        <p>Images: ${product.images.join(', ')}</p>
        <button class="editButton" onclick="editProduct('${product.id}')">Editează</button>
        <button class="deleteButton" onclick="deleteProduct('${product.id}')">Șterge</button>
    `;

    productsContainer.appendChild(productDiv);
}


function resetProductForm() {
    document.getElementById('productForm').reset(); // Reset all form fields
    document.getElementById('itemFormContainer').style.display = 'none'; // Hide the product form
    document.getElementById('overlay').style.display = 'none'; // Hide overlay
}

function editProduct(productId) {
    const product = products.find(prod => prod.id === productId);
    if (product) {
        document.getElementById('id').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('images').value = product.images.join(', ');
        document.getElementById('description').value = product.description;
        document.getElementById('old_price').value = product.old_price || '';
        document.getElementById('isTrending').checked = product.isTrending || false;
        document.getElementById('out_Of_stock').checked = product.out_Of_stock || false;
        document.getElementById('isNew').checked = product.isNew || false;
        document.getElementById('product_sizes').value = product.product_sizes ? product.product_sizes.join(', ') : '';

        document.getElementById('itemFormContainer').style.display = 'block'; // Show form for editing
        document.getElementById('overlay').style.display = 'block'; // Show overlay
    } else {
        alert("Produsul nu a fost găsit.");
    }
}

function deleteProduct(productId) {
    const confirmation = confirm(`Sigur doriți să ștergeți produsul cu ID: ${productId}?`);
    if (confirmation) {
        // Găsim indexul produsului în array
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            // Eliminăm produsul din array
            products.splice(productIndex, 1);

            // Salvăm lista actualizată în JSON
            saveProductsToJSON();

            // Eliminăm produsul din DOM
            const productElement = document.querySelector(`.product[data-id="${productId}"]`);
            if (productElement) {
                productElement.remove();
            }

            alert(`Produsul cu ID: ${productId} a fost șters.`);

            // Dacă nu mai există produse, afișăm un mesaj în container
            if (products.length === 0) {
                const productsContainer = document.getElementById('productsContainer');
                productsContainer.innerHTML = '<p>Nu există produse disponibile.</p>';
            }
        } else {
            alert("Produsul nu a fost găsit.");
        }
    }
}



function saveProductsToJSON() {
    fetch('save_product.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(products) // Trimite lista actualizată, inclusiv dacă este goală
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log("Produse salvate cu succes în JSON.");
        } else {
            console.error("Eroare la salvarea produselor:", data.message);
        }
    })
    .catch(error => console.error('Eroare:', error));
}
