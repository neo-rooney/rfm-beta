import * as esbuild from 'esbuild';

async function createContext({
  format,
  outExtension,
  config,
}: {
  format: any;
  outExtension?: any;
  config: any;
}) {
  return await esbuild.context({
    ...config,
    format,
    outExtension,
  });
}

const run = async ({
  entryPoints = ['src/index.ts'],
  pkg,
  config = {},
}: {
  entryPoints: string[];
  pkg: any;
  config: any;
}) => {
  const dev = process.argv.includes('--dev');
  const minify = !dev;

  const watch = process.argv.includes('--watch');

  const external = Object.keys({
    ...pkg.peerDependencies,
  });

  const baseConfig = {
    entryPoints,
    bundle: true,
    minify,
    sourcemap: true,
    outdir: 'dist',
    target: 'es2019',
    external,
    ...config,
  };

  try {
    let esmCtx = await createContext({ format: 'esm', config: baseConfig });
    let cjsCtx = await createContext({
      format: 'cjs',
      outExtension: { '.js': '.cjs' },
      config: baseConfig,
    });

    if (watch) {
      await esmCtx.watch();
      await cjsCtx.watch();
      console.log('👀 Watch mode enabled');
    } else {
      await esmCtx.rebuild();
      await cjsCtx.rebuild();
      console.log('✅ Build completed');
      process.exit(0);
    }
  } catch (error) {
    console.error('😰 Build failed:', error);
    process.exit(1);
  }
};

const builder = {
  run,
};

export default builder;
