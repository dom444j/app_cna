// controllers/binaryController.js
const db = require('../models'); // Asegúrate de que este módulo apunta a la conexión de la base de datos

// Función para calcular el bono binario
const calcularBonoBinario = async (userId) => {
    try {
        // Obtener la estructura binaria del usuario
        const usuario = await db.BinaryTree.findOne({ where: { user_id: userId } });
        if (!usuario) {
            return { success: false, message: 'Usuario no encontrado en el binario' };
        }

        // Obtener información del usuario
        const usuarioData = await db.Users.findOne({ where: { id: userId } });
        if (!usuarioData) {
            return { success: false, message: 'Usuario no encontrado en la base de datos' };
        }

        // Verificar si el usuario está activo
        const activo = usuarioData.puntos_recompra >= 50; // Mínimo de activación
        if (!activo) {
            return { success: false, message: 'Usuario inactivo, debe realizar recompras para activar el binario' };
        }

        // Obtener la pierna izquierda y derecha
        const izquierda = usuario.left_leg ? await db.BinaryTree.findOne({ where: { user_id: usuario.left_leg } }) : null;
        const derecha = usuario.right_leg ? await db.BinaryTree.findOne({ where: { user_id: usuario.right_leg } }) : null;

        const puntosIzquierda = izquierda ? izquierda.total_points : 0;
        const puntosDerecha = derecha ? derecha.total_points : 0;

        // Determinar la línea de cobro y la línea de acumulación
        const lineaCorta = Math.min(puntosIzquierda, puntosDerecha);
        const bancoPuntos = Math.abs(puntosIzquierda - puntosDerecha);

        // Obtener el rango del usuario
        const rango = obtenerRango(usuarioData.puntos_recompra, lineaCorta);
        if (!rango) {
            return { success: false, message: 'No califica para bono binario' };
        }

        // Calcular el bono
        const bono = (lineaCorta * rango.porcentaje) / 100;

        // Registrar el pago del bono binario
        await db.Transactions.create({
            user_id: userId,
            type: 'bono_binario',
            amount: bono,
            status: 'pendiente'
        });

        return { success: true, message: 'Bono binario calculado con éxito', bono };
    } catch (error) {
        console.error('Error en el cálculo del binario:', error);
        return { success: false, message: 'Error interno del servidor' };
    }
};

// Función auxiliar para obtener el rango del usuario según sus puntos
const obtenerRango = (puntos, lineaCorta) => {
    const rangos = [
        { nombre: 'bronce', puntos: 50, porcentaje: 15, minPares: 2, maxPares: 200 },
        { nombre: 'silver', puntos: 50, porcentaje: 15.5, minPares: 10, maxPares: 300 },
        { nombre: 'oro', puntos: 50, porcentaje: 16, minPares: 50, maxPares: 400 },
        { nombre: 'diamante', puntos: 50, porcentaje: 16.5, minPares: 80, maxPares: 600 },
        { nombre: 'diamante ejecutivo', puntos: 50, porcentaje: 17, minPares: 150, maxPares: 750 },
        { nombre: 'diamante premier', puntos: 50, porcentaje: 17.5, minPares: 250, maxPares: 850 },
        { nombre: 'diamante royal', puntos: 50, porcentaje: 18, minPares: 350, maxPares: 1000 },
    ];

    return rangos.find(r => lineaCorta >= r.minPares && lineaCorta <= r.maxPares);
};

module.exports = { calcularBonoBinario };

