const { Product } = require("../models");

// ✅ Obtener todos los productos
async function getAllProducts(req, res) {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error("❌ Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Obtener producto por ID
async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        console.error("❌ Error al obtener producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Agregar nuevo producto (solo Admin)
async function createProduct(req, res) {
    try {
        const { name, description, price, points, stock, category, image_url } = req.body;

        // Verifica si ya existe un producto con el mismo nombre
        const existingProduct = await Product.findOne({ where: { name } });
        if (existingProduct) {
            return res.status(400).json({ error: "El producto ya existe" });
        }

        const newProduct = await Product.create({
            name, description, price, points, stock, category, image_url
        });

        res.status(201).json({ message: "Producto creado con éxito", product: newProduct });
    } catch (error) {
        console.error("❌ Error al crear producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Actualizar producto (solo Admin)
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, points, stock, category, image_url } = req.body;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await product.update({ name, description, price, points, stock, category, image_url });
        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Eliminar producto (solo Admin)
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await product.destroy();
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
