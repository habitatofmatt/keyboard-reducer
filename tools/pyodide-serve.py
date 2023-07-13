#!/usr/bin/env python3

from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer


class CORSPermissiveHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()


if __name__ == "__main__":
    with TCPServer(("127.0.0.1", 8000), CORSPermissiveHTTPRequestHandler) as httpd:
        print("Serving...")
        httpd.serve_forever()
