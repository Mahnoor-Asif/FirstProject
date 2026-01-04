import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🟢 Define all projects
const projects = {
  "Admin-web": path.join(__dirname, "Admin-web", "Admin", "project"), // Vite/React
  "Service-seeker": path.join(__dirname, "Service-seeker", "SS", "project"),
  "Service-provider": path.join(__dirname, "Service-provider", "SP", "project"),
  "Service-shops": path.join(__dirname, "Service-shops", "Service Shops", "project"),
};

// 🟢 Start each project
Object.entries(projects).forEach(([name, appPath]) => {
  let command;

  // 🟢 Admin-web uses npm run dev (Vite)
  if (name === "Admin-web") {
    command = `cd "${appPath}" && npm run dev`;
  } else {
    // 🟢 Expo apps use expo start in tunnel mode
    command = `cd "${appPath}" && npx expo start --tunnel`;
  }

  // Allow Expo QR prompts
 const envVars = {
  ...process.env,
  EXPO_NO_INTERACTIVE: "0", // allow prompts
  CI: "",                   // remove CI mode completely
};

  const child = exec(command, { env: envVars });

  child.stdout.on("data", (data) => console.log(`[${name}] ${data}`));
  child.stderr.on("data", (data) => console.error(`[${name} ERROR] ${data}`));
});
