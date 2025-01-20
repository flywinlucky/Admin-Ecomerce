<?php
// Setează header-ul pentru a permite cereri de tip JSON
header('Content-Type: application/json');

// Citește datele trimise prin POST
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Verifică dacă datele sunt valide
if ($data) {
    // Creăm array-ul de produs cu datele obligatorii
    $product = [
        "id" => $data['id'], // Se presupune că ID-ul este unic
        "name" => $data['name'],
        "price" => $data['price'],
        "old_price" => isset($data['old_price']) && $data['old_price'] !== "" ? $data['old_price'] : null,
        "images" => $data['images'],
        "category" => $data['category'],
        "description" => $data['description'],
    ];

    // Adăugăm câmpurile opționale doar dacă sunt setate
    if (isset($data['isTrending']) && $data['isTrending']) {
        $product['isTrending'] = true;
    }
    
    if (isset($data['out_Of_stock']) && $data['out_Of_stock']) {
        $product['out_Of_stock'] = true;
    }

    if (isset($data['isNew']) && $data['isNew']) {
        $product['isNew'] = true;
    }

    if (isset($data['product_sizes']) && !empty($data['product_sizes'])) {
        $product['product_sizes'] = $data['product_sizes'];
    }

    // Calea către fișierul JSON
    $filePath = 'json/products.json';

    // Verifică dacă fișierul există
    if (file_exists($filePath)) {
        // Citește fișierul existent
        $existingData = file_get_contents($filePath);
        $products = json_decode($existingData, true);
    } else {
        $products = []; // Dacă fișierul nu există, inițializează un array gol
    }

    // Adaugă noul produs
    $products[] = $product;

    // Salvează datele înapoi în fișier fără a scăpa slash-urile
    if (file_put_contents($filePath, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))) {
        echo json_encode(["status" => "success", "message" => "Produsul a fost salvat cu succes!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Eroare la salvarea fișierului."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Date invalide."]);
}
?>
