// Space Physics Mod for Sandboxels
// Floating bodies, orbital gravity, sticking, friction heat

enabledMods.push("space_physics.js");

runAfterLoad(() => {

  /* ===============================
     CONFIG
  =============================== */
  const G = 0.002;          // gravity strength
  const STICK_DIST = 1.5;  // distance to stick
  const HEAT_MULT = 5;     // friction -> heat
  const DRAG = 0.999;      // tiny space drag

  /* ===============================
     MAIN PHYSICS LOOP
  =============================== */
  tickFunctions.push(function spacePhysics() {

    for (let i = 0; i < currentPixels.length; i++) {
      let p1 = currentPixels[i];
      if (!p1 || p1.dead) continue;

      // remove default gravity
      if (p1.vy === undefined) p1.vy = 0;
      if (p1.vx === undefined) p1.vx = 0;

      for (let j = i + 1; j < currentPixels.length; j++) {
        let p2 = currentPixels[j];
        if (!p2 || p2.dead) continue;

        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let distSq = dx*dx + dy*dy + 0.01;
        let dist = Math.sqrt(distSq);

        /* ===== ORBITAL GRAVITY ===== */
        let force = G / distSq;
        let fx = force * dx;
        let fy = force * dy;

        p1.vx += fx;
        p1.vy += fy;
        p2.vx -= fx;
        p2.vy -= fy;

        /* ===== STICKING ===== */
        if (dist < STICK_DIST) {
          let avx = (p1.vx + p2.vx) / 2;
          let avy = (p1.vy + p2.vy) / 2;
          p1.vx = avx;
          p1.vy = avy;
          p2.vx = avx;
          p2.vy = avy;

          /* ===== FRICTION HEAT ===== */
          let rvx = p1.vx - p2.vx;
          let rvy = p1.vy - p2.vy;
          let speed = Math.hypot(rvx, rvy);
          let heat = speed * HEAT_MULT;

          p1.temp += heat;
          p2.temp += heat;
        }
      }

      // small drag so stuff doesn’t go infinite speed
      p1.vx *= DRAG;
      p1.vy *= DRAG;
    }
  });

  /* ===============================
     ELEMENTS
  =============================== */

  elements.space_rock = {
    color: "#8a8a8a",
    behavior: behaviors.POWDER,
    density: 3000,
    tempHigh: 1200,
    stateHigh: "lava",
    tick(pixel) {
      if (pixel.vx === undefined) pixel.vx = 0;
      if (pixel.vy === undefined) pixel.vy = 0;
    }
  };

  elements.space_metal = {
    color: "#b0b0b0",
    behavior: behaviors.SOLID,
    density: 7800,
    tempHigh: 1500,
    stateHigh: "molten_metal",
  };

});

