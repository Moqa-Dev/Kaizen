import { PostStatus } from "../enums/api-enums/post-status";
import { UserDTO } from "../users-models/UserDTO";
import { Topic } from "./Topic";

export class Post {
	id: string;
	title: string;
	content: string;
	status: PostStatus;
	statusToRepresent: Map<string, string>;
	creationDate: Date;
	creationDateString: string;
	updateDate: Date;
	updateDateString: string;
	topic: Topic;
	topicString: String;
	user: UserDTO;
	userString: String;
}





