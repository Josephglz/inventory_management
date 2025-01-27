# Sistema para gestión de inventarios

## **Gestión de Inventarios - API REST**
Esta API REST permite gestionar el inventario de una cadena de tiendas minoristas. Incluye funcionalidades para:
- Administrar productos
- Gestionar inventarios por tienda
- Realizar transferencias entre tiendas
- Alertar sobre productos con stock bajo

---

## **Instrucciones de instalación**

### **Requisitos previos**
Asegúrate de tener instalado:
- [Node.js](https://nodejs.org) (versión 16 o superior)
- [Docker](https://www.docker.com/products/docker-desktop) (Desktop o Engine)
- [DBeaver](https://dbeaver.io/) (opcional, para administrar la base de datos)

---

### **Instrucciones de instalación**
1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Josephglz/inventory_management.git
   cd inventory_management
   ```

2. **Duplicar el archivo `.env.example`** y renombrarlo a `.env`. Dentro del archivo `.env`, asegúrate de configurar correctamente las siguientes variables de entorno:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=inventory
   DB_USER=admin
   DB_PASSWORD=admin
   ```

---

### **Configuración y ejecución**

1. **Instalar las dependencias de Node.js**:
   ```bash
   npm install
   ```

2. **Levantar los servicios con Docker**:
   Asegúrate de tener Docker corriendo antes de ejecutar este comando:
   ```bash
   docker compose up -d
   ```

3. **Verificar el estado de los contenedores**:
   ```bash
   docker ps
   ```

4. **Probar la conexión a la base de datos** (opcional):
   Utiliza una herramienta como DBeaver para conectarte a la base de datos PostgreSQL con los valores de configuración en `.env`.

5. **Ejecutar la aplicación**:
   Si deseas ejecutarla en modo desarrollo:
   ```bash
   npm run dev
   ```
   Para ejecutarla en modo producción:
   ```bash
   npm start
   ```

---

## **Rutas de la API**

### **1. Gestión de Productos**
| Método | Ruta                     | Descripción                                           | Datos de entrada                    |
|--------|--------------------------|-------------------------------------------------------|-------------------------------------|
| GET    | `/api/products`          | Listar todos los productos                           | Parámetros opcionales: `category`, `minPrice`, `maxPrice`, `minStock`, `maxStock`, `page`, `limit` |
| GET    | `/api/products/:id`      | Obtener un producto por ID                           | Ninguno                             |
| POST   | `/api/products`          | Crear un nuevo producto                              | `name`, `description`, `category`, `price`, `sku` |
| PUT    | `/api/products/:id`      | Actualizar un producto existente                     | `name`, `description`, `category`, `price`, `sku` |
| DELETE | `/api/products/:id`      | Eliminar un producto por ID                          | Ninguno                             |

---

### **2. Gestión de Stock**
| Método | Ruta                          | Descripción                                        | Datos de entrada                               |
|--------|-------------------------------|--------------------------------------------------|-----------------------------------------------|
| GET    | `/api/stores/:id/inventory`   | Obtener inventario de una tienda específica      | Ninguno                                       |
| POST   | `/api/inventory/transfer`     | Transferir productos entre tiendas               | `productId`, `sourceStoreId`, `targetStoreId`, `quantity` |
| GET    | `/api/inventory/alerts`       | Listar productos con stock bajo                  | Parámetro opcional: `storeId`                 |

---

## **Pruebas**

### **Pruebas unitarias**
Las pruebas unitarias están desarrolladas con Jest y están configuradas para garantizar una cobertura del 80% o superior. Para ejecutarlas:
```bash
npm run test
```

### **Pruebas de integración**
Los flujos críticos de la API han sido cubiertos mediante pruebas de integración. Se aseguran los siguientes casos:
- Gestión de productos (CRUD completo)
- Transferencia de inventario
- Alertas de stock bajo

Ejecuta estas pruebas con:
```bash
npm run test
```

### **Pruebas de carga**
Para realizar pruebas de carga con 500 requests por segundo:
1. Instalar [Artillery](https://artillery.io/):
   ```bash
   npm install -g artillery
   ```
2. Ejecutar el archivo de configuración `loadtest.yml`:
   ```bash
   artillery run tests/loads/load-test.yml
   ```

---

## **Despliegue**
El despliegue de la API se realizó a través de DigitalOcean, mediante un droplet con Linux Centos 9.
Se utilizó docker para la creación de los contenedores de la base de datos y la aplicación (API) y posteriormente
se realizó el despliegue de la aplicación en el droplet.

Una vez que se tiene el droplet con la aplicación corriendo, se puede acceder a la API a través de la siguiente URL:
```bash
http://64.23.155.12/api
```

---

## **Contacto**
- Autor: Joseph Gonzalez
- GitHub: [https://github.com/Josephglz](https://github.com/Josephglz)
- Email: joseph220199@gmail.com

---