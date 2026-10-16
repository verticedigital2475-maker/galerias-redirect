module.exports = async function(req, res) {
  let clienteId = req.url.substring(1);
  if (clienteId.includes('?')) clienteId = clienteId.split('?')[0];

  const urlScript = "https://script.google.com/macros/s/AKfycbxiL1vmjzB01l6vpVomq1Ja0vqok35HX03Ha6Np9eX-cqTzoAqQ6E-qSGNP6R8VfWex_g/exec";
  let imageUrl = "https://fotosvd.vercel.app/logo.jpg";
  let titulo = "Galería de fotos - Vértice Digital";

  try {
    if (clienteId && clienteId !== "favicon.ico" && clienteId !== "api/redireccion") {
      const respuesta = await fetch(`${urlScript}?api=true&cliente=${clienteId}&t=${Date.now()}`);
      const datos = await respuesta.json();
      if (datos && datos.imagen) imageUrl = datos.imagen;
      if (datos && datos.titulo) titulo = datos.titulo;
    }
  } catch (error) {
    console.error("Error al consultar la imagen", error);
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>${titulo}</title>
        <meta property="og:title" content="${titulo}">
        <meta property="og:description" content="Selecciona tus fotos favoritas de la sesión.">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:type" content="website">
        
        <script>
            if("${clienteId}" !== "" && "${clienteId}" !== "favicon.ico" && "${clienteId}" !== "api/redireccion") {
                window.location.href = "${urlScript}?cliente=${clienteId}";
            }
        </script>
    </head>
    <body style="background-color: #0f172a; color: white; text-align: center; font-family: sans-serif; padding-top: 50px;">
        <h2>Cargando tu galería... 📸</h2>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).send(html);
};
