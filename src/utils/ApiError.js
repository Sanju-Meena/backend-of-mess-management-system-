class ApiError extends Error{ //error class koo parent banaya
    constructor(statusCode,message = "Something went wrong",  errors = [],stack ="" ){
        //statck: Error exact kis file me aur kis line par aaya hai, uski poori history (Stack Trace) mai hoti hai.
        super(message) // super k pass ek he parameter hota hai message ka ;
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = false,
        this.errors = errors

       // Handles debugging history (Stack Trace) means error kis line se aaya hai uski info store karna;
        if (stack) {
            this.stack = stack; // Uses existing stack trace if provided (e.g., from Mongoose)
        } else {
            // Generates a clean stack trace pointing directly to the controller error line
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError}