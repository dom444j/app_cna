// src/controllers/compensationController.js

// Importa la definición de rangos y bonos
// (Si prefieres, puedes extraer RANKS a un archivo "ranksDefinition.js" en src/config o src/utils)
const RANKS = [
    {
      id: 1,
      name: "bronce",
      minRecompra: 50,
      percentage: 0.15,      // 15%
      pairsMin: 2,
      pairsMax: 200,
      successBonus: 0.05,    // 5%
      globalBonus: 0         // No aplica
    },
    {
      id: 2,
      name: "silver",
      minRecompra: 50,
      percentage: 0.155,     // 15.5%
      pairsMin: 10,
      pairsMax: 300,
      successBonus: 0.06,
      globalBonus: 0
    },
    {
      id: 3,
      name: "oro",
      minRecompra: 50,
      percentage: 0.16,      // 16%
      pairsMin: 50,
      pairsMax: 400,
      successBonus: 0.06,
      globalBonus: 0
    },
    {
      id: 4,
      name: "diamante",
      minRecompra: 50,
      percentage: 0.165,     // 16.5%
      pairsMin: 80,
      pairsMax: 600,
      successBonus: 0.07,
      globalBonus: 0
    },
    {
      id: 5,
      name: "diamante ejecutivo",
      minRecompra: 50,
      percentage: 0.17,      // 17%
      pairsMin: 150,
      pairsMax: 750,
      successBonus: 0.08,
      globalBonus: 0.02      // 2%
    },
    {
      id: 6,
      name: "diamante premier",
      minRecompra: 50,
      percentage: 0.175,     // 17.5%
      pairsMin: 250,
      pairsMax: 850,
      successBonus: 0.09,
      globalBonus: 0.01      // 1%
    },
    {
      id: 7,
      name: "diamante royal",
      minRecompra: 50,
      percentage: 0.18,      // 18%
      pairsMin: 350,
      pairsMax: 1000,
      successBonus: 0.1,
      globalBonus: 0.02      // 2%
    }
  ];
  
  // Importa tus modelos para actualizar la DB
  // Ajusta los nombres según tu estructura (Commissions, BinaryTree, etc.)
  const { BinaryTree, sequelize } = require("../models");
  
  /**
   * Obtiene la información del rango según el rankId.
   * @param {number} rankId 
   * @returns {object|null} Datos del rango o null si no se encuentra.
   */
  function getRankInfo(rankId) {
    return RANKS.find(r => r.id === rankId) || null;
  }
  
  /**
   * Verifica si el usuario está activado para recibir binario.
   * Reglas: al menos 2 compras y recompraPoints >= 50.
   * @param {object} userData - Debe incluir { purchaseCount, recompraPoints }.
   * @returns {boolean}
   */
  function checkUserActivation(userData) {
    if (userData.purchaseCount < 2) return false;
    if (userData.recompraPoints < 50) return false;
    return true;
  }
  
  /**
   * Calcula el pago binario.
   * @param {object} userData - Debe incluir:
   *    leftLeg: puntos en la pierna de cobro (línea corta),
   *    rightLeg: puntos en la pierna larga (banco de puntos),
   *    rankId: identificador del rango del usuario,
   *    purchaseCount, recompraPoints, etc.
   * @param {number} monthPayoutSoFar - Número de pares ya pagados en el mes.
   * @returns {object} { pairsUsed, pay, leftoverLeftLeg, leftoverRightLeg }
   */
  function calculateBinary(userData, monthPayoutSoFar) {
    // 1. Verificar activación
    if (!checkUserActivation(userData)) {
      return {
        pairsUsed: 0,
        pay: 0,
        leftoverLeftLeg: userData.leftLeg,
        leftoverRightLeg: userData.rightLeg
      };
    }
  
    // 2. Obtener info de rango
    const rankInfo = getRankInfo(userData.rankId);
    if (!rankInfo) {
      // Rango no encontrado => no se paga
      return {
        pairsUsed: 0,
        pay: 0,
        leftoverLeftLeg: userData.leftLeg,
        leftoverRightLeg: userData.rightLeg
      };
    }
  
    // 3. Calcular pares posibles
    let pairsPossible = Math.min(userData.leftLeg, userData.rightLeg);
  
    // 4. Respetar límite de pares para ese rango
    const maxPairsAvailable = Math.max(0, rankInfo.pairsMax - monthPayoutSoFar);
    const pairsUsed = Math.min(pairsPossible, maxPairsAvailable);
  
    // Si la pierna corta es 0 o no hay pares => no paga
    if (pairsUsed === 0) {
      return {
        pairsUsed: 0,
        pay: 0,
        leftoverLeftLeg: userData.leftLeg,
        leftoverRightLeg: userData.rightLeg
      };
    }
  
    // 5. Calcular el pago
    const pay = pairsUsed * rankInfo.percentage;
  
    // 6. Actualizar leftover
    const leftoverLeftLeg = userData.leftLeg - pairsUsed;
    const leftoverRightLeg = userData.rightLeg - pairsUsed;
  
    return {
      pairsUsed,
      pay,
      leftoverLeftLeg,
      leftoverRightLeg
    };
  }
  
  /**
   * Calcula el bono de éxito basado en los ingresos binarios de los directos.
   * @param {object} userData - Incluye rankId.
   * @param {number} directBinaryEarnings - Ganancias binarias de sus directos.
   * @returns {number} Monto del bono de éxito.
   */
  function applySuccessBonus(userData, directBinaryEarnings) {
    const rankInfo = getRankInfo(userData.rankId);
    if (!rankInfo) return 0;
    // Bono de éxito es un porcentaje de las ganancias directas
    return directBinaryEarnings * (rankInfo.successBonus || 0);
  }
  
  /**
   * Calcula el bono global basado en los puntos de recompra.
   * Solo aplicable para rangos 5, 6 y 7.
   * @param {object} userData - Incluye rankId.
   * @param {number} totalRecompraPoints - Puntos de recompra totales.
   * @returns {number} Monto del bono global.
   */
  function applyGlobalBonus(userData, totalRecompraPoints) {
    const rankInfo = getRankInfo(userData.rankId);
    if (!rankInfo || rankInfo.globalBonus === 0) return 0;
    return totalRecompraPoints * rankInfo.globalBonus;
  }
  
  /**
   * Procesa el pago binario de un usuario y registra la comisión en la DB.
   * @param {object} userData - info del usuario (debes tener user_id, leftLeg, rightLeg, etc.)
   * @param {number} monthPayoutSoFar - pares pagados en el mes
   * @returns {object} { pairsUsed, pay, leftoverLeftLeg, leftoverRightLeg }
   */
  async function payBinaryToUser(userData, monthPayoutSoFar) {
    // 1. Calcular binario
    const result = calculateBinary(userData, monthPayoutSoFar);
    const { pay, pairsUsed, leftoverLeftLeg, leftoverRightLeg } = result;
  
    // 2. Si no hay pago, salimos
    if (pay <= 0) {
      return result;
    }
  
    // 3. Actualizar los puntos leftover en binary_tree
    //    Suponiendo que userData.id es el ID del usuario en "users"
    //    y que en binary_tree se almacena user_id = userData.id
    const [affectedRows] = await sequelize.query(
      `UPDATE binary_tree
       SET left_leg = ?, right_leg = ?
       WHERE user_id = ?`,
      { replacements: [leftoverLeftLeg, leftoverRightLeg, userData.id] }
    );
  
    // 4. Insertar el registro en la tabla commissions
    //    type='binary' indica que es pago binario
    await sequelize.query(
      `INSERT INTO commissions (user_id, amount, pairs_used, type)
       VALUES (?, ?, ?, 'binary')`,
      { replacements: [userData.id, pay, pairsUsed] }
    );
  
    return result;
  }
  
  module.exports = {
    getRankInfo,
    checkUserActivation,
    calculateBinary,
    applySuccessBonus,
    applyGlobalBonus,
    payBinaryToUser // <-- Nueva función para integrar con la DB
  };
  