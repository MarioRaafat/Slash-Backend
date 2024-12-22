import {prisma} from "../seed.js";
import faker from "faker";
import bcrypt from "bcrypt";

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
const hashedPassword = await hashPassword('123456');

const stylePreferences = ["casual", "formal", "sporty", "business", "trendy", "vintage", "classic", "relaxed fit",
    "slim fit", "tailored", "athleisure", "bohemian", "preppy"];
const materialPreferences = ["cotton", "linen", "wool", "silk", "leather", "faux leather", "cashmere",
    "nylon", "polyester", "spandex", "fleece", "suede", "velvet", "satin"];
const patternPreferences = ["graphic print", "plain", "stripes", "polka dot", "floral", "checkered",
    "color block", "patchwork", "distressed", "embellished", "embroidered", "animal print", "camouflage", "metallic", "tie_dye"];
const climatePreferences = ["cold", "hot", "humid", "rainy", "temperate", "dry", "windy", "tropical",
    "arid", "snowy", "mild", "monsoon", "foggy", "desert", "coastal"];
// const preferredCategories = ["outerwear", "footwear", "accessories", "activewear"];
const occasions = ["everyday", "work", "party", "night out", "holiday", "wedding", "date night",
    "summer", "winter", "spring", "fall", "beachwear", "travel", "outdoor", "gym",
    "vacation", "formalEvents", "music festival", "birthday celebration",];
const productStylePreferences = ["round", "v_neck", "slim_fit", "oversized", "button_up", "collared", "scoop_neck", "turtleneck",
    "skinny", "straight_leg", "bootcut", "wide_leg", "jogger", "cargo", "high_waisted", "flare",
    "mini", "midi", "maxi", "wrap", "bodycon", "A_line", "shift", "sheath",
    "bomber", "denim", "parka", "blazer", "trench", "puffer", "windbreaker",
    "crewneck", "cardigan", "pullover", "zip_up", "fitted", // remove oversized & v_neck & turtle neck
    "pencil", "pleated", "circle", // remove mini & midi & maxi & wrap & A_line
    "chino", "biker", "bermuda", "athletic", // remove cargo & high_waisted & denim & tailored
    "sneakers", "loafers", "heels", "boots", "sandals", "flats", "wedges", "slippers",
    "tote", "backpack", "clutch", "crossbody", "satchel", "hobo", "messenger", "duffel",
    "beanie", "cap", "fedora", "bucket", "beret", "visor", "panama", "wide_brim",
    "belt", "scarf", "gloves", "sunglasses", "watch", "jewelry", "hair_clip", "bracelet",
    "cropped", "hooded", "sweatshirt", "sweatpants",]; // remove oversized & pullover & zip_up & fitted

const getRandomItems = (arr, count = 3) => {
    let selectedItems = [];
    while (selectedItems.length < count) {
        const randomItem = arr[Math.floor(Math.random() * arr.length)];
        if (!selectedItems.includes(randomItem)) {
            selectedItems.push(randomItem);
        }
    }
    return selectedItems;
};


export const UsersSeed = async () => {
    const colours = await prisma.colour.findMany();
    const brands = await prisma.brand.findMany();

    try {
        for (let i = 0; i < 20; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();

            const userBaseModel = await prisma.user.create({
                data: {
                    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.datatype.number({min:1, max:100})}@gmail.com`,
                    password: hashedPassword,
                    role: "USER"
                }
            });

            const user = await prisma.shopper.create({
                data: {
                    user_id: userBaseModel.id,
                    firstName: firstName,
                    lastName: lastName,
                    username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}${faker.datatype.number({ min: 1, max: 100 })}`,
                    gender: faker.random.arrayElement(['male', 'female']),
                    age: faker.datatype.number({ min: 18, max: 40 }),
                    phone: faker.phone.phoneNumber(),
                    city: faker.address.city(),
                    preferences: {
                        stylePreferences: getRandomItems(stylePreferences, 3),
                        colorPreferences: {
                            primaryColors: getRandomItems(colours.map(colour => colour.name), 3),
                            avoidColors: getRandomItems(colours.map(colour => colour.name), 1),
                        },
                        materialPreferences: {
                            preferredMaterials: getRandomItems(materialPreferences, 3),
                            avoidMaterials: getRandomItems(materialPreferences, 1),
                        },
                        patternPreferences: getRandomItems(patternPreferences, 3),
                        climatePreferences: getRandomItems(climatePreferences, 2),
                        productStylePreferences: getRandomItems(productStylePreferences, 5),
                        // preferredCategories: getRandomItems(),
                        brands: getRandomItems(brands.map(brand => brand.name), 2),
                        budgetRange: {
                            min: faker.datatype.number({ min: 250, max: 400 }),
                            max: faker.datatype.number({ min: 500, max: 1400 }),
                        },
                        occasions: getRandomItems(occasions, 2),
                    },
                },
            });
            const bodyM = await prisma.bodyMeasurement.create({
                data: {
                    waist: faker.datatype.number({ min: 70, max: 110 }),
                    height: faker.datatype.number({ min: 150, max: 200 }),
                    weight: faker.datatype.number({ min: 50, max: 120 }),
                    shoulder_width: faker.datatype.number({ min: 35, max: 70 }),
                    chest: faker.datatype.number({ min: 65, max: 120 }),
                    shape: faker.random.arrayElement(['RECTANGLE', 'TRIANGLE', 'INVERTED_TRIANGLE', 'HOURGLASS', 'OVAL']),
                    foot_length: faker.datatype.number({ min: 24, max: 30 }),
                    user_id: user.id,
                }
            });
            console.log(`User created: ${user.username} with body shape: ${bodyM.shape}`);

            const wishlist = await prisma.wishlist.create({
                data: {
                    user_id: user.id,
                }
            });
            console.log(`Wishlist created for user: ${user.username}`);

            const cart = await prisma.cart.create({
                data: {
                    user_id: user.id,
                }
            });
            console.log(`Cart created for user: ${user.username}`);
        }
    } catch (e) {
        console.error(e);
    }
    console.log("Users seed completed.");
};