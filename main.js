// Space Physics Mod — Sandboxels (r74n compatible)

enabledMods.push("space_physics.js");

modInfo = {
  name: "Space Physics",
  description: "Zero-G orbital gravity, pixel adhesion, and friction-based heating.",
  author: "you"
};

runAfterLoad(() => {

  /* ========= CONFIG ========= */
  const G = 0.002;          // gravity strength
  const STICK_DIST = 1.5;   // weld distance
  const HEAT_MULT = 5;      // friction → heat
  const DRAG = 0.999;       // tiny space drag
  const SOFTENING = 0.01;   // prevents singularities

  /* ========= PHYSICS LOOP ========= */
  tickFunctions.push(function spacePhysics() {
    const pixels = currentPixels;

    for (let i = 0; i < pixels.length; i++) {
      const p1 = pixels[i];
      if (!p1 || p1.dead) continue;

      if (p1.vx === undefined) p1.vx = 0;
      if (p1.vy === undefined) p1.vy = 0;
      if (p1.temp === undefined) p1.temp = 20;

      for (let j = i + 1; j < pixels.length; j++) {
        const p2 = pixels[j];
        if (!p2 || p2.dead) continue;

        if (p2.vx === undefined) p2.vx = 0;
        if (p2.vy === undefined) p2.vy = 0;
        if (p2.temp === undefined) p2.temp = 20;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distSq = dx*dx + dy*dy + SOFTENING;
        const dist = Math.sqrt(distSq);

        /* --- ORBITAL GRAVITY --- */
        const force = G / distSq;
        const fx = force * dx;
        const fy = force * dy;

        p1.vx += fx;
        p1.vy += fy;
        p2.vx -= fx;
        p2.vy -= fy;

        /* --- STICKING + FRICTION HEAT --- */
        if (dist < STICK_DIST) {
          const avx = (p1.vx + p2.vx) / 2;
          const avy = (p1.vy + p2.vy) / 2;

          const rvx = p1.vx - p2.vx;
          const rvy = p1.vy - p2.vy;
          const speed = Math.hypot(rvx, rvy);
          const heat = speed * HEAT_MULT;

          p1.vx = avx; p1.vy = avy;
          p2.vx = avx; p2.vy = avy;

          p1.temp += heat;
          p2.temp += heat;
        }
      }

      p1.vx *= DRAG;
      p1.vy *= DRAG;
    }
  });

  /* ========= ELEMENTS ========= */

  elements.space_rock = {
    color: "#8a8a8a",
    behavior: behaviors.POWDER,
    density: 3000,
    tempHigh: 1200,
    stateHigh: "lava",
    tick(pixel) {
      if (pixel.vx === undefined) pixel.vx = 0;
      if (pixel.vy === undefined) pixel.vy = 0;
      if (pixel.temp === undefined) pixel.temp = 20;
    }
  };

  elements.space_metal = {
    color: "#b0b0b0",
    behavior: behaviors.SOLID,
    density: 7800,
    tempHigh: 1500,
    stateHigh: "molten_metal"
  };

});
