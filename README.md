INVENTARIO DEL MOBILIARIO 
¡Bienvenid@ al Inventario del Mobiliario! Este proyecto se desarrolló para gestionar el préstamo y seguimiento de herramientas dentro del SENA. 🔧🔍
El objetivo principal es registrar y organizar los préstamos y pedidos de manera eficiente, permitiendo a los usuarios solicitar herramientas y productos de forma rápida y controlada.
______________
📂 Estructura del Proyecto 🗂️
El sistema de inventario está compuesto por dos partes principales que trabajan de manera conjunta para brindar una solución completa:
•	Backend_Proyect_SENA: 🔧 Contiene la lógica, las APIs y la conexión a la base de datos. Implementado en Node.js con Express.
•	Frontend_Proyecto_SENA-laura: 💻 Interfaz de usuario desarrollada en tecnologías web, incluyendo Tailwind CSS, para facilitar la gestión de las herramientas y el flujo de préstamos.
•	node_modules/: 📦 Directorio que almacena todas las dependencias necesarias para ejecutar el proyecto. Se genera automáticamente con el comando npm install.
Ambos componentes se integran para proporcionar una experiencia unificada, donde el backend se encarga del manejo de la información y el frontend permite la interacción con el sistema.
______________
🚀 Cómo Configurar el Entorno 🔧
Antes de ejecutar el proyecto, asegúrate de configurar las variables de entorno adecuadamente:
1️⃣   Configuración Principal
Estas variables son utilizadas en entornos de desarrollo:
PUERTO=9100
DOCUMENTO_ADMIN=1234567890
CONTRASEÑA_ADMIN=SenaMobiliario
CLAVE_SECRETA=CLAVE_SECRETA_ADMIN2654
2️⃣   Variables para Base de Datos Local
Úsalas si trabajas en un entorno local con PostgreSQL:
PUERTO=9400
DB_HOST=127.0.0.1
DB_NAME=pruebas
DB_NOMBRE=Nueva_Backend
DB_PUERTO=5432
DB_USUARIO=postgres
DB_CONTRASEÑA=1022003147
3️⃣   Variables de Entorno del Proyecto
ENV=SENA
______________
🛠️ Tecnologías Empleadas 💻
Este repositorio hace uso de las siguientes tecnologías:
•	Frontend: HTML, CSS, JavaScript y Tailwind CSS.
•	Backend: Node.js con Express.
•	Base de Datos: PostgreSQL.
Cada proyecto puede utilizar tecnologías adicionales. Consulta cada carpeta para más detalles. 📁
______________
📜 Guía de Uso 🔍
1.	Clonar el Repositorio:
git clone https://github.com/valsolano11/Repository_General.git
2.	Accede al proyecto de interés:
cd Backend_Proyect_SENA
3.	Instalar las dependencias:
npm install
Esto creará el directorio node_modules/ con todas las dependencias necesarias.
4.	Configura las variables de entorno como se indica en la sección anterior
