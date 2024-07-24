import * as esbuild from "esbuild";
import copy from "esbuild-plugin-copy";

(async () => {
  await esbuild.build({
    entryPoints: ["./server/server.ts"],
    bundle: true,
    platform: "node",
    target: ["node18.0"],
    outfile: "./dist/server/server.js",
    sourcemap: "inline",
    plugins: [
      copy({
        assets: {
          from: [
            "../prisma/schema.prisma",
            "../prisma/dev.db",
            "../node_modules/.prisma/client/libquery_engine-darwin-arm64.dylib.node",
          ],
          to: ["./"],
        },
      }),
    ],
  });
})();
