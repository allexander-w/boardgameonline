import PingModule from "./PingModule";

export default {
    module: null,
    init() {
        this.module = new PingModule();
        console.log("ping module initialized");
    }
};