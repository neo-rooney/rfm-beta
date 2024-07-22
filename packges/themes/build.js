import * as esbuild from "esbuild";
import pkg from "./package.json" assert { type: "json" };

/**
 * minify는 또 다른 변환 작업이 필요하므로 빠른 개발환경을 위해서 개발 모드에서는 minify를 사용하지 않는다.
 */
const dev = process.argv.includes("--dev");
const minify = !dev;

const watch = process.argv.includes("--watch");

/**
 * 외부 모듈 처리(번들링 결과에 포함되지 않아도 되는 것들)
 * external에 포함된 것들은 라이브러리의 번들에 포함되지 않음
 * dependencies는 빌드 결과물에 포함됨
 * devDependencies는 개발 환경에서만 필요한 패키지로, 번들에 포함될 필요도 없고 런타임에 로드될 필요도 없다.(external 처리X)
 * peerDependencies는 빌드 결과물에 포함되지는 않지만 런파타임에 필요함
 */

const external = Object.keys({
  ...pkg.peerDependencies,
});

const baseConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify,
  sourcemap: true,
  outdir: "dist",
  target: "es2019",
  external,
};

async function createContext(format, outExtension) {
  return await esbuild.context({
    ...baseConfig,
    format,
    outExtension,
  });
}

try {
  let esmCtx = await createContext("esm");
  let cjsCtx = await createContext("cjs", { ".js": ".cjs" });

  if (watch) {
    await esmCtx.watch();
    await cjsCtx.watch();
    console.log("👀 Watch mode enabled");
  } else {
    await esmCtx.rebuild();
    await cjsCtx.rebuild();
    console.log("✅ Build completed");
    process.exit(0);
  }
} catch (error) {
  console.error("😰 Build failed:", error);
  process.exit(1);
}
