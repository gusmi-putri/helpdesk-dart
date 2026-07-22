<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            background-color: #f1f5f9; 
            margin: 0; 
            padding: 40px 20px; 
            color: #334155;
        }
        .wrapper {
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #1E3166; /* Cighra Primary */
            padding: 30px 40px;
            text-align: center;
            border-bottom: 4px solid #E6C21F; /* Cighra Gold */
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 800;
        }
        .content {
            padding: 40px;
            font-size: 16px;
            line-height: 1.6;
        }
        .content p {
            margin: 0 0 20px 0;
        }
        .code-container {
            background: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
        }
        .code { 
            font-size: 42px; 
            font-weight: 900; 
            letter-spacing: 12px; 
            color: #1E3166; 
            margin: 0;
            font-family: 'Courier New', Courier, monospace;
            text-shadow: 1px 1px 0px rgba(0,0,0,0.1);
        }
        .warning {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 15px 20px;
            border-radius: 0 4px 4px 0;
            margin: 30px 0;
            font-size: 14px;
            color: #991b1b;
        }
        .footer { 
            background-color: #f8fafc;
            padding: 30px 40px;
            font-size: 13px; 
            color: #64748b; 
            text-align: center; 
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 0 0 10px 0;
        }
        .footer p:last-child {
            margin: 0;
        }
        @media only screen and (max-width: 600px) {
            .wrapper { width: 100% !important; }
            .content, .header, .footer { padding: 20px !important; }
            .code { font-size: 32px !important; letter-spacing: 8px !important; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>SISFO DART</h1>
        </div>
        
        <div class="content">
            <p>Halo,</p>
            <p>Anda menerima email ini karena kami menerima permintaan untuk mereset kata sandi akun Anda pada <strong>SISFO DART BENGPUSKOMLEK</strong>.</p>
            
            <p>Silakan gunakan kode rahasia 6-digit di bawah ini untuk melanjutkan proses reset kata sandi Anda:</p>
            
            <div class="code-container">
                <div class="code">{{ $code }}</div>
            </div>
            
            <div class="warning">
                <strong>Peringatan Keamanan:</strong> Kode ini hanya berlaku selama <strong>5 menit</strong>. Jangan pernah memberikan kode ini kepada siapa pun, termasuk administrator sistem.
            </div>
            
            <p>Jika Anda tidak pernah merasa meminta reset kata sandi, mohon abaikan email ini atau segera hubungi tim IT Support untuk mengamankan akun Anda.</p>
        </div>
        
        <div class="footer">
            <p>Email ini dikirim secara otomatis oleh SISFO DART BENGPUS PUSKOMLEKAD.</p>
            <p>&copy; {{ date('Y') }} SISFO DART System. Hak cipta dilindungi undang-undang.</p>
        </div>
    </div>
</body>
</html>
