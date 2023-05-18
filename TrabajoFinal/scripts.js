let plantas = [];
let familiaSelect;
let habitatSelect;
let temperaturaSelect;

document.addEventListener("DOMContentLoaded", function() {
  fetch('https://ambientedepruebas.xyz/coderhouse/data.json')
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      plantas = data;
      familiaSelect = document.getElementById("familia");
      habitatSelect = document.getElementById("luz");
      temperaturaSelect = document.getElementById("temperatura");

      const familias = new Set();
      const habitats = new Set();
      const temperaturas = new Set();

      plantas.forEach((planta) => {
        familias.add(planta.Familia);
        habitats.add(planta.Luz);
        temperaturas.add(planta.Temperatura);
      });

      fillDropdown(familiaSelect, Array.from(familias).sort());
      fillDropdown(habitatSelect, Array.from(habitats).sort());
      fillDropdown(temperaturaSelect, Array.from(temperaturas).sort());
    })
    .catch(error => {
      console.error("Error al cargar los datos del archivo JSON:", error);
    });

  const botonBuscar = document.getElementById("buscar");
  const resultadoDiv = document.getElementById("resultado");

  botonBuscar.addEventListener("click", function(event) {
    event.preventDefault();

    if (!validarCampos()) {
      return;
    }

    const familiaSeleccionada = familiaSelect.value;
    const habitatSeleccionado = habitatSelect.value;
    const temperaturaSeleccionada = temperaturaSelect.value;

    const resultados = plantas.filter((planta) => {
      if (
        (familiaSeleccionada && planta.Familia !== familiaSeleccionada) ||
        (habitatSeleccionado && planta.Luz !== habitatSeleccionado) ||
        (temperaturaSeleccionada && planta.Temperatura !== temperaturaSeleccionada)
      ) {
        return false;
      }

      return true;
    });

    if (resultados.length === 0) {
      Swal.fire({
        title: "No se encontraron resultados",
        icon: "info",
        confirmButtonText: "Cerrar"
      });
    } else {
      let modalContent = "";
      resultados.forEach((planta) => {
        modalContent += `
          <h3>${planta["Nombre científico"] || 'Nombre científico no disponible'}</h3>
          <p><strong>Familia:</strong> ${planta.Familia}</p>
          <p><strong>Habitat:</strong> ${planta.Luz}</p>
          <p><strong>Temperatura:</strong> ${planta.Temperatura}</p>
          <p><strong>Descripción:</strong> ${planta.Descripción}</p>
          <p><strong>Cuidados básicos:</strong> ${planta["Cuidados básicos"]}</p>
          <hr>
        `;
      });

      Swal.fire({
        title: "Resultados de búsqueda",
        html: modalContent,
        icon: "success",
        confirmButtonText: "Cerrar"
      });

      const historial = JSON.parse(localStorage.getItem("historialBusquedas")) || [];
      historial.push(resultados);
      localStorage.setItem("historialBusquedas", JSON.stringify(historial));
    }
  });

  function validarCampos() {
    if (
      !familiaSelect.value &&
      !habitatSelect.value &&
      !temperaturaSelect.value
    ) {
      Swal.fire({
        title: "Debe seleccionar al menos un campo",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      return false;
    }
    return true;
  }

  function fillDropdown(selectElement, options) {
    // Agregar campo vacío adicional
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Seleccionar opción";
    selectElement.appendChild(emptyOption);

    options.forEach((option) => {
      const opcion = document.createElement("option");
      opcion.value = option;
      opcion.textContent = option;
      selectElement.appendChild(opcion);
    });
  }

  const botonLimpiar = document.getElementById("limpiarLocalStorage");
  botonLimpiar.addEventListener("click", function(event) {
    event.preventDefault();
    limpiarLocalStorage();
  });

  const botonHistorial = document.getElementById("historialBusquedas");
  botonHistorial.addEventListener("click", function(event) {
    event.preventDefault();

    const historial = JSON.parse(localStorage.getItem("historialBusquedas"));

    if (historial && historial.length > 0) {
      let modalContent = "";
      historial.forEach((resultados) => {
        resultados.forEach((planta) => {
          modalContent += `
            <h3>${planta["Nombre científico"] || 'Nombre científico no disponible'}</h3>
            <p><strong>Familia:</strong> ${planta.Familia}</p>
            <p><strong>Habitat:</strong> ${planta.Luz}</p>
            <p><strong>Temperatura:</strong> ${planta.Temperatura}</p>
            <p><strong>Descripción:</strong> ${planta.Descripción}</p>
            <p><strong>Cuidados básicos:</strong> ${planta["Cuidados básicos"]}</p>
            <hr>
          `;
        });
      });

      Swal.fire({
        title: "Historial de Búsquedas",
        html: modalContent,
        icon: "info",
        confirmButtonText: "Cerrar"
      });
    } else {
      Swal.fire({
        title: "No hay historial de búsquedas",
        icon: "info",
        confirmButtonText: "Cerrar"
      });
    }
  });
});

function limpiarLocalStorage() {
  localStorage.removeItem("plantas");
  localStorage.removeItem("historialBusquedas");
}
