await Bun.build({
  entrypoints: ['./src/index.js'],
  outdir: './dist',
  minify: true,
});
