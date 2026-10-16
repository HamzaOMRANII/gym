# Groundwork: database model

MongoDB database `omrani_gym` (from `MONGO_URI`). Mongoose creates collections and indexes on first
use; `npm run seed` loads the catalog.

## Catalog (editorial, edited in /admin)

### `categories`
`slug` (unique), `name`, `blurb`, `image`, `position`, `published`.

### `exercises`
`slug` (unique), `name`, `category` (category slug), `kit` (`tools` | `bodyweight`),
`level` (`LOW` | `MEDIUM` | `ADVANCED`), `trainingType` (`Push` | `Pull` | `Legs` | `Core`),
`sets`, `reps`, `rest` (label), `restSec` (rest timer), `muscles`, `primaryMuscle`,
`secondaryMuscles[]`, `equipment`, `equipTags[]` (library filters), `cues[]`, `instructions[]`,
`setup`, `mistakes[]`, `safetyNotes`, `alternatives[]` (exercise slugs), `image`, `imageAlt`,
`videoUrl`, `position`, `published`, `version`, `updatedBy`.

### `plans`
Both the published templates and the members' own copies.

| Field | Notes |
| --- | --- |
| `isTemplate` | `true` for the three published weeks |
| `owner` | user id for a member copy, `null` for a template |
| `templateId` | the template a member copy came from |
| `slug`, `name`, `commitment`, `level`, `who` | display fields (slug is unique among templates) |
| `restNote` | `{ label, items[] }`: the "Other days" rest card |
| `days[]` | `{ weekday (0 = Monday), focus, isRest, notes[], items[] }` |
| `days[].items[]` | `{ exercise (slug), sets, reps, rest, restSec }`: the unit a member swaps |
| `active` | one active member plan per user |

## Members

### `users`
`name`, `email` (unique), `role` (`member` | `editor` | `admin`), `passwordHash` (Argon2id),
`status` (`active` | `disabled`), `timezone`, `profile { units, heightCm, weightKg, sessionsPerWeek }`,
`notifications { reminders, digest, newContent, product }`, `disclaimerVersion`,
`disclaimerAcceptedAt`, `credentialsChangedAt` (sessions issued before it are rejected), `lastLoginAt`.

### `workoutsessions`
`user`, `clientRef` (unique per user: makes uploads idempotent), `date` (YYYY-MM-DD), `day`, `focus`,
`unit` (`kg` | `lb`), `lines[] { exercise, name, sets[] { weight, reps } }`.

### `measurements`
`user`, `date`, `weight`, `chest`, `arm`, `units` (`metric` | `imperial`).

Deleting an account removes the user, their plans, sessions and measurements.

## Leftovers from the previous version

`workoutlogs` and `sessions` came from the old EJS app; both are unused and can be dropped.
