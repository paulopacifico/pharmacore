import { Permission } from "@pharmacore/auth";

export const CREATE_PRODUCT = Permission.create({
	name: "CREATE_PRODUCT",
	description: "Permission to create a new product",
});

export const READ_PRODUCT = Permission.create({
	name: "READ_PRODUCT",
	description: "Permission to read product information",
});

export const UPDATE_PRODUCT = Permission.create({
	name: "UPDATE_PRODUCT",
	description: "Permission to update product information",
});

export const DELETE_PRODUCT = Permission.create({
	name: "DELETE_PRODUCT",
	description: "Permission to delete a product",
});
