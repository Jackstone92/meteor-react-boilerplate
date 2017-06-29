import { Meteor } from 'meteor/meteor';
import expect from 'expect';
import { Collection } from './collection';

if(Meteor.isServer) {
  describe('collection', function() {

    const collectionOne = {
      _id: 'testNoteId1',
      title: 'My Title',
      body: 'My body for note',
      updatedAt: 0,
      userId: 'testUserId1'
    }

    const collectionTwo = {
      _id: 'testNoteId2',
      title: 'My Second Title',
      body: 'My second body for note',
      updatedAt: 0,
      userId: 'testUserId2'
    }

    // Mocha Lifecycle Method 'beforeEach' to fill database with seed data before running test-cases //
    beforeEach(function() {
      // uses different database for testing //
      Collection.remove({});
      Collection.insert(collectionOne);
    });

    it('should insert new collection', function() {
      // test meteor methods //
      const _id = Meteor.server.method_handlers['collection.insert'].apply({ userId: 'testId' });
      expect(Collection.findOne({ _id: _id, userId: 'testId' })).toExist();
    });

    it('should not insert collection if not authenticated', function() {
      expect(() => {
        Meteor.server.method_handlers['collection.insert']();
      }).toThrow();
    });

    it('should remove Collection', function() {
      Meteor.server.method_handlers['collection.remove'].apply({ userId: collectionOne.userId }, [collectionOne._id]);

      expect(Collection.findOne({ _id: collectionOne._id })).toNotExist();
    });

    it('should not remove collection if unauthenticated', function() {
      expect(() => {
        Meteor.server.method_handlers['collection.remove'].apply({}, [collectionOne._id]);
      }).toThrow();
    });

    it('should not remove collection if invalid _id', function() {
      expect(() => {
        Meteor.server.method_handlers['collection.remove'].apply({userId: collectionOne.userId});
      }).toThrow();
    });

    it('should update collection', function() {
      const title = 'This is an updated title';
      Meteor.server.method_handlers['collection.update'].apply({
        userId: collectionOne.userId
        }, [
          collectionOne._id,
          { title: title }
        ]
      );

      const collection = Collection.findOne(collectionOne._id);

      expect(collection.updatedAt).toBeGreaterThan(0);
      expect(collection).toInclude({
        title: title,
        body: collectionOne.body
      });
    });

    it('should throw error if extra updates provided', function() {
      expect(() => {
        Meteor.server.method_handlers['collection.update'].apply({
          userId: collection.userId
          }, [
            collection._id,
            { unexpected: "this is unexpected!" }
          ]
        );
      }).toThrow();
    });

    it('should not update collection if user was not creator', function() {
      const title = 'This is an updated title';
      Meteor.server.method_handlers['collection.update'].apply({
        userId: 'this is a different userId than creator'
        }, [
          collectionOne._id,
          { title: title }
        ]
      );

      const collection = Collection.findOne(collectionOne._id);

      expect(collection).toInclude(collectionOne);
    });

    it('should not update collection if unauthenticated', function() {
      expect(() => {
        Meteor.server.method_handlers['collection.update'].apply({}, [collectionOne._id]);
      }).toThrow();
    });

    it('should not update collection if invalid _id', function() {
      expect(() => {
        Meteor.server.method_handlers['collection.update'].apply({userId: collectionOne.userId});
      }).toThrow();
    });

    it('should return a users collection', function() {
      const result = Meteor.server.publish_handlers['collection'].apply({ userId: collectionOne.userId});
      const collections = result.fetch();

      expect(collections.length).toBe(1);
      expect(collections[0]).toEqual(collectionOne);
    });

    it('should return 0 notes for user that has none', function() {
      const result = Meteor.server.publish_handlers['collection'].apply({ userId: 'Someone Different'});
      const collections = result.fetch();

      expect(collections.length).toBe(0);
    });



  }); // describe end //
}
