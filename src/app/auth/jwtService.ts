import FuseUtils from '@app/utils/FuseUtils';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import { encodeStr } from '../utils/stringUtils';
/* eslint-disable camelcase */

const fetchUserData = async (id) => {
  const usersRef = doc(db, 'users', `${id}`);
  const userDoc = await getDoc(usersRef);

  return userDoc.data();
};
//@ts-ignore
export class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.handleAuthentication();
  }

  handleAuthentication = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.emit('onAutoLogin', true);
      } else {
        this.emit('onAutoLogout', 'Nieste prihlásený');
      }
    });
  };

  createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password).then((user) => {
      this.emit('onLogin', user);
    });
  };

  signInWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user: any = await fetchUserData(userCredential.user.uid);
      const mpAuth = JSON.stringify({
        name: user.name,
        id: user.id,
        role: user.role,
        allowedBoilers: user.heaters,
      });
      const hashed = encodeStr(mpAuth);
      await localStorage.setItem('mp-auth', hashed);
      return this.emit('onLogin', user);
    } catch (error) {
      throw error;
    }
  };

  signInWithToken = () => {
    return new Promise(async (resolve, reject) => {
      const user = auth.currentUser;
      if (user) {
        const userData = await fetchUserData(user.uid);
        if (userData) {
          const mpAuth = JSON.stringify({
            name: userData.name,
            id: userData.id,
            role: userData.role,
            allowedBoilers: userData.heaters,
          });
          const hashed = encodeStr(mpAuth);
          await localStorage.setItem('mp-auth', hashed);
        }
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
    localStorage.removeItem('monitoringpro-auth');
    this.emit('onLogout');
  };
}

export const authInstance = new JwtService();
