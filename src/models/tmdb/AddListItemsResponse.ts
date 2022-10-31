interface AddListInputObject {
  mediaType: string;
  mediaId: number;
  success?: boolean;
}

export interface AddListItemsResponse {
  statusMessage: string;
  results: AddListInputObject[];
  success: boolean;
  statusCode: number;
}
