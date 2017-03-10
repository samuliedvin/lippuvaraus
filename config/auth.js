module.exports = {

    'facebookAuth' : {
        'clientID'      : '363415430724302', // your App ID
        'clientSecret'  : 'c1a70a18e87bc4166123316136e80938', // your App Secret
        'callbackURL'   : 'http://lippuvaraus.herokuapp.com/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'uoNWZIus3YISuNEvhZ12WIRTr',
        'consumerSecret'    : 'LqkbnZ5oWnRcZl2QFtgtwKiuynr3HHfSzLtiMf6urmZgN0JMnU',
        'callbackURL'       : 'http://lippuvaraus.herokuapp.com/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
