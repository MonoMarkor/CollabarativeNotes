export class Group {
    //moeez made these public from private
    groupId: string;
	groupName: string;
	members: string[]; //members
	serverFileIds: string[];

    constructor(groupId: string, groupName: string, members: string[] = [], serverFileIds: string[] = []) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.members = members;
        this.serverFileIds = serverFileIds;
    }
}