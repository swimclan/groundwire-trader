class Strategy {
    constructor(type, strategies, options={}) {
        this.strategy = strategies[type];
        this.input = options;
    }

    execute() {
        return this.strategy(this.input);
    }
}

module.exports = Strategy;