# Re-seed auth accounts via the running auth-service so passwords are properly BCrypt-encoded.
# Run AFTER: config-server, eureka, api-gateway, auth-service are all up.
# Usage: .\seed-accounts.ps1

$ErrorActionPreference = 'Continue'
$gateway = 'http://localhost:9090/api/auth/register'

# 1. Clear any previously seeded users with the bad hash
Write-Host "Clearing existing auth users..." -ForegroundColor Cyan
mysql -u root -p2478553 -e "DELETE FROM hms_auth.users;"
mysql -u root -p2478553 -e "ALTER TABLE hms_auth.users AUTO_INCREMENT = 1;"

# 2. Register fresh accounts (password = "password123" for all)
$accounts = @(
    @{ email = 'admin@hms.com';    phone = '9000000001'; password = 'password123'; role = 'ADMIN'   },
    @{ email = 'owner@hms.com';    phone = '9000000002'; password = 'password123'; role = 'OWNER'   },
    @{ email = 'warden@hms.com';   phone = '9000000003'; password = 'password123'; role = 'WARDEN'  },
    @{ email = 'student1@hms.com'; phone = '9000000004'; password = 'password123'; role = 'STUDENT' },
    @{ email = 'student2@hms.com'; phone = '9000000005'; password = 'password123'; role = 'STUDENT' },
    @{ email = 'student3@hms.com'; phone = '9000000006'; password = 'password123'; role = 'STUDENT' },
    @{ email = 'staff@hms.com';    phone = '9000000007'; password = 'password123'; role = 'STAFF'   }
)

Write-Host ""
Write-Host "Registering accounts via $gateway ..." -ForegroundColor Cyan
foreach ($a in $accounts) {
    try {
        $body = $a | ConvertTo-Json -Compress
        $resp = Invoke-RestMethod -Uri $gateway -Method POST -ContentType 'application/json' -Body $body
        Write-Host ("  [OK]  {0,-22}  role={1}" -f $a.email, $a.role) -ForegroundColor Green
    } catch {
        $msg = $_.ErrorDetails.Message
        Write-Host ("  [ERR] {0,-22}  {1}" -f $a.email, $msg) -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done. Try logging in at http://localhost:3000" -ForegroundColor Cyan
Write-Host "All passwords = password123" -ForegroundColor Yellow
