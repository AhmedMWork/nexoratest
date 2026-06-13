// ============================================================
// NEXORA — Firebase Authentication Helpers
// ============================================================

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import type { Admin } from '@/types';

export async function loginAdmin(email: string, password: string): Promise<Admin> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Check if user is in admins collection
  const adminDoc = await getDoc(doc(db, 'admins', user.uid));
  if (!adminDoc.exists()) {
    await signOut(auth);
    throw new Error('Unauthorized access. Admin privileges required.');
  }

  const adminData = adminDoc.data() as Admin;

  // Update last login
  const { updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'admins', user.uid), {
    lastLoginAt: new Date(),
  });

  return {
    ...adminData,
    uid: user.uid,
  };
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function getCurrentAdmin(user: User): Promise<Admin | null> {
  const adminDoc = await getDoc(doc(db, 'admins', user.uid));
  if (!adminDoc.exists()) return null;
  return { id: adminDoc.id, ...adminDoc.data() } as unknown as Admin;
}

export async function checkIsAdmin(user: User): Promise<boolean> {
  const adminDoc = await getDoc(doc(db, 'admins', user.uid));
  return adminDoc.exists();
}
