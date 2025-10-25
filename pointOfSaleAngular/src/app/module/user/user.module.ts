import { Role } from "../role.model";
import { TokenModule } from "../token/token.module";


export class UserModule {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  cell!: string;
  address!: string;
  dob!: Date;
  gender!: string;
  active!: boolean;
  lock!: boolean;
  role!: Role;
  tokens!: TokenModule[];
}
