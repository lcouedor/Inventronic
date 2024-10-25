export interface Component {
	id: number;
	nom: string;
	code: string;
	tags: string[];
	description: string;
	quantite: number;
	image: string;
	prixUnitaire: number;
	lienAchat: string;
}