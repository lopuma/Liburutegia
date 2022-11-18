# Liburudenda

APP para el control de libro de la sociedad : ' San Miguel'

![This is an image](https://github.com/lopuma/Liburudenda/blob/master/src/public/img/APPLiburutegia.png)

## ** Primero clonar el repositorio. **


`git clone https://github.com/lopuma/Liburudenda.git`


## ** Segundo Instalaciones de los siguientes Servicios Necesarios. **


#### Actualiza Sistema operativo: Ubuntu 22
    
```console
sudo apt update
```
#### MySql

```console
sudo apt install mysql-server
```
  > Comprobar
```console   
sudo systemctl status mysql
```
##### Configurar mysql

```console
sudo mysql -u root

mysql> USE mysql;
mysql> UPDATE user SET plugin='mysql_native_password' WHERE User='root';
mysql> FLUSH PRIVILEGES;
mysql> exit;
sudo service mysql restart

```

#### Creamos la BD
```
mysql -u root

mysql> CREATE DATABASE sanmiguel;
mysql> exit;
```
#### Copiar la BD a MySql
```console
   mysqldump -u root sanmiguel < /home/lopuma/Liburudenda/data/sanmiguel.sql
```

   > comprobar
```
mysql -u root

mysql> use sanmiguel;
mysql> show tables;
```

#### NODE
```console
sudo apt install nodejs
```
   > comprobar
```console
node --version
```
#### NPM
```console
sudo apt install npm
```
   > comprobar
```console
npm --version
```

### Configuracion de VARIABLES DE ENTORNO

   > En la carpeta env/, cambiar el nombre del archivo .env_example por .env, y modificar los valores a los necesarios para tu APP.
   
#### Iniciamos la instalacion de las librerias de NPM 

```console
   npm install
```

#### Iniciamos la aplicacion en desarrollo

```console
   npm run dev
```

#### Iniciamos la aplicacion en desarrollo

```console
   npm run prod
```

#### NGINX

```console
sudo apt install nginx
```

   > comprobar
```console
sudo systemctl status nginx
```
##### Configuracion de NGINX

   > declarar las siguientes variables
  
```console
NGINX_PORT="80"
NGINX_HOST="example.com"
```

###### si el host es publico no se requiere el siguiente paso.
   > editar fichero hosts y añadir el hosts asignado a la aplicacion

```console
sudo vi /etc/hosts
```
   > añadir
```console
127.0.0.1 example.com www.example.com
```

   > crear directorio templates en nginx
```console
sudo mkdir /etc/nginx/templates
```

   > copiar la plantilla
```console
sudo cp nginx/templates/default.conf.template /etc/nginx/templates/
```

   > accedemos a la aplicacion

[http://example.com](http://example.com)