import FuseUtils from '@app/utils/FuseUtils';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../../../../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
/* eslint-disable camelcase */

const fetchUserData = async (id) => {
  const usersRef = doc(db, 'users', `${id}`);
  const userDoc = await getDoc(usersRef);

  return userDoc.data();
};
class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.handleAuthentication();
  }

  handleAuthentication = () => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        console.log('on auto login');
        this.emit('onAutoLogin', true);
      } else {
        console.log('logOut');
        this.emit('onAutoLogout', 'Nieste prihlásený');
      }
    });
  };

  createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password).then((user) => {
      this.emit('onLogin', user);
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const user = await fetchUserData(userCredential.user.uid);

      this.emit('onLogin', user);
    });
  };

  signInWithToken = () => {
    return new Promise(async (resolve, reject) => {
      const user = auth.currentUser;
      if (user) {
        const userData = await fetchUserData(user.uid);
        resolve(userData);
      } else {
        this.logout();
        reject(new Error('Failed to login with token.'));
      }
    });
  };

  updateUserData = (user) => {
    if (auth.currentUser) {
      return updateProfile(auth.currentUser, {
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }
  };

  logout = () => {
    auth.signOut();
    this.emit('onLogout');
  };
}

const instance = new JwtService();

export default instance;
