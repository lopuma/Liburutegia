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

#### Copiar la BD a MySql
```console
   mysqldump -u root -p sanmiguel < /home/lopuma/Liburutegia/data/sanmiguel.sql
```
#### Iniciamos la instalacion de las librerias de NPM 
```console
   npm install
```