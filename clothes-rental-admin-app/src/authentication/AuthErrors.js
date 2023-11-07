export function parseAuthError(code) {
  if (code === "ERR_BAD_REQUEST") {
    return "Incorrect email or password.";
  }

  if (code === "auth/network-request-failed") {
    return "Network connection error.";
  }

  return "Something went wrong. Please try again.";
}
