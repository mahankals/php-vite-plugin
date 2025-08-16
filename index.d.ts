import { Plugin, UserConfig } from 'vite';

interface PhpVitePluginOptions {
  envFile?: string;
  phpUrl?: string;
  publicDir?: string;
  input?: Record<string, string>;
}

declare function phpVitePlugin(options?: PhpVitePluginOptions): Plugin;

export default phpVitePlugin;
