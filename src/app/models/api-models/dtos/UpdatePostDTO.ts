import { PostStatus } from "../../enums/api-enums/post-status";

export class UpdatePostDTO {
	title: string;
	content: string;
	status: PostStatus;
	topicId: string;
}





