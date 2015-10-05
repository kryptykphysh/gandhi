var config = require('./config.js');
var saml = new(require('passport-saml').SAML)(config.sso);
console.log(saml.generateServiceProviderMetadata());
