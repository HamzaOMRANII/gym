/* Shared content for the site. Loaded as a plain script; exposes window.FIT. */
window.FIT = (function () {
  const categories = [
    { id: 'chest', name: 'Chest', blurb: 'Pressing strength and upper-body shape. Machines and dumbbells first, floor work when you have nothing.' },
    { id: 'back', name: 'Back', blurb: 'Pulling patterns that build width and fix desk posture. Fully machine-friendly for beginners.' },
    { id: 'shoulders', name: 'Shoulders', blurb: 'Light, high-control work. The one area where less weight beats more, every session.' },
    { id: 'arms', name: 'Arms', blurb: 'Biceps and triceps, trained directly. Short sessions, simple equipment, quick to learn.' },
    { id: 'legs', name: 'Legs', blurb: 'Stable machines and controlled movement. No barbell squats or deadlifts required.' },
    { id: 'core', name: 'Core', blurb: 'Bracing and trunk control. Needs no equipment and can be done at home on a mat.' }
  ];

  const E = (id, cat, name, kit, level, sets, reps, rest, muscles, equipment, cues) =>
    ({ id, cat, name, kit, level, sets, reps, rest, muscles, equipment, cues });

  const exercises = [
    // chest
    E('db-bench', 'chest', 'Dumbbell Bench Press', 'tools', 'MEDIUM', 3, '8-10', '2-3 min', 'Chest · Triceps · Front shoulders', 'Flat bench + dumbbells', ['Shoulder blades pulled back into the bench.', 'Elbows 45-60° from the torso, not flared wide.', 'Two seconds down, controlled press up.']),
    E('incline-db-press', 'chest', 'Incline Dumbbell Press', 'tools', 'MEDIUM', 3, '8-12', '2 min', 'Upper chest · Front shoulders', 'Adjustable bench + dumbbells', ['Bench at 30-45°, no steeper.', 'Wrists stacked over elbows.', 'Stop the descent at the stretch.']),
    E('machine-chest-press', 'chest', 'Machine Chest Press', 'tools', 'LOW', 3, '8-12', '2 min', 'Chest · Triceps', 'Chest press machine', ['Handles level with mid-chest.', 'Back and head on the pad.', 'No hard lockout.']),
    E('pec-deck', 'chest', 'Pec Deck', 'tools', 'LOW', 3, '10-15', '90 sec', 'Chest', 'Pec-deck machine', ['Squeeze the chest, do not push with the hands.', 'Elbows just below shoulder height.', 'Control the opening phase.']),
    E('cable-fly', 'chest', 'Cable Chest Fly', 'tools', 'MEDIUM', 2, '12-15', '60-90 sec', 'Chest', 'Cable machine', ['Fixed slight elbow bend.', 'Lead with the elbows.', 'Light load, slow tempo.']),
    E('push-up', 'chest', 'Push-Up', 'bodyweight', 'LOW', 3, '6-15', '90 sec', 'Chest · Triceps · Core', 'Floor only', ['Hands slightly wider than the shoulders.', 'Body in one line from head to heels.', 'Lower until the chest is a fist from the floor.']),
    E('incline-push-up', 'chest', 'Hands-Elevated Push-Up', 'bodyweight', 'LOW', 3, '8-15', '90 sec', 'Chest · Triceps', 'Table, bench or sofa edge', ['The higher the hands, the easier the rep.', 'Squeeze the glutes to stop the hips sagging.', 'Same tempo on every rep.']),
    E('floor-fly-towel', 'chest', 'Wall Press', 'bodyweight', 'LOW', 3, '10-20', '60 sec', 'Chest · Shoulders', 'A wall', ['Stand a forearm from the wall.', 'Elbows travel back, not out.', 'Push away without shrugging.']),

    // back
    E('lat-pulldown', 'back', 'Lat Pulldown', 'tools', 'LOW', 3, '8-12', '2 min', 'Back · Biceps', 'Lat-pulldown machine', ['Pull with the elbows, not the hands.', 'Chest up as the bar comes down.', 'Always to the front, never behind the neck.']),
    E('seated-cable-row', 'back', 'Seated Cable Row', 'tools', 'LOW', 3, '8-12', '2 min', 'Back · Biceps', 'Seated cable-row machine', ['Torso still, no rocking.', 'Handle to the lower ribs.', 'Slow return to a full stretch.']),
    E('chest-supported-row', 'back', 'Chest-Supported Row', 'tools', 'LOW', 3, '10-12', '90 sec', 'Back · Rear shoulders', 'Chest-supported row machine', ['Chest stays on the pad.', 'Elbows finish behind the torso.', 'No shrugging at the top.']),
    E('straight-arm-pulldown', 'back', 'Straight-Arm Pulldown', 'tools', 'MEDIUM', 2, '12-15', '60-90 sec', 'Back · Core', 'Cable machine', ['Elbows almost locked.', 'Only the shoulders move.', 'Ribs down, no back arch.']),
    E('table-row', 'back', 'Table Row', 'bodyweight', 'MEDIUM', 3, '6-12', '90 sec', 'Back · Biceps', 'Sturdy table edge', ['Grip the edge, body straight, heels on the floor.', 'Pull the chest to the edge.', 'Walk the feet in to make it easier.']),
    E('towel-row', 'back', 'Door-Anchored Towel Row', 'bodyweight', 'LOW', 3, '10-15', '60-90 sec', 'Back · Biceps', 'Towel + solid door handle', ['Lean back with straight arms, then pull.', 'Squeeze the shoulder blades.', 'Lean further back for more difficulty.']),
    E('prone-y', 'back', 'Floor Y-Raise', 'bodyweight', 'LOW', 3, '10-15', '60 sec', 'Upper back · Rear shoulders', 'Floor or mat', ['Face down, arms overhead in a Y.', 'Lift the hands a few centimetres only.', 'Neck relaxed, no head lift.']),

    // shoulders
    E('lateral-raise', 'shoulders', 'Dumbbell Lateral Raise', 'tools', 'LOW', 3, '12-20', '60 sec', 'Side shoulders', 'Dumbbells', ['Lead with the elbows.', 'Stop at shoulder height.', 'Lighter than you expect.']),
    E('reverse-pec-deck', 'shoulders', 'Reverse Pec Deck', 'tools', 'LOW', 3, '12-15', '60-90 sec', 'Rear shoulders · Upper back', 'Reverse pec-deck machine', ['Lead with the little fingers.', 'No shrugging.', 'Stop at the shoulder line.']),
    E('machine-shoulder-press', 'shoulders', 'Machine Shoulder Press', 'tools', 'LOW', 3, '8-12', '2 min', 'Shoulders · Triceps', 'Shoulder press machine', ['Seat so the handles start at shoulder height.', 'Ribs down, back on the pad.', 'Press without shrugging.']),
    E('pike-push-up', 'shoulders', 'Pike Push-Up', 'bodyweight', 'MEDIUM', 3, '5-12', '90 sec', 'Shoulders · Triceps', 'Floor only', ['Hips high, body in a V.', 'Crown of the head toward the floor.', 'Elbows travel back at 45°.']),
    E('wall-slide', 'shoulders', 'Wall Slide', 'bodyweight', 'LOW', 3, '10-15', '60 sec', 'Shoulders · Upper back', 'A wall', ['Forearms on the wall, elbows at rib height.', 'Slide up slowly, keep contact.', 'Stop where contact breaks.']),

    // arms
    E('db-curl', 'arms', 'Dumbbell Biceps Curl', 'tools', 'LOW', 3, '8-12', '90 sec', 'Biceps', 'Dumbbells', ['Elbows pinned to the ribs.', 'Squeeze at the top.', 'Three-second lowering.']),
    E('hammer-curl', 'arms', 'Hammer Curl', 'tools', 'LOW', 3, '10-12', '60-90 sec', 'Biceps · Forearms', 'Dumbbells', ['Thumbs up the whole rep.', 'Elbows do not travel forward.', 'Control both directions.']),
    E('triceps-pushdown', 'arms', 'Cable Triceps Pushdown', 'tools', 'LOW', 3, '10-12', '60-90 sec', 'Triceps', 'Cable machine + rope or bar', ['Upper arms vertical and still.', 'Wrists neutral.', 'Extend without locking hard.']),
    E('overhead-triceps', 'arms', 'Overhead Cable Extension', 'tools', 'MEDIUM', 3, '10-15', '60-90 sec', 'Triceps', 'Cable machine + rope', ['Elbows forward and close.', 'Ribs down, no arch.', 'Move only at the elbow.']),
    E('chair-dip', 'arms', 'Chair Dip', 'bodyweight', 'MEDIUM', 3, '6-15', '90 sec', 'Triceps · Chest', 'Chair or low bench', ['Hands on the edge, fingers forward.', 'Elbows back, not out.', 'Feet closer in to make it easier.']),
    E('towel-curl', 'arms', 'Towel Isometric Curl', 'bodyweight', 'LOW', 3, '20-30 sec', '60 sec', 'Biceps · Forearms', 'Towel', ['Stand on one end, pull up against it.', 'Hold hard for the full count.', 'Breathe throughout.']),
    E('diamond-push-up', 'arms', 'Diamond Push-Up', 'bodyweight', 'MEDIUM', 3, '5-12', '90 sec', 'Triceps · Chest', 'Floor only', ['Hands together under the chest.', 'Elbows brush the ribs.', 'Elevate the hands to regress.']),

    // legs
    E('leg-press', 'legs', 'Leg Press Machine', 'tools', 'LOW', 3, '10-12', '2-3 min', 'Quads · Glutes', 'Leg press machine', ['Whole foot on the platform.', 'Knees track over the toes.', 'Stop before the hips lift.']),
    E('leg-extension', 'legs', 'Leg Extension', 'tools', 'LOW', 3, '10-15', '90 sec', 'Quads', 'Leg extension machine', ['Knee at the machine pivot.', 'Squeeze at the top.', 'No kicking.']),
    E('leg-curl', 'legs', 'Seated / Lying Leg Curl', 'tools', 'LOW', 3, '10-15', '90 sec', 'Hamstrings', 'Leg curl machine', ['Hips stay down.', 'Toes relaxed.', 'Control the return.']),
    E('hip-abductor', 'legs', 'Hip Abductor Machine', 'tools', 'LOW', 2, '12-15', '60-90 sec', 'Glutes', 'Hip abductor machine', ['Sit upright.', 'Push through the outside of the knees.', 'Two-second return.']),
    E('calf-raise', 'legs', 'Calf Raise Machine', 'tools', 'LOW', 3, '12-15', '60-90 sec', 'Calves', 'Calf raise machine', ['Deep stretch, high squeeze.', 'One-second hold at the top.', 'No bouncing.']),
    E('bodyweight-squat', 'legs', 'Bodyweight Squat', 'bodyweight', 'LOW', 3, '10-20', '90 sec', 'Quads · Glutes', 'Floor only', ['Feet shoulder-width, toes slightly out.', 'Sit down and back, chest up.', 'Hold a doorframe for balance if needed.']),
    E('split-squat', 'legs', 'Split Squat', 'bodyweight', 'MEDIUM', 3, '8-12', '90 sec', 'Quads · Glutes', 'Floor only', ['Long stance, torso upright.', 'Back knee drops straight down.', 'Touch a wall for balance.']),
    E('glute-bridge', 'legs', 'Glute Bridge', 'bodyweight', 'LOW', 3, '12-20', '60 sec', 'Glutes · Hamstrings', 'Floor or mat', ['Heels close to the hips.', 'Push through the heels.', 'Ribs down, no back arch.']),
    E('step-up', 'legs', 'Step-Up', 'bodyweight', 'MEDIUM', 3, '8-12', '90 sec', 'Quads · Glutes', 'Stair or sturdy step', ['Whole foot on the step.', 'Stand up without pushing off the back foot.', 'Lower slowly.']),
    E('calf-raise-step', 'legs', 'Standing Calf Raise', 'bodyweight', 'LOW', 3, '15-25', '60 sec', 'Calves', 'A step', ['Balls of the feet on the edge.', 'Rise as high as possible.', 'Slow heel drop.']),

    // core
    E('plank', 'core', 'Plank', 'bodyweight', 'LOW', 3, '20-45 sec', '60 sec', 'Core', 'Floor or mat', ['Elbows under the shoulders.', 'Ribs down, glutes tight.', 'Drop to the knees before the form breaks.']),
    E('dead-bug', 'core', 'Dead Bug', 'bodyweight', 'LOW', 3, '8-12', '60 sec', 'Core', 'Floor or mat', ['Lower back stays flat on the floor.', 'Move one arm and the opposite leg.', 'Breathe out as you extend.']),
    E('side-plank', 'core', 'Side Plank', 'bodyweight', 'MEDIUM', 3, '15-30 sec', '60 sec', 'Obliques · Core', 'Floor or mat', ['Stack the shoulder over the elbow.', 'Hips lifted in one line.', 'Bend the bottom knee to regress.']),
    E('cable-crunch', 'core', 'Cable Crunch', 'tools', 'MEDIUM', 3, '10-15', '60-90 sec', 'Core', 'Cable machine + rope', ['Hips fixed, spine curls.', 'Pull with the abs, not the arms.', 'Slow return.']),
    E('bird-dog', 'core', 'Bird Dog', 'bodyweight', 'LOW', 3, '8-12', '60 sec', 'Core · Lower back', 'Floor or mat', ['Reach opposite arm and leg.', 'Keep the hips level.', 'Pause one second at full reach.'])
  ];

  const plans = [
    { id: 'starter-2', name: 'Two days a week', commitment: '2 sessions · 35-45 min', level: 'LOW',
      who: 'A first month back, or a schedule with almost no room. Full body each session so nothing gets skipped.',
      days: [
        { day: 'Monday', focus: 'Full body A', items: ['Machine Chest Press 3×10', 'Lat Pulldown 3×10', 'Leg Press 3×10', 'Dumbbell Biceps Curl 2×12', 'Plank 3×30 sec'] },
        { day: 'Thursday', focus: 'Full body B', items: ['Incline Dumbbell Press 3×10', 'Seated Cable Row 3×10', 'Leg Curl 3×12', 'Triceps Pushdown 2×12', 'Dead Bug 3×10'] },
        { day: 'Other days', focus: 'Rest', items: ['Walking', 'Light stretching', 'Sleep'] }
      ] },
    { id: 'balanced-3', name: 'Three days a week', commitment: '3 sessions · 45-55 min', level: 'LOW',
      who: 'The default recommendation. Enough volume to grow, enough rest to recover, easy to reschedule.',
      days: [
        { day: 'Monday', focus: 'Push — chest, shoulders, triceps', items: ['Dumbbell Bench Press 3×8-10', 'Machine Chest Press 3×10', 'Lateral Raise 3×15', 'Triceps Pushdown 3×12', 'Cable Fly 2×12'] },
        { day: 'Wednesday', focus: 'Pull — back, biceps', items: ['Lat Pulldown 3×10', 'Seated Cable Row 3×10', 'Reverse Pec Deck 3×15', 'Dumbbell Curl 3×10', 'Hammer Curl 2×12'] },
        { day: 'Friday', focus: 'Legs, core', items: ['Leg Press 3×10', 'Leg Extension 3×12', 'Leg Curl 3×12', 'Calf Raise 3×15', 'Plank 3×40 sec'] },
        { day: 'Other days', focus: 'Rest', items: ['Walking', 'Hydration', 'Sleep'] }
      ] },
    { id: 'upper-5', name: 'Five days a week', commitment: '5 sessions · 60-75 min', level: 'MEDIUM',
      who: 'Chest, biceps, triceps and shoulders prioritised, legs on stable machines. The full program already built into the training app.',
      days: [
        { day: 'Monday', focus: 'Chest + triceps', items: ['7 exercises', 'Dumbbell and machine pressing', 'Two triceps movements'] },
        { day: 'Tuesday', focus: 'Back + biceps', items: ['7 exercises', 'Pulldown and row variations', 'Two curl movements'] },
        { day: 'Wednesday', focus: 'Recovery', items: ['Walking', 'Light stretching'] },
        { day: 'Thursday', focus: 'Chest + shoulders + triceps', items: ['7 exercises', 'Incline focus', 'Lateral raises'] },
        { day: 'Friday', focus: 'Legs + biceps', items: ['7 exercises', 'Machines only — no barbell squats or deadlifts'] },
        { day: 'Saturday / Sunday', focus: 'Rest', items: ['Optional walking'] }
      ] }
  ];

  const images = Object.assign({ 'push-up': 'uploads/Gemini_Generated_Image_98gt398gt398gt39.jpg' }, {
    "pec-deck": "uploads/WhatsApp Image 2026-09-14 at 12.42.11.jpeg",
    "triceps-pushdown": "uploads/WhatsApp Image 2026-09-18 at 11.53.49.jpeg",
    "overhead-triceps": "uploads/WhatsApp Image 2026-09-18 at 11.54.21.jpeg",
    "db-bench": "uploads/WhatsApp Image 2026-09-14 at 12.44.10.jpeg",
    "incline-db-press": "uploads/WhatsApp Image 2026-09-14 at 12.44.29.jpeg",
    "machine-chest-press": "uploads/WhatsApp Image 2026-09-14 at 12.44.48.jpeg",
    "lat-pulldown": "uploads/WhatsApp Image 2026-09-15 at 12.29.06.jpeg",
    "seated-cable-row": "uploads/WhatsApp Image 2026-09-15 at 12.29.30.jpeg",
    "chest-supported-row": "uploads/WhatsApp Image 2026-09-15 at 12.30.06.jpeg",
    "reverse-pec-deck": "uploads/WhatsApp Image 2026-09-15 at 12.30.32.jpeg",
    "straight-arm-pulldown": "uploads/WhatsApp Image 2026-09-15 at 12.31.24.jpeg",
    "db-curl": "uploads/WhatsApp Image 2026-09-15 at 12.31.55.jpeg",
    "hammer-curl": "uploads/WhatsApp Image 2026-09-15 at 12.32.27.jpeg",
    "cable-fly": "uploads/WhatsApp Image 2026-09-18 at 11.52.20.jpeg",
    "lateral-raise": "uploads/WhatsApp Image 2026-09-18 at 11.53.07.jpeg"
  });
  const catImages = {
    chest: images['db-bench'],
    back: images['lat-pulldown'],
    shoulders: images['lateral-raise'],
    arms: images['db-curl']
  };
  exercises.forEach(e => { if (images[e.id]) e.img = images[e.id]; });
  categories.forEach(c => { if (catImages[c.id]) c.img = catImages[c.id]; });

  return { categories, exercises, plans };
})();
