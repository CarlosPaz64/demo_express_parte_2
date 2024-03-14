// controllers/productos.js
const productos = [
    { id: 1, nombre: 'Marvels Spider-Man Remasterizado', descripcion: 'Descripción del Producto 1', cantidad: 10, precio: 750, imagen: 'producto1.jpg' },
    { id: 2, nombre: 'Marvels Spider-Man 2', descripcion: 'Descripción del Producto 2', cantidad: 15, precio: 1200, imagen: 'producto2.jpg' },
    { id: 3, nombre: 'Halo Infinite', descripcion: 'Descripción del Producto 3', cantidad: 5, precio: 500, imagen: 'producto3.jpg' },
    { id: 4, nombre: 'Super Mario Party', descripcion: 'Descripción del Producto 4', cantidad: 10, precio: 750, imagen: 'producto4.jpg' },
    { id: 5, nombre: 'Super Smash Bros Ultimate', descripcion: 'Descripción del Producto 5', cantidad: 15, precio: 450, imagen: 'producto5.jpg' },
    { id: 6, nombre: 'Red Dead Redemption', descripcion: 'Descripción del Producto 6', cantidad: 5, precio: 350, imagen: 'producto6.jpg' },
    { id: 7, nombre: 'Red Dead Redemption 2', descripcion: 'Descripción del Producto 7', cantidad: 5, precio: 890, imagen: 'producto7.jpg' },
    { id: 8, nombre: 'Fallout 4: Game Of The Year', descripcion: 'Descripción del Producto 7', cantidad: 5, precio: 500, imagen: 'producto8.jpg' },
    { id: 9, nombre: 'Jurassic World Evolution', descripcion: 'Descripción del Producto 7', cantidad: 5, precio: 350, imagen: 'producto9.jpg' },
    { id: 10, nombre: 'Metroid: Dread', descripcion: 'Descripción del Producto 7', cantidad: 5, precio: 400, imagen: 'producto10.jpg' },
    { id: 11, nombre: 'Grand Theft Auto 5', descripcion: 'Descripción del Producto 7', cantidad: 5, precio: 200, imagen: 'producto11.jpg' },
    { id: 12, nombre: 'EA Sports FC 24', descripcion: 'Descripción del Producto 7', cantidad: 5, precio: 600, imagen: 'producto12.jpg' }
  ];
  
  function getProductos() {
    return productos;
  }
  
  function getProductoPorId(id) {
    return productos.find(producto => producto.id === parseInt(id));
  }
  
  module.exports = {
    getProductos,
    getProductoPorId
  };
  