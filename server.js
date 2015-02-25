this.Bitcoin = new Meteor.Collection('bitcoin');

if (Meteor.isServer) {
  Meteor.publish('btc-price', function() {
    return Bitcoin.find({});
  });
  Meteor.startup(function() {
    var id, _ref;
    id = ((_ref = Bitcoin.findOne()) != null ? _ref._id : void 0) || Bitcoin.insert({});
    return Meteor.setInterval(function() {
      HTTP.get('https://api.coinbase.com/v1/prices/sell?qty=1', function(e, r) {
        if (e) {
          return console.log('sell error:', e);
        } else {
          return Bitcoin.update(id, {
            $set: {
              'sell.usd': r.data.subtotal.amount,
              'sell.updated': new Date()
            }
          });
        }
      });
      return HTTP.get('https://api.coinbase.com/v1/prices/buy?qty=1', function(e, r) {
        if (e) {
          return console.log('buy error:', e);
        } else {
          return Bitcoin.update(id, {
            $set: {
              'buy.usd': r.data.subtotal.amount,
              'buy.updated': new Date()
            }
          });
        }
      });
    }, 30 * 1000);
  });
}
