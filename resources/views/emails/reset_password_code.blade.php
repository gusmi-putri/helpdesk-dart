<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; border-top: 4px solid #1E3166; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #E6C21F; background: #1E3166; padding: 15px; text-align: center; border-radius: 4px; margin: 20px 0; font-family: monospace; }
        .footer { margin-top: 30px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2 style="color: #1E3166;">Reset Kata Sandi DART</h2>
        <p>Halo,</p>
        <p>Anda menerima email ini karena kami menerima permintaan reset kata sandi untuk akun Anda di Sistem Informasi DART.</p>
        <p>Gunakan kode 6-digit berikut untuk mereset kata sandi Anda:</p>
        
        <div class="code">{{ $code }}</div>
        
        <p style="color: #ef4444; font-size: 14px; font-weight: bold;">⚠️ Kode ini hanya berlaku selama 5 menit.</p>
        
        <p>Jika Anda tidak meminta reset kata sandi, abaikan email ini.</p>
        
        <div class="footer">
            Ini adalah email otomatis dari Sistem Informasi DART.<br>
            Harap tidak membalas email ini.
        </div>
    </div>
</body>
</html>
