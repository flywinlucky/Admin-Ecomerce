let categories = [];
let productCounter = 1; // Counter for unique product IDs
let categoryCounter = 1; // Counter for unique category IDs

function addCategory() {
    const categoryName = document.getElementById('categoryName').value.trim();
    if (categoryName) {
        categories.push(categoryName);
        updateCategories();
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

function selectCategory(category, index) {
    document.getElementById('selectedCategory').textContent = category;
    document.getElementById('itemFormContainer').style.display = 'block';
    document.getElementById('id').value = `${categoryCounter}-${productCounter}`; // Set unique ID based on category and product counter
    productCounter++; // Increment product counter
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

    fetch('save_product.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            resetProductForm(); // Reset form after saving
        })
        .catch(error => console.error('Eroare:', error));
}

function resetProductForm() {
    document.getElementById('productForm').reset(); // Reset all form fields
    document.getElementById('itemFormContainer').style.display = 'none'; // Hide the product form
}