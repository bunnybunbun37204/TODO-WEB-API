import { Hono } from "hono";
import { cors } from "hono/cors";
import { v4 as uuidv4 } from "uuid";

// Mock users data
const mockUsers = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
  { id: 3, username: "admin", password: "admin123" },
];

// Mock activities data
const mockActivities = [
  { id: uuidv4(), content: "Went for a morning run", date: "2024-06-10" },
  {
    id: uuidv4(),
    content: "Completed project presentation",
    date: "2024-06-11",
  },
  { id: uuidv4(), content: "Read a book about UX design", date: "2024-06-12" },
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

// Activities endpoint
app.post("/activities", async (c) => {
  const { content, date } = await c.req.json();

  if (!content || !date) {
    return c.json({ error: "Content and date are required" }, 400);
  }

  const newActivity = { id: uuidv4(), content, date };
  mockActivities.push(newActivity);

  return c.json(newActivity, 201);
});

app.get("/activities", (c) => c.json(mockActivities));

// Health check
app.get("/", (c) => c.text("Mock API Server is running!"));

export default app;
