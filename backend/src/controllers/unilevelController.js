const UNILEVEL_PLAN = require("../config/unilevelPlan");
const { User, Transactions, UnilevelTree } = require("../models");
const { Sequelize } = require("sequelize");

/**
 * 📌 Determina el nivel de activación del usuario basado en sus puntos.
 */
function getActivationLevel(points) {
  return (
    UNILEVEL_PLAN.activationThresholds.find(
      (threshold) => points >= threshold.minPoints && points <= threshold.maxPoints
    ) || null
  );
}

/**
 * 📌 Calcula el Bono de Activación Unilevel
 */
async function calculateUnilevelBonus(userId, totalPoints) {
  try {
    console.log(`🔹 Ejecutando calculateUnilevelBonus para userId: ${userId}`);

    const user = await User.findByPk(userId, { raw: true });
    if (!user) return { error: "Usuario no encontrado" };

    const activation = getActivationLevel(totalPoints);
    if (!activation) return { error: "No califica para activación Unilevel" };

    let totalBonus = 0;
    const userTree = await UnilevelTree.findOne({ where: { user_id: userId }, raw: true });
    if (!userTree) return { error: "El usuario no tiene estructura Unilevel." };

    let currentSponsor = userTree.sponsor_id;
    console.log(`✅ Iniciando cálculo de bono Unilevel para usuario ${userId} con BD: ${activation.name}`);

    for (const level of UNILEVEL_PLAN.levelPercentages) {
      if (!currentSponsor) break;

      const percentage = level[activation.name];
      if (typeof percentage !== "number") continue;

      const bonusAmount = totalPoints * percentage;
      totalBonus += bonusAmount;

      console.log(`🟢 Nivel ${level.level}: Sponsor ${currentSponsor} recibe ${bonusAmount}`);

      await Transactions.create({
        user_id: currentSponsor,
        amount: bonusAmount,
        type: "unilevel_bonus",
        level: level.level,
        related_user_id: userId,
        status: "completado",
        created_at: new Date(),
        updated_at: new Date(),
      });

      const sponsorTree = await UnilevelTree.findOne({ where: { user_id: currentSponsor }, raw: true });
      currentSponsor = sponsorTree ? sponsorTree.sponsor_id : null;
    }

    return { userId, totalBonus, activationLevel: activation.name };
  } catch (error) {
    console.error("❌ Error en calculateUnilevelBonus:", error);
    return { error: "Error interno en la calculadora de bonos Unilevel." };
  }
}

/**
 * 📌 Calcula el Bono de Éxito Unilevel
 */
async function calculateSuccessBonus(userId) {
  try {
    console.log(`🔹 Ejecutando calculateSuccessBonus para userId: ${userId}`);

    const user = await User.findByPk(userId, { attributes: ["id", "points"], raw: true });
    if (!user) return { error: "Usuario no encontrado" };

    const userPoints = user.points || 0;
    console.log(`📌 Usuario ${userId} tiene ${userPoints} puntos.`);

    const activation = getActivationLevel(userPoints);
    if (!activation) {
      console.log(`⚠️ Usuario ${userId} no tiene BD válido.`);
      return { message: "Usuario no tiene nivel BD válido." };
    }

    const successBonusPercentage = UNILEVEL_PLAN.successBonus.find(
      (b) => b.activation === activation.name
    )?.percentage || 0;

    if (!successBonusPercentage) {
      console.log(`⚠️ Usuario ${userId} no tiene porcentaje de bono de éxito.`);
      return { message: "Usuario no tiene porcentaje asignado." };
    }

    console.log(`✅ Usuario ${userId} tiene BD: ${activation.name} con ${successBonusPercentage * 100}% de bono.`);

    const directUsers = await UnilevelTree.findAll({ where: { sponsor_id: userId }, raw: true });
    if (!directUsers.length) {
      console.log(`⚠️ Usuario ${userId} no tiene directos en Unilevel.`);
      return { message: "El usuario no tiene directos en el Unilevel." };
    }

    console.log(`📌 Usuario ${userId} tiene ${directUsers.length} directos en Unilevel.`);

    const directUserIds = directUsers.map((d) => d.user_id);
    const earnings = await Transactions.findAll({
      where: { user_id: directUserIds, type: "unilevel_bonus", status: "completado" },
      attributes: [
        "user_id",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalEarnings"],
      ],
      group: ["user_id"],
      raw: true
    });

    const earningsMap = earnings.reduce((acc, row) => {
      acc[row.user_id] = parseFloat(row.totalEarnings) || 0;
      return acc;
    }, {});

    let totalSuccessBonus = 0;

    for (const direct of directUsers) {
      const totalDirectEarnings = earningsMap[direct.user_id] || 0;

      if (totalDirectEarnings <= 0) {
        console.log(`⚠️ Directo ${direct.user_id} no ha generado bono Unilevel.`);
        continue;
      }

      const successBonus = totalDirectEarnings * successBonusPercentage;
      totalSuccessBonus += successBonus;

      console.log(`🎯 Bono de Éxito: Usuario ${userId} recibe ${successBonus} por directo ${direct.user_id}`);

      await Transactions.create({
        user_id: userId,
        amount: successBonus,
        type: "success_bonus",
        related_user_id: direct.user_id,
        status: "completado",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log(`✅ Bono de Éxito total para Usuario ${userId}: ${totalSuccessBonus}`);
    return { userId, totalSuccessBonus };
  } catch (error) {
    console.error("❌ Error en calculateSuccessBonus:", error);
    return { error: "Error interno en la calculadora de bonos de éxito." };
  }
}

/**
 * 📌 Calcula el Bono Global Unilevel
 */
async function calculateGlobalBonus() {
  try {
    const { Op } = Sequelize;
    const threeMonthsAgo = new Date(new Date() - 90 * 24 * 60 * 60 * 1000);

    // ✅ Obtener total de puntos generados en unilevel_bonus en los últimos 3 meses
    const totalPoints = await Transactions.sum("amount", {
      where: {
        type: "unilevel_bonus",
        created_at: { [Op.gte]: threeMonthsAgo },
      },
    });

    // ✅ Sumar fondo acumulado previo
    const globalBonusRecord = await Transactions.findOne({
      where: { type: "global_bonus_pool" },
      attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "total"]],
      raw: true,
    });

    const accumulatedFund = globalBonusRecord?.total ? parseFloat(globalBonusRecord.total) : 0;
    const bonusPool = (totalPoints * 0.05) + accumulatedFund;

    if (!bonusPool) {
      console.log("🌍 No hay puntos suficientes para calcular el bono global.");
      return { message: "No hay fondo para distribuir en este trimestre." };
    }

    console.log(`🌍 Calculando bono global. Total puntos: ${totalPoints}, Fondo global: ${bonusPool}, Acumulado previo: ${accumulatedFund}`);

    let payments = [];

    // ✅ Verificar usuarios que han calificado al menos 2 veces en los últimos 3 meses
    for (const rankBonus of UNILEVEL_PLAN.globalBonus) {
      const qualifyingUsers = await User.findAll({
        where: {
          rank: rankBonus.rank,
          updated_at: { [Op.gte]: threeMonthsAgo },
        },
        attributes: ["id"],
        include: [
          {
            model: Transactions,
            where: {
              type: "rank_qualification",
              created_at: { [Op.gte]: threeMonthsAgo },
            },
            attributes: [[Sequelize.fn("COUNT", Sequelize.col("Transactions.id")), "qualification_count"]],
            required: true,
          },
        ],
        group: ["User.id"],
        having: Sequelize.literal("qualification_count >= 2"),
        raw: true,
      });

      if (qualifyingUsers.length === 0) continue;

      const perUserBonus = (bonusPool * rankBonus.percentage) / qualifyingUsers.length;

      for (const user of qualifyingUsers) {
        await Transactions.create({
          user_id: user.id,
          amount: perUserBonus,
          type: "global_bonus",
          status: "completado",
          created_at: new Date(),
          updated_at: new Date(),
        });

        console.log(`🎁 Bono Global: Usuario ${user.id} (${rankBonus.rank}) recibe ${perUserBonus}`);
        payments.push({ user_id: user.id, amount: perUserBonus });
      }
    }

    // ✅ Si no hubo pagos, acumular el fondo global para el siguiente trimestre
    if (payments.length === 0) {
      await Transactions.create({
        user_id: null, // No se asigna a un usuario específico
        amount: bonusPool,
        type: "global_bonus_pool",
        status: "pendiente",
        created_at: new Date(),
        updated_at: new Date(),
      });

      console.log(`🔄 No hubo calificados. Se acumula el fondo global de ${bonusPool} para el siguiente trimestre.`);
      return { message: `No hubo calificados, se acumula ${bonusPool} para el siguiente trimestre.` };
    }

    return payments;
  } catch (error) {
    console.error("❌ Error en calculateGlobalBonus:", error);
    return { error: "Error interno en la calculadora de bonos globales." };
  }
}


module.exports = {
  calculateUnilevelBonus,
  calculateSuccessBonus,
  calculateGlobalBonus,
};
