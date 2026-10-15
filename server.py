#!/usr/bin/env python3
"""
=============================================================================
ASIFGKBD.COM — Dedicated Cyber Backend & Web Server
Architect: ASIF GK
Phone: +8801773860372
Email: asifgk.hacker@gmail.com
Domain: ASIFGKBD.com
=============================================================================
"""

import os
import sys
import json
import time
import socket
import webbrowser
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse
from datetime import datetime

PORT = 5000
HOST = "0.0.0.0"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MESSAGES_FILE = os.path.join(BASE_DIR, "messages.json")
START_TIME = time.time()

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def load_messages():
    if os.path.exists(MESSAGES_FILE):
        try:
            with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_message(data):
    messages = load_messages()
    messages.append(data)
    try:
        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(messages, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[!] Error saving message: {e}")

class AsifGkServerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS and Cache-Control
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "OK")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # API: Server Health Status
        if path == "/api/status":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            
            uptime_seconds = int(time.time() - START_TIME)
            messages = load_messages()
            status_data = {
                "status": "ONLINE",
                "domain": "ASIFGKBD.COM",
                "architect": "ASIF GK",
                "hotline": "+8801773860372",
                "email": "asifgk.hacker@gmail.com",
                "github": "https://github.com/mdaminulislamasif",
                "uptime_seconds": uptime_seconds,
                "uptime_formatted": f"{uptime_seconds // 3600}h {(uptime_seconds % 3600) // 60}m {uptime_seconds % 60}s",
                "messages_count": len(messages),
                "server_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            self.wfile.write(json.dumps(status_data, indent=2).encode("utf-8"))
            return

        # API: View Received Messages (Inbox)
        if path == "/api/messages":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            messages = load_messages()
            self.wfile.write(json.dumps(messages, indent=2).encode("utf-8"))
            return

        # Default static file handling
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # API: Handle Contact Form Dispatch
        if path == "/api/contact":
            content_length = int(self.headers.get("Content-Length", 0))
            post_body = self.rfile.read(content_length)

            try:
                data = json.loads(post_body.decode("utf-8"))
            except Exception:
                data = {"raw": post_body.decode("utf-8", errors="ignore")}

            client_ip = self.client_address[0]
            data["client_ip"] = client_ip
            if "timestamp" not in data:
                data["timestamp"] = datetime.now().isoformat()

            save_message(data)

            # Terminal alert for ASIF GK
            print("\n" + "=" * 65)
            print(" ⚡ [NEW TRANSMISSION RECEIVED ON ASIFGKBD.COM] ⚡")
            print(f" • From Name : {data.get('name', 'N/A')}")
            print(f" • Email     : {data.get('email', 'N/A')}")
            print(f" • Domain    : {data.get('domain', 'N/A')}")
            print(f" • Client IP : {client_ip}")
            print(f" • Message   : {data.get('message', 'N/A')}")
            print(f" • Time      : {data.get('timestamp')}")
            print("=" * 65 + "\n")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response = {
                "success": True,
                "message": "Transmission logged successfully into ASIFGKBD Secure Core.",
                "hotline": "+8801773860372",
                "email": "asifgk.hacker@gmail.com"
            }
            self.wfile.write(json.dumps(response).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        # Format concise server log
        sys.stdout.write(f"[{datetime.now().strftime('%H:%M:%S')}] {self.address_string()} - {format%args}\n")

def open_browser_delayed(url):
    time.sleep(1.2)
    webbrowser.open(url)

def run_server():
    local_ip = get_local_ip()
    server_address = (HOST, PORT)
    httpd = HTTPServer(server_address, AsifGkServerHandler)

    print("\n" + "█" * 68)
    print("  🌐 ASIFGKBD.COM — HIGH-SPEED CYBER BACKEND SERVER")
    print("  Architect : ASIF GK")
    print("  Hotline   : +8801773860372 (WhatsApp Verified)")
    print("  Gmail     : asifgk.hacker@gmail.com")
    print("  GitHub    : https://github.com/mdaminulislamasif")
    print("  Domain    : https://asifgkbd.com")
    print("█" * 68)
    print(f"\n  [✔] Local Address   : http://localhost:{PORT}")
    print(f"  [✔] Loopback Address: http://127.0.0.1:{PORT}")
    print(f"  [✔] LAN Address     : http://{local_ip}:{PORT}")
    print(f"  [✔] API Status      : http://localhost:{PORT}/api/status")
    print(f"  [✔] API Inbox       : http://localhost:{PORT}/api/messages")
    print("\n  [*] Serving from:", BASE_DIR)
    print("  [*] Press Ctrl + C to stop the server.\n" + "-" * 68)

    # Launch browser automatically in background thread
    threading.Thread(target=open_browser_delayed, args=(f"http://localhost:{PORT}",), daemon=True).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Shutting down ASIFGKBD Server gracefully...")
        httpd.server_close()
        print("[✔] Server stopped.")

if __name__ == "__main__":
    run_server()
