import { Router } from "express";
import { initiateLogin, completeAuth, buildLogoutUrl } from "../services/oidcService.js";
import { syncUser } from "../services/authService.js";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || "opinion_session";

const router = Router();

router.get("/login", async (req, res) => {
  const redirectTo = (req.query.redirect as string) || "/dashboard";
  const { authorizeUrl } = await initiateLogin(redirectTo);
  res.redirect(authorizeUrl);
});

router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  if (typeof code !== "string" || typeof state !== "string") {
    res.redirect("/?error=missing_params");
    return;
  }

  try {
    const { sessionJwt, redirectTo, user } = await completeAuth(code, state);

    await syncUser(user);

    res.cookie(SESSION_COOKIE, sessionJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.redirect(redirectTo);
  } catch (err) {
    console.error("Auth callback failed:", err);
    res.redirect("/?error=auth_failed");
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.json({ logoutUrl: buildLogoutUrl() });
});

export default router;
