FROM php:7.4-apache

# Installa estensioni PHP
RUN docker-php-ext-install pdo pdo_mysql

# Abilita mod_rewrite se usi URL rewriting
RUN a2enmod rewrite