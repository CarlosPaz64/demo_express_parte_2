const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const productosController = require('./controllers/productos');
const clientesController = require('./controllers/clientes');
const bodyParser = require('body-parser'); // Importa body-parser

// Configurar middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar middleware para manejar sesiones
app.use(session({
  secret: 'secreto', // Clave secreta para firmar la cookie de sesión
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.carrito = req.session.carrito || []; // Funcion para darle seguimiento al carrito de compra 
  // de una sesion en específico
  next();
});

// Middleware para acceder a la sesión en todas las vistas
app.use((req, res, next) => {
    res.locals.cliente = req.session.cliente || null; // Guarda el cliente en res.locals para accederlo en las vistas
    next();
  });

// Configuración de la plantilla Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar archivos estáticos en la carpeta 'public'
app.use(express.static('public'));
app.use(express.json());

// Ruta para la vista de registro de cliente
app.get('/registro_cliente', (req, res) => {
    res.render('registro_cliente', { title: 'Registro de Cliente' });
});

// Manejar el registro de clientes
app.post('/registro_cliente', (req, res) => {
    const { nombre, apellido } = req.body;
    console.log('Datos del cliente:', nombre, apellido);
    clientesController.agregarCliente(nombre, apellido); // Agrega el cliente al controlador de clientes
    req.session.cliente = { nombre, apellido }; // Guarda el nombre y apellido del cliente en la sesión
    console.log('Cliente registrado:', req.session.cliente); // Imprime los datos del cliente guardados en la sesión
    res.redirect('/');
});

// Ruta para la página de inicio
app.get('/', (req, res) => {
    const cliente = req.session.cliente; // Obtén los datos del cliente almacenados en la sesión
    console.log('Datos del cliente en la página de inicio:', cliente); // Imprime los datos del cliente en la consola
    res.render('index', { title: 'Tienda de videojuegos: Legendary Collection' });
}); 


// Ruta para el catálogo de productos
app.get('/catalogo', (req, res) => {
    const productos = productosController.getProductos();
    res.render('catalogo', { title: 'Catálogo de Productos', productos });
});

// Ruta para buscar productos
app.get('/buscar-producto', (req, res) => {
    const query = req.query.q.toLowerCase();
    const productos = productosController.getProductos();
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query) || producto.descripcion.toLowerCase().includes(query)
    );
    res.render('catalogo', { title: 'Resultados de la Búsqueda', productos: productosFiltrados });
});


// Ruta para el detalle de producto
app.get('/producto/:id', (req, res) => {
    const idProducto = req.params.id;
    const producto = productosController.getProductoPorId(idProducto);
    res.render('producto', { title: 'Detalle del Producto', producto });
});

// Ruta para el carrito de compra
app.get('/carrito', (req, res) => {
  let carrito = req.session.carrito || []; // Obtiene el carrito de la sesión del usuario, si no existe, crea un nuevo carrito vacío
    res.render('carrito', { title: 'Carrito de Compra', carrito });
});

// Ruta para agregar un producto al carrito
app.post('/agregar-al-carrito/:id', (req, res) => {
  const idProducto = req.params.id;
  const producto = productosController.getProductoPorId(idProducto);
  if (!req.session.cliente) {
    return res.redirect('/registro_cliente');
}
  if (producto && producto.cantidad > 0) {
      let carrito = req.session.carrito || [];
      let productoEnCarrito = carrito.find(item => item.id === idProducto);
      if (productoEnCarrito) {
          productoEnCarrito.cantidad++;
      } else {
          carrito.push({ id: idProducto, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
      }
      producto.cantidad--;
      req.session.carrito = carrito;
      res.redirect('/catalogo');
  } else {
      res.status(404).send('Producto no encontrado o no disponible');
  }
});

// Ruta para el detalle de compra
app.get('/detalle-compra', (req, res) => {
    let carrito = req.session.carrito || []; // Obtiene el carrito de la sesión del usuario, si no existe, crea un nuevo carrito vacío
    res.render('detalle-compra', { title: 'Detalle de Compra', carrito});
});

// Ruta para actualizar la cantidad de un producto en el carrito
app.post('/actualizar-cantidad/:id/:cantidad', (req, res) => {
    const idProducto = req.params.id;
    const cantidad = parseInt(req.params.cantidad);
    let carrito = req.session.carrito || [];
    const item = carrito.find(item => item.id === idProducto);
    const producto = productosController.getProductoPorId(idProducto);
    if (item) {
        const cantidadNueva = item.cantidad + cantidad;
        if (cantidadNueva > 0 && cantidad <= producto.cantidad) {
            item.cantidad = cantidadNueva;
            // item.precio = item.cantidad * producto.precio;
            producto.cantidad -= cantidad;
            if (item.cantidad === 0) {
                carrito = carrito.filter(item => item.id !== idProducto);
            }
        }
    }
    req.session.carrito = carrito;
    res.redirect('/carrito');
});

// Ruta para eliminar un producto del carrito
app.post('/eliminar-del-carrito/:id', (req, res) => {
    const idProducto = req.params.id;
    let carrito = req.session.carrito || []; // Obtiene el carrito de la sesión del usuario, si no existe, crea un nuevo carrito vacío
    const itemIndex = carrito.findIndex(item => item.id === idProducto);
    if (itemIndex !== -1) {
      const removedItem = carrito.splice(itemIndex, 1)[0];
      const producto = productosController.getProductoPorId(idProducto);
      if (producto) {
        producto.cantidad += removedItem.cantidad; // Modifica la cantidad del producto en stock
      }
    }
    req.session.carrito = carrito; // Actualiza el carrito en la sesión
    res.redirect('/carrito');
});

// Middleware para procesar la compra
app.post('/procesar-compra', (req, res) => {
    // Aquí iría la lógica para procesar la compra, por ejemplo, actualizar la base de datos y vaciar el carrito
    const carrito = req.session.carrito || []; // Obtiene el carrito de la sesión del usuario

    // Lógica para procesar la compra...
    if (!req.session.cliente) {
        return res.status(403).send('Debes estar registrado para comprar');
    }

    // Vaciar el carrito después de procesar la compra
    req.session.carrito = [];

    // Obtener el nombre y apellido del cliente desde la sesión
    const { nombre, apellido } = req.session.cliente;

    // Renderizar la vista de confirmación de compra con el nombre, apellido y carrito
    res.render('confirmacion-compra', { title: 'Compra Exitosa', nombre, apellido, carrito });
});

app.get('/cerrar_sesion', (req, res) => {
    // Lógica para cerrar sesión, por ejemplo, eliminando el cliente de la sesión
    delete req.session.cliente;
  
    // Redirige al usuario a la página de inicio
    res.redirect('/');
  });
  
// Puerto en el que escucha el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
