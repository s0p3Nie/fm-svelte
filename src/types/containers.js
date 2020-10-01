export class BaseContainer {
    constructor(limit) {
        this.container = [];
        this.limit = limit;
    }

    clear() {
        this.container = [];
    }

    add(data) {
        return this.container.push(data);
    }

    get() {
        return this.container.pop();
    }
    
    isEmpty() {
        return 0 === this.container.length;
    }
}
