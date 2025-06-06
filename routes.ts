/**
 * An array of routes that are accessible to the public.
 * These routes are not protected by the authentication middleware.
 * @type {string[]}
 */

export const publicRoutes = [
    "/",
]

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged user's to /dashboard page.
 * @type {string[]}
 */

export const authRoutes = [
    "/auth/login",
    "/auth/register",
]

/**
 * The prefix for the authentication API routes.
 * Routes that are used for authentication are prefixed with this string.
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect URL after a successful login.
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/dashboard"
