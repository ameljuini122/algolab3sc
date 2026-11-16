import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const AUTHORIZED_TEACHER_EMAIL = 'amelijuini3@gmail.com';

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
} as const;

export type OperationTypeValue = (typeof OperationType)[keyof typeof OperationType];

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationTypeValue;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationTypeValue,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let connectionTested = false;
export async function testFirestoreConnection(): Promise<boolean> {
  if (connectionTested) return true;
  connectionTested = true;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client appears offline. Vérifiez votre connexion.');
    }
    return false;
  }
}

export async function signInTeacherWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  if (user.email && user.emailVerified && user.email.toLowerCase() === AUTHORIZED_TEACHER_EMAIL) {
    try {
      await setDoc(
        doc(db, 'admins', user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Amel Juini',
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch {
      // Ignore if admin doc already exists (update is disallowed by immutable rules)
    }
  }
  return user;
}

export async function signOutTeacher(): Promise<void> {
  await signOut(auth);
}

export async function syncTeacherClassesToFirestore(
  teacherUid: string,
  classes: { id: string; name: string; level: string; schoolYear: string }[],
  sessions: { id: string; classId: string; title: string; code: string; active: boolean }[]
): Promise<void> {
  for (const cls of classes) {
    const path = `classes/${cls.id}`;
    try {
      await setDoc(
        doc(db, 'classes', cls.id),
        {
          id: cls.id,
          name: cls.name,
          level: cls.level,
          schoolYear: cls.schoolYear,
          teacherUid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  for (const sess of sessions) {
    const path = `sessions/${sess.id}`;
    try {
      await setDoc(
        doc(db, 'sessions', sess.id),
        {
          id: sess.id,
          classId: sess.classId,
          title: sess.title,
          code: sess.code,
          active: sess.active,
          teacherUid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }
}

export async function fetchTeacherFirestoreClasses(teacherUid: string) {
  const path = 'classes';
  try {
    const q = query(collection(db, path), where('teacherUid', '==', teacherUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export { onAuthStateChanged, type User };
