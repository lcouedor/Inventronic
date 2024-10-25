import { Status } from "../models/status";
import { openDatabase } from "./globalServ";

// Récupérer tous les status
export async function getAllStatus(): Promise<Status[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["status"], "readonly");
    const store = transaction.objectStore("status");
    const request = store.getAll();

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject("Erreur lors de la récupération des status.");
    };
  });
}
