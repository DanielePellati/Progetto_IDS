FROM php:7.4-apache

# Installare PDO e PDO_MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Copia i file di configurazione e il codice
COPY . /var/www/html/
