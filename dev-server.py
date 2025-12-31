#!/usr/bin/env python3
"""
Development server with NO CACHING headers
Ensures browser always gets fresh files
"""

import http.server
import socketserver
from pathlib import Path

PORT = 8001

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with no-cache headers"""

    def end_headers(self):
        # Add no-cache headers to EVERY response
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Simpler logging
        print(f"{args[0]} - {args[1]}")

if __name__ == "__main__":
    # Change to the directory where this script is located
    Path(__file__).parent.absolute()

    with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"🚀 Development server running at http://localhost:{PORT}")
        print(f"📝 NO CACHE mode - all files served fresh")
        print(f"🔧 Press Ctrl+C to stop\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✋ Server stopped")
