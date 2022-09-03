import { AccountModel } from "../models/account-model";

type AuthenticaionParams = {
  email: string;
  password: string;
};

export interface Authentication {
  auth(params: AuthenticaionParams): Promise<AccountModel>;
}
