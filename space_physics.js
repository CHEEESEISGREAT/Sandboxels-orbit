// 1. Define the Space Vacuum
elements.void_vacuum = {
    color: "#111111",
    behavior: behaviors.WALL,
    category: "Space",
    state: "gas",
    density: 0,
    temp: -270,
    conduct: 0,
    desc: "The cold, empty vacuum of space.",
};

// 2. Define the Singularity (Black Hole)
elements.singularity = {
    color: "#000000",
    behavior: [
        ["XX", "XX", "XX"],
        ["XX", "DL", "XX"], // DL = Delete
        ["XX", "XX", "XX"]
    ],
    category: "Space",
    state: "solid",
    density: 10000,
    temp: -273.15,
    hardness: 1,
    desc: "A black hole. Deletes everything.",
};

// 3. Define Star Plasma
elements.star_plasma = {
    color: ["#ffff00", "#ff5500"],
    behavior: behaviors.GAS,
    category: "Space",
    state: "plasma",
    temp: 5500,
    desc: "Hot star matter.",
};

// 4. Force a UI refresh message
alert("Space Mod Loaded! If you don't see the 'Space' tab, search for 'singularity' in the element search bar.");