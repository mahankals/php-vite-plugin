import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import colors from "picocolors";

/**
 * PHP Vite Plugin
 * @param {Object} options
 * @param {string} [options.envFile] Path to .env file (default: project root)
 * @param {string} [options.phpUrl] Fallback PHP app URL if not in .env
 * @param {string} [options.publicDir] Where compiled assets go (default: webroot/build)
 * @param {Object} [options.input] Entry points for Vite build
 */
export default function phpVitePlugin(options = {}) {
  const {
    envFile = path.resolve(process.cwd(), ".env"),
    phpUrl = "http://127.0.0.1:8000",
    publicDir = "public/build",
    input = {},
    hotFile,
  } = options;

  // Load APP_URL
  let appUrl = phpUrl;
  if (fs.existsSync(envFile)) {
    const env = dotenv.parse(fs.readFileSync(envFile));
    if (env.APP_URL) appUrl = env.APP_URL;
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

  return {
    name: "php-vite-plugin",
    config: (config, { command }) => {
      const isBuild = command === "build";
      const app = new URL(appUrl);
      const isHttps = app.protocol === "https:"; // detect from APP_URL

      return {
        base: isBuild ? `/${publicDir}/` : "",
        publicDir: false,
        build: {
          manifest: true,
          outDir: path.resolve(process.cwd(), publicDir),
          rollupOptions: { input },
          emptyOutDir: true,
        },
        server: {
          strictPort: true,
          cors: true,
          https: false, // isHttps || false,
          host: "0.0.0.0", // bind inside container
          hmr: {
            host: app.hostname,
            protocol: isHttps ? "wss" : "ws",
          },
        },
      };
    },
    configureServer(server) {
      const app = new URL(appUrl);
      const port = server.config.server.port || 5173;
      app.port = port;

      const hotFilePath = hotFile || path.resolve(server.config.root || process.cwd(), "hot");
      const hotUrl = `${app.protocol}//${app.hostname}:${app.port}`;

      fs.writeFileSync(hotFilePath, hotUrl);
      console.log(`Hot file written: ${hotUrl}`);

      server.httpServer?.once("listening", () => {
        console.log(colors.green(`\n  ${colors.bold(pkg.name)} v${pkg.version}\n`));
        console.log(`  ➜ APP_URL: ${colors.cyan(appUrl)}\n`);
      });

      server.httpServer?.once("close", () => {
        if (fs.existsSync(hotFilePath)) {
          fs.unlinkSync(hotFilePath);
          console.log("Hot file removed");
        }
      });

      server.middlewares.use((req, res, next) => {
        if (req.url === "/" || req.url === "") {
          res.setHeader("Content-Type", "text/html");
          res.end(`
            <html><head><title>Vite Dev Server</title></head><body style="font-family:sans-serif;text-align:center;margin:50px">
            <h2>PHP + Vite Dev Server</h2>
            <p><a href="${appUrl}">${appUrl}</a></p>
            </body></html>
          `);
        } else {
          next();
        }
      });
    },
  };
}

