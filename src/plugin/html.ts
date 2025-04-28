export const html = (successText: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Success</title>
    <style>
        :root {
            --bg-color: #f8f9fa;
            --text-color: #212529;
            --accent-color: #000000;
            --success-color: #28a745;
            --border-color: #e9ecef;
            --card-bg: #ffffff;
            --card-shadow: rgba(0, 0, 0, 0.05);
            --text-secondary: #495057;
            --text-muted: #6c757d;
        }
        
        @media (prefers-color-scheme: dark) {
            :root {
                --bg-color: #121212;
                --text-color: #e1e1e1;
                --accent-color: #90caf9;
                --success-color: #4caf50;
                --border-color: #2d2d2d;
                --card-bg: #1e1e1e;
                --card-shadow: rgba(0, 0, 0, 0.2);
                --text-secondary: #b0b0b0;
                --text-muted: #909090;
            }
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            line-height: 1.5;
        }
        .success-container {
            background-color: var(--card-bg);
            border-radius: 12px;
            box-shadow: 0 4px 6px var(--card-shadow);
            padding: 2.5rem;
            text-align: center;
            max-width: 90%;
            width: 400px;
        }
        h1 {
            color: var(--success-color);
            font-size: 1.75rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        p {
            margin-bottom: 1.5rem;
            color: var(--text-secondary);
        }
        .btn {
            background-color: var(--accent-color);
            color: var(--bg-color);
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            transition: all 0.3s ease;
            display: inline-block;
            font-weight: 500;
            border: 2px solid var(--accent-color);
        }
        .btn:hover {
            opacity: 0.9;
        }
        .success-code {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
        }
        .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="icon">✅</div>
        <h1>Authentication Successful</h1>
        <p>${successText}</p>
    </div>
</body>
</html>`
