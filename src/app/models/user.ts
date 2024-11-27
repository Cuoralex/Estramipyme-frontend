export interface User {
  id?: string | null | undefined;
  name?: string | null | undefined;
  email?: string | null | undefined;
  password?: string | null | undefined;
  typeUser?: string | number;
  sizeCompany?: string | number;
  sector?: string | number;
  registerDate?: string;
  isBookDonwloaded?: boolean | undefined;
  isTestDone?: boolean;
}
