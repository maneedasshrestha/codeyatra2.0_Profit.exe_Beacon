import { createClient } from "../utils/supabaseClient.js";

// 1. SIGN UP
export const signup = async (req, res) => {
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

  // Insert into public.users table with profile_completed = false
  if (data.user) {
    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email,
      profile_completed: false, // ← NEW: Track if profile is complete
    });

    if (insertError) {
      console.error("Error creating user record:", insertError);
    }
  }

  res.status(201).json({
    message: "User created",
    session: data.session,
    token: data.session?.access_token,
  });
};

// 2. LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  const supabase = createClient({ req, res });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  // Check if profile is complete
  const { data: userData } = await supabase
    .from("users")
    .select("profile_completed, name, college, stream, semester, role")
    .eq("id", data.user.id)
    .single();

  res.json({
    // message: "Login successful",
    // user: data.user,
    // profile_completed: userData?.profile_completed || false,
    // profile: userData,
    session: data.session,
    token: data.session.access_token,
  });
};

// 3. EMAIL VERIFICATION
export const confirmEmail = async (req, res) => {
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
};

// Auth code error page
export const authCodeError = (req, res) => {
  res.status(400).send(`
    <h1>Email Verification Failed</h1>
    <p>Your confirmation link has expired or is invalid.</p>
    <p>Please sign up again to receive a new confirmation email.</p>
    <a href="http://localhost:3000">Go back</a>
  `);
};

// 4. LOGOUT
export const logout = async (req, res) => {
  const supabase = createClient({ req, res });
  await supabase.auth.signOut();
  res.json({ message: "Logged out" });
};

// 5. GET CURRENT USER
export const getMe = async (req, res) => {
  const supabase = createClient({ req, res });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return res.status(401).json({ error: "Unauthorized" });

  // Get full profile from users table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  res.json({ user, profile });
};

// ✨ 6. COMPLETE PROFILE (NEW)
export const completeProfile = async (req, res) => {
  const supabase = createClient({ req, res });

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name, college, stream, semester, role } = req.body;

  // Validate required fields
  if (!name || !college || !stream || !semester || !role) {
    return res.status(400).json({
      error: "All fields are required: name, college, stream, semester, role",
    });
  }

  // Validate role
  if (!["junior", "senior", "both"].includes(role)) {
    return res.status(400).json({
      error: "Role must be one of: junior, senior, both",
    });
  }

  // Validate semester
  if (semester < 1 || semester > 10) {
    return res.status(400).json({
      error: "Semester must be between 1 and 10",
    });
  }

  // Upsert user profile (creates if doesn't exist, updates if exists)
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email: user.email,
        name,
        college,
        stream,
        semester,
        role,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    )
    .select();

  if (error) {
    console.error("Profile update error:", error);
    return res
      .status(500)
      .json({ error: "Failed to update profile", details: error });
  }

  res.status(200).json({
    message: "Profile completed successfully",
    profile: data && data.length > 0 ? data[0] : data,
  });
};

// ✨ 7. UPDATE PROFILE (NEW)
export const updateProfile = async (req, res) => {
  const supabase = createClient({ req, res });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name, college, stream, semester, role } = req.body;

  // Build update object (only include provided fields)
  const updates = {
    updated_at: new Date().toISOString(),
  };

  if (name) updates.name = name;
  if (college) updates.college = college;
  if (stream) updates.stream = stream;
  if (semester) updates.semester = semester;
  if (role && ["junior", "senior", "both"].includes(role)) updates.role = role;

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: "Failed to update profile" });
  }

  res.status(200).json({
    message: "Profile updated successfully",
    profile: data,
  });
};
