// Datos de ejemplo de juegos
const juegos = {
  cyberraid: {
    nombre: "CyberRaid 2077",
    precio: 59.99,
    descuento: 0.4,
    descripcion:
      "Hackea el sistema y domina la ciudad en este RPG futurista lleno de acción.",
    imagen: "../imagenes/juego1.jpg",
  },
  legends: {
    nombre: "Legends of Terra",
    precio: 49.99,
    descuento: 0,
    descripcion:
      "Sumérgete en una épica fantasía y lidera tu reino hacia la victoria.",
    imagen: "../imagenes/juego2.jpg",
  },
  velocity: {
    nombre: "Velocity Drift",
    precio: 39.99,
    descuento: 0.3,
    descripcion:
      "Velocidad pura en pistas urbanas. ¿Podrás dominar todas las curvas?",
    imagen: "../imagenes/juego3.jpg",
  },
  pixelrush: {
    nombre: "Pixel Rush",
    precio: 24.99,
    descuento: 0.25,
    descripcion: "Arcade retro con mecánicas innovadoras.",
    imagen: "../imagenes/juego1.jpg", // ✅ imagen existente
  },
};

// Carrito de compras (simulado en memoria)
let carrito = [];

// Funciones del carrito
function agregarAlCarrito(juegoId) {
  const juego = juegos[juegoId];
  if (juego && !carrito.find((item) => item.id === juegoId)) {
    const precioFinal = juego.precio * (1 - juego.descuento);
    carrito.push({
      id: juegoId,
      nombre: juego.nombre,
      precio: juego.precio,
      descuento: juego.descuento,
      precioFinal: precioFinal,
      descripcion: juego.descripcion,
      imagen: juego.imagen,
    });
    mostrarAlerta(
      "¡Agregado!",
      `${juego.nombre} se agregó al carrito.`,
      "success"
    );
    actualizarCarrito();
  } else if (carrito.find((item) => item.id === juegoId)) {
    mostrarAlerta(
      "Ya en el carrito",
      "Este juego ya está en tu carrito.",
      "warning"
    );
  }
}

function eliminarDelCarrito(juegoId) {
  carrito = carrito.filter((item) => item.id !== juegoId);
  actualizarCarrito();
}

function calcularTotal() {
  return carrito.reduce((total, item) => total + item.precioFinal, 0);
}

function actualizarCarrito() {
  const contenedorCarrito = document.getElementById("items-carrito");
  const totalElement = document.getElementById("total-compra");

  if (!contenedorCarrito) return;

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `
      <div class="carrito-vacio">
        <h3>Tu carrito está vacío</h3>
        <p>Explora nuestro catálogo y agrega juegos increíbles.</p>
        <a href="index.html" class="btn-volver">Volver a la tienda</a>
      </div>
    `;
    if (totalElement) totalElement.textContent = "$0.00";
    return;
  }

  contenedorCarrito.innerHTML = "";

  carrito.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item-carrito";
    itemDiv.innerHTML = `
      <div class="item-info">
        <h4>${item.nombre}</h4>
        <p>${item.descripcion}</p>
        ${
          item.descuento > 0
            ? `<p style="color: #28a745;">🎉 ${Math.round(
                item.descuento * 100
              )}% de descuento!</p>`
            : ""
        }
        <p>Precio original: ${
          item.descuento > 0
            ? `<span style="text-decoration: line-through;">$${item.precio.toFixed(
                2
              )}</span>`
            : `$${item.precio.toFixed(2)}`
        }</p>
      </div>
      <div class="item-precio">$${item.precioFinal.toFixed(2)}</div>
      <button class="btn-eliminar" onclick="eliminarDelCarrito('${
        item.id
      }')">Eliminar</button>
    `;
    contenedorCarrito.appendChild(itemDiv);
  });

  if (totalElement) {
    totalElement.textContent = `$${calcularTotal().toFixed(2)}`;
  }
}

function procederAlPago() {
  if (carrito.length === 0) {
    mostrarAlerta(
      "Carrito vacío",
      "Agrega algunos juegos antes de proceder al pago.",
      "warning"
    );
    return;
  }

  const total = calcularTotal();
  const resumen = carrito
    .map((item) => `• ${item.nombre} - $${item.precioFinal.toFixed(2)}`)
    .join("\n");

  const confirmar = confirm(
    `🎮 Resumen de tu compra:\n\n${resumen}\n\nTotal: $${total.toFixed(
      2
    )}\n\n¿Proceder al pago?`
  );

  if (confirmar) {
    mostrarCargando();
    setTimeout(() => {
      mostrarAlerta(
        "¡Compra exitosa!",
        "Tus juegos están listos para descargar. ¡Disfrútalos!",
        "success"
      );
      carrito = [];
      actualizarCarrito();
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }, 2000);
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  actualizarCarrito();

  const btnPagar = document.getElementById("proceder-pago");
  if (btnPagar) {
    btnPagar.addEventListener("click", procederAlPago);
  }

  if (
    window.location.pathname.includes("compras.html") &&
    carrito.length === 0
  ) {
    agregarAlCarrito("cyberraid");
    agregarAlCarrito("velocity");
  }

  // Validación de formulario
  const form = document.querySelector('form[name="frm"]');
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nombre = document.getElementById("fnombre").value.trim();
      const email = document.getElementById("femail").value.trim();
      const mensaje = document.getElementById("fmensaje").value.trim();

      if (!nombre || !email || !mensaje) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Por favor, ingresa un email válido.");
        return;
      }

      document.getElementById("formulario").style.display = "none";
      document.getElementById("gracias").style.display = "block";
      form.reset();

      setTimeout(() => {
        document.getElementById("formulario").style.display = "block";
        document.getElementById("gracias").style.display = "none";
      }, 3000);
    });
  }

  // Botones "Ver más"
  const botonesVerMas = document.querySelectorAll(".juego button");
  botonesVerMas.forEach((boton) => {
    boton.addEventListener("click", function () {
      const juego = this.closest(".juego");
      const nombreJuego = juego.querySelector("h3").textContent;
      const descripcion = juego.querySelector("p").textContent;
      alert(
        `🎮 ${nombreJuego}\n\n${descripcion}\n\n¡Próximamente más detalles!`
      );
    });
  });

  // Scroll suave
  const enlaces = document.querySelectorAll('a[href^="#"]');
  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", function (e) {
      e.preventDefault();
      const destino = document.querySelector(this.getAttribute("href"));
      if (destino) {
        destino.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});

// Funciones auxiliares
function mostrarAlerta(titulo, mensaje, tipo = "info") {
  const iconos = {
    info: "🎮",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };
  alert(`${iconos[tipo]} ${titulo}\n\n${mensaje}`);
}

function mostrarCargando() {
  const overlay = document.createElement("div");
  overlay.id = "loading-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex; justify-content: center; align-items: center;
    z-index: 9999; color: white; font-size: 1.2em;
  `;
  overlay.innerHTML = "🎮 Procesando pago...";
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
  }, 2000);
}

// Exportar global
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.procederAlPago = procederAlPago;
