export enum PostStatus {
  Public = 'Public',
  Private = 'Private'
}


export function getColorOf(postStatus: PostStatus) {
  if (postStatus.valueOf() === PostStatus.Public.valueOf()) {
      return '#83e85a';
  } else if (postStatus.valueOf() === PostStatus.Private.valueOf()) {
      return '#faee1c';
  } else{
    return '#d72323';
  }
}
