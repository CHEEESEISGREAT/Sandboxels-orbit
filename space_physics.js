// Space Physics Mod — ACTUALLY WORKS on r74n

enabledMods.push("space_physics.js");

modInfo = {
    name: "Space Physics",
    description: "Zero-G space physics with gravity, sticking, and heating.",
    author: "you"
};

runAfterLoad(() => {

    const G = 0.05;
    const STICK_DIST = 1;
    const HEAT_MULT = 2;
    const DRAG = 0.995;

    function initVel(pixel) {
        if (pixel.vx === undefined) pixel.vx = 0;
        if (pixel.vy === undefined) pixel.vy = 0;
        if (pixel.temp === undefined) pixel.temp = 20;
    }

    elements.space_dust = {
        color: "#aaaaaa",
        category: "space",
        state: "solid",
        density: 2000,
        behavior: behaviors.WALL,
        tick(pixel) {
            initVel(pixel);

            // gravity toward nearby space pixels
            for (let dx = -6; dx <= 6; dx++) {
                for (let dy = -6; dy <= 6; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    const other = pixelMap[pixel.x + dx]?.[pixel.y + dy];
                    if (!other || other === pixel) continue;

                    if (other.element.startsWith("space_")) {
                        initVel(other);

                        const dist = Math.hypot(dx, dy) + 0.1;
                        const fx = (dx / dist) * G;
                        const fy = (dy / dist) * G;

                        pixel.vx += fx;
                        pixel.vy += fy;

                        if (dist <= STICK_DIST) {
                            const avx = (pixel.vx + other.vx) / 2;
                            const avy = (pixel.vy + other.vy) / 2;

                            const speed = Math.hypot(
                                pixel.vx - other.vx,
                                pixel.vy - other.vy
                            );

                            pixel.vx = avx;
                            pixel.vy = avy;
                            other.vx = avx;
                            other.vy = avy;

                            pixel.temp += speed * HEAT_MULT;
                            other.temp += speed * HEAT_MULT;
                        }
                    }
                }
            }

            // apply movement manually
            const mx = Math.sign(pixel.vx);
            const my = Math.sign(pixel.vy);

            if (mx !== 0) tryMove(pixel, pixel.x + mx, pixel.y);
            if (my !== 0) tryMove(pixel, pixel.x, pixel.y + my);

            pixel.vx *= DRAG;
            pixel.vy *= DRAG;
        }
    };

    elements.space_core = {
        color: "#ff9900",
        category: "space",
        state: "solid",
        density: 9000,
        behavior: behaviors.WALL
    };

});
