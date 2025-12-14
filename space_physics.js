// Space Physics Mod — r74n Sandboxels
// Global zero-G, orbital gravity, sticking, friction heating

enabledMods.push("space_physics.js");

modInfo = {
    name: "Space Physics",
    description: "Global zero-G with orbital gravity, sticking, and friction heating.",
    author: "you"
};

runAfterLoad(() => {

    /* ========= CONFIG ========= */
    const G = 0.003;
    const STICK_DIST = 1.6;
    const HEAT_MULT = 6;
    const DRAG = 0.9995;
    const SOFTENING = 0.05;

    /* ========= CATEGORY ========= */
    if (!categories.space) {
        categories.space = {
            name: "Space",
            color: "#666666"
        };
    }

    /* ========= GLOBAL PHYSICS ========= */
    tickFunctions.push(function spacePhysics() {
        const pixels = currentPixels;

        for (let i = 0; i < pixels.length; i++) {
            const p1 = pixels[i];
            if (!p1 || p1.dead) continue;

            // override default gravity
            if (p1.vx === undefined) p1.vx = 0;
            if (p1.vy === undefined) p1.vy = 0;
            p1.vy -= 0.1; // cancel Sandboxels gravity

            for (let j = i + 1; j < pixels.length; j++) {
                const p2 = pixels[j];
                if (!p2 || p2.dead) continue;

                if (p2.vx === undefined) p2.vx = 0;
                if (p2.vy === undefined) p2.vy = 0;

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distSq = dx*dx + dy*dy + SOFTENING;
                const dist = Math.sqrt(distSq);

                // gravity
                const force = G / distSq;
                const fx = force * dx;
                const fy = force * dy;

                p1.vx += fx;
                p1.vy += fy;
                p2.vx -= fx;
                p2.vy -= fy;

                // sticking + friction heat
                if (dist < STICK_DIST) {
                    const avx = (p1.vx + p2.vx) / 2;
                    const avy = (p1.vy + p2.vy) / 2;

                    const speed = Math.hypot(p1.vx - p2.vx, p1.vy - p2.vy);
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

    /* ========= SPACE ELEMENT ========= */
    elements.space_dust = {
        color: "#aaaaaa",
        behavior: behaviors.POWDER,
        category: "space",
        state: "solid",
        density: 2000,
        tempHigh: 1000,
        stateHigh: "lava",
        tick(pixel) {
            if (pixel.vx === undefined) pixel.vx = (Math.random() - 0.5) * 2;
            if (pixel.vy === undefined) pixel.vy = (Math.random() - 0.5) * 2;
        }
    };

});
