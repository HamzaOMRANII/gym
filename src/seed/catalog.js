// Initial catalog, generated from the Claude Design export in design/ (data.js + Training Program).
// Loaded by `npm run seed`; after that the content is edited from /admin.
module.exports = {
  "categories": [
    {
      "slug": "chest",
      "name": "Chest",
      "blurb": "Pressing strength and upper-body shape. Machines and dumbbells first, floor work when you have nothing.",
      "position": 0,
      "image": "/uploads/db-bench.jpg"
    },
    {
      "slug": "back",
      "name": "Back",
      "blurb": "Pulling patterns that build width and fix desk posture. Fully machine-friendly for beginners.",
      "position": 1,
      "image": "/uploads/lat-pulldown.jpg"
    },
    {
      "slug": "shoulders",
      "name": "Shoulders",
      "blurb": "Light, high-control work. The one area where less weight beats more, every session.",
      "position": 2,
      "image": "/uploads/lateral-raise.jpg"
    },
    {
      "slug": "arms",
      "name": "Arms",
      "blurb": "Biceps and triceps, trained directly. Short sessions, simple equipment, quick to learn.",
      "position": 3,
      "image": "/uploads/db-curl.jpg"
    },
    {
      "slug": "legs",
      "name": "Legs",
      "blurb": "Stable machines and controlled movement. No barbell squats or deadlifts required.",
      "position": 4,
      "image": ""
    },
    {
      "slug": "core",
      "name": "Core",
      "blurb": "Bracing and trunk control. Needs no equipment and can be done at home on a mat.",
      "position": 5,
      "image": ""
    }
  ],
  "exercises": [
    {
      "slug": "db-bench",
      "name": "Dumbbell Bench Press",
      "category": "chest",
      "kit": "tools",
      "level": "MEDIUM",
      "trainingType": "Push",
      "sets": 3,
      "reps": "8-10",
      "rest": "2-3 min",
      "restSec": 150,
      "muscles": "Chest · Triceps · Front shoulders",
      "primaryMuscle": "Chest",
      "secondaryMuscles": [
        "Triceps",
        "Front shoulders"
      ],
      "equipment": "Flat bench + dumbbells",
      "equipTags": [
        "Dumbbells",
        "Bench"
      ],
      "cues": [
        "Shoulder blades pulled back and down into the bench.",
        "Elbows about 45-60 degrees from your body, not flared straight out.",
        "Two seconds down, controlled press up."
      ],
      "instructions": [
        "Sit on the end of the bench with a dumbbell resting on each thigh.",
        "Lie back, using your knees to help lift the dumbbells to shoulder level.",
        "Press both dumbbells up until your arms are almost straight, wrists stacked over elbows.",
        "Lower under control until your upper arms are roughly level with your torso.",
        "Keep both feet flat and press again without bouncing at the bottom."
      ],
      "setup": "Flat bench, dumbbells racked at the end so you can pick them up seated. Start light enough that you can complete all reps with the same tempo.",
      "mistakes": [
        "Letting the dumbbells drift toward the head instead of over the chest.",
        "Bouncing the weights off the chest at the bottom.",
        "Lifting the hips off the bench to move heavier weight."
      ],
      "safetyNotes": "No exercise is risk-free. If you train without a spotter, keep the weight conservative and stop a set with two reps still in reserve.",
      "alternatives": [
        "machine-chest-press",
        "incline-db-press"
      ],
      "image": "/uploads/db-bench.jpg",
      "imageAlt": "Dumbbell Bench Press: illustration of the movement and the muscles it trains",
      "position": 0
    },
    {
      "slug": "incline-db-press",
      "name": "Incline Dumbbell Press",
      "category": "chest",
      "kit": "tools",
      "level": "MEDIUM",
      "trainingType": "Push",
      "sets": 3,
      "reps": "8-12",
      "rest": "2 min",
      "restSec": 120,
      "muscles": "Upper chest · Front shoulders",
      "primaryMuscle": "Chest",
      "secondaryMuscles": [
        "Front shoulders",
        "Triceps"
      ],
      "equipment": "Adjustable bench + dumbbells",
      "equipTags": [
        "Dumbbells",
        "Bench"
      ],
      "cues": [
        "Chest up, ribcage proud.",
        "Wrists directly above elbows at every point.",
        "Stop the descent when the stretch appears, not when the dumbbells hit your chest."
      ],
      "instructions": [
        "Set the bench to roughly 30-45 degrees.",
        "Sit back with a dumbbell on each thigh, then bring them to shoulder height.",
        "Press up and slightly inward until the arms are nearly straight.",
        "Lower slowly until you feel a stretch across the upper chest.",
        "Keep your head, upper back and hips in contact with the bench throughout."
      ],
      "setup": "Adjustable bench at 30-45 degrees. Steeper angles shift work to the shoulders, so stay near the lower end for chest.",
      "mistakes": [
        "Setting the bench too upright and turning it into a shoulder press.",
        "Letting the elbows collapse toward the hips."
      ],
      "safetyNotes": "Reduce the range of motion if you feel pinching at the front of the shoulder.",
      "alternatives": [
        "machine-chest-press",
        "db-bench"
      ],
      "image": "/uploads/incline-db-press.jpg",
      "imageAlt": "Incline Dumbbell Press: illustration of the movement and the muscles it trains",
      "position": 1
    },
    {
      "slug": "machine-chest-press",
      "name": "Machine Chest Press",
      "category": "chest",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Push",
      "sets": 3,
      "reps": "8-12",
      "rest": "2 min",
      "restSec": 120,
      "muscles": "Chest · Triceps",
      "primaryMuscle": "Chest",
      "secondaryMuscles": [
        "Triceps",
        "Front shoulders"
      ],
      "equipment": "Chest press machine",
      "equipTags": [
        "Machine"
      ],
      "cues": [
        "Back and head against the pad.",
        "Press with the palms, not the fingertips.",
        "Do not lock out hard at the end."
      ],
      "instructions": [
        "Set the seat so the handles sit at mid-chest height.",
        "Sit tall with your back flat against the pad.",
        "Press the handles forward until your arms are nearly straight.",
        "Return slowly until you feel a light stretch in the chest.",
        "Keep tension by stopping just short of the weight stack resting."
      ],
      "setup": "Adjust seat height first, then pick a load you can control for all reps. Handles should track along your mid-chest, not your neck.",
      "mistakes": [
        "Seat too low, pressing upward at the neck.",
        "Letting the weight slam down between reps."
      ],
      "safetyNotes": "A fixed path is stable but not risk-free; stop if the shoulder feels pinched at the back of the movement.",
      "alternatives": [
        "db-bench",
        "incline-db-press"
      ],
      "image": "/uploads/machine-chest-press.jpg",
      "imageAlt": "Machine Chest Press: illustration of the movement and the muscles it trains",
      "position": 2
    },
    {
      "slug": "pec-deck",
      "name": "Pec Deck",
      "category": "chest",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Push",
      "sets": 3,
      "reps": "10-15",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Chest",
      "primaryMuscle": "Chest",
      "secondaryMuscles": [
        "Front shoulders"
      ],
      "equipment": "Pec-deck machine",
      "equipTags": [
        "Machine"
      ],
      "cues": [
        "Squeeze the chest, do not push with the hands.",
        "Elbows stay slightly below shoulder height.",
        "Control the opening phase."
      ],
      "instructions": [
        "Set the seat so your elbows or forearms meet the pads at chest height.",
        "Sit back with your shoulder blades on the backrest.",
        "Bring the pads together in front of your chest.",
        "Pause briefly, then open slowly to a comfortable stretch.",
        "Keep the elbows at the same angle the whole set."
      ],
      "setup": "Seat height so the pads sit level with your mid-chest. Set the starting-range lever so the stretch is comfortable, not extreme.",
      "mistakes": [
        "Using a range so wide it strains the front of the shoulder.",
        "Swinging the pads together with momentum."
      ],
      "safetyNotes": "Shorten the range if you feel any pull at the front of the shoulder joint.",
      "alternatives": [
        "cable-fly",
        "machine-chest-press"
      ],
      "image": "/uploads/pec-deck.jpg",
      "imageAlt": "Pec Deck: illustration of the movement and the muscles it trains",
      "position": 3
    },
    {
      "slug": "cable-fly",
      "name": "Cable Chest Fly",
      "category": "chest",
      "kit": "tools",
      "level": "MEDIUM",
      "trainingType": "Push",
      "sets": 2,
      "reps": "12-15",
      "rest": "60-90 sec",
      "restSec": 75,
      "muscles": "Chest",
      "primaryMuscle": "Chest",
      "secondaryMuscles": [
        "Front shoulders"
      ],
      "equipment": "Cable machine",
      "equipTags": [
        "Cable"
      ],
      "cues": [
        "Fixed, slight elbow bend throughout.",
        "Lead with the elbows, not the hands.",
        "Stay leaning very slightly forward."
      ],
      "instructions": [
        "Set both pulleys at roughly shoulder height and select a light load.",
        "Take a handle in each hand and step forward into a staggered stance.",
        "With a slight bend in the elbows, bring both hands together in front of your chest.",
        "Pause, then let the arms open slowly and under tension.",
        "Keep the torso still — only the arms move."
      ],
      "setup": "Two pulleys at shoulder height. One foot forward for balance. Load light: this is a control exercise, not a strength lift.",
      "mistakes": [
        "Turning it into a press by bending and straightening the elbows.",
        "Going too heavy and rocking the torso."
      ],
      "safetyNotes": "Keep the hands in view; do not let the arms travel far behind the torso.",
      "alternatives": [
        "pec-deck",
        "machine-chest-press"
      ],
      "image": "/uploads/cable-fly.jpg",
      "imageAlt": "Cable Chest Fly: illustration of the movement and the muscles it trains",
      "position": 4
    },
    {
      "slug": "push-up",
      "name": "Push-Up",
      "category": "chest",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Push",
      "sets": 3,
      "reps": "6-15",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Chest · Triceps · Core",
      "primaryMuscle": "Chest",
      "secondaryMuscles": [
        "Triceps",
        "Core"
      ],
      "equipment": "Floor only",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Hands slightly wider than the shoulders.",
        "Body in one line from head to heels.",
        "Lower until the chest is a fist from the floor."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "/uploads/push-up.jpg",
      "imageAlt": "Push-Up: illustration of the movement and the muscles it trains",
      "position": 5
    },
    {
      "slug": "incline-push-up",
      "name": "Hands-Elevated Push-Up",
      "category": "chest",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Push",
      "sets": 3,
      "reps": "8-15",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Chest · Triceps",
      "primaryMuscle": "Chest",
      "secondaryMuscles": [
        "Triceps"
      ],
      "equipment": "Table, bench or sofa edge",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "The higher the hands, the easier the rep.",
        "Squeeze the glutes to stop the hips sagging.",
        "Same tempo on every rep."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 6
    },
    {
      "slug": "floor-fly-towel",
      "name": "Wall Press",
      "category": "chest",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Push",
      "sets": 3,
      "reps": "10-20",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Chest · Shoulders",
      "primaryMuscle": "Chest",
      "secondaryMuscles": [
        "Shoulders"
      ],
      "equipment": "A wall",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Stand a forearm from the wall.",
        "Elbows travel back, not out.",
        "Push away without shrugging."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 7
    },
    {
      "slug": "lat-pulldown",
      "name": "Lat Pulldown",
      "category": "back",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Pull",
      "sets": 3,
      "reps": "8-12",
      "rest": "2 min",
      "restSec": 120,
      "muscles": "Back · Biceps",
      "primaryMuscle": "Back",
      "secondaryMuscles": [
        "Biceps",
        "Rear shoulders"
      ],
      "equipment": "Lat-pulldown machine",
      "equipTags": [
        "Machine",
        "Cable"
      ],
      "cues": [
        "Pull with the elbows, not the hands.",
        "Chest up as the bar comes down.",
        "No swinging of the torso."
      ],
      "instructions": [
        "Set the thigh pad so your legs are held firmly.",
        "Take a shoulder-width-plus grip on the bar and sit down.",
        "Lean back very slightly and pull the bar to your upper chest.",
        "Drive the elbows down toward your ribs.",
        "Return the bar slowly until your arms are straight and shoulders lift a little."
      ],
      "setup": "Thigh pad snug, grip a hand-width wider than the shoulders on each side.",
      "mistakes": [
        "Leaning far back and rowing instead of pulling down.",
        "Pulling the bar behind the neck."
      ],
      "safetyNotes": "Always pull to the front of the body, never behind the neck.",
      "alternatives": [
        "seated-cable-row",
        "straight-arm-pulldown"
      ],
      "image": "/uploads/lat-pulldown.jpg",
      "imageAlt": "Lat Pulldown: illustration of the movement and the muscles it trains",
      "position": 8
    },
    {
      "slug": "seated-cable-row",
      "name": "Seated Cable Row",
      "category": "back",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Pull",
      "sets": 3,
      "reps": "8-12",
      "rest": "2 min",
      "restSec": 120,
      "muscles": "Back · Biceps",
      "primaryMuscle": "Back",
      "secondaryMuscles": [
        "Biceps",
        "Rear shoulders"
      ],
      "equipment": "Seated cable-row machine",
      "equipTags": [
        "Cable",
        "Machine"
      ],
      "cues": [
        "Torso stays still — no rocking.",
        "Lead with the elbows.",
        "Slow return, full stretch."
      ],
      "instructions": [
        "Sit with feet on the platform and a slight bend in the knees.",
        "Take the handle and sit up tall with a flat back.",
        "Pull the handle to your lower ribs, elbows close to the body.",
        "Squeeze the shoulder blades together briefly.",
        "Let the handle travel forward slowly without rounding the back."
      ],
      "setup": "Feet braced, knees softly bent. Chest stays lifted for the whole set.",
      "mistakes": [
        "Swinging the torso back and forth.",
        "Rounding the lower back at the front of the movement."
      ],
      "safetyNotes": "Keep the spine neutral; do not use a heavy load that forces you to lean.",
      "alternatives": [
        "chest-supported-row",
        "lat-pulldown"
      ],
      "image": "/uploads/seated-cable-row.jpg",
      "imageAlt": "Seated Cable Row: illustration of the movement and the muscles it trains",
      "position": 9
    },
    {
      "slug": "chest-supported-row",
      "name": "Chest-Supported Row",
      "category": "back",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Pull",
      "sets": 3,
      "reps": "10-12",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Back · Rear shoulders",
      "primaryMuscle": "Back",
      "secondaryMuscles": [
        "Biceps",
        "Rear shoulders"
      ],
      "equipment": "Chest-supported row machine",
      "equipTags": [
        "Machine"
      ],
      "cues": [
        "Chest stays in contact with the pad.",
        "Elbows finish behind the torso.",
        "No shrugging at the top."
      ],
      "instructions": [
        "Set the seat and chest pad so the handles are at mid-torso height.",
        "Rest your chest on the pad with feet planted.",
        "Row the handles back, elbows close to your sides.",
        "Squeeze the shoulder blades at the end.",
        "Return under control to a full stretch."
      ],
      "setup": "Chest pad height so your arms reach the handles without shrugging. The pad takes the lower back out of the movement.",
      "mistakes": [
        "Pulling the chest off the pad to add range.",
        "Using only the arms without moving the shoulder blades."
      ],
      "safetyNotes": "Stable and beginner-friendly, but still work up in small load steps.",
      "alternatives": [
        "seated-cable-row",
        "lat-pulldown"
      ],
      "image": "/uploads/chest-supported-row.jpg",
      "imageAlt": "Chest-Supported Row: illustration of the movement and the muscles it trains",
      "position": 10
    },
    {
      "slug": "straight-arm-pulldown",
      "name": "Straight-Arm Cable Pulldown",
      "category": "back",
      "kit": "tools",
      "level": "MEDIUM",
      "trainingType": "Pull",
      "sets": 2,
      "reps": "12-15",
      "rest": "60-90 sec",
      "restSec": 75,
      "muscles": "Back · Core",
      "primaryMuscle": "Back",
      "secondaryMuscles": [
        "Triceps",
        "Core"
      ],
      "equipment": "Cable machine",
      "equipTags": [
        "Cable"
      ],
      "cues": [
        "Elbows stay almost locked.",
        "Only the shoulders move.",
        "Ribs down, no back arch."
      ],
      "instructions": [
        "Set the pulley high with a straight bar or rope.",
        "Stand a step back and hinge forward slightly at the hips.",
        "With near-straight arms, pull the attachment down to your thighs.",
        "Feel the contraction along the sides of your back.",
        "Let the arms rise slowly back to head height."
      ],
      "setup": "High pulley, feet hip-width, small hip hinge and a flat back.",
      "mistakes": [
        "Bending the elbows into a pushdown.",
        "Standing too upright and losing tension."
      ],
      "safetyNotes": "Keep the load light and the spine neutral during the hinge.",
      "alternatives": [
        "lat-pulldown",
        "seated-cable-row"
      ],
      "image": "/uploads/straight-arm-pulldown.jpg",
      "imageAlt": "Straight-Arm Cable Pulldown: illustration of the movement and the muscles it trains",
      "position": 11
    },
    {
      "slug": "table-row",
      "name": "Table Row",
      "category": "back",
      "kit": "bodyweight",
      "level": "MEDIUM",
      "trainingType": "Pull",
      "sets": 3,
      "reps": "6-12",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Back · Biceps",
      "primaryMuscle": "Back",
      "secondaryMuscles": [
        "Biceps"
      ],
      "equipment": "Sturdy table edge",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Grip the edge, body straight, heels on the floor.",
        "Pull the chest to the edge.",
        "Walk the feet in to make it easier."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 12
    },
    {
      "slug": "towel-row",
      "name": "Door-Anchored Towel Row",
      "category": "back",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Pull",
      "sets": 3,
      "reps": "10-15",
      "rest": "60-90 sec",
      "restSec": 75,
      "muscles": "Back · Biceps",
      "primaryMuscle": "Back",
      "secondaryMuscles": [
        "Biceps"
      ],
      "equipment": "Towel + solid door handle",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Lean back with straight arms, then pull.",
        "Squeeze the shoulder blades.",
        "Lean further back for more difficulty."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 13
    },
    {
      "slug": "prone-y",
      "name": "Floor Y-Raise",
      "category": "back",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Pull",
      "sets": 3,
      "reps": "10-15",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Upper back · Rear shoulders",
      "primaryMuscle": "Back",
      "secondaryMuscles": [
        "Rear shoulders"
      ],
      "equipment": "Floor or mat",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Face down, arms overhead in a Y.",
        "Lift the hands a few centimetres only.",
        "Neck relaxed, no head lift."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 14
    },
    {
      "slug": "lateral-raise",
      "name": "Dumbbell Lateral Raise",
      "category": "shoulders",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Push",
      "sets": 3,
      "reps": "12-20",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Side shoulders",
      "primaryMuscle": "Shoulders",
      "secondaryMuscles": [
        "Upper back"
      ],
      "equipment": "Dumbbells",
      "equipTags": [
        "Dumbbells"
      ],
      "cues": [
        "Lead with the elbows.",
        "Wrists level with the elbows, not higher.",
        "No shrugging."
      ],
      "instructions": [
        "Stand with a light dumbbell in each hand at your sides.",
        "Bend the elbows slightly and lean forward a few degrees.",
        "Raise both arms out to the sides until level with the shoulders.",
        "Pause, then lower slowly.",
        "Keep the neck and traps relaxed."
      ],
      "setup": "Light dumbbells — much lighter than you expect. Standing, feet hip-width.",
      "mistakes": [
        "Swinging the dumbbells up with a hip bounce.",
        "Raising the arms above shoulder height."
      ],
      "safetyNotes": "Stop at shoulder height; higher raises stress the shoulder joint.",
      "alternatives": [
        "reverse-pec-deck"
      ],
      "image": "/uploads/lateral-raise.jpg",
      "imageAlt": "Dumbbell Lateral Raise: illustration of the movement and the muscles it trains",
      "position": 15
    },
    {
      "slug": "reverse-pec-deck",
      "name": "Reverse Pec Deck",
      "category": "shoulders",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Pull",
      "sets": 3,
      "reps": "12-15",
      "rest": "60-90 sec",
      "restSec": 75,
      "muscles": "Rear shoulders · Upper back",
      "primaryMuscle": "Shoulders",
      "secondaryMuscles": [
        "Upper back"
      ],
      "equipment": "Reverse pec-deck machine",
      "equipTags": [
        "Machine"
      ],
      "cues": [
        "Lead with the little fingers.",
        "Keep the neck relaxed.",
        "Stop when the arms reach the shoulder line."
      ],
      "instructions": [
        "Turn the seat or pads so you face the backrest.",
        "Set the seat so the handles are at shoulder height.",
        "Hold the handles with straight-ish arms.",
        "Open the arms out and slightly back until level with your shoulders.",
        "Return slowly to the front."
      ],
      "setup": "Facing the pad, chest supported, handles at shoulder height with a small elbow bend.",
      "mistakes": [
        "Shrugging the shoulders up during the pull.",
        "Bending and straightening the elbows to cheat the weight back."
      ],
      "safetyNotes": "Light loads work best here; heavy weight turns it into a swing.",
      "alternatives": [
        "lateral-raise",
        "chest-supported-row"
      ],
      "image": "/uploads/reverse-pec-deck.jpg",
      "imageAlt": "Reverse Pec Deck: illustration of the movement and the muscles it trains",
      "position": 16
    },
    {
      "slug": "machine-shoulder-press",
      "name": "Machine Shoulder Press",
      "category": "shoulders",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Push",
      "sets": 3,
      "reps": "8-12",
      "rest": "2 min",
      "restSec": 120,
      "muscles": "Shoulders · Triceps",
      "primaryMuscle": "Shoulders",
      "secondaryMuscles": [
        "Triceps"
      ],
      "equipment": "Shoulder press machine",
      "equipTags": [
        "Machine"
      ],
      "cues": [
        "Seat so the handles start at shoulder height.",
        "Ribs down, back on the pad.",
        "Press without shrugging."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 17
    },
    {
      "slug": "pike-push-up",
      "name": "Pike Push-Up",
      "category": "shoulders",
      "kit": "bodyweight",
      "level": "MEDIUM",
      "trainingType": "Push",
      "sets": 3,
      "reps": "5-12",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Shoulders · Triceps",
      "primaryMuscle": "Shoulders",
      "secondaryMuscles": [
        "Triceps"
      ],
      "equipment": "Floor only",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Hips high, body in a V.",
        "Crown of the head toward the floor.",
        "Elbows travel back at 45°."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 18
    },
    {
      "slug": "wall-slide",
      "name": "Wall Slide",
      "category": "shoulders",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Push",
      "sets": 3,
      "reps": "10-15",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Shoulders · Upper back",
      "primaryMuscle": "Shoulders",
      "secondaryMuscles": [
        "Upper back"
      ],
      "equipment": "A wall",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Forearms on the wall, elbows at rib height.",
        "Slide up slowly, keep contact.",
        "Stop where contact breaks."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 19
    },
    {
      "slug": "db-curl",
      "name": "Dumbbell Biceps Curl",
      "category": "arms",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Pull",
      "sets": 3,
      "reps": "8-12",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Biceps",
      "primaryMuscle": "Biceps",
      "secondaryMuscles": [
        "Forearms"
      ],
      "equipment": "Dumbbells",
      "equipTags": [
        "Dumbbells"
      ],
      "cues": [
        "Elbows pinned to the ribs.",
        "Squeeze at the top, do not rest there.",
        "Three-second lowering."
      ],
      "instructions": [
        "Stand tall with a dumbbell in each hand, palms forward.",
        "Keep the elbows at your sides and curl one or both dumbbells up.",
        "Stop when the forearm is just past vertical.",
        "Lower slowly until the arm is straight.",
        "Keep the torso still for every rep."
      ],
      "setup": "Standing or seated on an upright bench. Pick a weight you can lift without leaning back.",
      "mistakes": [
        "Swinging the torso to start the rep.",
        "Stopping halfway down instead of straightening the arm."
      ],
      "safetyNotes": "If the elbow or wrist aches, switch to a hammer grip.",
      "alternatives": [
        "hammer-curl"
      ],
      "image": "/uploads/db-curl.jpg",
      "imageAlt": "Dumbbell Biceps Curl: illustration of the movement and the muscles it trains",
      "position": 20
    },
    {
      "slug": "hammer-curl",
      "name": "Hammer Curl",
      "category": "arms",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Pull",
      "sets": 3,
      "reps": "10-12",
      "rest": "60-90 sec",
      "restSec": 75,
      "muscles": "Biceps · Forearms",
      "primaryMuscle": "Biceps",
      "secondaryMuscles": [
        "Forearms"
      ],
      "equipment": "Dumbbells",
      "equipTags": [
        "Dumbbells"
      ],
      "cues": [
        "Thumbs stay up the whole rep.",
        "Elbows do not travel forward.",
        "Controlled tempo both directions."
      ],
      "instructions": [
        "Stand with a dumbbell in each hand, palms facing your thighs.",
        "Keep that neutral grip and curl the dumbbell toward the shoulder.",
        "Pause at the top without shrugging.",
        "Lower slowly to a straight arm.",
        "Alternate arms or lift both together."
      ],
      "setup": "Neutral grip, elbows at your sides, feet hip-width.",
      "mistakes": [
        "Rocking the body to move heavier dumbbells.",
        "Cutting the lowering phase short."
      ],
      "safetyNotes": "Comfortable for most wrists; still stop if you feel joint pain rather than muscle fatigue.",
      "alternatives": [
        "db-curl"
      ],
      "image": "/uploads/hammer-curl.jpg",
      "imageAlt": "Hammer Curl: illustration of the movement and the muscles it trains",
      "position": 21
    },
    {
      "slug": "triceps-pushdown",
      "name": "Cable Triceps Pushdown",
      "category": "arms",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Push",
      "sets": 3,
      "reps": "10-12",
      "rest": "60-90 sec",
      "restSec": 75,
      "muscles": "Triceps",
      "primaryMuscle": "Triceps",
      "secondaryMuscles": [
        "Front shoulders"
      ],
      "equipment": "Cable machine + rope or bar",
      "equipTags": [
        "Cable"
      ],
      "cues": [
        "Upper arms stay vertical and still.",
        "Wrists neutral, not bent.",
        "Full extension without locking hard."
      ],
      "instructions": [
        "Attach a rope or straight bar at upper-chest height or above.",
        "Stand close to the machine with a small forward lean.",
        "Pin your elbows to your sides and push the attachment down until the arms are straight.",
        "Squeeze briefly at the bottom.",
        "Let the attachment rise until your forearms are level, keeping the elbows still."
      ],
      "setup": "Pulley set high. Stand about one step back so the cable does not rub your chest.",
      "mistakes": [
        "Letting the elbows drift forward and turning it into a press.",
        "Leaning and using bodyweight to force the weight down."
      ],
      "safetyNotes": "Stop if the elbow joint aches rather than the muscle; lower the load and shorten the range.",
      "alternatives": [
        "overhead-triceps",
        "machine-chest-press"
      ],
      "image": "/uploads/triceps-pushdown.jpg",
      "imageAlt": "Cable Triceps Pushdown: illustration of the movement and the muscles it trains",
      "position": 22
    },
    {
      "slug": "overhead-triceps",
      "name": "Overhead Cable Triceps Extension",
      "category": "arms",
      "kit": "tools",
      "level": "MEDIUM",
      "trainingType": "Push",
      "sets": 3,
      "reps": "10-15",
      "rest": "60-90 sec",
      "restSec": 75,
      "muscles": "Triceps",
      "primaryMuscle": "Triceps",
      "secondaryMuscles": [
        "Shoulders"
      ],
      "equipment": "Cable machine + rope",
      "equipTags": [
        "Cable"
      ],
      "cues": [
        "Elbows point forward and stay close together.",
        "Ribs down, do not arch the lower back.",
        "Move only at the elbow."
      ],
      "instructions": [
        "Set the pulley low to mid height and attach a rope.",
        "Take the rope, turn away from the machine and raise it overhead.",
        "Step into a staggered stance with a slight forward lean.",
        "Extend the arms forward and up until straight.",
        "Bend the elbows slowly until you feel a stretch behind the upper arm."
      ],
      "setup": "Rope attachment, pulley at hip to chest height. Face away from the stack with one foot forward.",
      "mistakes": [
        "Arching the back to press the weight.",
        "Letting the elbows flare wide."
      ],
      "safetyNotes": "Keep the load moderate — the overhead position puts the shoulder in a long range.",
      "alternatives": [
        "triceps-pushdown"
      ],
      "image": "/uploads/overhead-triceps.jpg",
      "imageAlt": "Overhead Cable Triceps Extension: illustration of the movement and the muscles it trains",
      "position": 23
    },
    {
      "slug": "chair-dip",
      "name": "Chair Dip",
      "category": "arms",
      "kit": "bodyweight",
      "level": "MEDIUM",
      "trainingType": "Push",
      "sets": 3,
      "reps": "6-15",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Triceps · Chest",
      "primaryMuscle": "Triceps",
      "secondaryMuscles": [
        "Chest"
      ],
      "equipment": "Chair or low bench",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Hands on the edge, fingers forward.",
        "Elbows back, not out.",
        "Feet closer in to make it easier."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 24
    },
    {
      "slug": "towel-curl",
      "name": "Towel Isometric Curl",
      "category": "arms",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Pull",
      "sets": 3,
      "reps": "20-30 sec",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Biceps · Forearms",
      "primaryMuscle": "Biceps",
      "secondaryMuscles": [
        "Forearms"
      ],
      "equipment": "Towel",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Stand on one end, pull up against it.",
        "Hold hard for the full count.",
        "Breathe throughout."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 25
    },
    {
      "slug": "diamond-push-up",
      "name": "Diamond Push-Up",
      "category": "arms",
      "kit": "bodyweight",
      "level": "MEDIUM",
      "trainingType": "Push",
      "sets": 3,
      "reps": "5-12",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Triceps · Chest",
      "primaryMuscle": "Triceps",
      "secondaryMuscles": [
        "Chest"
      ],
      "equipment": "Floor only",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Hands together under the chest.",
        "Elbows brush the ribs.",
        "Elevate the hands to regress."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 26
    },
    {
      "slug": "leg-press",
      "name": "Leg Press Machine",
      "category": "legs",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Legs",
      "sets": 3,
      "reps": "10-12",
      "rest": "2-3 min",
      "restSec": 150,
      "muscles": "Quads · Glutes",
      "primaryMuscle": "Legs",
      "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
      ],
      "equipment": "Leg press machine",
      "equipTags": [
        "Machine"
      ],
      "cues": [
        "Whole foot stays in contact with the platform.",
        "Knees track over the toes.",
        "Never lock the knees hard at the top."
      ],
      "instructions": [
        "Sit with your back and hips flat against the pad.",
        "Place your feet shoulder-width on the platform, toes slightly out.",
        "Release the safety and press the platform up until the legs are nearly straight.",
        "Lower until the knees reach roughly 90 degrees.",
        "Press again without letting the lower back round off the pad."
      ],
      "setup": "Back pad set so your knees start at about 90 degrees and your hips stay flat.",
      "mistakes": [
        "Lowering so far that the hips lift and the back rounds.",
        "Letting the knees fall inward."
      ],
      "safetyNotes": "Keep the safety catches engaged and stop the descent before your hips leave the pad.",
      "alternatives": [
        "leg-extension"
      ],
      "image": "",
      "imageAlt": "",
      "position": 27
    },
    {
      "slug": "leg-extension",
      "name": "Leg Extension Machine",
      "category": "legs",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Legs",
      "sets": 3,
      "reps": "10-15",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Quads",
      "primaryMuscle": "Legs",
      "secondaryMuscles": [
        "Quadriceps"
      ],
      "equipment": "Leg extension machine",
      "equipTags": [
        "Machine"
      ],
      "cues": [
        "Hips stay in the seat.",
        "Squeeze the thigh at the top.",
        "Smooth tempo, no kicking."
      ],
      "instructions": [
        "Set the seat so the knee joint lines up with the machine pivot.",
        "Place the shin pad just above the ankles.",
        "Sit back and extend the knees until the legs are straight.",
        "Pause for a moment at the top.",
        "Lower slowly to the starting position."
      ],
      "setup": "Seat back and pad position set first; the knee must align with the pivot point.",
      "mistakes": [
        "Swinging the weight up with a jerk.",
        "Letting the weight drop back down freely."
      ],
      "safetyNotes": "Reduce the load if you feel pressure behind the kneecap.",
      "alternatives": [
        "leg-press"
      ],
      "image": "",
      "imageAlt": "",
      "position": 28
    },
    {
      "slug": "leg-curl",
      "name": "Seated / Lying Leg Curl",
      "category": "legs",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Legs",
      "sets": 3,
      "reps": "10-15",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Hamstrings",
      "primaryMuscle": "Legs",
      "secondaryMuscles": [
        "Hamstrings",
        "Calves"
      ],
      "equipment": "Leg curl machine",
      "equipTags": [
        "Machine"
      ],
      "cues": [
        "Hips stay down through the curl.",
        "Toes relaxed.",
        "Control the return."
      ],
      "instructions": [
        "Adjust the machine so your knees sit at the pivot and the pad rests above the heels.",
        "Secure the thigh pad if the machine has one.",
        "Curl your heels toward your hips.",
        "Hold the end position briefly.",
        "Return slowly until the legs are almost straight."
      ],
      "setup": "Knee at the pivot, ankle pad just above the heel, thigh pad snug.",
      "mistakes": [
        "Lifting the hips to finish the rep.",
        "Using a range so short the hamstring never lengthens."
      ],
      "safetyNotes": "Warm up with one light set before your working sets.",
      "alternatives": [
        "leg-press"
      ],
      "image": "",
      "imageAlt": "",
      "position": 29
    },
    {
      "slug": "hip-abductor",
      "name": "Hip Abductor Machine",
      "category": "legs",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Legs",
      "sets": 2,
      "reps": "12-15",
      "rest": "60-90 sec",
      "restSec": 75,
      "muscles": "Glutes",
      "primaryMuscle": "Legs",
      "secondaryMuscles": [
        "Glutes"
      ],
      "equipment": "Hip abductor machine",
      "equipTags": [
        "Machine"
      ],
      "cues": [
        "Sit upright, do not lean back hard.",
        "Push through the outside of the knees.",
        "Two-second return."
      ],
      "instructions": [
        "Sit with your back against the pad and knees against the outer pads.",
        "Set the starting width so the position feels comfortable.",
        "Push the knees outward as far as the machine allows.",
        "Pause at the widest point.",
        "Return slowly without letting the pads slam."
      ],
      "setup": "Back flat, feet on the rests, starting width narrow but not pinched.",
      "mistakes": [
        "Rocking the torso for momentum.",
        "Rushing the return phase."
      ],
      "safetyNotes": "Keep the range within what feels comfortable at the hip.",
      "alternatives": [
        "leg-press"
      ],
      "image": "",
      "imageAlt": "",
      "position": 30
    },
    {
      "slug": "calf-raise",
      "name": "Calf Raise Machine",
      "category": "legs",
      "kit": "tools",
      "level": "LOW",
      "trainingType": "Legs",
      "sets": 3,
      "reps": "12-15",
      "rest": "60-90 sec",
      "restSec": 75,
      "muscles": "Calves",
      "primaryMuscle": "Calves",
      "secondaryMuscles": [
        "Ankles"
      ],
      "equipment": "Calf raise machine",
      "equipTags": [
        "Machine"
      ],
      "cues": [
        "Full range: deep stretch, high squeeze.",
        "One-second hold at the top.",
        "No bouncing."
      ],
      "instructions": [
        "Place the balls of your feet on the platform with heels hanging off.",
        "Set the shoulder or thigh pad snug.",
        "Rise onto your toes as high as possible.",
        "Pause at the top for a full second.",
        "Lower the heels slowly to a stretch."
      ],
      "setup": "Balls of the feet on the edge of the platform, knees almost straight for the standing version.",
      "mistakes": [
        "Fast, short bounces with no pause.",
        "Bending the knees to push the weight."
      ],
      "safetyNotes": "Ease into the bottom stretch, especially in the first sessions.",
      "alternatives": [
        "leg-press"
      ],
      "image": "",
      "imageAlt": "",
      "position": 31
    },
    {
      "slug": "bodyweight-squat",
      "name": "Bodyweight Squat",
      "category": "legs",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Legs",
      "sets": 3,
      "reps": "10-20",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Quads · Glutes",
      "primaryMuscle": "Legs",
      "secondaryMuscles": [
        "Glutes"
      ],
      "equipment": "Floor only",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Feet shoulder-width, toes slightly out.",
        "Sit down and back, chest up.",
        "Hold a doorframe for balance if needed."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 32
    },
    {
      "slug": "split-squat",
      "name": "Split Squat",
      "category": "legs",
      "kit": "bodyweight",
      "level": "MEDIUM",
      "trainingType": "Legs",
      "sets": 3,
      "reps": "8-12",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Quads · Glutes",
      "primaryMuscle": "Legs",
      "secondaryMuscles": [
        "Glutes"
      ],
      "equipment": "Floor only",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Long stance, torso upright.",
        "Back knee drops straight down.",
        "Touch a wall for balance."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 33
    },
    {
      "slug": "glute-bridge",
      "name": "Glute Bridge",
      "category": "legs",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Legs",
      "sets": 3,
      "reps": "12-20",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Glutes · Hamstrings",
      "primaryMuscle": "Legs",
      "secondaryMuscles": [
        "Hamstrings"
      ],
      "equipment": "Floor or mat",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Heels close to the hips.",
        "Push through the heels.",
        "Ribs down, no back arch."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 34
    },
    {
      "slug": "step-up",
      "name": "Step-Up",
      "category": "legs",
      "kit": "bodyweight",
      "level": "MEDIUM",
      "trainingType": "Legs",
      "sets": 3,
      "reps": "8-12",
      "rest": "90 sec",
      "restSec": 90,
      "muscles": "Quads · Glutes",
      "primaryMuscle": "Legs",
      "secondaryMuscles": [
        "Glutes"
      ],
      "equipment": "Stair or sturdy step",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Whole foot on the step.",
        "Stand up without pushing off the back foot.",
        "Lower slowly."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 35
    },
    {
      "slug": "calf-raise-step",
      "name": "Standing Calf Raise",
      "category": "legs",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Legs",
      "sets": 3,
      "reps": "15-25",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Calves",
      "primaryMuscle": "Calves",
      "secondaryMuscles": [],
      "equipment": "A step",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Balls of the feet on the edge.",
        "Rise as high as possible.",
        "Slow heel drop."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 36
    },
    {
      "slug": "plank",
      "name": "Plank",
      "category": "core",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Core",
      "sets": 3,
      "reps": "20-45 sec",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Core",
      "primaryMuscle": "Core",
      "secondaryMuscles": [],
      "equipment": "Floor or mat",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Elbows under the shoulders.",
        "Ribs down, glutes tight.",
        "Drop to the knees before the form breaks."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 37
    },
    {
      "slug": "dead-bug",
      "name": "Dead Bug",
      "category": "core",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Core",
      "sets": 3,
      "reps": "8-12",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Core",
      "primaryMuscle": "Core",
      "secondaryMuscles": [],
      "equipment": "Floor or mat",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Lower back stays flat on the floor.",
        "Move one arm and the opposite leg.",
        "Breathe out as you extend."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 38
    },
    {
      "slug": "side-plank",
      "name": "Side Plank",
      "category": "core",
      "kit": "bodyweight",
      "level": "MEDIUM",
      "trainingType": "Core",
      "sets": 3,
      "reps": "15-30 sec",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Obliques · Core",
      "primaryMuscle": "Core",
      "secondaryMuscles": [
        "Core"
      ],
      "equipment": "Floor or mat",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Stack the shoulder over the elbow.",
        "Hips lifted in one line.",
        "Bend the bottom knee to regress."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 39
    },
    {
      "slug": "cable-crunch",
      "name": "Cable Crunch",
      "category": "core",
      "kit": "tools",
      "level": "MEDIUM",
      "trainingType": "Core",
      "sets": 3,
      "reps": "10-15",
      "rest": "60-90 sec",
      "restSec": 75,
      "muscles": "Core",
      "primaryMuscle": "Core",
      "secondaryMuscles": [],
      "equipment": "Cable machine + rope",
      "equipTags": [
        "Cable",
        "Machine"
      ],
      "cues": [
        "Hips fixed, spine curls.",
        "Pull with the abs, not the arms.",
        "Slow return."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 40
    },
    {
      "slug": "bird-dog",
      "name": "Bird Dog",
      "category": "core",
      "kit": "bodyweight",
      "level": "LOW",
      "trainingType": "Core",
      "sets": 3,
      "reps": "8-12",
      "rest": "60 sec",
      "restSec": 60,
      "muscles": "Core · Lower back",
      "primaryMuscle": "Core",
      "secondaryMuscles": [
        "Lower back"
      ],
      "equipment": "Floor or mat",
      "equipTags": [
        "No equipment"
      ],
      "cues": [
        "Reach opposite arm and leg.",
        "Keep the hips level.",
        "Pause one second at full reach."
      ],
      "instructions": [],
      "setup": "",
      "mistakes": [],
      "safetyNotes": "",
      "alternatives": [],
      "image": "",
      "imageAlt": "",
      "position": 41
    }
  ],
  "templates": [
    {
      "slug": "starter-2",
      "name": "Two days a week",
      "commitment": "2 sessions · 35-45 min",
      "level": "LOW",
      "who": "A first month back, or a schedule with almost no room. Full body each session so nothing gets skipped.",
      "position": 0,
      "restNote": {
        "label": "Other days",
        "items": [
          "Walking",
          "Light stretching",
          "Sleep"
        ]
      },
      "days": [
        {
          "weekday": 0,
          "focus": "Full body A",
          "items": [
            {
              "exercise": "machine-chest-press",
              "sets": 3,
              "reps": "10",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "lat-pulldown",
              "sets": 3,
              "reps": "10",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "leg-press",
              "sets": 3,
              "reps": "10",
              "rest": "2-3 min",
              "restSec": 150
            },
            {
              "exercise": "db-curl",
              "sets": 2,
              "reps": "12",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "plank",
              "sets": 3,
              "reps": "30 sec",
              "rest": "60 sec",
              "restSec": 60
            }
          ]
        },
        {
          "weekday": 3,
          "focus": "Full body B",
          "items": [
            {
              "exercise": "incline-db-press",
              "sets": 3,
              "reps": "10",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "seated-cable-row",
              "sets": 3,
              "reps": "10",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "leg-curl",
              "sets": 3,
              "reps": "12",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "triceps-pushdown",
              "sets": 2,
              "reps": "12",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "dead-bug",
              "sets": 3,
              "reps": "10",
              "rest": "60 sec",
              "restSec": 60
            }
          ]
        }
      ]
    },
    {
      "slug": "balanced-3",
      "name": "Three days a week",
      "commitment": "3 sessions · 45-55 min",
      "level": "LOW",
      "who": "The default recommendation. Enough volume to grow, enough rest to recover, easy to reschedule.",
      "position": 1,
      "restNote": {
        "label": "Other days",
        "items": [
          "Walking",
          "Hydration",
          "Sleep"
        ]
      },
      "days": [
        {
          "weekday": 0,
          "focus": "Push — chest, shoulders, triceps",
          "items": [
            {
              "exercise": "db-bench",
              "sets": 3,
              "reps": "8-10",
              "rest": "2-3 min",
              "restSec": 150
            },
            {
              "exercise": "machine-chest-press",
              "sets": 3,
              "reps": "10",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "lateral-raise",
              "sets": 3,
              "reps": "15",
              "rest": "60 sec",
              "restSec": 60
            },
            {
              "exercise": "triceps-pushdown",
              "sets": 3,
              "reps": "12",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "cable-fly",
              "sets": 2,
              "reps": "12",
              "rest": "60-90 sec",
              "restSec": 75
            }
          ]
        },
        {
          "weekday": 2,
          "focus": "Pull — back, biceps",
          "items": [
            {
              "exercise": "lat-pulldown",
              "sets": 3,
              "reps": "10",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "seated-cable-row",
              "sets": 3,
              "reps": "10",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "reverse-pec-deck",
              "sets": 3,
              "reps": "15",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "db-curl",
              "sets": 3,
              "reps": "10",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "hammer-curl",
              "sets": 2,
              "reps": "12",
              "rest": "60-90 sec",
              "restSec": 75
            }
          ]
        },
        {
          "weekday": 4,
          "focus": "Legs, core",
          "items": [
            {
              "exercise": "leg-press",
              "sets": 3,
              "reps": "10",
              "rest": "2-3 min",
              "restSec": 150
            },
            {
              "exercise": "leg-extension",
              "sets": 3,
              "reps": "12",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "leg-curl",
              "sets": 3,
              "reps": "12",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "calf-raise",
              "sets": 3,
              "reps": "15",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "plank",
              "sets": 3,
              "reps": "40 sec",
              "rest": "60 sec",
              "restSec": 60
            }
          ]
        }
      ]
    },
    {
      "slug": "upper-5",
      "name": "Five days a week",
      "commitment": "5 sessions · 60-75 min",
      "level": "MEDIUM",
      "who": "Chest, biceps, triceps and shoulders prioritised, legs on stable machines. The full program already built into the training app.",
      "position": 2,
      "restNote": {
        "label": "Saturday / Sunday",
        "items": [
          "Optional walking"
        ]
      },
      "days": [
        {
          "weekday": 0,
          "focus": "Chest + Triceps",
          "items": [
            {
              "exercise": "db-bench",
              "sets": 3,
              "reps": "8-10",
              "rest": "2-3 min",
              "restSec": 150
            },
            {
              "exercise": "incline-db-press",
              "sets": 3,
              "reps": "8-12",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "machine-chest-press",
              "sets": 3,
              "reps": "8-12",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "pec-deck",
              "sets": 3,
              "reps": "10-15",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "cable-fly",
              "sets": 2,
              "reps": "12-15",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "triceps-pushdown",
              "sets": 3,
              "reps": "10-12",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "overhead-triceps",
              "sets": 3,
              "reps": "10-15",
              "rest": "60-90 sec",
              "restSec": 75
            }
          ]
        },
        {
          "weekday": 1,
          "focus": "Back + Biceps",
          "items": [
            {
              "exercise": "lat-pulldown",
              "sets": 3,
              "reps": "8-12",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "seated-cable-row",
              "sets": 3,
              "reps": "8-12",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "chest-supported-row",
              "sets": 3,
              "reps": "10-12",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "reverse-pec-deck",
              "sets": 3,
              "reps": "12-15",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "straight-arm-pulldown",
              "sets": 2,
              "reps": "12-15",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "db-curl",
              "sets": 3,
              "reps": "8-12",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "hammer-curl",
              "sets": 3,
              "reps": "10-12",
              "rest": "60-90 sec",
              "restSec": 75
            }
          ]
        },
        {
          "weekday": 2,
          "focus": "Recovery",
          "isRest": true,
          "notes": [
            "Walking",
            "Light stretching"
          ],
          "items": []
        },
        {
          "weekday": 3,
          "focus": "Chest + Shoulders + Triceps",
          "items": [
            {
              "exercise": "incline-db-press",
              "sets": 3,
              "reps": "8-10",
              "rest": "2-3 min",
              "restSec": 150
            },
            {
              "exercise": "machine-chest-press",
              "sets": 3,
              "reps": "8-12",
              "rest": "2 min",
              "restSec": 120
            },
            {
              "exercise": "pec-deck",
              "sets": 3,
              "reps": "10-15",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "cable-fly",
              "sets": 2,
              "reps": "12-15",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "lateral-raise",
              "sets": 3,
              "reps": "12-20",
              "rest": "60 sec",
              "restSec": 60
            },
            {
              "exercise": "triceps-pushdown",
              "sets": 3,
              "reps": "10-12",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "overhead-triceps",
              "sets": 3,
              "reps": "10-15",
              "rest": "60-90 sec",
              "restSec": 75
            }
          ]
        },
        {
          "weekday": 4,
          "focus": "Legs + Biceps",
          "items": [
            {
              "exercise": "leg-press",
              "sets": 3,
              "reps": "10-12",
              "rest": "2-3 min",
              "restSec": 150
            },
            {
              "exercise": "leg-extension",
              "sets": 3,
              "reps": "10-15",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "leg-curl",
              "sets": 3,
              "reps": "10-15",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "hip-abductor",
              "sets": 2,
              "reps": "12-15",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "calf-raise",
              "sets": 3,
              "reps": "12-15",
              "rest": "60-90 sec",
              "restSec": 75
            },
            {
              "exercise": "db-curl",
              "sets": 3,
              "reps": "8-12",
              "rest": "90 sec",
              "restSec": 90
            },
            {
              "exercise": "hammer-curl",
              "sets": 3,
              "reps": "10-15",
              "rest": "60-90 sec",
              "restSec": 75
            }
          ]
        }
      ]
    }
  ]
};
