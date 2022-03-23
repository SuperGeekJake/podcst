/**
 * IDB Storage manager
 */
import { get, set, del } from "idb-keyval";

export interface IDBStoreable {
  subscriptions: App.SubscriptionsMap;
  lastSync: number;
}

export async function getValue<K extends keyof IDBStoreable>(
  key: K
): Promise<IDBStoreable[K] | undefined> {
  try {
    const value = await get<IDBStoreable[K]>(key);
    return value;
  } catch (err) {
    console.error("Could not retrieve key", key, err);
    return;
  }
}

export async function setValue<K extends keyof IDBStoreable>(
  key: K,
  value: IDBStoreable[K]
): Promise<void> {
  try {
    await set(key, value);
  } catch (err) {
    console.error("Could not set key", key, err);
  }
}

export async function removeValue<K extends keyof IDBStoreable>(
  key: K
): Promise<void> {
  try {
    await del(key);
  } catch (err) {
    console.error("Could not delete key", key, err);
  }
}
