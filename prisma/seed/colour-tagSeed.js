import {prisma} from "../seed.js";
import faker from "faker";


const colors = [
    { name: "Scarlet", hex: "#FF2400", family: "Red" },
    { name: "Crimson", hex: "#DC143C", family: "Red" },
    { name: "Firebrick", hex: "#B22222", family: "Red" },
    { name: "Indian Red", hex: "#CD5C5C", family: "Red" },
    { name: "Tomato", hex: "#FF6347", family: "Red" },
    { name: "Salmon", hex: "#FA8072", family: "Red" },
    { name: "Dark Orange", hex: "#FF8C00", family: "Orange" },
    { name: "Coral", hex: "#FF7F50", family: "Orange" },
    { name: "Peach", hex: "#FFDAB9", family: "Orange" },
    { name: "Apricot", hex: "#FBCEB1", family: "Orange" },
    { name: "Mango", hex: "#FFC324", family: "Orange" },
    { name: "Pumpkin", hex: "#FF7518", family: "Orange" },
    { name: "Amber", hex: "#FFBF00", family: "Yellow" },
    { name: "Gold", hex: "#FFD700", family: "Yellow" },
    { name: "Khaki", hex: "#F0E68C", family: "Yellow" },
    { name: "Lemon", hex: "#FFF44F", family: "Yellow" },
    { name: "Mustard", hex: "#FFDB58", family: "Yellow" },
    { name: "Honey", hex: "#FFC30B", family: "Yellow" },
    { name: "Lime Green", hex: "#32CD32", family: "Green" },
    { name: "Forest Green", hex: "#228B22", family: "Green" },
    { name: "Olive", hex: "#808000", family: "Green" },
    { name: "Teal", hex: "#008080", family: "Green" },
    { name: "Mint", hex: "#98FF98", family: "Green" },
    { name: "Sea Green", hex: "#2E8B57", family: "Green" },
    { name: "Aqua", hex: "#00FFFF", family: "Blue" },
    { name: "Sky Blue", hex: "#87CEEB", family: "Blue" },
    { name: "Royal Blue", hex: "#4169E1", family: "Blue" },
    { name: "Navy", hex: "#000080", family: "Blue" },
    { name: "Steel Blue", hex: "#4682B4", family: "Blue" },
    { name: "Turquoise", hex: "#40E0D0", family: "Blue" },
    { name: "Indigo", hex: "#4B0082", family: "Purple" },
    { name: "Lavender", hex: "#E6E6FA", family: "Purple" },
    { name: "Plum", hex: "#DDA0DD", family: "Purple" },
    { name: "Orchid", hex: "#DA70D6", family: "Purple" },
    { name: "Amethyst", hex: "#9966CC", family: "Purple" },
    { name: "Violet", hex: "#8A2BE2", family: "Purple" },
    { name: "Magenta", hex: "#FF00FF", family: "Pink" },
    { name: "Hot Pink", hex: "#FF69B4", family: "Pink" },
    { name: "Rose", hex: "#FF007F", family: "Pink" },
    { name: "Blush", hex: "#DE5D83", family: "Pink" },
    { name: "Fuchsia", hex: "#FF77FF", family: "Pink" },
    { name: "Bubblegum", hex: "#FFC1CC", family: "Pink" },
    { name: "Brown", hex: "#A52A2A", family: "Brown" },
    { name: "Saddle Brown", hex: "#8B4513", family: "Brown" },
    { name: "Chocolate", hex: "#D2691E", family: "Brown" },
    { name: "Tan", hex: "#D2B48C", family: "Brown" },
    { name: "Beige", hex: "#F5F5DC", family: "Brown" },
    { name: "Espresso", hex: "#4B3621", family: "Brown" },
    { name: "Slate Gray", hex: "#708090", family: "Gray" },
    { name: "Dim Gray", hex: "#696969", family: "Gray" },
    { name: "Light Gray", hex: "#D3D3D3", family: "Gray" },
    { name: "Charcoal", hex: "#36454F", family: "Gray" },
    { name: "Silver", hex: "#C0C0C0", family: "Gray" },
    { name: "Gunmetal", hex: "#2A3439", family: "Gray" },
    { name: "Ivory", hex: "#FFFFF0", family: "White" },
    { name: "Snow", hex: "#FFFAFA", family: "White" },
    { name: "Floral White", hex: "#FFFAF0", family: "White" },
    { name: "Ghost White", hex: "#F8F8FF", family: "White" },
    { name: "Antique White", hex: "#FAEBD7", family: "White" },
    { name: "Linen", hex: "#FAF0E6", family: "White" },
    { name: "Black", hex: "#000000", family: "Black" },
    { name: "Jet", hex: "#343434", family: "Black" },
    { name: "Ebony", hex: "#555D50", family: "Black" },
    { name: "Onyx", hex: "#353839", family: "Black" },
    { name: "Licorice", hex: "#1A1110", family: "Black" },
    { name: "Charcoal Black", hex: "#2B2B2B", family: "Black" }
];


const Tags = [
    // Style and Fit
    "casual", "formal", "sporty", "business", "trendy", "vintage", "classic", "relaxed fit",
    "slim fit", "tailored", "athleisure", "bohemian", "preppy",

    // Material
    "cotton", "linen", "wool", "silk", "leather", "faux leather", "cashmere",
    "nylon", "polyester", "spandex", "fleece", "suede", "velvet", "satin",

    // Climate
    "cold", "hot", "humid", "rainy", "temperate", "dry", "windy", "tropical",
    "arid", "snowy", "mild", "monsoon", "foggy", "desert", "coastal",

    // Occasion
    "everyday", "work", "party", "night out", "holiday", "wedding", "date night",
    "summer", "winter", "spring", "fall", "beachwear", "travel", "outdoor", "gym",
    "vacation", "formalEvents", "music festival", "birthday celebration",

    // Design and Detail
    "graphic print", "plain", "stripes", "polka dot", "floral", "checkered",
    "color block", "patchwork", "distressed", "embellished", "embroidered",
    "animal print", "camouflage", "metallic", "tie_dye",


    // Specific Features
    "pockets", "zippers", "buttons", "elastic waist", "drawstring", "cuffed",
    "sleeveless", "long sleeve", "short sleeve", "high waist", "low rise", "mid rise",


    // Shapes
    "round", "v_neck", "slim_fit", "oversized", "button_up", "collared", "scoop_neck", "turtleneck",
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
    "cropped", "hooded", "sweatshirt", "sweatpants", // remove oversized & pullover & zip_up & fitted

    // category
    "Shirts", "Pants", "Dresses", "Jackets", "Sweaters", "Hoodies", "Skirts", "Shorts", "Shoes", "Bag", "Hat", "Accessories",

    // Size Tags
    "XS", "S", "M", "L", "XL", "XXL", "XXXL", "one size",

    // Colour Families
    "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Brown", "Black",
    "White", "Gray", "Pink",

    // Colour names
    "Scarlet", "Crimson", "Firebrick", "Indian Red", "Tomato", "Salmon",
    "Dark Orange", "Coral", "Peach", "Apricot", "Mango", "Pumpkin",
    "Amber", "Gold", "Khaki", "Lemon", "Mustard", "Honey",
    "Lime Green", "Forest Green", "Olive", "Teal", "Mint", "Sea Green",
    "Aqua", "Sky Blue", "Royal Blue", "Navy", "Steel Blue", "Turquoise",
    "Indigo", "Lavender", "Plum", "Orchid", "Amethyst", "Violet",
    "Magenta", "Hot Pink", "Rose", "Blush", "Fuchsia", "Bubblegum",
    "Saddle Brown", "Chocolate", "Tan", "Beige", "Espresso",
    "Slate Gray", "Dim Gray", "Light Gray", "Charcoal", "Silver", "Gunmetal",
    "Ivory", "Snow", "Floral White", "Ghost White", "Antique White", "Linen",
    "Jet", "Ebony", "Onyx", "Licorice", "Charcoal Black"
];



export const ColourTagSeed = async () => {
    try {
        for (let i = 0; i < colors.length; i++) {
            await prisma.colour.create({
                data: {
                    name: colors[i].name,
                    hex: colors[i].hex,
                    family: colors[i].family
                }
            });
            console.log(`Added ${colors[i].name} colour`);
        }
        console.log("Colours seed data added successfully");

        for (let i = 0; i < Tags.length; i++) {
            await prisma.tag.create({
                data: {
                    name: Tags[i]
                }
            });
            console.log(`Added ${Tags[i]} tag`);
        }

    } catch (error) {
        console.error(error);
    }
};