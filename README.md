# SBOM Visualizer

A small web application that processes a [CycloneDX](https://cyclonedx.org/) SBOM in the browser
and displays the contained components and their dependency tree.


## Developing

Install the dependencies:

```bash
pnpm install
```

and start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version:

```bash
pnpm run build
```

You can preview the production build with `npm run preview`.

