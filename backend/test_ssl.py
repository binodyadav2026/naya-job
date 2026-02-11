
import urllib.request
import ssl
import sys
import socket

print(f"Python: {sys.version}")
print(f"OpenSSL: {ssl.OPENSSL_VERSION}")

try:
    print("\nTesting HTTPS to google.com...")
    urllib.request.urlopen("https://www.google.com", timeout=5)
    print("Google HTTPS: SUCCESS")
except Exception as e:
    print(f"Google HTTPS: FAILED ({e})")

# target_host = "cluster0.qs7mxga.mongodb.net"
target_host = "ac-damsear-shard-00-00.qs7mxga.mongodb.net" # Direct shard

try:
    print(f"\nTesting TCP to {target_host}:27017...")
    s = socket.create_connection((target_host, 27017), timeout=5)
    print("TCP Connect: SUCCESS")
    
    print("Testing SSL Wrap (TLS 1.2)...")
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    context.maximum_version = ssl.TLSVersion.TLSv1_2
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    
    ss = context.wrap_socket(s, server_hostname=target_host)
    print(f"SSL Handshake: SUCCESS (Protocol: {ss.version()})")
    print(f"Cipher: {ss.cipher()}")
    ss.close()

    # print("Reading raw bytes...")
    # data = s.recv(1024)
    # print(f"Received ({len(data)} bytes): {data}")
    # s.close()
except Exception as e:
    print(f"MongoDB SSL: FAILED ({e})")
