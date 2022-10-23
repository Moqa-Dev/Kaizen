import { PostStatus } from "../enums/api-enums/post-status";

export class PublicPostDto {
	id: string;
	title: string;
	content: string;
	status: PostStatus;
	creationDate: Date;
	updateDate: Date;
	topicId: String;
	topicName: String;
	userId: String;
	userName: String;
}





