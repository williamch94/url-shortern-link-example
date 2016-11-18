import { Meteor } from 'meteor/meteor';
import { Links } from '../imports/collections/links';
import { WebApp } from 'meteor/webapp';
import ConnectRoute from 'connect-route';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish('links', function() {
    return Links.find({});
  });
});

//Executed whenever a user visits with a route like
//'localhost:3000/abcd'
function onRoute(req, res, next) {
  const link = Links.findOne({ token: req.params.token });

  if (link) {
    Links.update(link, { $inc: {clicks: 1}});
    res.writeHead(307, { 'Location': link.url });
    res.end();
  } else {
    next(); // I don't care about this, move on to the next middleware
  }
}

const middleware = ConnectRoute(function(router) {
  router.get('/:token', onRoute);
});

// const middleware = ConnectRoute(function(router){
//   router.get('/:token',(req)=> console.log(req));
// });

WebApp.connectHandlers.use(middleware);
