import { UserDTO } from "../users-models/UserDTO";
import { Post } from "./Post";

export class Topic {
	id: string;
	title: string;
	description: string;
	creationDate: Date;
	creationDateString: String;
	updateDate: Date;
	updateDateString: String;
	posts?: Post[];
	user: UserDTO;
	userString: String;
}





