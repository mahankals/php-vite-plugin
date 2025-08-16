# php-vite-plugin

[![npm version](https://img.shields.io/npm/v/php-vite-plugin.svg?style=flat)](https://www.npmjs.com/package/php-vite-plugin)
[![License](https://img.shields.io/npm/l/php-vite-plugin.svg?style=flat)](LICENSE)

A framework-agnostic Vite plugin to integrate Vite with PHP applications (e.g., CakePHP, Symfony).

---

## Features

- Reads your `.env` or custom env file to get `APP_URL` & `VITE_DEV_SERVER_URL`.
- Configures Vite build output for PHP-friendly paths.
- Supports Vite dev server with CORS and HMR configured.
- Easy integration of Vite assets in PHP apps with manifest support.
- Support `ddev` and `network url` 

---

## Installation

```bash
npm i -D git+https://github.com/mahankals/php-vite-plugin
```

## Usage

### create vite.config.js

```bash
npx php-vite-plugin init
```

## plugin Options in vite.config.js

| Option     | Type     | Default                                   | Description                                     |
|------------|----------|-------------------------------------------|-------------------------------------------------|
| `envFile`  | `string` | `path.resolve(process.cwd(), '.env')`     | Path to your `.env` file to read `APP_URL`.     |
| `phpUrl`   | `string` | `'http://127.0.0.1:8765'`                 | Fallback PHP app URL if not specified in env.   |
| `publicDir`| `string` | `'public/build'`                          | Directory where compiled assets will be output. |
| `input`    | `array`  | `[]`                                      | Entry points for Vite build (name to file path).|

## Example `.env`

```
APP_URL=http://your-php-app.ddev.site
VITE_DEV_SERVER_URL=http://your-php-app.ddev.site:5173
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
```

## Contributing

Contributions, issues, and feature requests are welcome!

## Author

Atul Mahankal – [atulmahankal@gmail.com](mailto:atulmahankal@gmail.com)


## License

This library is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
