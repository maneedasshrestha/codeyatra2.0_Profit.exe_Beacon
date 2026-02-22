import express from "express";
import { createClient } from "../utils/supabaseClient.js";
const router = express.Router();

// 1. SIGN UP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const supabase = createClient({ req, res });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `http://localhost:3000/auth/confirm`,
    },
  });

  if (error) return res.status(400).json({ error: error.message });

  // Insert into public.users table
  if (data.user) {
    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email,
    });

    if (insertError) {
      console.error("Error creating user record:", insertError);
      // Continue anyway - auth user was created
    }
  }

  res.status(201).json({ message: "email verified , user created", data });
});

// 2. LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const supabase = createClient({ req, res });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });
  res.json({ message: "Login successful", user: data.user });
});
// 3. EMAIL VERIFICATION
router.get("/confirm", async (req, res) => {
  console.log("=== EMAIL CONFIRMATION ATTEMPT ===");
  console.log("Full URL:", req.url);
  console.log("All query params:", req.query);

  const code = req.query.code;

  console.log("Extracted code:", code);

  if (code) {
    const supabase = createClient({ req, res });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("Verification result:", { data: !!data, error });

    if (!error && data.session) {
      console.log("✅ Email verified successfully!");
      return res.send(`
        <h1>Email Verified!</h1>
        <p>Your email has been successfully verified.</p>
        <p>You can now <a href="http://localhost:3000">go to the app</a>.</p>
      `);
    }

    console.error("❌ Verification error:", error);
  } else {
    console.log("❌ No code found in request");
  }

  console.log("Redirecting to error page...");
  res.redirect(303, "/auth/auth-code-error");
});

// Add error route
router.get("/auth-code-error", (req, res) => {
  res.status(400).send(`
    <h1>Email Verification Failed</h1>
    <p>Your confirmation link has expired or is invalid.</p>
    <p>Please sign up again to receive a new confirmation email.</p>
    <a href="http://localhost:3000">Go back</a>
  `);
});

// 4. LOGOUT
router.post("/logout", async (req, res) => {
  const supabase = createClient({ req, res });
  await supabase.auth.signOut();
  res.json({ message: "Logged out" });
});

// 5. GET CURRENT USER
router.get("/me", async (req, res) => {
  const supabase = createClient({ req, res });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return res.status(401).json({ error: "Unauthorized" });
  res.json({ user });
});

export default router;
