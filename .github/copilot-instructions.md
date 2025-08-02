# Copilot Instructions for AI Coding Agents

## Contexto y objetivo
Este proyecto es una web simple para estudio personal. Permite cargar un archivo `.txt` con preguntas y respuestas, mostrando una interfaz para navegar, ver progreso y controlar el tiempo de estudio.

## Stack y estructura
- Vanilla JS, HTML5 y CSS3. No se usan frameworks ni herramientas de build.
- Estructura principal:
  - `index.html`: Estructura y layout de la app.
  - `style.css`: Estilos globales y de componentes.
  - `main.js`: Lógica de carga de archivo, parsing, navegación, temporizador y progreso.
  - `assets/`: Carpeta para recursos futuros (imágenes, ejemplos, etc).

## Convenciones y patrones
- El archivo `.txt` debe tener bloques de pregunta y respuesta separados por una línea vacía. Ejemplo:
  ```
  ¿Pregunta 1?
  Respuesta 1

  ¿Pregunta 2?
  Respuesta 2
  ```
- El temporizador se reinicia en cada pregunta y muestra la respuesta automáticamente al agotarse.
- Los botones "Anterior", "Siguiente" y "Mostrar respuesta" controlan la navegación y visibilidad.
- El progreso se muestra como fracción y barra visual.

## Flujo de trabajo
- No requiere build ni dependencias externas.
- Abrir `index.html` en el navegador para usar.
- Actualiza este archivo si se agregan nuevas funcionalidades, convenciones o dependencias.

---

Mantén este archivo actualizado para facilitar la colaboración y la productividad de agentes AI y desarrolladores humanos.
