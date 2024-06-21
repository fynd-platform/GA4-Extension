const consumeEventScript = require('./fpi_script');

function getInjectScriptObj(botName, scriptContent) {
  return {
    tags: [
      {
        name: `${botName} script`,
        sub_type: 'inline',
        type: 'js',
        position: 'body-bottom',
        content: scriptContent,
        attributes: {},
      },
    ],
  };
}

function getGAScriptContent(gaId) {
  const trimmedGaId = gaId.trim();
  return `
        
const tag = document.createElement("script");
tag.src = 'https://www.googletagmanager.com/gtag.js?id=${trimmedGaId}';
const init = () => {
    console.log("GA4 initiated")
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag("config", '${trimmedGaId}')
    // Data layer script
  const listener = ${consumeEventScript}
  listener()
}
tag.onload = init;
document.getElementsByTagName("head")[0].appendChild(tag);
    `;
}

module.exports = {
  getInjectScriptObj,
  getGAScriptContent,
};
