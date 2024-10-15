openssl req \
-newkey rsa:2048 \
-x509 \
-nodes \
-keyout key.pem \
-new \
-out cert.pem \
-subj /CN=Hostname \
-sha256 \
-days 3650