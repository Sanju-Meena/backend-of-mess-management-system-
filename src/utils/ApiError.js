//statck: Error exact kis file me aur kis line par aaya hai, uski poori history (Stack Trace) mai hoti hai.


class ApiError extends Error{ //error class koo parent banaya
    constructor(statusCode, message = "Something went wrong",  errors = [], stack ="" ){
        super(message) 

        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = false,
        this.errors = errors

       // Handles debugging history (Stack Trace) means error kis line se aaya hai uski info store karna;
        if (stack) this.stack = stack; 
        else Error.captureStackTrace(this, this.constructor);

    }
}

export {ApiError}