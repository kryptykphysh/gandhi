'use strict';

var Promise      = require('bluebird');
var _            = require('lodash');
var Handlebars   = require('handlebars');

module.exports = function(router, resources) {
	resources.actions.mail = function(conn, project, options) {
		var pathToRecipients = options.path_to_recipients || [];
		var pathToEmail = options.path_to_email || null;
		var recipients = _.get(project, pathToRecipients, []);

		// make sure we have an array of recipients
		if (!_.isArray(recipients)) {
			console.warn('The mail action must be passed recipients as an array.', recipients);
			return;
		}

		// get all project assignments
		return Promise.settle(recipients.map(function(recipient) {
			var email = pathToEmail ? _.get(recipient, pathToEmail, null) : recipient;

			// make sure we have an email for this recipient
			if (typeof email !== 'string') {
				console.warn('The mail action could not find am email for a recipient.', recipient);
				return;
			}

			var mail = {
				to: email,
				subject: Handlebars.compile(options.subject || '')({ project: project, cycle: project.cycle }),
				html: Handlebars.compile(options.template || '')({ project: project, cycle: project.cycle })
			};

			if (options.from)
				mail.from = options.from;

			// send mail in the background
			resources.mail(mail)

			// just log this error
			.catch(function(err) {
				console.error(err);
			});

		}));
	};
};
