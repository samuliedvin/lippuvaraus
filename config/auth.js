module.exports = {

    'facebookAuth' : {
        'clientID'      : '700832903452397', // your App ID
        'clientSecret'  : '5760c45f780f46a73d197682349ea75d', // your App Secret
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
