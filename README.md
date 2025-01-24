# Sistema para gestión de inventarios
# Gestión de Inventarios - API REST
Esta API REST permite gestionar el inventario de una cadena de tiendas minoristas. Incluye funcionalidades para administrar productos, gestionar inventarios por tienda y realizar transferencias entre ellas.
## **Instrucciones de instalación**
### **Requisitos previos**
Tener instalado:
   - [Node.js](https://nodejs.org) (versión 16 o superior)
   - [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - [DBeaver](https://dbeaver.io/) (opcional, para administrar la base de datos)
  
### **Instrucciones de instalación**
1. Clonar este repositorio:
   ```bash
   git clone https://github.com/Josephglz/inventory_management.git
   cd inventory_management`
2. Duplicar el archivo `.env.example` y renombrar a `.env`, dentro del mismo, se deberán modificar las variables de entorno siguientes: 
	  ```bash
  	DB_HOST=localhost
  	DB_PORT=5432
  	DB_NAME=inventory
  	DB_USER=admin
  	DB_PASSWORD=admin`
### **Configuración y ejecución**
1. Instalar las dependencias de Node.js:
   ```bash
   npm install`
2. Levantar servicios de docker (Es importante contar con Docker Desktop iniciado)
  ```bash
   docker-compose up -d`


### En construcción...