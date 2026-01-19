# MANUAL DE DESPLEGAMENT (Entorn Local / Servidor)

A continuació es detallen els passos per desplegar el projecte en un entorn Linux (Ubuntu/Debian) sense utilitzar Docker, basant-me en la configuració exacta i les versions utilitzades durant el desenvolupament.

## 1. Requisits i Versions del Sistema

El projecte s'ha desenvolupat i testejat amb les següents versions de programari. Tot i que hauria de funcionar amb versions posteriors, aquestes són les garantides:

* **Sistema Operatiu:** Ubuntu 22.04 / 24.04 (o WSL a Windows)
* **PHP:** 8.3.29 (Extensions necessàries: xml, curl, mysql, zip, mbstring, bcmath)
* **Node.js:** v24.12.0
* **NPM:** 11.6.2
* **Composer:** 2.9.3
* **Base de Dades:** MySQL 8.0.44
* **Servidor Web:** Apache 2.4.52
* **Gestió BD:** phpMyAdmin (No obligatori, jo el tinc)

---

## 2. Clonat del Repositori

Preparem l'estructura de carpetes i descarreguem el codi font:

```bash
Crear la carpeta de projectes si no existeix
mkdir -p ~/projectes
cd ~/projectes

Clonar el repositori
git clone https://github.com/DAW-Cirvianum/final-project-YarosCirvianum.git

Entrar a la carpeta del projecte
cd final-project-YarosCirvianum
```

## 3. Crear la BD via terminal amb MySQL

Cal accedir al mysql amb:
```bash
sudo mysql
```

A continuació fer Copy+Paste d'aquestes instruccions per crear la BD inventory, aquí l'usuari que es crea és yaros i la password 1234, això es pot canviar fàcilment editant la comanda abans d'executar.

```bash
CREATE DATABASE inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'yaros'@'localhost' IDENTIFIED BY '1234';

GRANT ALL PRIVILEGES ON inventory.* TO 'yaros'@'localhost';

FLUSH PRIVILEGES;
EXIT;
```

## 4. Configuració del Backend (Laravel)

Configuració de l'API i la base de dades.

```bash
# 1. Entrar al directori del backend
cd backend

# 2. Instal·lar dependències de PHP
composer install
# Nota: Si tens problemes de versions, utilitza: composer update

# 3. Crear l'arxiu de configuració d'entorn o bé via nano o via vsCode
cp .env.example .env
nano .env
```

Configuració de l'arxiu .env: Dins de l'editor, assegura't que les credencials de la base de dades són correctes (la BD inventory l'hem creat abans) i defineix la URL del projecte, també afegir ja la part de configuració del VITE:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventory
DB_USERNAME=el_teu_usuari
DB_PASSWORD=el_teu_password

APP_URL="http://final-project.local"

VITE_APP_NAME="${APP_NAME}"
VITE_API_URL="http://final-project.local/api"
```

Configuració en el .env del Mailer per fer proves sense servidor de correu via Gmail, caldria obtenir un codi de aplicació del Gmail i posar-lo al .env on posa "MAIL_PASSWORD":

```bash
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=correu.example@cirvianum.cat
MAIL_PASSWORD="abcd abcd abcd abcd"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="correu@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

Continuem amb les comandes de configuració:

```bash
# 4. Generar la clau d'encriptació de l'aplicació
php artisan key:generate

# 5. Crear les taules i omplir la BD amb dades de prova (Seeders)
php artisan migrate --seed

# 6. Assignar permisos d'escriptura (Vital per a Linux/Apache)
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

## 5. Configuració del Frontend (React + Vite)
Obre terminal nou o torna enrere (cd ..) per configurar la part visual.

```bash
# 1. Entrar al directori del frontend
cd ../frontend

# 2. Instal·lar dependències de Node
npm install

# 3. Posar en marxa el servidor de desenvolupament (React)
npm run dev
```

Això aixecarà el frontend, normalment accessible a http://localhost:5173

## 6. Configuració del Servidor Web (Apache)

Perquè l'API funcioni amb el domini final-project.local, cal configurar un Virtual Host a Apache.

1. Crear l'arxiu de configuració:

```bash
sudo nano /etc/apache2/sites-available/final-project.conf
```

2. Contingut de l'arxiu: Copia i enganxa la següent configuració (ajusta la ruta /home/yaros/... si el teu usuari és diferent):

```bash
<VirtualHost *:80>
    ServerName final-project.local
    DocumentRoot /home/yaros/projectes/final-project-YarosCirvianum/backend/public

    <Directory /home/yaros/projectes/final-project-YarosCirvianum/backend/public>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        DirectoryIndex index.php
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/final-project_error.log
    CustomLog ${APACHE_LOG_DIR}/final-project_access.log combined
</VirtualHost>
```

3. Activar el lloc i reiniciar Apache:

```bash
# Activar la nova configuració
sudo a2ensite final-project.conf

# Assegurar que el mòdul rewrite està actiu (necessari per Laravel)
sudo a2enmod rewrite

# Reiniciar el servidor per aplicar canvis
sudo systemctl reload apache2
```

4. Configurar el fitxer Hosts: Perquè el teu ordinador sàpiga que final-project.local és la teva pròpia màquina.

Linux/Mac: sudo nano /etc/hosts

Windows: Editar C:\Windows\System32\drivers\etc\hosts (com a Administrador)

Afegir la línia al final:

```bash
127.0.0.1   final-project.local
```

## Resum d'Accés

Un cop completats tots els passos, el sistema està operatiu:

1. Backend / API: Accessible a http://final-project.local

2. Frontend (React): Accessible a http://localhost:5173 (mentre npm run dev estigui actiu).

3. Panell Admin (Blade): Accessible a http://final-project.local/ que es redirigeix automaticament a http://final-project.local/admin/login

4. Gestió BD: Accessible via http://final-project.local/phpmyadmin/ o http://localhost/phpmyadmin (si el tens instal·lat).