import { ComponentWQuantity, ComponentWQuantityFull } from "./componentWQuantity";

export interface ProjetDatabase {
    id: number;
    nom: string;
    description: string;
    statut: number;
    components: ComponentWQuantity[];
}

export interface Projet {
    id: number;
    nom: string;
    description: string;
    statut: string;
    components: ComponentWQuantityFull[];
}