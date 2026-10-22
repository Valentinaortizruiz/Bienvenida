# Página de bienvenida sitti (enlace para nuevos talentos)

Página que se envía a cada nuevo talento. Solo abre con un enlace personal generado en el **Panel de inducción**, y ese enlace deja de funcionar a los 7 días.

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página: qué es sitti, mapa de la sede, manual de presentación personal y los primeros 2 meses |
| `talentos-sitti.jpg` | Imagen de bienvenida |
| `middleware.js` | Revisa que el enlace sea válido y no esté vencido antes de mostrar la página |

## Publicarla por primera vez

1. En GitHub, crea un repositorio nuevo (por ejemplo `Bienvenida`) y sube estos 3 archivos.
2. En Vercel: **Add New → Project**, importa ese repositorio y, antes de **Deploy**, abre **Environment Variables**:
   - Nombre: `LINK_SECRET`
   - Valor: la clave que aparece en el Panel de inducción → pestaña **Link para nuevos talentos** → **Configuración** → **Copiar clave**.
3. Pulsa **Deploy** y copia la dirección que te da Vercel (por ejemplo `https://bienvenida-sitti.vercel.app`).
4. En el panel, en esa misma **Configuración**, pega la dirección y pulsa **Guardar dirección**.

Desde ahí, cada vez que pulses **Generar enlace** sale un enlace listo para copiar, con su fecha de vencimiento.

## Importante

- La clave **nunca** se sube a GitHub (el repositorio es público). Solo va en Vercel.
- Si cambias la clave en Vercel, los enlaces que ya enviaste dejan de funcionar.
- Quien abra la dirección sin enlace, o con uno vencido, ve un aviso para pedirle uno nuevo a Experiencia y Bienestar.
- El mapa 3D se carga desde https://onboarding-two-hazel.vercel.app, que sigue siendo público.
