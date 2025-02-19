const { Purchase, Product, User, UnilevelTree, BinaryTree } = require("../models");
const { Op } = require("sequelize");
const winston = require("winston");

// Configuración de logs
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/purchases.log" })
    ]
});

// ✅ Función para encontrar una posición en el binario
async function findBinaryPosition(sponsor_id) {
    const sponsor = await BinaryTree.findOne({ where: { user_id: sponsor_id } });

    if (!sponsor) return null;

    if (!sponsor.left_leg) return { sponsor_id, position: "left_leg" };
    if (!sponsor.right_leg) return { sponsor_id, position: "right_leg" };

    // Buscar en profundidad si ambas piernas están ocupadas
    const leftUser = await BinaryTree.findOne({ where: { user_id: sponsor.left_leg } });
    if (leftUser) {
        const leftPosition = await findBinaryPosition(leftUser.user_id);
        if (leftPosition) return leftPosition;
    }

    const rightUser = await BinaryTree.findOne({ where: { user_id: sponsor.right_leg } });
    if (rightUser) {
        const rightPosition = await findBinaryPosition(rightUser.user_id);
        if (rightPosition) return rightPosition;
    }

    return null;
}

// ✅ Crear una nueva compra con activación de Unilevel y Binario
async function createPurchase(req, res) {
    try {
        const { user_id, product_id, quantity } = req.body;

        // 🚀 Validar existencia de usuario y producto
        const user = await User.findByPk(user_id);
        const product = await Product.findByPk(product_id);

        if (!user) {
            logger.warn(`Usuario ${user_id} no encontrado`);
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        if (!product) {
            logger.warn(`Producto ${product_id} no encontrado`);
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // 🚀 Registrar la compra
        const total_points = product.points * quantity;
        const newPurchase = await Purchase.create({ user_id, product_id, quantity, total_points });

        // 🚀 Contar compras previas del usuario
        const userPurchases = await Purchase.count({ where: { user_id } });

        // 🔹 Verificar si el usuario tiene patrocinador antes de activarlo
        if (!user.sponsor_id) {
            logger.warn(`Usuario ${user_id} no tiene patrocinador. No activado en Unilevel ni Binario.`);
            return res.status(201).json({
                message: "Compra registrada, pero el usuario no tiene patrocinador. No se activó en Unilevel ni Binario.",
                purchase: newPurchase
            });
        }

        // 🔹 Activar en Unilevel en la PRIMERA COMPRA
        let unilevelEntry = await UnilevelTree.findOne({ where: { user_id } });

        if (!unilevelEntry && userPurchases === 1) {
            await UnilevelTree.create({ user_id, sponsor_id: user.sponsor_id, level: 1 });
            logger.info(`✅ Unilevel activado para ${user_id} bajo ${user.sponsor_id}`);
        }

        // 🔹 Activar en Binario en la SEGUNDA COMPRA (o recompras de 50-100 puntos)
        let binaryEntry = await BinaryTree.findOne({ where: { user_id } });

        if (!binaryEntry && userPurchases >= 2 && total_points >= 50 && total_points <= 100) {
            const position = await findBinaryPosition(user.sponsor_id);

            if (position) {
                const { sponsor_id, position: leg } = position;

                await BinaryTree.create({ user_id, sponsor_id, left_leg: null, right_leg: null, total_points });

                // Actualizar la pierna del patrocinador
                await BinaryTree.update({ [leg]: user_id }, { where: { user_id: sponsor_id } });

                logger.info(`✅ Binario activado para ${user_id} en la pierna ${leg} de ${sponsor_id}`);
            } else {
                logger.warn(`⚠️ No se encontró posición en el binario para ${user_id}.`);
            }
        }

        res.status(201).json({ message: "Compra registrada con éxito", purchase: newPurchase });

    } catch (error) {
        logger.error("❌ Error al registrar compra:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Obtener todas las compras
async function getAllPurchases(req, res) {
    try {
        const purchases = await Purchase.findAll();
        res.json(purchases);
    } catch (error) {
        logger.error("❌ Error al obtener compras:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Obtener una compra por ID
async function getPurchaseById(req, res) {
    try {
        const { id } = req.params;
        const purchase = await Purchase.findByPk(id);

        if (!purchase) {
            logger.warn(`Compra ${id} no encontrada`);
            return res.status(404).json({ error: "Compra no encontrada" });
        }

        res.json(purchase);
    } catch (error) {
        logger.error("❌ Error al obtener compra:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Eliminar una compra
async function deletePurchase(req, res) {
    try {
        const { id } = req.params;
        const purchase = await Purchase.findByPk(id);
        if (!purchase) {
            logger.warn(`Compra ${id} no encontrada`);
            return res.status(404).json({ error: "Compra no encontrada" });
        }
        await purchase.destroy();
        logger.info(`Compra ${id} eliminada correctamente`);
        res.json({ message: "Compra eliminada correctamente" });
    } catch (error) {
        logger.error("❌ Error al eliminar compra:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

module.exports = {
    createPurchase,
    deletePurchase,
    getAllPurchases,
    getPurchaseById
};
