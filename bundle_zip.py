import os
import zipfile
import re
import shutil

# 1. Read dist/index.html
if not os.path.exists('dist/index.html'):
    print('dist/index.html not found, running build first...')
    exit(1)

with open('dist/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Read CSS
css_files = [f for f in os.listdir('dist/assets') if f.endswith('.css')]
css_content = ''
if css_files:
    with open(os.path.join('dist/assets', css_files[0]), 'r', encoding='utf-8') as f:
        css_content = f.read()

# Read JS
js_files = [f for f in os.listdir('dist/assets') if f.endswith('.js')]
js_content = ''
if js_files:
    with open(os.path.join('dist/assets', js_files[0]), 'r', encoding='utf-8') as f:
        js_content = f.read()

# Build standalone HTML
html_clean = re.sub(r'<link rel="stylesheet"[^>]*>', '', html)
html_clean = re.sub(r'<script type="module"[^>]*></script>', '', html_clean)
standalone = html_clean.replace('</head>', f'<style>{css_content}</style></head>')
standalone = standalone.replace('</body>', f'<script>{js_content}</script></body>')

with open('standalone.html', 'w', encoding='utf-8') as f:
    f.write(standalone)

# Create README.md
readme = """# Nexus Business Workspace

## How to Open and Run

### Option 1: Instant Launch (No Install Required)
Simply double-click **`index.html`** in this folder. It will immediately open in any web browser (Chrome, Edge, Safari, Firefox).
No Node.js, terminal, or server is required!

### Option 2: Full-Stack Developer Mode (React 19 + TypeScript + Node Server)
If you want to edit the source code and run the development server with Gemini AI support:
1. Make sure you have Node.js installed (v18+).
2. Open a terminal in this folder and install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser.

## Features Included
- Multi-Device Responsive Testing (Laptop 1440px, Tablet 768px, Mobile 390px, Multi-Device Matrix)
- Dedicated Dark Theme Column (Obsidian, Midnight, Emerald, Sunset presets, OLED True Black, Contrast)
- Full Light & Dark Theme Support
- Interactive Revenue Forecaster & Simulator
- Website Builder with live preview and code export
- CRM & Contacts with search, filtering, and CSV export
- Subscriptions & Billing with multi-currency converter (INR, USD, EUR)
- Marketing Automation & Campaigns
- Webinars & Events with live registration toggle
- AI Business Copilot
- Analytics with traffic donut and conversion funnel
"""

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(readme)

# Package into ZIP archive:
exclude_dirs = {'node_modules', '.git', 'dist', '.cache', '__pycache__', 'scripts'}

os.makedirs('public', exist_ok=True)
zip_path = 'public/nexus-workspace.zip'

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # First write the standalone as index.html so double-clicking index.html works out of the box!
    zipf.write('standalone.html', 'index.html')
    # Also write original index.html as index-dev.html
    zipf.write('index.html', 'index-dev.html')
    zipf.write('README.md', 'README.md')
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            filepath = os.path.join(root, file)
            relpath = os.path.relpath(filepath, '.')
            if relpath in {'nexus-workspace.zip', 'standalone.html', 'index.html', 'README.md', 'public/nexus-workspace.zip'}:
                continue
            zipf.write(filepath, relpath)

shutil.copy(zip_path, 'nexus-workspace.zip')
print(f'ZIP generated successfully! Size: {os.path.getsize(zip_path)} bytes')
