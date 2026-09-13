<#
.SYNOPSIS
Deploys the Vue Frontend to an Ubuntu DigitalOcean Droplet using Nginx.

.EXAMPLE
.\deploy-frontend.ps1 -DropletIp "45.55.40.101"
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$DropletIp = "45.55.40.101",

    [string]$SshUser = "root",
    [string]$SshKeyPath = "$HOME\.ssh\id_rsa"
)

$ErrorActionPreference = "Stop"

$AppDir = "/var/www/frontend"
$DistDir = "$AppDir/dist"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Starting Frontend Deployment to $DropletIp" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Verify / build dist
Write-Host "`n[1/4] Checking production build in dist/..." -ForegroundColor Yellow
if (-not (Test-Path "dist/index.html")) {
    Write-Host "Building dist..."
    cmd.exe /c "npm run build"
}
if (-not (Test-Path "dist/index.html")) {
    Write-Error "Could not find dist/index.html. Run npm run build first."
    exit 1
}
Write-Host "Production build verified in dist/." -ForegroundColor Green

# 2. Package dist folder
Write-Host "`n[2/4] Packaging dist/ folder into tarball..." -ForegroundColor Yellow
if (Test-Path "deploy_frontend.tar.gz") { Remove-Item "deploy_frontend.tar.gz" -Force }
tar.exe -czf deploy_frontend.tar.gz -C dist .

# 3. Upload tarball and nginx config
Write-Host "`n[3/4] Uploading files to Droplet..." -ForegroundColor Yellow
ssh -i $SshKeyPath -o BatchMode=yes -o StrictHostKeyChecking=accept-new ${SshUser}@${DropletIp} "mkdir -p $DistDir"
scp -i $SshKeyPath -o BatchMode=yes -o StrictHostKeyChecking=accept-new deploy_frontend.tar.gz ${SshUser}@${DropletIp}:/tmp/deploy_frontend.tar.gz
scp -i $SshKeyPath -o BatchMode=yes -o StrictHostKeyChecking=accept-new nginx-frontend.conf ${SshUser}@${DropletIp}:/etc/nginx/sites-available/frontend

# Extract, set permissions, and restart Nginx
ssh -i $SshKeyPath -o BatchMode=yes ${SshUser}@${DropletIp} @"
    set -e
    tar -xzf /tmp/deploy_frontend.tar.gz -C $DistDir/
    rm -f /tmp/deploy_frontend.tar.gz
    chown -R www-data:www-data $AppDir
    ln -sf /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t
    systemctl restart nginx
    systemctl enable nginx
"@

Remove-Item "deploy_frontend.tar.gz" -Force -ErrorAction SilentlyContinue

# 4. Verify
Write-Host "`n[4/4] Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
$res = Invoke-WebRequest -Uri "http://$DropletIp/" -UseBasicParsing -TimeoutSec 10
if ($res.StatusCode -eq 200) {
    Write-Host "`n==================================================" -ForegroundColor Green
    Write-Host " Frontend successfully deployed and live!" -ForegroundColor Green
    Write-Host " Access your dashboard at: http://$DropletIp/" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
} else {
    Write-Host "Status: $($res.StatusCode)" -ForegroundColor Yellow
}
