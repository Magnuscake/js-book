import * as esbuild from "esbuild-wasm";
import localforage from "localforage";
import axios from "axios";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (userInput: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, async (args: any) => {
        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: userInput,
          };
        }
      });

      // hacky workaround for css files
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        // check if we already fetched this package and if it is in the
        // cache. If it is return it immediately
        // args.path seems to be unique
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }

        const escapedData = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escapedData}';
          document.head.appendChild(style)
        `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // TODO: Some parts hwere are duplicated. DRY them out
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
