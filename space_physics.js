// Register the mod
const SPACE_MOD_NAME = "Space Physics";
runAfterLoad(function() {
    console.log(`${SPACE_MOD_NAME} loaded!`);
});

// 1. The Void (Space Vacuum)
// A background element that mimics the cold vacuum of space.
elements.void_vacuum = {
    color: "#050505",
    behavior: behaviors.WALL, // Acts as a container/background
    category: "Space",
    state: "gas",
    density: 0,
    temp: -270, // Near absolute zero
    conduct: 0, // Doesn't conduct heat well (vacuum)
    desc: "The cold, empty vacuum of space. Very cold.",
};

// 2. Protostar
// A dense gas that heats up over time and turns into a Star.
elements.protostar = {
    color: ["#ffcc00", "#ffaa00", "#ff8800"],
    behavior: behaviors.GAS,
    category: "Space",
    state: "gas",
    density: 0.5,
    temp: 1000,
    tempHigh: 5000,
    stateHigh: "star_plasma", // Transforms into Star Plasma
    conduct: 0.8,
    desc: "A gathering cloud of gas, heating up to become a star.",
};

// 3. Star Plasma
// The active state of a star. Very hot and burns everything nearby.
elements.star_plasma = {
    color: ["#ffff00", "#ff3300", "#ffffff"],
    behavior: [
        ["XX", "CR:light", "XX"],
        ["CR:light", "XX", "CR:light"],
        ["XX", "CR:light", "XX"]
    ], // Creates light around it
    category: "Space",
    state: "plasma",
    density: 10,
    temp: 5500,
    conduct: 1,
    desc: "Superheated plasma forming the body of a star.",
    reactions: {
        "void_vacuum": { elem1: null, chance: 0.01 }, // Slowly burns out into void
        "water": { elem1: "steam", elem2: null }, // Vaporizes water instantly
        "sand": { elem1: "glass", elem2: "magma" } // Melts sand
    }
};

// 4. Black Hole (Singularity)
// Destroys almost anything it touches and has high gravity.
elements.singularity = {
    color: "#000000",
    behavior: [
        ["XX", "XX", "XX"],
        ["XX", "DL", "XX"], // "DL" deletes the pixel it moves into
        ["XX", "XX", "XX"]
    ],
    category: "Space",
    state: "solid", // Treated as solid for physics stability
    density: 10000, // Extremely heavy
    temp: -273.15, // Absolute zero
    hardness: 1,
    desc: "A point of infinite density. Consumes matter.",
    reactions: {
        "all": { elem2: null, func: function(pixel1, pixel2) {
            // Custom function: Grow slightly when eating (optional logic)
            if (Math.random() < 0.05) {
                // Chance to emit Hawking Radiation (light/radiation)
                if(!pixel1.temp) pixel1.temp = 0;
                pixel1.temp += 10;
            }
        }}
    }
};

// Add a category for the new elements
if (!elements.void_vacuum.category) {
    elements.void_vacuum.category = "Space";
}