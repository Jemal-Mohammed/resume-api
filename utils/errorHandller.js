// error handller class
class ErrorHandller extends Error{
    constructor(message,errorCode){
        super(message);
        this.statusCode=this.statusCode
        Error.captureStackTrace(this,this.constructor)
    }
}
export default ErrorHandller;