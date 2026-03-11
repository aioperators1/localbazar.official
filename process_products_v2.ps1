$ErrorActionPreference = "Stop"
$jsonText = Get-Content techspace_products.json -Raw
$json = ConvertFrom-Json $jsonText
$products = $json.products | Select-Object -First 36

$tsCode = "const FALLBACK_PRODUCTS = [`n"
foreach ($p in $products) {
    if ($p.images.Count -gt 0) {
        $imgUrl = $p.images[0].src
        $fileName = [System.IO.Path]::GetFileName($imgUrl.Split('?')[0])
        
        $price = $p.variants[0].price
        if ([string]::IsNullOrWhiteSpace($price)) { $price = "999.00" }
        
        $type = $p.product_type
        if ([string]::IsNullOrWhiteSpace($type)) { $type = "Accessoires" }
        
        $slug = $p.handle
        $title = $p.title.Replace('"', '\"').Replace("'", "\'")
        
        # Categorize for ElectroIslam routing
        $categoryId = "composants"
        $categoryName = "Composants"
        if ($type -match "PC|Gamer|Bureau") { $categoryId = "pc-gamer"; $categoryName = "PC Gamer" }
        if ($type -match "Ecran|Monitor") { $categoryId = "ecrans"; $categoryName = "Ecrans PC" }
        if ($type -match "Souris|Clavier|Casque|Micro") { $categoryId = "peripheriques"; $categoryName = "Périphériques" }
        if ($type -match "Portable|Laptop") { $categoryId = "pc-portable"; $categoryName = "PC Portable" }

        $brand = "Techspace"
        if ($p.vendor) { $brand = $p.vendor }

        $tsCode += "  {`n"
        $tsCode += "    id: '$($p.id)',`n"
        $tsCode += "    name: `"$title`",`n"
        $tsCode += "    slug: '$slug',`n"
        $tsCode += "    description: `"Découvrez le $title, un produit de haute qualité.`",`n"
        $tsCode += "    price: $price,`n"
        $tsCode += "    stock: 15,`n"
        $tsCode += "    inStock: true,`n"
        $tsCode += "    images: JSON.stringify(['/images/products/$fileName']),`n"
        $tsCode += "    categoryId: '$categoryId',`n"
        $tsCode += "    category: { id: '$categoryId', name: '$categoryName', slug: '$categoryId' },`n"
        $tsCode += "    brand: `"$brand`",`n"
        $tsCode += "    featured: true,`n"
        $tsCode += "    createdAt: new Date().toISOString(),`n"
        $tsCode += "    updatedAt: new Date().toISOString()`n"
        $tsCode += "  },`n"
    }
}
$tsCode += "];`n"
Set-Content -Path "techspace_products.ts" -Value $tsCode -Encoding UTF8
