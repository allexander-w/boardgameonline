class Bank {
    constructor(resources) {
        this.resourcesBank = new Map();

        for ( const resource of resources || [] ) {
            this.resourcesBank.set(resource.id, resource.count);
        }
    }

    get bank() {
        return Object.fromEntries(this.resourcesBank);
    }

    add(id) {
        const count = this.resourcesBank.get(id);
        this.resourcesBank.set(id, count + 1);
    }

    remove(id) {
        const count = this.resourcesBank.get(id);
        this.resourcesBank.set(id, count > 0 ? count - 1 : 0);
    }
}

module.exports = Bank;