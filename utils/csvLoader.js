import prisma from "./prismaClient.js";
import fs from 'fs';
import { Parser } from 'json2csv';

// generating CSV file


export const ProductFile = async () => {
    let rows = [];
    rows = await prisma.product.findMany({
        include: {
            colours: {
                include: {
                    colour: true,
                },
            },
            tags: {
                include: {
                    tag: true,
                },
            },
            category: true,
            brand: true,
            productVariants: {
                include: { size: true },
            },
        },
    });

    // Flatten and prepare data for CSV
    const formattedData = rows.map((row) => ({
        ID: row.id,
        Name: row.name,
        Description: row.description,
        Category: row.category?.name || "N/A", // Handle category
        Style: row.category?.style || "N/A", // Handle category
        Brand: row.brand?.name || "N/A", // Handle brand
        Colours: row.colours.map((colour) => colour.colour.name+"-"+colour.colour.family).join(", "), // Flatten colours
        Tags: row.tags.map((tag) => tag.tag.name).join(", "), // Flatten tags
        Sizes: row.productVariants
            .map((variant) => variant.size.size)
            .join(", "), // Flatten product variants
    }));

    // Define CSV fields
    const fields = ["ID", "Name", "Category", "Style", "Brand", "Colours", "Tags", "Sizes"];

    // Convert to CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedData);

    // Write CSV to a file
    const filePath = "Products.csv";
    fs.writeFileSync(filePath, csv);

    console.log("Data exported successfully to database_data.csv");
};



export const BrandFile = async () => {
    let rows = [];
    rows = await prisma.brand.findMany({
        include: {
            products: {
                include: {
                    product: {category: true},
                },
            }
        },
    });

    // Flatten and prepare data for CSV
    const formattedData = rows.map((row) => ({
        Name: row.name,
        Category: row.products.map((product) => product.category.name).join(", ")
    }));

    // Define CSV fields
    const fields = ["Name", "Category"];

    // Convert to CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedData);

    // Write CSV to a file
    const filePath = "Brands.csv";
    fs.writeFileSync(filePath, csv);

    console.log("Data exported successfully to database_data.csv");

};



export const CategoryFile = async () => {
    let rows = [];
    rows = await prisma.category.findMany({});

    // Flatten and prepare data for CSV
    const formattedData = rows.map((row) => ({
        Name: row.name,
        Style: row.style
    }));

    // Define CSV fields
    const fields = ["Name", "Style"];

    // Convert to CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedData);

    // Write CSV to a file
    const filePath = "Categories.csv";
    fs.writeFileSync(filePath, csv);

    console.log("Data exported successfully to database_data.csv");

};


export const TagFile = async () => {
    let rows = [];
    rows = await prisma.tag.findMany({});

    // Flatten and prepare data for CSV
    const formattedData = rows.map((row) => ({
        Name: row.name
    }));

    // Define CSV fields
    const fields = ["Name"];

    // Convert to CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedData);

    // Write CSV to a file
    const filePath = "Tags.csv";
    fs.writeFileSync(filePath, csv);

    console.log("Data exported successfully to database_data.csv");

};

export const ColourFile = async () => {
    let rows = [];
    rows = await prisma.colour.findMany({});

    // Flatten and prepare data for CSV
    const formattedData = rows.map((row) => ({
        Name: row.name,
        Family: row.family,
        Hex: row.hex
    }));

    // Define CSV fields
    const fields = ["Name", "Family", "Hex"];

    // Convert to CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedData);

    // Write CSV to a file
    const filePath = "Colours.csv";
    fs.writeFileSync(filePath, csv);

    console.log("Data exported successfully to database_data.csv");
};


//await ProductFile();
//await BrandFile();
// await CategoryFile();
// await TagFile();
// await ColourFile();