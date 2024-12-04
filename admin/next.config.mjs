export const reactStrictMode = false;
export const images = {
  domains: ['localhost'], // Allow images from localhost
};
export function webpack(config) {
  // Loop through the rules and adjust CSS loader configuration
  config.module.rules.forEach((rule) => {
    if (rule.test?.toString().includes('.css')) {
      if (rule.use) {
        rule.use.forEach((loader) => {
          if (loader.loader?.includes('css-loader')) {
            loader.options.sourceMap = false; // Disable CSS source maps
          }
        });
      }
    }
  });

  return config;
}
