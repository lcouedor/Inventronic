import { deleteAllComponents } from "./componentsServ";
import { deleteAllProjects } from "./projectsServ";
import { deleteAllListe } from "./listeServ";

// Ouvrir la base de données avec Promesse
export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ElectoryDB", 5);

    request.onerror = function () {
      reject("Erreur lors de l'ouverture de la base de données.");
    };

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onupgradeneeded = function () {
      const db = request.result;

      //Table "components"
      if (!db.objectStoreNames.contains("components")) {
        const store = db.createObjectStore("components", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("nom", "nom", { unique: false });
        store.createIndex("code", "code", { unique: false });
        store.createIndex("tags", "tags", { unique: false });
        store.createIndex("description", "description", { unique: false });
        store.createIndex("quantite", "quantite", { unique: false });
        store.createIndex("image", "image", { unique: false });
        store.createIndex("prixUnitaire", "prixUnitaire", { unique: false });
        store.createIndex("lienAchat", "lienAchat", { unique: false });
      }

      //Table "status"
      if (!db.objectStoreNames.contains("status")) {
        const store = db.createObjectStore("status", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("nom", "nom", { unique: false });

        //Ajout des status
        store.add({ nom: "En cours" });
        store.add({ nom: "Terminé" });
        store.add({ nom: "Annulé" });
      }

      //Table "liste"
      if (!db.objectStoreNames.contains("liste")) {
        const store = db.createObjectStore("liste", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("nom", "nom", { unique: false });
        store.createIndex("description", "description", { unique: false });
        store.createIndex("priorite", "priorite", { unique: false });
        store.createIndex("lienAchat", "lienAchat", { unique: false });
        store.createIndex("quantite", "quantite", { unique: false });
        store.createIndex("prixUnitaire", "prixUnitaire", { unique: false });
      }

      //Table "projets"
      if (!db.objectStoreNames.contains("projets")) {
        const store = db.createObjectStore("projets", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("nom", "nom", { unique: false });
        store.createIndex("description", "description", { unique: false });
        store.createIndex("statut", "statut", { unique: false });
        store.createIndex("components", "components", { unique: false });
      }
    };
  });
}

//Initialiser le indexedDB à partir d'un fichier JSON
export async function initDatabaseFromJson(path: string): Promise<string> {
  //On commence par clear la base de données
  await deleteAllComponents();
  await deleteAllProjects();
  await deleteAllListe();

  const db = await openDatabase();

  //Ajouter les composants, projets et liste à partir du fichier JSON
  return new Promise(async (resolve, reject) => {
    fetch("/src/" + path)
      .then((response) => response.json())
      .then((data) => {
        const transaction = db.transaction(["components"], "readwrite");
        const store = transaction.objectStore("components");

        for (const component of data.components) {
          store.add(component);
        }

        const transaction2 = db.transaction(["projets"], "readwrite");
        const store2 = transaction2.objectStore("projets");

        for (const projet of data.projets) {
          store2.add(projet);
        }

        const transaction3 = db.transaction(["liste"], "readwrite");
        const store3 = transaction3.objectStore("liste");

        for (const item of data.liste) {
          store3.add(item);
        }

        resolve("Base de données initialisée avec succès !");
      })
      .catch(() => {
        reject("Erreur lors de l'initialisation de la base de données.");
      });
  });
}

//Sauvegarder les tables components, liste et projets dans un fichier JSON
export function saveInJson(name: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();

    const transaction = db.transaction(["components"], "readonly");
    const store = transaction.objectStore("components");

    const transaction2 = db.transaction(["projets"], "readonly");
    const store2 = transaction2.objectStore("projets");

    const transaction3 = db.transaction(["liste"], "readonly");
    const store3 = transaction3.objectStore("liste");

    const request = store.getAll();
    const request2 = store2.getAll();
    const request3 = store3.getAll();

    request.onsuccess = function () {
      request2.onsuccess = function () {
        request3.onsuccess = function () {
          const data = {
            components: request.result,
            projets: request2.result,
            liste: request3.result,
          };

          const blob = new Blob([JSON.stringify(data)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = name + ".json";
          a.click();

          resolve("Fichier JSON sauvegardé avec succès !");
        };
      };
    };

    request.onerror = function () {
      reject("Erreur lors de la sauvegarde du fichier JSON.");
    };

    request2.onerror = function () {
      reject("Erreur lors de la sauvegarde du fichier JSON.");
    };

    request3.onerror = function () {
      reject("Erreur lors de la sauvegarde du fichier JSON.");
    };
  });
}
