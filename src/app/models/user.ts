export interface User {
  id?: string | null | undefined;
  name?: string | null | undefined;
  email?: string | null | undefined;
  password?: string | null | undefined;
  typeUser?: string | null| number;
  sizeCompany?: string | null | number;
  sector?: string | null| number;
  registerDate?: string;
  isBookDonwloaded?: boolean | undefined;
  isTestDone?: boolean;
}
