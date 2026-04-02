// ================================================
// script.js  —  Shared helpers for all pages
// API base URL — change port if needed
// ================================================

// ✅ API BASE URL (Change if backend is on different port)
const API_BASE = "http://localhost:3000";

console.log("🚀 Script loaded. API Base:", API_BASE);

// ================================================
// UI HELPERS
// ================================================

/**
 * Show alert message (error or success)
 * @param {string} message - Message to display
 * @param {string} type - "success" or "error"
 */
function showAlert(message, type = "error") {
  const box  = document.getElementById("alert");
  const msg  = document.getElementById("alertMsg");
  const icon = document.getElementById("alertIcon");
  
  if (!box) {
    console.warn("⚠️ Alert box not found on this page");
    return;
  }
  
  msg.textContent  = message;
  icon.textContent = type === "success" ? "✅" : "❌";
  box.className    = "alert " + type;
  
  console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Toggle button loading spinner
 * @param {boolean} active - Show spinner or not
 */
function setLoading(active) {
  const btn     = document.getElementById("btn");
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("spinner");
  
  if (!btn) {
    console.warn("⚠️ Button not found on this page");
    return;
  }
  
  btn.disabled          = active;
  btnText.style.display = active ? "none"  : "inline";
  spinner.style.display = active ? "inline-block" : "none";
}

// ================================================
// AUTHENTICATED API CALLS
// ================================================

/**
 * Make authenticated API request
 * Automatically attaches JWT token from localStorage
 * Redirects to login if token is expired (401)
 * 
 * @param {string} endpoint - API endpoint (e.g., "/tasks", "/auth/login")
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Response} Response object or null if 401
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  
  console.log(`📤 [${options.method || 'GET'}] ${API_BASE}${endpoint}`);
  
  try {
    const res = await fetch(API_BASE + endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        // Attach JWT token if available
        ...(token ? { "Authorization": "Bearer " + token } : {}),
        // Allow overriding headers
        ...(options.headers || {})
      }
    });

    console.log(`📨 Response Status: ${res.status}`);

    // ✅ If token expired or invalid → kick to login
    if (res.status === 401) {
      console.log("⏰ Token expired or unauthorized");
      localStorage.clear();
      window.location.href = "login.html";
      return null;
    }

    return res;
    
  } catch (err) {
    console.error("❌ Network error:", err);
    throw err;
  }
}

// ================================================
// UTILITY FUNCTIONS
// ================================================

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
function isAuthenticated() {
  return !!getToken();
}

/**
 * Clear all stored user data and redirect to login
 */
function logout() {
  localStorage.clear();
  console.log("👋 User logged out");
  window.location.href = "login.html";
}

/**
 * Decode JWT token (without verification)
 * NOTE: This is client-side only, not secure for production
 * Always verify token on backend
 */
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("❌ Error decoding token:", err);
    return null;
  }
}

// ================================================
// VALIDATION HELPERS
// ================================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if at least 6 characters
 */
function isValidPassword(password) {
  return password && password.length >= 6;
}

// ================================================
// DEBUG MODE
// ================================================

// Log initial state
console.log("✅ API Helpers loaded");
console.log("📝 Available functions:");
console.log("  - showAlert(message, type)");
console.log("  - setLoading(active)");
console.log("  - apiFetch(endpoint, options)");
console.log("  - getToken()");
console.log("  - isAuthenticated()");
console.log("  - logout()");
console.log("  - decodeToken(token)");
console.log("  - isValidEmail(email)");
console.log("  - isValidPassword(password)");
