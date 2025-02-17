// Importa la función que quieres probar
const { calculateSuccessBonus } = require("../controllers/unilevelController");

async function test() {
    const userId = 1; // Cambia esto por un ID válido
    console.log(`🔹 Ejecutando test para calculateSuccessBonus con userId: ${userId}`);

    try {
        const result = await calculateSuccessBonus(userId);
        console.log("✅ Resultado del Bono de Éxito:", result);
    } catch (error) {
        console.error("❌ Error al ejecutar el test:", error);
    }
}

test();
