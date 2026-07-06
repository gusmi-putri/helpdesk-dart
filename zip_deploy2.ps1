$tempDir = Join-Path $env:TEMP "helpdesk-deploy"
Remove-Item -Force -Recurse $tempDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tempDir | Out-Null

$exclude = @('node_modules', 'public', '.git', '.gemini', 'helpdesk-core.zip', 'public_html.zip', 'zip_deploy.ps1')
Get-ChildItem -Path . | Where-Object { $_.Name -notin $exclude } | Copy-Item -Destination $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Remove-Item -Force helpdesk-core.zip -ErrorAction SilentlyContinue
Compress-Archive -Path "$tempDir\*" -DestinationPath helpdesk-core.zip -Force
Remove-Item -Force -Recurse $tempDir -ErrorAction SilentlyContinue
