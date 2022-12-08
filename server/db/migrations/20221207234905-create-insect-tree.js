"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("InsectTrees", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			treeId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Trees"
				},
				onDelete: "CASCADE"
			},
			insectId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Insects"
				},
				onDelete: "CASCADE"
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
			}
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("InsectTrees");
	}
};
