$ErrorActionPreference = "Stop"
$jsonText = Get-Content techspace_products.json -Raw
$json = ConvertFrom-Json $jsonText
$products = $json.products | Select-Object -First 36
mkdir -Force public/images/products | Out-Null

$tsCode = "export const PRODUCTS = [`n"
foreach ($p in $products) {
    if ($p.images.Count -gt 0) {
        $imgUrl = $p.images[0].src
        $fileName = [System.IO.Path]::GetFileName($imgUrl.Split('?')[0])
        $localPath = "public/images/products/$fileName"
        
        Write-Host "Downloading $fileName..."
        try {
            if (-not (Test-Path $localPath)) {
                Invoke-WebRequest -Uri $imgUrl -OutFile $localPath -UseBasicParsing
            }
        } catch {
            Write-Host "Failed to download $imgUrl - skipping"
            continue
        }

        $price = $p.variants[0].price
        if ([string]::IsNullOrWhiteSpace($price)) { $price = "999.00" }
        
        $type = $p.product_type
        if ([string]::IsNullOrWhiteSpace($type)) { $type = "Accessoires" }
        
        $slug = $p.handle
        $title = $p.title.Replace('"', '\"')
        
        # Categorize for ElectroIslam routing
        $category = "composants"
        if ($type -match "PC|Gamer|Bureau") { $category = "pc-gamer" }
        if ($type -match "Ecran|Monitor") { $category = "ecrans" }
        if ($type -match "Souris|Clavier|Casque|Micro") { $category = "peripheriques" }
        if ($type -match "Portable|Laptop") { $category = "pc-portable" }

        $tsCode += "  {`n"
        $tsCode += "    id: '$($p.id)',`n"
        $tsCode += "    name: `"$title`",`n"
        $tsCode += "    slug: '$slug',`n"
        $tsCode += "    price: $price,`n"
        $tsCode += "    originalPrice: $([math]::Round([decimal]$price * 1.2, 2)),`n"
        $tsCode += "    image: '/images/products/$fileName',`n"
        $tsCode += "    category: '$category',`n"
        $tsCode += "    inStock: true,`n"
        $tsCode += "    features: ['Garantie Techspace', 'Livraison Express'],`n"
        $tsCode += "    description: `"Découvrez le $title, un produit de haute qualité sélectionné pour les passionnés.`",`n"
        $tsCode += "  },`n"
    }
}
$tsCode += "];`n"
Set-Content -Path "techspace_products.ts" -Value $tsCode -Encoding UTF8
Write-Host "Done!"
