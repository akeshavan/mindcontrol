import '../imports/startup/accounts-config.js';
import '../imports/ui/body.js';

globalSelector = {}

 Meteor.startup(function () {

          Session.set("globalSelector", globalSelector)

      
    });
