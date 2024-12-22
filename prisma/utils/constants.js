export const categories = {
    Shirts: {
        shapes: ["round", "v_neck", "slim_fit", "oversized", "button_up", "collared", "scoop_neck", "turtleneck"]
    },
    Pants: {
        shapes: ["skinny", "straight_leg", "bootcut", "wide_leg", "jogger", "cargo", "high_waisted", "flare"]
    },
    Dresses: {
        shapes: ["mini", "midi", "maxi", "wrap", "bodycon", "A_line", "shift", "sheath"]
    },
    Jackets: {
        shapes: ["bomber", "denim", "leather", "parka", "blazer", "trench", "puffer", "windbreaker"]
    },
    Sweaters: {
        shapes: ["crewneck", "v_neck", "cardigan", "turtleneck", "pullover", "zip_up", "oversized", "fitted"]
    },
    Hoodies: {
        shapes: ["pullover", "zip_up", "oversized", "fitted", "cropped", "hooded", "sweatshirt", "sweatpants"]
    },
    Skirts: {
        shapes: ["mini", "midi", "maxi", "pencil", "A_line", "pleated", "wrap", "circle"]
    },
    Shorts: {
        shapes: ["denim", "cargo", "chino", "biker", "bermuda", "high_waisted", "athletic", "tailored"]
    },
    Shoes: {
        shapes: ["sneakers", "loafers", "heels", "boots", "sandals", "flats", "wedges", "slippers"]
    },
    Bag: {
        shapes: ["tote", "backpack", "clutch", "crossbody", "satchel", "hobo", "messenger", "duffel"]
    },
    Hat: {
        shapes: ["beanie", "cap", "fedora", "bucket", "beret", "visor", "panama", "wide_brim"]
    },
    Accessories: {
        shapes: ["belt", "scarf", "gloves", "sunglasses", "watch", "jewelry", "hair_clip", "bracelet"]
    },
};

export const upperCategories = ["Shirts", "Sweaters", "Hoodies"];
export const halfLowerCategories = ["Shorts", "Skirts"];
export const fullLowerCategories = ["Pants"];
export const fullCategories = ["Dresses"];
export const outerCategories = ["Jackets"];
export const shoeCategories = ["Shoes"];
export const accessoryCategories = ["Bag", "Hat", "Accessories"];

export const sizeRanges = {
    Shirts: {
        chest: {
            XS: [76, 81],
            S: [82, 87],
            M: [88, 94],
            L: [95, 102],
            XL: [103, 110],
            XXL: [111, 118],
            XXXL: [119, 126],
        },
        arm_length: {
            XS: [53, 55],
            S: [56, 58],
            M: [59, 61],
            L: [62, 64],
            XL: [65, 67],
            XXL: [68, 70],
            XXXL: [71, 73],
        },
        bicep: {
            XS: [24, 26],
            S: [27, 29],
            M: [30, 32],
            L: [33, 35],
            XL: [36, 38],
            XXL: [39, 41],
            XXXL: [42, 44],
        },
        length: {
            XS: [65, 68],
            S: [69, 72],
            M: [73, 76],
            L: [77, 80],
            XL: [81, 84],
            XXL: [85, 88],
            XXXL: [89, 92],
        }
    },
    Jackets: {
        chest: {
            XS: [76, 81],
            S: [82, 87],
            M: [88, 94],
            L: [95, 102],
            XL: [103, 110],
            XXL: [111, 118],
            XXXL: [119, 126],
        },
        arm_length: {
            XS: [53, 55],
            S: [56, 58],
            M: [59, 61],
            L: [62, 64],
            XL: [65, 67],
            XXL: [68, 70],
            XXXL: [71, 73],
        },
        length: {
            XS: [70, 73],
            S: [74, 77],
            M: [78, 81],
            L: [82, 85],
            XL: [86, 89],
            XXL: [90, 93],
            XXXL: [94, 97],
        }
    },
    Shorts: {
        waist: {
            XS: [66, 70],
            S: [71, 75],
            M: [76, 81],
            L: [82, 87],
            XL: [88, 93],
            XXL: [94, 99],
            XXXL: [100, 105],
        },
        length: {
            XS: [25, 27],
            S: [28, 30],
            M: [31, 33],
            L: [34, 36],
            XL: [37, 39],
            XXL: [40, 42],
            XXXL: [43, 45],
        }
    },
    Pants: {
        waist: {
            XS: [66, 70],
            S: [71, 75],
            M: [76, 81],
            L: [82, 87],
            XL: [88, 93],
            XXL: [94, 99],
            XXXL: [100, 105],
        },
        length: {
            XS: [96, 100],
            S: [101, 105],
            M: [106, 110],
            L: [111, 115],
            XL: [116, 120],
            XXL: [121, 125],
            XXXL: [126, 130],
        }
    },
    Dresses: {
        chest: {
            XS: [76, 81],
            S: [82, 87],
            M: [88, 94],
            L: [95, 102],
            XL: [103, 110],
            XXL: [111, 118],
            XXXL: [119, 126],
        },
        waist: {
            XS: [61, 65],
            S: [66, 70],
            M: [71, 75],
            L: [76, 80],
            XL: [81, 85],
            XXL: [86, 90],
            XXXL: [91, 95],
        },
        length: {
            XS: [85, 90],
            S: [91, 96],
            M: [97, 102],
            L: [103, 108],
            XL: [109, 114],
            XXL: [115, 120],
            XXXL: [121, 126],
        }
    },
    Shoes: {
        foot_length: {
            XS: [22, 23],
            S: [24, 25],
            M: [26, 27],
            L: [28, 29],
            XL: [30, 31],
            XXL: [32, 33],
            XXXL: [34, 35],
        }
    },
    Sweaters: {
        chest: {
            XS: [76, 81],
            S: [82, 87],
            M: [88, 94],
            L: [95, 102],
            XL: [103, 110],
            XXL: [111, 118],
            XXXL: [119, 126],
        },
        arm_length: {
            XS: [53, 55],
            S: [56, 58],
            M: [59, 61],
            L: [62, 64],
            XL: [65, 67],
            XXL: [68, 70],
            XXXL: [71, 73],
        },
        length: {
            XS: [65, 68],
            S: [69, 72],
            M: [73, 76],
            L: [77, 80],
            XL: [81, 84],
            XXL: [85, 88],
            XXXL: [89, 92],
        },
        bicep: {
            XS: [24, 26],
            S: [27, 29],
            M: [30, 32],
            L: [33, 35],
            XL: [36, 38],
            XXL: [39, 41],
            XXXL: [42, 44],
        }
    },
    Hoodies: {
        chest: {
            XS: [76, 81],
            S: [82, 87],
            M: [88, 94],
            L: [95, 102],
            XL: [103, 110],
            XXL: [111, 118],
            XXXL: [119, 126],
        },
        arm_length: {
            XS: [53, 55],
            S: [56, 58],
            M: [59, 61],
            L: [62, 64],
            XL: [65, 67],
            XXL: [68, 70],
            XXXL: [71, 73],
        },
        length: {
            XS: [65, 68],
            S: [69, 72],
            M: [73, 76],
            L: [77, 80],
            XL: [81, 84],
            XXL: [85, 88],
            XXXL: [89, 92],
        },
        bicep: {
            XS: [24, 26],
            S: [27, 29],
            M: [30, 32],
            L: [33, 35],
            XL: [36, 38],
            XXL: [39, 41],
            XXXL: [42, 44],
        }
    },
    Skirts: {
        waist: {
            XS: [61, 65],
            S: [66, 70],
            M: [71, 75],
            L: [76, 80],
            XL: [81, 85],
            XXL: [86, 90],
            XXXL: [91, 95],
        },
        length: {
            XS: [40, 45],
            S: [46, 50],
            M: [51, 55],
            L: [56, 60],
            XL: [61, 65],
            XXL: [66, 70],
            XXXL: [71, 75],
        }
    }
};


export const sizeTags = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];