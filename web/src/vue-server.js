const fs = require('fs');
const path = require('path');
const config = require('../../config');

const resolvePath = file => path.resolve(__dirname, file);
const urlJoin = require('url-join');

const { BROWSER_CONFIG, env } = config.get();
const isProduction = env !== 'development';

const template = fs.readFileSync(
  resolvePath('../../public/index.html'),
  'utf-8'
);
const { createBundleRenderer } = require('vue-server-renderer');

let serverReady;
let renderer;

const createRenderer = (bundle, options) => {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      // for component caching
      template,
      inject: false,
      runInNewContext: false,
    })
  );
};

/**
 * Renders the request application using renderer
 * @param {*} renderer
 * @param {*} req
 * @param {*} res
 * @param {*} context
 */
const render = (renderer, req, res, context) => {
  const s = Date.now();

  console.log(`Rendering: ${req.url}`);

  res.setHeader('Content-Type', 'text/html');

  const errorHandler = err => {
    // TODO: Render Error Page
    console.error(`Fatal error when rendering : ${req.url}`);
    console.error(err);

    const statusCode = err.code || 500;
    res.status(statusCode);
    res.end(`<h1>${statusCode}</h1>`);

    console.log(`Whole request: ${Date.now() - s}ms`);
  };

  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.error(err);
      return errorHandler(err);
    }

    res.status(200);
    res.end(html);

    console.log(`Whole request: ${Date.now() - s}ms`);
  });
};

/**
 * Renders app dynamically
 * @param {*} req
 * @param {*} res
 * @param {*} context
 */
const renderApp = (app, req, res, context) => {
  if (isProduction) {
    if (!renderer) {
      const bundle = require('../../public/admin/vue-ssr-server-bundle.json');
      const clientManifest = require('../../public/admin/vue-ssr-client-manifest.json');

      renderer = createRenderer(bundle, {
        clientManifest,
      });
    }

    render(renderer, req, res, context);
  } else {
    // In development
    serverReady.then(() => {
      render(renderer, req, res, context);
    });
  }
};

module.exports.renderApp = renderApp;
