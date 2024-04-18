import dts from 'bun-plugin-dts';

await Bun.build({
  entrypoints: ['./src/index.js'],
  outdir: './dist',
  minify: true,
  plugins: [dts()],
});
