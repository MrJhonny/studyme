# Estudiame

Estudiame es una aplicación web simple y moderna para practicar preguntas de opción múltiple o simple, ideal para el estudio personal de exámenes o repasos.

## Características principales
- **Carga de preguntas** desde un archivo `.txt` con formato personalizado.
- **Soporte multilenguaje**: Español, Inglés y Francés. Detección automática por URL o idioma del navegador.
- **Interfaz moderna y responsiva** usando Bootstrap 5 y Animate.css.
- **Timer global** para el examen, con resumen automático al finalizar el tiempo.
- **Navegación fácil** entre preguntas, con botones de siguiente, anterior y mostrar respuesta.
- **Barra de progreso visual** y resumen de resultados al finalizar.
- **Sin dependencias de backend**: solo HTML, CSS y JS puro. ¡Abre el `index.html` en tu navegador y listo!

## Formato del archivo de preguntas

# 📚 Estudiame

Estudiame es una aplicación web simple y moderna para practicar preguntas de opción múltiple o simple, ideal para el estudio personal de exámenes o repasos. ¡Aprende jugando! 🎓✨

## ✨ Características principales
- 📄 **Carga de preguntas** desde un archivo `.txt` con formato personalizado.
- 🌐 **Soporte multilenguaje**: Español, Inglés y Francés. Detección automática por URL o idioma del navegador.
- 💻 **Interfaz moderna y responsiva** usando Bootstrap 5 y Animate.css.
- ⏰ **Timer global** para el examen, con resumen automático al finalizar el tiempo.
- 🧭 **Navegación fácil** entre preguntas, con botones de siguiente, anterior y mostrar respuesta.
- 📊 **Barra de progreso visual** y resumen de resultados al finalizar.
- 🚀 **Sin dependencias de backend**: solo HTML, CSS y JS puro. ¡Abre el `index.html` en tu navegador y listo!

## 📝 Formato del archivo de preguntas
Cada línea debe tener:

```
Pregunta|a)|b)|c)|d)|respuesta_correcta
```
- 📌 Ejemplo:
```
¿Cuál es la capital de Francia?|Madrid|París|Roma|Berlín|b
¿2+2=?|3|4|5|6|b
```
- ✅ Para respuestas múltiples, separa con coma: `a,c`

## 🚦 Cómo usar
1. 📥 Descarga o clona este repositorio.
2. 🖥️ Abre `index.html` en tu navegador (no requiere servidor).
3. 📂 Sube tu archivo de preguntas `.txt`.
4. ⏳ Define el tiempo y porcentaje de aprobación.
5. 🏁 ¡Comienza a estudiar!

## 🌍 Cambiar idioma
- 🏷️ Por URL: agrega `/es`, `/en` o `/fr` a la ruta (requiere estructura de carpetas o servidor local).
- 🌐 Por navegador: cambia el idioma principal en la configuración de tu navegador.

> ⚡ **Nota:**
> La detección por URL tiene prioridad sobre el idioma del navegador. Si la ruta contiene `/fr`, siempre mostrará francés, aunque tu navegador esté en español o inglés.

## 🎨 Personalización
- 📝 Edita `languages.js` para agregar o modificar idiomas.
- 🎨 Cambia estilos en `style.css` o usa tus propios fondos.

## 🗂️ Estructura del proyecto
- `index.html` — Interfaz principal
- `main.js` — Lógica de la app
- `languages.js` — Traducciones
- `style.css` — Estilos personalizados
- `assets/` — Recursos opcionales (imágenes, ejemplos)

## 👨‍💻 Créditos
- Hecho con ❤️ para el estudio personal.
- Basado en Bootstrap 5 y Animate.css.

---

🙌 ¡Contribuciones y sugerencias son bienvenidas!
