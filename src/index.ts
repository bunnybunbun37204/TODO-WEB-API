import { Hono } from "hono";
import { cors } from "hono/cors";
import { v4 as uuidv4 } from "uuid";

// Mock users data
const mockUsers = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
  { id: 3, username: "admin", password: "admin123" },
];

const app = new Hono();

// Enable CORS
app.use(cors());

// Login endpoint
app.post("/tokens", async (c) => {
  const { username, password } = await c.req.json();

  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return c.json(
      {
        error: "Invalid credentials",
      },
      401
    );
  }

  // Generate fake token
  const fakeToken = `fake-jwt-token-${uuidv4()}`;

  return c.json({
    token: fakeToken,
  });
});

// Health check
app.get("/", (c) => c.text("Mock API Server is running!"));

export default app;
