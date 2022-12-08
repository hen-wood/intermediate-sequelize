"use strict";
const { Insect, Tree } = require("../models");
const { Op } = require("sequelize");
const seedData = [
	{
		insect: { name: "Western Pygmy Blue Butterfly" },
		trees: [
			{ tree: "General Sherman" },
			{ tree: "General Grant" },
			{ tree: "Lincoln" },
			{ tree: "Stagg" }
		]
	},
	{
		insect: { name: "Patu Digua Spider" },
		trees: [{ tree: "Stagg" }]
	}
];
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert("InsectTrees", [
			{
				name: "John Doe",
				isBetaMember: false
			}
		]);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	}
};
