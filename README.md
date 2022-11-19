# Liburudenda

APP para el control de libro de la sociedad : ' San Miguel'

![This is an image](https://github.com/lopuma/Liburudenda/blob/master/src/public/img/APPLiburutegia.png)

## ** Primero clonar el repositorio. **


`git clone https://github.com/lopuma/Liburudenda.git`


#### ** Segundo Instalaciones de los siguientes Servicios Necesarios. **


#### Actualiza Sistema operativo: Ubuntu 22
    
```console
sudo apt update
```

---
### MySql
---

```console
sudo apt install mysql-server
```
  > Comprobar
```console   
sudo systemctl status mysql
```
#### Configurar mysql

```console
sudo mysql -u root

```
mysql> USE mysql;
mysql> UPDATE user SET plugin='mysql_native_password' WHERE User='root';
mysql> FLUSH PRIVILEGES;
mysql> exit;
```

```console
sudo service mysql restart
```

#### Creamos la BD

```
mysql -u root

mysql> CREATE DATABASE sanmiguel CHARACTER SET utf8 COLLATE utf8_general_ci;

mysql> exit;
```

#### Copiar la BD a MySql
```console
   mysql -u root sanmiguel < /home/lopuma/Liburudenda/data/sanmiguel.sql
```

   > Comprobar

```
mysql -u root

mysql> use sanmiguel;
mysql> show tables;

mysql> exit;
```

---
### NODE
---

```console
sudo apt install nodejs
```

   > Comprobar

```console
node --version
```

---
### NPM
---

```console
sudo apt install npm
```

> Comprobar

```console
npm --version
```

---
### APP
---

#### Configuracion de VARIABLES DE ENTORNO

   > En la carpeta env/, cambiar el nombre del archivo .env_example por .env, y modificar los valores a los necesarios para tu APP.
   
#### Iniciamos la instalacion de las librerias de NPM 

```console
   cd ~/Liburudenda
   npm install
```

#### Iniciamos la aplicacion en DESAROLLO

```console
   npm run dev
```

#### Iniciamos la aplicacion en PRODUCION

   > Instalar pm2

```console
sudo npm i -g pm2
```

   > Iniciamos con:

```console
   npm run prod
```

---
### NGINX
---

```console
sudo apt install nginx
```

   > Comprobar
```console
sudo systemctl status nginx
```

#### Configuracion de NGINX

##### si el host es publico no se requiere el siguiente paso.

   > Editar fichero hosts y añadir el hosts asignado a la aplicacion

```console
sudo vi /etc/hosts
```
   > Añadir

```console
127.0.0.1 example.com www.example.com
```

   > Copiar la plantilla
  
```console
sudo cp nginx/templates/default.conf.template /etc/nginx/conf.d/default.conf
```

En la configuracion de NGINX, cambiar el valor de ${NGINX_PORT}, por el puerto que correra la APP, se recomienda el puerto 80.

La variable ${NGINX_HOST} por el host de tu aplicacion e.g example.com

```console
sudo vim /etc/nginx/conf.d/default.conf
```

   > Revisamos la configuracion de NGINX, nos saldra OK y SUCCESSFUL
   
```console
sudo nginx -t
```

   > Reiniciamos NGINX

```console
sudo systemctl restart nginx.service
```

   > Accedemos a la aplicacion

[http://example.com](http://example.com)
