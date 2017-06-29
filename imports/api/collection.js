// collection //
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
// import Simpl Schema from simpl-schema //
import SimpleSchema from 'simpl-schema';


export const Collection = new Mongo.Collection('collection');

if(Meteor.isServer) {
  Meteor.publish('collection', function() {
    return Collection.find({userId: this.userId});
  });
}

Meteor.methods({
  'collection.insert': function() {
    if(!this.userId) {
      throw new Meteor.Error('Not-Authorised!');
    }

    return Collection.insert({
      title: '',
      body: '',
      userId: this.userId,
      updatedAt: moment().valueOf() //new Date().getTime()
    });
  }, // notes.insert end //

  'collection.remove': function(_id) {
    if(!this.userId) {
      throw new Meteor.Error('Not-Authorised!');
    }

    // validate _id //
    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      }
    }).validate({
      _id: _id
    });

    Collection.remove({_id: _id, userId: this.userId });
  }, // notes.remove end //

  'collection.update': function(_id, updates) {
    if(!this.userId) {
      throw new Meteor.Error('Not-Authorised!');
    }

    // validate _id //
    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      },
      title: {
        type: String,
        optional: true
      },
      body: {
        type: String,
        optional: true
      }
    }).validate({
      _id: _id,
      ...updates
    });

    Collection.update({
      _id: _id,
      userId: this.userId
    }, {
      $set: {
        updatedAt: moment().valueOf(),
        ...updates
      }
    });

  }
});
