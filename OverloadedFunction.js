function OverloadedFunction() {
    const func = function () {
        const { method } = func.methods.find(entry => OverloadedFunction.matches(arguments, entry.signature)) || {};
        
        if (method) {
            return method(...arguments);
        } else {
            throw new Error("No suitable method found");
        }
    }
    
    Object.setPrototypeOf(func, OverloadedFunction.proto);
    return func;
}

OverloadedFunction.proto = {
    methods: [],
    add: function (signature, method) {
        this.methods.push({ signature, method });
        return this;
    }
}

OverloadedFunction.matches = function (args, signature) {
    if (args.length !== signature.length) {
        return false;
    }

    // Go through arguments, returning false if we find a mismatch
    for (let i = 0; i < args.length; i++) {
        if (args[i] == null) {
            continue;
        }
        if (!(args[i].constructor === signature[i] || args[i] instanceof signature[i])) {
            return false;
        }
    }

    return true;
}
