import { fs } from '~/fs';

export class DrivesHelper {
    drivesInfo = [];
    driveList = [];

    constructor() {
        this.drivesInfo = JSON.parse(fs.readFileSync('E:\\dev\\svelte\\drivelist.json'));
        this.drivesInfo.forEach(element => {
            element.mountpoints.forEach(element => {
                this.driveList.push(element.path);
            });
        });
    }

    getDriveList() {
        if (this.driveList.length) {
            return this.driveList;
        }

        this.drivesInfo.forEach(element => {
            element.mountpoints.forEach(element => {
                this.driveList.push(element.path);
            });
        });

        return this.driveList;
    }

    isDrive(drive) {
        
    }
}