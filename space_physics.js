// Space Physics Mod — WORKING r74n VERSION

enabledMods.push("space_physics.js");

modInfo = {
    name: "Space Physics",
    description: "Zero-G space physics with gravity, sticking, and friction heating.",
    author: "you"
};

runAfterLoad(() => {

    /* ===== CONFIG ===== */
    const G = 0.002;
    const STICK_DIST = 1.5;
    const HEAT_MULT = 6;
    const DRAG = 0.999;
    const SOFTENING = 0.1;

    /* ===== GLOBAL PHYSICS ===== */
    tickFunctions.push(function spacePhysicsTick() {
        const pixels = currentPixels;

        for (let i = 0; i < pixels.length; i++) {
            const p1 = pixels[i];
            if (!p1 || p1.dead) continue;

            // ensure velocity exists
            if (p1.vx === undefined) p1.vx = 0;
            if (p1.vy === undefined) p1.vy = 0;

            // cancel default gravity (this is the CORRECT way)
            p1.vy -= 0.15;

            for (let j = i + 1; j < pixels.length; j++) {
                const p2 = pixels[j];
                if (!p2 || p2.dead) continue;

                if (p2.vx === undefined) p2.vx = 0;
                if (p2.vy === undefined) p2.vy = 0;

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distSq = dx*dx + dy*dy + SOFTENING;
                const dist = Math.sqrt(distSq);

                // orbital gravity
                const force = G / distSq;
                const fx = force * dx;
                const fy = force * dy;

                p1.vx += fx;
                p1.vy += fy;
                p2.vx -= fx;
                p2.vy -= fy;

                // sticking + heat
                if (dist < STICK_DIST) {
                    const avx = (p1.vx + p2.vx) / 2;
                    const avy = (p1.vy + p2.vy) / 2;

                    const speed = Math.hypot(
                        p1.vx - p2.vx,
                        p1.vy - p2.vy
                    );

                    const heat = speed * HEAT_MULT;

                    p1.vx = avx;
                    p1.vy = avy;
                    p2.vx = avx;
                    p2.vy = avy;

                    p1.temp += heat;
                    p2.temp += heat;
                }
            }

            p1.vx *= DRAG;
            p1.vy *= DRAG;
        }
    });

    /* ===== SPACE ELEMENTS (THIS CREATES THE CATEGORY) ===== */

    elements.space_dust = {
        color: "#bbbbbb",
        behavior: behaviors.POWDER,
        category: "space",
        state: "solid",
        density: 2000,
        tempHigh: 1000,
        stateHigh: "lava",
        tick(pixel) {
            if (pixel.vx === undefined)
                pixel.vx = (Math.random() - 0.5) * 2;
            if (pixel.vy === undefined)
                pixel.vy = (Math.random() - 0.5) * 2;
        }
    };

    elements.space_core = {
        color: "#ffaa00",
        behavior: behaviors.SOLID,
        category: "space",
        state: "solid",
        density: 9000,
        tempHigh: 3000,
        stateHigh: "lava"
    };

});
