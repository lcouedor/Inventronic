import { Component } from "../models/component";
import { openDatabase } from "./globalServ";

// Récupérer tous les composants
export async function getAllComponents(): Promise<Component[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["components"], "readonly");
    const store = transaction.objectStore("components");
    const request = store.getAll();

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject("Erreur lors de la récupération des composants.");
    };
  });
}

export async function getComponentById(id: number): Promise<Component> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["components"], "readonly");
    const store = transaction.objectStore("components");
    const request = store.get(id);

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject("Erreur lors de la récupération du composant.");
    };
  });
}

// Supprimer un composant de la IndexedDB ElectoryDB par son id
export async function deleteComponent(id: number): Promise<string> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["components"], "readwrite");
    const store = transaction.objectStore("components");

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = function () {
      resolve("Composant supprimé avec succès !");
    };

    deleteRequest.onerror = function () {
      reject("Erreur lors de la suppression du composant.");
    };
  });
}

// Supprimer tous les composants de la IndexedDB ElectoryDB
export async function deleteAllComponents(): Promise<string> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["components"], "readwrite");
    const store = transaction.objectStore("components");

    const deleteRequest = store.clear();

    deleteRequest.onsuccess = function () {
      resolve("Composants supprimés avec succès !");
    };

    deleteRequest.onerror = function () {
      reject("Erreur lors de la suppression des composants.");
    };
  });
}

// Créer un composant dans la IndexedDB ElectoryDB
export async function createComponent(
  nom: string,
  code: string,
  tags: string[],
  description: string,
  quantite: number,
  image: string,
  prixUnitaire: number,
  lienAchat: string
): Promise<string> {
  const db = await openDatabase();
  const component = {
    nom,
    code,
    tags,
    description,
    quantite,
    image,
    prixUnitaire,
    lienAchat,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["components"], "readwrite");
    const store = transaction.objectStore("components");

    //Si la description fait plus de 1000 caractères, on retourne une erreur
    if (description.length > 600) {
      reject("La description est trop longue (600 caractères maximum).");
      return;
    }

    const addRequest = store.add(component);

    addRequest.onsuccess = function () {
      resolve("Composant ajouté avec succès !");
    };

    addRequest.onerror = function () {
      reject("Erreur lors de l'ajout du composant.");
    };
  });
}

// Mettre à jour un composant dans la IndexedDB ElectoryDB
export async function updateComponent(component: Component): Promise<string> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["components"], "readwrite");
    const store = transaction.objectStore("components");

    const updateRequest = store.put(component);

    updateRequest.onsuccess = function () {
      resolve("Composant mis à jour avec succès !");
    };

    updateRequest.onerror = function () {
      reject("Erreur lors de la mise à jour du composant.");
    };
  });
}
