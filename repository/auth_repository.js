export const signUp = async (email, username, password, token) => {
  try {
    const response = await fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
        token: token,
      }),
    });
    const data = await response.json();
    if (!data.success) return data.error ?? "Something went wrong!";
  } catch (e) {
    return "Something went wrong!";
  }
};
