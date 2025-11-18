## Quick context

This repository is a small Express/MongoDB backend (ES modules) with authentication endpoints and a minimal frontend folder. Key files:

- `backend/server.js` — Express app setup, mounts routes at `/api/auth`, reads env via `dotenv` and calls `ConnectDb()`.
- `backend/package.json` — scripts: `npm run dev` (nodemon server.js) and `npm start` (node server.js).
- `backend/config/db.js` — mongoose connection (expects `process.env.MONGO_URI`).
- `backend/config/token.js` — JWT token generation (expects `process.env.JWT_SECRET`, token expiry `10d`).
- `backend/controllers/auth.controllers.js` — controller patterns (exports named functions). `signUp` is implemented; `logIn` is empty.
- `backend/models/users.model.js` — Mongoose `User` schema (name, email, password, assistantName, assistantImage, history).
- `backend/routes/auth.Router.js` — router mounts `POST /signup` and `POST /login`.

## Architecture & data flow (concise)

1. HTTP request -> `backend/routes/*` (Router) -> `backend/controllers/*` (business logic) -> `backend/models/*` (Mongoose).
2. On server start `server.js` calls `ConnectDb()` (in `config/db.js`) and logs success/failure.
3. Auth flow example (signup): controller validates input, hashes password with `bcryptjs`, creates a `User`, generates JWT via `config/token.js`, and sets an HTTP-only cookie named `token`.

## Important repository conventions

- ES modules only (package.json sets `type: "module"`). Use `import`/`export default` or named exports to match existing files.
- Controllers export named functions (e.g., `export const signUp = async (req,res) => {}`) and routers import them by name.
- Responses are JSON with appropriate HTTP status codes (see `signUp` for examples: 201, 400, 500).
- Cookies: project sets `res.cookie("token", token, { httpOnly: true, maxAge: ..., sameSite: "strict", secure: false })` — preserve this shape for auth endpoints.

## Environment & runtime notes

- Required env vars: `MONGO_URI`, `JWT_SECRET`. Optional: `PORT`.
- Dev workflow: `npm run dev` uses `nodemon` (recommended for iterative development). Production: `npm start`.
- Dependencies of interest: `express@5`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `multer`, `cloudinary` (cloudinary/multer may be used in other parts of the project — search when adding upload features).

## Code patterns and concrete examples

- Route wiring: `server.js` mounts `app.use('/api/auth', authRouter)`; keep new auth routes under `backend/routes` and follow the same file-per-router pattern.
- Creating a user (follow `signUp`): validate body, check uniqueness with `User.findOne({ email })`, hash with `bcrypt.hash(password, 10)`, `await User.create(...)`, generate token and `res.cookie(...)`, then `res.status(201).json(user)`.
- Token creation: use `config/token.js` which signs payload `{ userId }` using `process.env.JWT_SECRET` and returns the token.

## Implementation caveats discovered (do not invent fixes silently)

- `signUp` currently calls `User.create(...)` without awaiting the promise — be explicit and `await` it to ensure `user._id` exists when generating the token.
- `logIn` is unimplemented; follow the `signUp` style for validation, password compare with `bcrypt.compare`, token generation, and cookie setting.

## Where to edit / add code

- Add routes in `backend/routes/*.js` and controllers in `backend/controllers/*.js`.
- Add models in `backend/models/*.js` and keep schema fields consistent with `users.model.js`.

## Example curl to exercise signup (adjust host/port)

curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d "{\"name\":\"Alice\",\"email\":\"a@x.com\",\"password\":\"secret123\"}"

## Guidance for AI edits

- Preserve ES module syntax. When modifying code, run minimal sanity checks: use `npm run dev` and verify server logs `MongoDb Connected` and `server is listening on PORT`.
- Match response shapes and cookie options used by existing `signUp` implementation.
- When adding features that touch environment variables, document required env names and default behavior.
- If you change public API routes, update any frontend usage under `frontend/` accordingly.

---

If anything here is incomplete or you'd like more detail (e.g., example tests, a suggested .env.example, or auto-fix for the missing `await` in `signUp`), tell me where to apply changes and I will update the file.
