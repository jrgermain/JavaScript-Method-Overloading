# JavaScript Method Overloading
My take on method overloading in JavaScript

I was reading a StackOverflow thread where a commenter linked a [blog post](https://johnresig.com/blog/javascript-method-overloading/) by John Resig. Resig talks about writing what he describes as a "quick-and-dirty function for doing simple method overloading" in JavaScript. The post was written 13 years ago, so I wondered if I could leverage some of the newer JavaScript features to pick up where he left off and make a more advanced version.

## Differences in my version
- It looks at both the types and the number of arguments 
- When creating an overloaded function, it doesn't have to be a property of an object

## Back up... what's overloading?
Overloading is when you have 2 different functions with the same name that take different parameters. For example, look at the following Java code:

```java
public Customer findCustomer(String name) {
    // Do stuff here
}

public Customer findCustomer(int customerId) {
    // Do other stuff here
}
```

We have 2 findCustomer methods, so what `findCustomer(x)` means depends on whether `x` is a String or int.

JavaScript doesn't have a built-in way to do this.

## How do I use it?
Let's start with an example function. We can mimic the Java example like so:
```js
var findCustomer = new OverloadedFunction()
    .add([String], function (name) {
        return customers.find(customer => customer.name === name);
    })
    .add([Number], function (id) {
        return customers.find(customer => customer.id === id);
    })
    
findCustomer("John Resig"); // Calls the first method
findCustomer(12345);        // Calls the second method
findCustomer();             // Throws an error
```

Without OverloadedFunction, the code would either need 2 separate methods or include type checks inside of the findCustomer function.

### A few quick notes
- The first parameter to `OverloadedFunction.prototype.add` is an array of constructors that represents the signature of an overloaded method
    - For example, a value of `[Number, String]` means we expect the function to be called with 2 parameters: a number followed by a string. The order matters.
    - This DOES look up the prototype chain (e.g. specifying `Object` will also match an `Array`, since all arrays inherit from `Object`.
    - Precedence is based on insertion order, not specificity. This means that if you want to handle arrays differently from objects, add the array method first.
    - `null` and `undefined` are treated as equal (both match `null` and `undefined`)
    - To match a call where no arguments are given, use an empty array
- The second parameter to `OverloadedFunction.prototype.add` is the function to be called when the arguments match the expected types
- `OverloadedFunction.prototype.add` returns the OverloadedFunction object it is attached to, allowing you to chain calls (as seen in the example)
- If no matching method exists, an error is thrown
