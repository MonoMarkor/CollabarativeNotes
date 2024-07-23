export class User {
    userId: string; //save in LocalDb
	username: string;
	password: string;
	localFileIds: string[]; ////save in LocalDb
    serverFileIds: string[];
	groupIds: string[];

    constructor(userId: string, username: string, password: string, localFileIds: string[] = [], serverFileIds: string[] = [], groupIds: string[] = []) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.localFileIds = localFileIds;
        this.serverFileIds = serverFileIds;
        this.groupIds = groupIds;
    }
}