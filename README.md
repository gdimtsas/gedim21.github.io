## Development

To start the project locally, run:

```bash
yarn start
```

Open `http://localhost:8000` with your browser to see the result.

## Documentation

### Requirements

- Node.js >= 16.15
- Yarn 1 (Classic)

### Directory Structure

- [`.github`](.github) — GitHub configuration including the CI workflow.
- [`src`](./src) — Application source code, including pages, components, styles.

### Scripts

- `yarn start` — Starts the application in development mode at `http://localhost:8000`.
- `yarn build` — Compile your application and make it ready for deployment.
- `yarn serve` — Serve the production build of your site
- `yarn clean` — Wipe out the cache (`.cache` folder).
- `yarn type-check` — Validate code using TypeScript compiler.
- `yarn lint` — Runs ESLint for all files in the `src` directory.
- `yarn format` — Runs Prettier for all files in the `src` directory.
- `yarn test` — Run tests.

### Path Mapping

TypeScript are pre-configured with custom path mappings. To import components or files, use the `@` prefix.

```tsx
import { Button } from '@/components/Button';

// To import images or other files from the static folder
import avatar from '@/static/avatar.png';
```

## Fonts

Fonts are imported from [https://github.com/fontsource/fontsource](https://github.com/fontsource/fontsource)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information.
