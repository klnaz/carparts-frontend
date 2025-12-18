export interface User {
  id?: string;
  role?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
}
