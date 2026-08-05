import { type FirebaseApp, getApps, initializeApp } from 'firebase/app'
import {
	type DocumentData,
	doc,
	type Firestore,
	getDoc as fsGetDoc,
	onSnapshot as fsOnSnapshot,
	setDoc as fsSetDoc,
	getFirestore,
} from 'firebase/firestore'

// Ambient process for Node/Next envs — guarded before use, no @types/node dep.
declare const process: { env?: Record<string, string | undefined> } | undefined

export interface FirebaseConfig {
	apiKey: string
	authDomain: string
	projectId: string
	storageBucket?: string
	messagingSenderId?: string
	appId: string
}

/** Read a PUBLIC_FIREBASE_* value from Vite/Astro import.meta.env or Node process.env. */
function readEnv(key: string): string | undefined {
	const viteEnv =
		typeof import.meta !== 'undefined'
			? (import.meta as { env?: Record<string, string> }).env
			: undefined
	return (
		viteEnv?.[`PUBLIC_${key}`] ??
		viteEnv?.[`NEXT_PUBLIC_${key}`] ??
		(typeof process !== 'undefined'
			? (process.env?.[`PUBLIC_${key}`] ?? process.env?.[`NEXT_PUBLIC_${key}`])
			: undefined)
	)
}

/**
 * Build config from PUBLIC_FIREBASE_* / NEXT_PUBLIC_FIREBASE_* env vars.
 * Returns null when required keys are missing.
 */
export function configFromEnv(): FirebaseConfig | null {
	const apiKey = readEnv('FIREBASE_API_KEY')
	const authDomain = readEnv('FIREBASE_AUTH_DOMAIN')
	const projectId = readEnv('FIREBASE_PROJECT_ID')
	const appId = readEnv('FIREBASE_APP_ID')
	if (!apiKey || !authDomain || !projectId || !appId) return null
	return {
		apiKey,
		authDomain,
		projectId,
		storageBucket: readEnv('FIREBASE_STORAGE_BUCKET'),
		messagingSenderId: readEnv('FIREBASE_MESSAGING_SENDER_ID'),
		appId,
	}
}

let cachedDb: Firestore | undefined

/**
 * Init (or reuse) the Firebase app and return a Firestore handle.
 * Config defaults to configFromEnv(); pass explicitly to override.
 * Firebase-public config is NOT a secret — but it is still read from env,
 * never hardcoded, so each site supplies its own.
 */
export function initFirestore(config?: FirebaseConfig): Firestore {
	if (cachedDb) return cachedDb
	const cfg = config ?? configFromEnv()
	if (!cfg) {
		throw new Error(
			'[@chirag127/data-firebase] Missing Firebase config. ' +
				'Set PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN, ' +
				'PUBLIC_FIREBASE_PROJECT_ID, PUBLIC_FIREBASE_APP_ID in env, ' +
				'or pass a config object.',
		)
	}
	const app: FirebaseApp = getApps()[0] ?? initializeApp(cfg)
	cachedDb = getFirestore(app)
	return cachedDb
}

/** Reset the cached Firestore handle. Test-only. */
export function resetFirestore(): void {
	cachedDb = undefined
}

function resolveDb(db?: Firestore): Firestore {
	return db ?? initFirestore()
}

/** Read one document. Returns typed data or null when it does not exist. */
export async function getDoc<T = DocumentData>(
	path: string,
	db?: Firestore,
): Promise<T | null> {
	const snap = await fsGetDoc(doc(resolveDb(db), path))
	return snap.exists() ? (snap.data() as T) : null
}

/** Write one document. Merges by default so partial updates are safe. */
export async function setDoc<T extends DocumentData>(
	path: string,
	data: T,
	options: { merge?: boolean } = { merge: true },
	db?: Firestore,
): Promise<void> {
	await fsSetDoc(doc(resolveDb(db), path), data, {
		merge: options.merge ?? true,
	})
}

/**
 * Subscribe to one document. Callback fires with typed data or null.
 * Returns the unsubscribe function.
 */
export function onSnapshot<T = DocumentData>(
	path: string,
	onData: (data: T | null) => void,
	db?: Firestore,
): () => void {
	return fsOnSnapshot(doc(resolveDb(db), path), (snap) => {
		onData(snap.exists() ? (snap.data() as T) : null)
	})
}
