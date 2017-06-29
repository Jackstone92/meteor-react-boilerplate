import {Meteor} from 'meteor/meteor';
import expect from 'expect';

import { validateNewUser } from './users';

if(Meteor.isServer) {
  describe('users', function() {
    it('should allow valid email address', function() {
      const testUser = {
        emails: [
          {
            address: 'test@example.com'
          }
        ]
      };

      const result = validateNewUser(testUser);

      expect(result).toBe(true);

    });

    it('should reject invalid email', function() {
      expect(() => {
        const testUser2 = {
          emails: [
            {
              address: '1a34gfd.com'
            }
          ]
        };

        validateNewUser(testUser2);
      }).toThrow();
    });

  });
}
