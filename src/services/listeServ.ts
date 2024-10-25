import { ListeElem } from "../models/listeElem";
import { openDatabase } from "./globalServ";


export async function getAllListe(): Promise<ListeElem[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["liste"], "readonly");
    const store = transaction.objectStore("liste");
    const request = store.getAll();

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject("Erreur lors de la récupération de la liste de courses.");
    };
  });
}

export async function addToListe(listeElem: ListeElem): Promise<string> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["liste"], "readwrite");
    const store = transaction.objectStore("liste");

    const addRequest = store.add(listeElem);

    addRequest.onsuccess = function () {
      resolve("Element ajouté avec succès à la liste de courses !");
    };

    addRequest.onerror = function () {
      reject("Erreur lors de l'ajout à la liste de courses.");
    };
  });
}

export async function deleteFromListe(id: number): Promise<string> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["liste"], "readwrite");
    const store = transaction.objectStore("liste");

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = function () {
      resolve("Element supprimé avec succès de la liste de courses !");
    };

    deleteRequest.onerror = function () {
      reject("Erreur lors de la suppression de l'élément de la liste de courses.");
    };
  });
}

export async function deleteAllListe(): Promise<string> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["liste"], "readwrite");
    const store = transaction.objectStore("liste");

    const deleteRequest = store.clear();

    deleteRequest.onsuccess = function () {
      resolve("Liste de courses vidée avec succès !");
    };

    deleteRequest.onerror = function () {
      reject("Erreur lors de la suppression de la liste de courses.");
    };
  });
}

export async function updateListeElem(listeElem: ListeElem): Promise<string> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["liste"], "readwrite");
    const store = transaction.objectStore("liste");

    const updateRequest = store.put(listeElem);

    updateRequest.onsuccess = function () {
      resolve("Element mis à jour avec succès dans la liste de courses !");
    };

    updateRequest.onerror = function () {
      reject("Erreur lors de la mise à jour de l'élément dans la liste de courses.");
    };
  });
}