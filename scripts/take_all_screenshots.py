import subprocess
import os
import time

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SCREENSHOT_DIR = os.path.join(REPO_ROOT, 'act_screenshots')
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

for act in range(7):
    out_file = os.path.join(SCREENSHOT_DIR, f'act{act}.png')
    url = f'http://localhost:8080/?act={act}'
    cmd = [
        chrome_path,
        '--headless=new',
        f'--screenshot={out_file}',
        '--virtual-time-budget=3500',
        '--window-size=1920,1080',
        url
    ]
    print(f'Rendering Act {act}...')
    subprocess.run(cmd, check=True)
    print(f'Saved Act {act} screenshot: {os.path.getsize(out_file)/1024:.1f} KB')

print('All 7 act screenshots generated successfully!')
