#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = process.cwd();
const targetFile = path.join(projectRoot, "vite.config.js");
const sourceFile = path.join(__dirname, "..", "templates", "vite.config.js");

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim().toLowerCase());
    })
  );
}

async function initConfig() {
  if (!fs.existsSync(targetFile)) {
    fs.copyFileSync(sourceFile, targetFile);
    console.log("vite.config.js created from php-vite-plugin template.");
    return;
  }

  // File exists → confirm overwrite
  const ans = await askQuestion(
    "vite.config.js already exists. Overwrite? (y/N): "
  );

  if (ans === "y" || ans === "yes") {
    fs.copyFileSync(sourceFile, targetFile);
    console.log("vite.config.js overwritten with template.");
  } else {
    console.log("Aborted. Existing vite.config.js kept.");
  }
}

if (process.argv[2] === "init") {
  initConfig();
} else {
  console.log("Usage: npx php-vite-plugin init");
}
