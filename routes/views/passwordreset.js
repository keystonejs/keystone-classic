var keystone = require('../../'),
    session = require('../../lib/session');

exports = module.exports = function(req, res) {

    var User = keystone.list(keystone.get('user model')),
        infoMessage = 'If we found a corresponding user, you\'ll receive and email with instructions on how to reset your password';

    function renderView() {
        keystone.render(req, res, 'passwordreset', {
            submitted: req.body,
            from: req.query.from,
            logo: keystone.get('signin logo')
        });
    }

    // If a form was submitted, process the login attempt
    if (req.method === 'POST') {

        if (!keystone.security.csrf.validate(req)) {
            req.flash('error', 'There was an error with your request, please try again.');
            return renderView();
        }

        if (!req.body.email) {
            req.flash('error', 'Please enter your email address.');
            return renderView();
        }

        var genericMessage = function () {
            req.flash('success', infoMessage );
            renderView();
        };

        console.log('CHECK EMAIL AND SEND EMAIL');
        session.checkResetPassword(req.body, req, res, genericMessage, genericMessage);

    } else {
        renderView();
    }

};
