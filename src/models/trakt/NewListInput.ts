export interface NewListInput {
  name: string;
  description: string;
  privacy: "public" | "private";
  displayNumbers?: boolean;
  allowComments?: boolean;
  sortBy?: string;
  sortHow?: string;
}
