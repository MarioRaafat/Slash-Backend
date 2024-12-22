import {prisma} from "../seed.js";
import faker from "faker";
import bcrypt from "bcrypt";
import {categories, upperCategories, halfLowerCategories, fullLowerCategories, fullCategories, outerCategories, shoeCategories, sizeTags, sizeRanges} from "../utils/constants.js";

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
const hashedPassword = await hashPassword('000000');

const fashionBrands = [
    {
        name: "Zara",
        email: "zara@zara.com",
        description: "A fast-fashion retailer offering trendy and affordable clothing."
    },
    {
        name: "H&M",
        email: "hm@hm.com",
        description: "Another popular fast-fashion brand with a wide range of styles."
    },
    {
        name: "Gucci",
        email: "gucci@gucci.com",
        description: "A luxury fashion brand known for its high-end clothing and accessories."
    },
    {
        name: "Louis Vuitton",
        email: "louisvuitton@louisvuitton.com",
        description: "A French luxury fashion house, specializing in leather goods, fashion, and accessories."
    },
    {
        name: "Chanel",
        email: "chanel@chanel.com",
        description: "A renowned French luxury brand, offering high-end fashion, perfumes, and cosmetics."
    },
    {
        name: "Nike",
        email: "nike@nike.com",
        description: "While primarily a sportswear brand, Nike also offers a wide range of stylish clothing."
    },
    {
        name: "Adidas",
        email: "adidas@adidas.com",
        description: "Similar to Nike, Adidas offers fashionable clothing in addition to sportswear."
    },
    {
        name: "Levi's",
        email: "levis@levi.com",
        description: "An iconic American clothing brand, famous for its jeans."
    },
    {
        name: "Uniqlo",
        email: "uniqlo@uniqlo.com",
        description: "A Japanese casual wear retailer known for its quality basics and innovative fabrics."
    },
    {
        name: "Forever 21",
        email: "forever21@forever21.com",
        description: "A fast-fashion retailer offering trendy and affordable clothing, especially for younger generations."
    }
];


export const BrandsSeed = async () => {
    try {
        for (const category in categories) {
            for (const shape of categories[category].shapes) {
                const newCategory = await prisma.category.create({
                    data: {
                        name: category,
                        style: shape,
                    },
                });
                console.log(`Category created: ${newCategory.name} with style: ${newCategory.style}`);
            }
        }

        for (let i = 0; i < 10; i++) {
            const user = await prisma.user.create({
                data: {
                    email: fashionBrands[i].email,
                    password: hashedPassword,
                    role: "BRAND",
                }
            });
            const brand = await prisma.brand.create({
                data: {
                    user_id: user.id,
                    name: fashionBrands[i].name,
                    rated_status: true,
                    rating: parseFloat(faker.datatype.number({ min: 3.3, max: 5, precision: 0.2 }).toFixed(1)),
                    phone: faker.phone.phoneNumber(),
                    description: fashionBrands[i].description,
                    logo: null,
                    facebook: faker.internet.url(),
                    instagram: faker.internet.url(),
                    website: faker.internet.url(),
                },
            });
            console.log(`Brand created: ${brand.name}`);

            for (const category of upperCategories) {
                const categoryStyles = await prisma.category.findMany({ where: { name: category } });
                for (const style of categoryStyles) {
                    for (let j = 0; j < sizeTags.length; j++) {
                        await prisma.size.create({
                            data: {
                                brand_id: brand.id,
                                category_id: style.id,
                                size: sizeTags[j],
                                chest: faker.datatype.number({ min: sizeRanges[category].chest[sizeTags[j]][0], max: sizeRanges[category].chest[sizeTags[j]][1] }),
                                arm_length: faker.datatype.number({ min: sizeRanges[category].arm_length[sizeTags[j]][0], max: sizeRanges[category].arm_length[sizeTags[j]][1] }),
                                bicep: faker.datatype.number({ min: sizeRanges[category].bicep[sizeTags[j]][0], max: sizeRanges[category].bicep[sizeTags[j]][1] }),
                                length: faker.datatype.number({ min: sizeRanges[category].length[sizeTags[j]][0], max: sizeRanges[category].length[sizeTags[j]][1] }),
                                foot_length: null,
                                waist: null,
                            },
                        });
                        console.log(`Size created for ${brand.name} in ${category} with size: ${sizeTags[j]}`);
                    }
                }
            }

            for (const category of halfLowerCategories) {
                const categoryStyles = await prisma.category.findMany({ where: { name: category } });
                for (const style of categoryStyles) {
                    for (let j = 0; j < sizeTags.length; j++) {
                        await prisma.size.create({
                            data: {
                                brand_id: brand.id,
                                category_id: style.id,
                                size: sizeTags[j],
                                chest: null,
                                arm_length: null,
                                bicep: null,
                                length: faker.datatype.number({ min: sizeRanges[category].length[sizeTags[j]][0], max: sizeRanges[category].length[sizeTags[j]][1] }),
                                foot_length: null,
                                waist: faker.datatype.number({ min: sizeRanges[category].waist[sizeTags[j]][0], max: sizeRanges[category].waist[sizeTags[j]][1] }),
                            },
                        });
                        console.log(`Size created for ${brand.name} in ${category} with size: ${sizeTags[j]}`);
                    }
                }
            }

            for (const category of fullLowerCategories) {
                const categoryStyles = await prisma.category.findMany({ where: { name: category } });
                for (const style of categoryStyles) {
                    for (let j = 0; j < sizeTags.length; j++) {
                        await prisma.size.create({
                            data: {
                                brand_id: brand.id,
                                category_id: style.id,
                                size: sizeTags[j],
                                chest: null,
                                arm_length: null,
                                bicep: null,
                                length: faker.datatype.number({ min: sizeRanges[category].length[sizeTags[j]][0], max: sizeRanges[category].length[sizeTags[j]][1] }),
                                foot_length: null,
                                waist: faker.datatype.number({ min: sizeRanges[category].waist[sizeTags[j]][0], max: sizeRanges[category].waist[sizeTags[j]][1] }),
                            },
                        });
                        console.log(`Size created for ${brand.name} in ${category} with size: ${sizeTags[j]}`);
                    }
                }
            }

            for (const category of fullCategories) {
                const categoryStyles = await prisma.category.findMany({ where: { name: category } });
                for (const style of categoryStyles) {
                    for (let j = 0; j < sizeTags.length; j++) {
                        await prisma.size.create({
                            data: {
                                brand_id: brand.id,
                                category_id: style.id,
                                size: sizeTags[j],
                                chest: faker.datatype.number({ min: sizeRanges[category].chest[sizeTags[j]][0], max: sizeRanges[category].chest[sizeTags[j]][1] }),
                                arm_length: null,
                                bicep: null,
                                length: faker.datatype.number({ min: sizeRanges[category].length[sizeTags[j]][0], max: sizeRanges[category].length[sizeTags[j]][1] }),
                                foot_length: null,
                                waist: faker.datatype.number({ min: sizeRanges[category].waist[sizeTags[j]][0], max: sizeRanges[category].waist[sizeTags[j]][1] }),
                            },
                        });
                        console.log(`Size created for ${brand.name} in ${category} with size: ${sizeTags[j]}`);
                    }
                }
            }

            for (const category of outerCategories) {
                const categoryStyles = await prisma.category.findMany({ where: { name: category } });
                for (const style of categoryStyles) {
                    for (let j = 0; j < sizeTags.length; j++) {
                        await prisma.size.create({
                            data: {
                                brand_id: brand.id,
                                category_id: style.id,
                                size: sizeTags[j],
                                chest: faker.datatype.number({ min: sizeRanges[category].chest[sizeTags[j]][0], max: sizeRanges[category].chest[sizeTags[j]][1] }),
                                arm_length: faker.datatype.number({ min: sizeRanges[category].arm_length[sizeTags[j]][0], max: sizeRanges[category].arm_length[sizeTags[j]][1] }),
                                bicep: null,
                                length: faker.datatype.number({ min: sizeRanges[category].length[sizeTags[j]][0], max: sizeRanges[category].length[sizeTags[j]][1] }),
                                foot_length: null,
                                waist: null,
                            },
                        });
                        console.log(`Size created for ${brand.name} in ${category} with size: ${sizeTags[j]}`);
                    }
                }
            }

            for (const category of shoeCategories) {
                const categoryStyles = await prisma.category.findMany({ where: { name: category } });
                for (const style of categoryStyles) {
                    for (let j = 0; j < sizeTags.length; j++) {
                        await prisma.size.create({
                            data: {
                                brand_id: brand.id,
                                category_id: style.id,
                                size: sizeTags[j],
                                chest: null,
                                arm_length: null,
                                bicep: null,
                                length: null,
                                foot_length: faker.datatype.number({ min: sizeRanges[category].foot_length[sizeTags[j]][0], max: sizeRanges[category].foot_length[sizeTags[j]][1] }),
                                waist: null,
                            },
                        });
                        console.log(`Size created for ${brand.name} in ${category} with size: ${sizeTags[j]}`);
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
    console.log("Brands seed completed.");
};