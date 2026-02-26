# Manual técnico - CLOUDCINEMA
### Curso: Seminario de Sistemas 1
### Sección: A
### Práctica 1

## Integrantes - Grupo 2:

| Nombre | Carné |
| --- | --- |
| nombre1 | carné1 |
| nombre2 | carné2 |
| Nelson Emanuel Cún Bálan | 201222010 |

## Introducción
El presente documento describe el proceso técnico para el desarrollo del sistema CloudCinema, una aplicación web que permite a los usuarios ver un catálogo de películas, crea listas de reproducción y poder ver las películas en streaming. El sistema se implementó utilizando servicios de Amazon Web Services (AWS) para garantizar escalabilidad, seguridad y alta disponibilidad. Este manual técnico detalla la arquitectura del sistema, los usuarios IAM y políticas de seguridad, así como capturas de pantalla de los componentes clave del sistema.

## Objetivos
### Objetivo General
Desarrollar una aplicación web de streaming de películas utilizando servicios de AWS, que permita a los usuarios acceder a un catálogo de películas, crear listas de reproducción y ver las películas en streaming de manera segura y eficiente.

### Objetivos Específicos
1. Diseñar y configurar la arquitectura de AWS para soportar la aplicación CloudCinema.
2. Implementar políticas de seguridad utilizando IAM para controlar el acceso a los recursos de AWS.
3. Desplegar la aplicación web en una instancia EC2 y configurar una base de datos RDS para almacenar la información de los usuarios y las películas.
4. Integrar almacenamiento de imagenes utilizando S3 para almacenar los archivos multimedia de las películas.

## Arquitectura
El sistema CloudCinema está basado en una arquitectura distribuida en la nube, diseñada para separar responsabilidades entre presentación, lógica de negocio, almacenamiento y base de datos. Esta segmentación permite escalabilidad, mantenimiento independiente de componentes y alta disponibilidad.

La arquitectura se compone de los siguientes elementos:

### App web pública
La aplicación web se despliega en una instancia EC2, que actúa como servidor web y maneja las solicitudes de los usuarios. Sus características incluyen:
- 

### Load balancer
El load balancer distribuye el tráfico entrante entre las instancias de backend, asegurando alta disponibilidad y escalabilidad. Permite manejar picos de tráfico y garantiza que la aplicación esté siempre accesible.

### Servidor Web / NodeJS

El servidor NodeJS implementa una API REST desarrollada con Express.

Responsabilidades:

- Gestión de usuarios (registro, login, edición).
- Gestión del catálogo de películas.
- Administración de listas de reproducción.
- Construcción de URLs públicas para imágenes almacenadas en S3.
- Validación de datos y control de errores.
- Integración con base de datos MySQL (RDS).

Estructura modular:
- Routes
- Controllers
- Services
- Configuración de entorno

Este servidor se diseñó para ser completamente compatible con el frontend React y tener igual funcionalidad que el servidor Python, permitiendo una transición fluida entre ambos lenguajes de backend.

### Servidor Web / Python
El servidor Python (Flask) representa una implementación alternativa del backend, con la misma funcionalidad que el servidor NodeJS. 

Características:

- API REST equivalente a la implementada en NodeJS.

### Bucket de imágenes S3
El almacenamiento de imágenes se realiza mediante un bucket de Amazon S3, que ofrece alta durabilidad y disponibilidad para los archivos multimedia de las películas.
Se utilizan prefijos estructurados:
- fotos_perfil/
- fotos_publicas/

Funciones principales:
- Almacenamiento de imágenes de perfil de usuario y portadas de películas.
- Generación de URLs públicas para acceso a las imágenes desde la aplicación web.

Las URLs públicas siguen el formato:
```
https://<bucket-name>.s3.<region>.amazonaws.com/<key>
```

### Base de datos RDS

La base de datos se implementa utilizando Amazon RDS con MySQL, proporcionando un entorno gestionado para almacenar la información de los usuarios, películas y listas de reproducción.

Características técnicas:
- Motor de base de datos: MySQL
- Integridad referencial para garantizar la consistencia de los datos.
- Escalabilidad vertical para manejar el crecimiento de datos y tráfico.
- Hash MD5 para el almacenamiento seguro de contraseñas de usuarios.

### Flujo del sistema
1. El usuario accede a la aplicación web a través de su navegador.
2. La aplicación web envía solicitudes al servidor NodeJS o Python para gestionar la autenticación, el catálogo de películas y las listas de reproducción.
3. El servidor procesa las solicitudes, interactúa con la base de datos RDS para almacenar o recuperar información, y genera URLs públicas para las imágenes almacenadas en S3.
4. El usuario puede ver el catálogo de películas, crear listas de reproducción y acceder a las películas en streaming a través de la aplicación web.

## Usuarios IAM y Políticas

## Capturas de pantalla

### Bucket de S3

### EC2

### Base de datos RDS

### Aplicación web

## Conclusiones