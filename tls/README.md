### TLS README

The files in the ./tls directory enable a bootstrap of the HTTPS protocol with initial installations of Seedling.  It is highly recommended that valid certificates be produced and used if serving via HTTPS directly from the server.  Alternatively, in production environments, the Seedling server should be placed behind a dedicated HTTPS front end web server.

To generate a certificate via openssl:
```
openssl req -new -x509 -days 3650 -key tempkey -out cacert.pem
```
