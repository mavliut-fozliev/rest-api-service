export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn("users", "id", {
    type: Sequelize.STRING(255),
    allowNull: false,
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn("users", "id", {
    type: Sequelize.INTEGER,
    allowNull: false,
  });
}
