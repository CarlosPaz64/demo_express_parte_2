// controllers/clientes.js
let clientes = []; // Inicializamos un array vacío para almacenar los clientes

function agregarCliente(nombre, apellido) {
    clientes.push({ nombre, apellido }); // Agregamos el nuevo cliente al array
}

function obtenerClientes() {
    return clientes; // Devolvemos todos los clientes almacenados
}

module.exports = {
    agregarCliente,
    obtenerClientes
};