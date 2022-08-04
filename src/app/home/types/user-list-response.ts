import { User } from './user';
export interface UserListResponse {
  content: User[];
  page: number;
  size: number;
  totalPages: number;
}
