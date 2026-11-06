import os
import time
import numpy as np
from PIL import Image

ACT_FILES = [
    'originofdiwali.png',
    'vasubaras.png',
    'dhanteras.png',
    'narakachaturdashi.png',
    'laxmipoojan.png',
    'balipadwa.png',
    'bhaubeej.png'
]

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REFERENCE_DIR = os.path.join(REPO_ROOT, 'reference')
TARGET_PARTICLES = 180000

def process_act(act_idx, filename):
    t0 = time.time()
    filepath = os.path.join(REFERENCE_DIR, filename)
    im = Image.open(filepath).convert('RGB')
    arr = np.array(im, dtype=np.float32)
    h, w, c = arr.shape
    
    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    
    # Sobel edge filter for razor-sharp contours
    gx = np.zeros_like(lum)
    gy = np.zeros_like(lum)
    gx[:, 1:-1] = (lum[:, 2:] - lum[:, :-2]) * 0.5
    gy[1:-1, :] = (lum[2:, :] - lum[:-2, :]) * 0.5
    edge = np.sqrt(gx**2 + gy**2)
    
    # Color vibrancy measure: distance between max and min channel
    vibrancy = np.max(arr, axis=2) - np.min(arr, axis=2)
    
    # Non-black candidates
    valid_mask = (lum > 4.5) | (edge > 3.5)
    y_idx, x_idx = np.where(valid_mask)
    num_candidates = len(y_idx)
    
    # Compute completely smooth sampling weights (ZERO step discontinuities!)
    # 1. Edge weight (guarantees crisp borders, face outlines, lantern ribs, rangoli curves)
    w_edge = edge[y_idx, x_idx] * 2.2
    # 2. Color vibrancy weight (prioritizes purple lanterns, green leaves, red garlands, pink lotus)
    w_vib = vibrancy[y_idx, x_idx] * 1.8
    # 3. Luminance weight (populates glowing bodies, halos, flames)
    w_lum = lum[y_idx, x_idx] * 0.8
    
    # 4. Smooth continuous margin boost (smooth fade towards edges, no step cliffs)
    dist_x = np.minimum(x_idx, w - 1 - x_idx) / float(w)
    dist_y = np.minimum(y_idx, h - 1 - y_idx) / float(h)
    edge_dist = np.minimum(dist_x, dist_y)
    w_margin = np.clip(1.0 - edge_dist / 0.22, 0.0, 1.0) * 18.0
    
    # 5. Base weight (ensures smooth unbroken coverage)
    base_w = 8.0
    
    weights = w_edge + w_vib + w_lum + w_margin + base_w
    prob = weights / np.sum(weights)
    
    # Sample exactly TARGET_PARTICLES (without replacement if enough candidates exist)
    replace = num_candidates < TARGET_PARTICLES
    chosen = np.random.choice(num_candidates, size=TARGET_PARTICLES, replace=replace, p=prob)
    
    cx = x_idx[chosen].astype(np.float32)
    cy = y_idx[chosen].astype(np.float32)
    c_edge = edge[y_idx[chosen], x_idx[chosen]]
    c_lum = lum[y_idx[chosen], x_idx[chosen]]
    c_r = r[y_idx[chosen], x_idx[chosen]]
    c_g = g[y_idx[chosen], x_idx[chosen]]
    c_b = b[y_idx[chosen], x_idx[chosen]]
    
    # Sub-pixel anti-aliased jitter
    is_crisp_edge = c_edge > 14.0
    jitter_mag = np.where(is_crisp_edge, 0.22, 0.45)
    jx = (np.random.rand(TARGET_PARTICLES) - 0.5) * jitter_mag
    jy = (np.random.rand(TARGET_PARTICLES) - 0.5) * jitter_mag
    
    # World Coordinates (preserving exact 1024x572 aspect ratio)
    half_w = 8.0
    half_h = 8.0 * (572.0 / 1024.0) # 4.46875
    
    world_x = ((cx + jx) / w) * 16.0 - half_w
    world_y = -(((cy + jy) / h) * (2.0 * half_h) - half_h)
    
    # Natural 3D Stereoscopic Layering - 100% C2-SMOOTH (NO CLIFFS, NO SEAMS, NO BLACK LINES!)
    ny = cy / float(h)           # 0.0 at top, 1.0 at bottom
    nx = (cx / float(w)) - 0.5   # -0.5 at left, +0.5 at right
    lum_norm = np.clip(c_lum / 255.0, 0.0, 1.0)
    
    # 1. Smooth ground tilt: ground tilts forward (+Z), upper sky/lanterns recede back (-Z)
    z_tilt = (ny - 0.5) * 0.70
    
    # 2. Smooth sculptural relief: radiant faces, crowns, flame lau gently sculpt forward
    z_relief = (lum_norm - 0.4) * 0.35
    
    # 3. Smooth parabolic framing vignette along the sides
    z_arch = -(nx ** 2) * 0.25
    
    # 4. Organic micro-stardust volume jitter
    z_jitter = np.random.normal(0.0, 0.025, TARGET_PARTICLES).astype(np.float32)
    
    depth = z_tilt + z_relief + z_arch + z_jitter
    
    # Colors: Extract and calibrate vibrancy
    raw_r = c_r / 255.0
    raw_g = c_g / 255.0
    raw_b = c_b / 255.0
    
    col_out = np.zeros((TARGET_PARTICLES, 3), dtype=np.float32)
    
    # Vectorized RGB to HSV adjustment for color pop
    c_max = np.maximum(np.maximum(raw_r, raw_g), raw_b)
    c_min = np.minimum(np.minimum(raw_r, raw_g), raw_b)
    delta = c_max - c_min
    
    sat = np.zeros_like(c_max)
    non_zero = c_max > 0.01
    sat[non_zero] = delta[non_zero] / c_max[non_zero]
    
    sat_boost = np.clip(sat * 1.18 + 0.02, 0.0, 1.0)
    factor = np.where(sat > 0.01, sat_boost / np.maximum(sat, 0.001), 1.0)
    r_boost = c_max - (c_max - raw_r) * factor
    g_boost = c_max - (c_max - raw_g) * factor
    b_boost = c_max - (c_max - raw_b) * factor
    
    # For bright highlights (diya flames, radiant face, crown, white rice), preserve pristine glow
    is_highlight = (c_lum > 200.0) & (sat < 0.25)
    r_boost[is_highlight] = np.maximum(raw_r[is_highlight], 0.98)
    g_boost[is_highlight] = np.maximum(raw_g[is_highlight], 0.94)
    b_boost[is_highlight] = np.maximum(raw_b[is_highlight], 0.88)
    
    col_out[:, 0] = np.clip(r_boost, 0.0, 1.0)
    col_out[:, 1] = np.clip(g_boost, 0.0, 1.0)
    col_out[:, 2] = np.clip(b_boost, 0.0, 1.0)
    
    # Particle Sizes
    size_out = np.ones(TARGET_PARTICLES, dtype=np.float32) * 1.05
    flame_mask = c_lum > 180.0
    size_out[flame_mask] = 1.35 + lum_norm[flame_mask] * 0.75
    size_out[is_crisp_edge] = 1.20 + np.random.rand(np.sum(is_crisp_edge)) * 0.15
    ambient_mask = c_lum < 30.0
    size_out[ambient_mask] = 0.85 + np.random.rand(np.sum(ambient_mask)) * 0.2
    
    # Assemble Buffer: 180,000 * 7 floats (pos 3, col 3, size 1)
    buffer = np.zeros(TARGET_PARTICLES * 7, dtype=np.float32)
    
    # Pos: [0 : 540,000]
    buffer[0 : TARGET_PARTICLES * 3 : 3] = world_x
    buffer[1 : TARGET_PARTICLES * 3 : 3] = world_y
    buffer[2 : TARGET_PARTICLES * 3 : 3] = depth
    
    # Col: [540,000 : 1,080,000]
    col_offset = TARGET_PARTICLES * 3
    buffer[col_offset : col_offset + TARGET_PARTICLES * 3 : 3] = col_out[:, 0]
    buffer[col_offset + 1 : col_offset + TARGET_PARTICLES * 3 : 3] = col_out[:, 1]
    buffer[col_offset + 2 : col_offset + TARGET_PARTICLES * 3 : 3] = col_out[:, 2]
    
    # Size: [1,080,000 : 1,260,000]
    size_offset = TARGET_PARTICLES * 6
    buffer[size_offset : size_offset + TARGET_PARTICLES] = size_out
    
    out_path = os.path.join(REFERENCE_DIR, f'act{act_idx}.bin')
    buffer.tofile(out_path)
    file_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f'Act {act_idx} ({filename:22s}): {TARGET_PARTICLES} particles generated in {time.time()-t0:.2f}s -> {out_path} ({file_mb:.2f} MB)')

if __name__ == '__main__':
    print('Generating Seamless Master Particles for all 7 Acts (180,000 particles each)...')
    t_start = time.time()
    for idx, fname in enumerate(ACT_FILES):
        process_act(idx, fname)
    print(f'All 7 acts regenerated seamlessly in {time.time()-t_start:.2f}s!')
