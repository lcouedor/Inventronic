import { ProjetDatabase, Projet } from "../models/projet";
import { ComponentWQuantity, ComponentWQuantityFull } from "../models/componentWQuantity";
import { openDatabase } from "./globalServ";
import { getComponentById } from "./componentsServ";

// Récupérer tous les projets
export async function getAllProjects(): Promise<ProjetDatabase[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["projets"], "readonly");
    const store = transaction.objectStore("projets");
    const request = store.getAll();

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject("Erreur lors de la récupération des projets.");
    };
  });
}

// Ajouter un projet
export async function createProject(
  nom: string,
  description: string,
  statut: number,
  components: ComponentWQuantity[]
): Promise<string> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["projets"], "readwrite");
    const store = transaction.objectStore("projets");
    const request = store.add({ nom, description, statut, components });

    request.onsuccess = function () {
      resolve("Projet ajouté avec succès !");
    };

    request.onerror = function () {
      reject("Erreur lors de l'ajout du projet.");
    };
  });
}

// Supprimer un projet de la IndexedDB ElectoryDB par son id
export async function deleteProject(id: number): Promise<string> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["projets"], "readwrite");
    const store = transaction.objectStore("projets");

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = function () {
      resolve("Projet supprimé avec succès !");
    };

    deleteRequest.onerror = function () {
      reject("Erreur lors de la suppression du projet.");
    };
  });
}

// Supprimer tous les projets de la IndexedDB ElectoryDB
export async function deleteAllProjects(): Promise<string> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["projets"], "readwrite");
    const store = transaction.objectStore("projets");

    const deleteRequest = store.clear();

    deleteRequest.onsuccess = function () {
      resolve("Projets supprimés avec succès !");
    };

    deleteRequest.onerror = function () {
      reject("Erreur lors de la suppression des projets.");
    };
  });
}

// Mettre à jour un projet
export async function updateProject(project: ProjetDatabase): Promise<string> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["projets"], "readwrite");
    const store = transaction.objectStore("projets");
    const request = store.put(project);

    request.onsuccess = function () {
      resolve("Projet mis à jour avec succès !");
    };

    request.onerror = function () {
      reject("Erreur lors de la mise à jour du projet.");
    };
  });
}

// Récupérer un projet par son id
export async function getProjectById(id: number): Promise<Projet> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["projets"], "readonly");
    const store = transaction.objectStore("projets");
    const request = store.get(id);

    request.onsuccess = async function () {
      //L'élément récupéré est de type ComponentWQuantity, on remplace donc son attribut componentId par component avec le composant correspondant
      const projectBdd = request.result;
      const componentsBdd = projectBdd.components;
      
      let componentsFull: ComponentWQuantityFull[] = [];
      for (const componentBdd of componentsBdd) {
        const componentId = componentBdd.componentId;
        const quantity = componentBdd.quantity;
        const component = await getComponentById(componentId);
        componentsFull.push({ component, quantity });
      }

      const project: Projet = {
        id: projectBdd.id,
        nom: projectBdd.nom,
        description: projectBdd.description,
        statut: projectBdd.statut,
        components: componentsFull,
      };

      console.log(project);
      resolve(project);
      
    };

    request.onerror = function () {
      reject("Erreur lors de la récupération du projet.");
    };
  });
}