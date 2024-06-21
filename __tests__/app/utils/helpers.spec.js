const {
  getInjectScriptObj,
  getGAScriptContent,
} = require('../../../app/utils/helpers');

describe('Helper Utilities test Suite', () => {
  describe('getInjectScriptObj', () => {
    it('should return a script object with the given bot name and script content', () => {
      const botName = 'TestBot';
      const scriptContent = 'console.log("Hello, World!");';
      const expected = {
        tags: [
          {
            name: 'TestBot script',
            sub_type: 'inline',
            type: 'js',
            position: 'body-bottom',
            content: scriptContent,
            attributes: {},
          },
        ],
      };

      const result = getInjectScriptObj(botName, scriptContent);
      expect(result).toEqual(expected);
    });
  });

  it('should return a script content string containing the provided GA ID', () => {
    const gaId = 'G-123456';
    const result = getGAScriptContent(gaId);

    expect(result).toContain(gaId);
    expect(result).toContain('https://www.googletagmanager.com/gtag.js?id=');
  });

  it('should trim the GA ID before using it in the script content', () => {
    const gaId = '  G-123456  ';
    const trimmedGaId = 'G-123456';
    const result = getGAScriptContent(gaId);

    expect(result).toContain(trimmedGaId);
    expect(result).not.toContain(gaId);
  });
});
