module.exports = {
  improve: 'apostrophe-rich-text-widgets',

  beforeConstruct: function(self, options) {
    options.browser = options.browser || {}
    options.browser.tools = Object.assign({}, options.browser.tools || {}, {
      'modal': {
        component: 'ApostropheTiptapImportData',
        label: 'Upload',
        icon: 'FileUpload'
      },
    });
  }
};
