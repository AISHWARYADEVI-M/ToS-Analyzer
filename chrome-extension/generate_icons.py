#!/usr/bin/env python3
"""Generate placeholder PNG icons for the Chrome extension"""

import struct
import zlib
import os

def create_png(width, height, color_r=79, color_g=70, color_b=229):
    """Create a simple PNG file with specified dimensions and color"""
    
    # PNG signature
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk (image header)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk (image data)
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # Filter type for each scanline
        for x in range(width):
            raw_data += bytes([color_r, color_g, color_b])
    
    compressed = zlib.compress(raw_data, 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed) & 0xffffffff
    idat_chunk = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND') & 0xffffffff
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_signature + ihdr_chunk + idat_chunk + iend_chunk

# Create icons directory if it doesn't exist
icons_dir = os.path.dirname(os.path.abspath(__file__))

# Create PNG icons (indigo color: rgb(79, 70, 229))
sizes = [16, 48, 128]
for size in sizes:
    png_data = create_png(size, size, 79, 70, 229)
    filename = os.path.join(icons_dir, f'icon-{size}.png')
    with open(filename, 'wb') as f:
        f.write(png_data)
    print(f'✓ Created {filename}')

print('\n✅ All extension icons generated successfully!')
