
export enum Genders {
  Male = 0,
  Female = 1
}

export interface Account {
  displayName: string;
  firstName: string;
  lastName: string;
  gender: Genders;
  birthDate: number;
  address: string;
  phoneCountryCode: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  profilePic: string;
  roles: string[];
  lang: string;
  ageRange: string;
  topics: string[];
}

export interface UpdateAccountByIdRequest {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  gender: Genders;
  birthDate: number;
  address: string;
  phoneCountryCode: string;
  phoneNumber: string;
  emailAddress: string;
  profilePic: string;
  lang: string;
  ageRange: string;
  topics: string[];
}

export interface ChangePasswordRequest {
  emailAddress: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
