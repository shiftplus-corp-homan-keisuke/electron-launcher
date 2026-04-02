Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path 'resources\racco.png').Path
$img = [System.Drawing.Image]::FromFile($src)
$w = $img.Width
$h = $img.Height
Write-Host "Size: ${w}x${h}"

# --- icon.png (256x256) ---
$bmp256 = New-Object System.Drawing.Bitmap(256, 256)
$g = [System.Drawing.Graphics]::FromImage($bmp256)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.DrawImage($img, 0, 0, 256, 256)
$g.Dispose()
$bmp256.Save((Join-Path 'resources' 'icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host '[OK] icon.png (256x256)'

# --- tray-icon.png (16x16) ---
$bmp16 = New-Object System.Drawing.Bitmap(16, 16)
$g = [System.Drawing.Graphics]::FromImage($bmp16)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.DrawImage($img, 0, 0, 16, 16)
$g.Dispose()
$bmp16.Save((Join-Path 'resources' 'tray-icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host '[OK] tray-icon.png (16x16)'

# --- tray-icon@2x.png (32x32) ---
$bmp32 = New-Object System.Drawing.Bitmap(32, 32)
$g = [System.Drawing.Graphics]::FromImage($bmp32)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.DrawImage($img, 0, 0, 32, 32)
$g.Dispose()
$bmp32.Save((Join-Path 'resources' 'tray-icon@2x.png'), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host '[OK] tray-icon@2x.png (32x32)'

# --- icon.ico (multi-size: 16, 32, 48, 256) ---
$sizes = @(16, 32, 48, 256)
$ms = New-Object System.IO.MemoryStream

# ICO header
$bw = New-Object System.IO.BinaryWriter($ms)
$bw.Write([UInt16]0)           # Reserved
$bw.Write([UInt16]1)           # Type: ICO
$bw.Write([UInt16]$sizes.Count) # Number of images

# Prepare each PNG entry
$pngDataList = @()
foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($s, $s)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($img, 0, 0, $s, $s)
    $g.Dispose()
    $pngMs = New-Object System.IO.MemoryStream
    $bmp.Save($pngMs, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngDataList += ,$pngMs.ToArray()
    $pngMs.Dispose()
    $bmp.Dispose()
}

# ICO directory entries (offset starts after header + all entries)
$headerSize = 6
$entrySize = 16
$dataOffset = $headerSize + ($entrySize * $sizes.Count)

for ($i = 0; $i -lt $sizes.Count; $i++) {
    $s = $sizes[$i]
    $pngBytes = $pngDataList[$i]
    $widthByte = if ($s -ge 256) { 0 } else { $s }
    $heightByte = if ($s -ge 256) { 0 } else { $s }
    $bw.Write([byte]$widthByte)   # Width
    $bw.Write([byte]$heightByte)  # Height
    $bw.Write([byte]0)            # Color palette
    $bw.Write([byte]0)            # Reserved
    $bw.Write([UInt16]1)          # Color planes
    $bw.Write([UInt16]32)         # Bits per pixel
    $bw.Write([UInt32]$pngBytes.Length) # Size of PNG data
    $bw.Write([UInt32]$dataOffset)      # Offset
    $dataOffset += $pngBytes.Length
}

# Write PNG data
for ($i = 0; $i -lt $sizes.Count; $i++) {
    $bw.Write($pngDataList[$i])
}

$bw.Flush()
$icoPath = Join-Path (Join-Path (Get-Location) 'resources') 'icon.ico'
[System.IO.File]::WriteAllBytes($icoPath, $ms.ToArray())
$ms.Dispose()
Write-Host '[OK] icon.ico (16,32,48,256)'

$img.Dispose()
Write-Host '[OK] All icons generated from racco.png'
