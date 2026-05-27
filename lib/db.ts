import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { WishProject, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Helper to generate slug
export function generateSlug(recipientName: string): string {
  const base = recipientName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 20);
  return `${base}-${uuidv4().slice(0, 8)}`;
}

// Users
export async function createUserDoc(uid: string, data: Partial<User>) {
  if (!db) return;
  await setDoc(doc(db, 'users', uid), {
    ...data,
    isPremium: false,
    wishCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getUserDoc(uid: string): Promise<User | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as User;
}

export async function updateUserDoc(uid: string, data: Partial<User>) {
  if (!db) return;
  await updateDoc(doc(db, 'users', uid), data as Record<string, unknown>);
}

// Projects
export async function createProject(
  userId: string,
  data: Partial<WishProject>
): Promise<string> {
  if (!db) throw new Error('DB not initialized');
  const id = uuidv4();
  const slug = generateSlug(data.recipientName || 'wish');
  await setDoc(doc(db, 'projects', id), {
    ...data,
    id,
    userId,
    slug,
    viewCount: 0,
    isPublic: false,
    isPremium: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: null,
  });
  // Increment user wish count
  await updateDoc(doc(db, 'users', userId), { wishCount: increment(1) });
  return id;
}

export async function getProject(id: string): Promise<WishProject | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'projects', id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    id,
    createdAt: (data.createdAt as Timestamp)?.toDate(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate(),
    publishedAt: (data.publishedAt as Timestamp)?.toDate() || null,
  } as WishProject;
}

export async function getProjectBySlug(
  slug: string
): Promise<WishProject | null> {
  if (!db) return null;
  const q = query(
    collection(db, 'projects'),
    where('slug', '==', slug),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docData = snap.docs[0];
  const data = docData.data();
  return {
    ...data,
    id: docData.id,
    createdAt: (data.createdAt as Timestamp)?.toDate(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate(),
    publishedAt: (data.publishedAt as Timestamp)?.toDate() || null,
  } as WishProject;
}

export async function getUserProjects(userId: string): Promise<WishProject[]> {
  if (!db) return [];
  const q = query(
    collection(db, 'projects'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: (data.createdAt as Timestamp)?.toDate(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate(),
      publishedAt: (data.publishedAt as Timestamp)?.toDate() || null,
    } as WishProject;
  });
}

export async function updateProject(id: string, data: Partial<WishProject>) {
  if (!db) return;
  await updateDoc(doc(db, 'projects', id), {
    ...(data as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function publishProject(id: string) {
  if (!db) return;
  await updateDoc(doc(db, 'projects', id), {
    isPublic: true,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id: string) {
  if (!db) return;
  await deleteDoc(doc(db, 'projects', id));
}

export async function incrementViewCount(id: string) {
  if (!db) return;
  await updateDoc(doc(db, 'projects', id), { viewCount: increment(1) });
}
