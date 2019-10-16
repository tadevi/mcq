export enum UserRoles {
    Standard,
    Admin,
}

type TUserRoles =
    UserRoles.Standard |
    UserRoles.Admin;


export interface IUser {
    id?: number;
    username: string;
    pwdHash: string;
    role: TUserRoles;
    email?: string;
    phoneNumber?: string;
    fullName?: string;
    grade?: string;
    schoolName?: string;
}


export class User implements IUser {

    public id?: number;
    public username: string;
    public pwdHash: string;
    public role: TUserRoles;
    public email?: string;
    public phoneNumber?: string;
    public fullName?: string;
    public grade?: string;
    public schoolName?: string;


    constructor(
        nameOrUser?: string | IUser,
        pwdHash?: string,
        role?: TUserRoles,
        email?: string,
        phoneNumber?: string,
        fullName?: string,
        grade?: string,
        schoolName?: string,
    ) {
        if (typeof nameOrUser === 'string' || typeof nameOrUser === 'undefined') {
            this.username = nameOrUser || '';
            this.email = email || '';
            this.role = role || UserRoles.Standard;
            this.pwdHash = pwdHash || '';
            this.phoneNumber = phoneNumber || '';
            this.fullName = fullName || '';
            this.grade = grade || '';
            this.schoolName = schoolName || '';
        } else {
            this.username = nameOrUser.username;
            this.email = nameOrUser.email;
            this.role = nameOrUser.role;
            this.pwdHash = nameOrUser.pwdHash;
            this.phoneNumber = nameOrUser.phoneNumber;
            this.fullName = nameOrUser.fullName;
            this.grade = nameOrUser.grade;
            this.schoolName = nameOrUser.schoolName;
        }
    }
}
