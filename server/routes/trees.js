// Instantiate router - DO NOT MODIFY
const express = require("express");
const router = express.Router();

/**
 * BASIC PHASE 1, Step A - Import model
 */
// Your code here
// const sequelize = require("sequelize");
const { Tree } = require("../db/models");

/**
 * INTERMEDIATE BONUS PHASE 1 (OPTIONAL), Step A:
 *   Import Op to perform comparison operations in WHERE clauses
 **/
// Your code here
const { Op } = require("sequelize");

/**
 * BASIC PHASE 1, Step B - List of all trees in the database
 *
 * Path: /
 * Protocol: GET
 * Parameters: None
 * Response: JSON array of objects
 *   - Object properties: heightFt, tree, id
 *   - Ordered by the heightFt from tallest to shortest
 */
router.get("/", async (req, res, next) => {
	const trees = await Tree.findAll({
		attributes: ["heightFt", "tree", "id"],
		order: [["heightFt", "DESC"]]
	});
	res.json(trees);
});

/**
 * BASIC PHASE 1, Step C - Retrieve one tree with the matching id
 *
 * Path: /:id
 * Protocol: GET
 * Parameter: id
 * Response: JSON Object
 *   - Properties: id, tree, location, heightFt, groundCircumferenceFt
 */
router.get("/:id", async (req, res, next) => {
	let tree;
	try {
		tree = await Tree.findByPk(req.params.id);

		if (tree) {
			res.json(tree);
		} else {
			next({
				status: "not-found",
				message: `Could not find tree ${req.params.id}`,
				details: "Tree not found"
			});
		}
	} catch (err) {
		next({
			status: "error",
			message: `Could not find tree ${req.params.id}`,
			details: err.errors
				? err.errors.map(item => item.message).join(", ")
				: err.message
		});
	}
});

/**
 * BASIC PHASE 2 - INSERT tree row into the database
 *
 * Path: /trees
 * Protocol: POST
 * Parameters: None
 * Request Body: JSON Object
 *   - Properties: name, location, height, size
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully created new tree
 *   - Property: data
 *     - Value: object (the new tree)
 */
router.post("/", async (req, res, next) => {
	try {
		const { name, location, height, size } = req.body;
		const newTree = await Tree.create({
			tree: name,
			location,
			heightFt: height,
			groundCircumferenceFt: size
		});
		res.json({
			status: "success",
			message: "Successfully created new tree",
			data: newTree
		});
	} catch (err) {
		next({
			status: "error",
			message: "Could not create new tree",
			details: err.errors
				? err.errors.map(item => item.message).join(", ")
				: err.message
		});
	}
});

/**
 * BASIC PHASE 3 - DELETE a tree row from the database
 *
 * Path: /trees/:id
 * Protocol: DELETE
 * Parameter: id
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully removed tree <id>
 * Custom Error Handling:
 *   If tree is not in database, call next() with error object
 *   - Property: status
 *     - Value: not-found
 *   - Property: message
 *     - Value: Could not remove tree <id>
 *   - Property: details
 *     - Value: Tree not found
 */
router.delete("/:id", async (req, res, next) => {
	try {
		const treeId = req.params.id;
		const treeToDelete = await Tree.findOne({ where: { id: treeId } });
		await treeToDelete.destroy();
		res.json({
			status: "success",
			message: `Successfully removed tree ${req.params.id}`
		});
	} catch (err) {
		next({
			status: "error",
			message: `Could not remove tree ${req.params.id}`,
			details: err.errors
				? err.errors.map(item => item.message).join(", ")
				: err.message
		});
	}
});

/**
 * INTERMEDIATE PHASE 4 - UPDATE a tree row in the database
 *   Only assign values if they are defined on the request body
 *
 * Path: /trees/:id
 * Protocol: PUT
 * Parameter: id
 * Request Body: JSON Object
 *   - Properties: id, name, location, height, size
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully updated tree
 *   - Property: data
 *     - Value: object (the updated tree)
 * Custom Error Handling 1/2:
 *   If id in request params does not match id in request body,
 *   call next() with error object
 *   - Property: status
 *     - Value: error
 *   - Property: message
 *     - Value: Could not update tree <id>
 *   - Property: details
 *     - Value: <params id> does not match <body id>
 * Custom Error Handling 2/2:
 *   If tree is not in database, call next() with error object
 *   - Property: status
 *     - Value: not-found
 *   - Property: message
 *     - Value: Could not update tree <id>
 *   - Property: details
 *     - Value: Tree not found
 */
router.put("/:id", async (req, res, next) => {
	try {
		const { id, name, location, height, size } = req.body;
		const treeToUpdate = await Tree.findByPk(req.params.id);
		if (id == req.params.id && treeToUpdate) {
			if (name) treeToUpdate.tree = name;
			if (location) treeToUpdate.location = location;
			if (height) treeToUpdate.heightFt = height;
			if (size) treeToUpdate.groundCircumferenceFt = size;
			treeToUpdate.save();
			const resBody = {
				status: 200,
				message: "Successfully updated tree",
				data: treeToUpdate
			};
			res.json(resBody);
		} else if (treeToUpdate) {
			res.json("Ids must match");
		} else {
			res.json("tree not found");
		}
	} catch (err) {
		next({
			status: "error",
			message: "Could not update new tree",
			details: err.errors
				? err.errors.map(item => item.message).join(", ")
				: err.message
		});
	}
});

/**
 * INTERMEDIATE BONUS PHASE 1 (OPTIONAL), Step B:
 *   List of all trees with tree name like route parameter
 *
 * Path: /search/:value
 * Protocol: GET
 * Parameters: value
 * Response: JSON array of objects
 *   - Object properties: heightFt, tree, id
 *   - Ordered by the heightFt from tallest to shortest
 */
router.get("/search/:value", async (req, res, next) => {
	const { value } = req.params;
	const trees = await Tree.findAll({
		attributes: ["heightFt", "tree", "id"],
		where: {
			tree: {
				[Op.like]: `%${value}`
			}
		},
		order: [["heightFt", "DESC"]]
	});
	if (trees.length) {
		res.json(trees);
	} else {
		res.json("no trees like that found");
	}
});

// Export class - DO NOT MODIFY
module.exports = router;
