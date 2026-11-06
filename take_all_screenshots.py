import subprocess
import os
import time

os.makedirs(r'C:\diwali\act_screenshots', exist_ok=True)

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

for act in range(7):
    out_file = fr'C:\diwali\act_screenshots\act{act}.png'
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
