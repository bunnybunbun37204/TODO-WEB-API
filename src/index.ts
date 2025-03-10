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
  { id: 1, content: "Went for a morning run", date: "2024-06-10" },
  {
    id: 2,
    content: "Completed project presentation",
    date: "2024-06-11",
  },
  { id: 3, content: "Read a book about UX design", date: "2024-06-12" },
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

  const newActivity = { id: Math.random() * 10, content, date };
  mockActivities.push(newActivity);

  return c.json(newActivity, 201);
});

app.get("/activities", (c) => c.json(mockActivities));

app.patch("/activities/:id", async (c) => {
  const id = c.req.param("id");
  const { content, date } = await c.req.json();

  const activity = mockActivities.find((a) => a.id === Number(id));
  if (!activity) {
    return c.json({ error: "Activity not found" }, 404);
  }

  if (content) activity.content = content;
  if (date) activity.date = date;

  return c.json(activity);
});

app.delete("/activities/:id", (c) => {
  const id = c.req.param("id");
  const activityIndex = mockActivities.findIndex((a) => a.id === Number(id));

  if (activityIndex === -1) {
    return c.json({ error: "Activity not found" }, 404);
  }

  mockActivities.splice(activityIndex, 1);
  return c.body(null, 204);
});

// Health check
app.get("/", (c) => c.text("Mock API Server is running!"));

export default app;
