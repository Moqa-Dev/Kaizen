import { UserDTO } from "../users-models/UserDTO";

export class Role {
	roleID: string;
	role: string;
	permissions?: string[];
	users?: UserDTO[];
}





