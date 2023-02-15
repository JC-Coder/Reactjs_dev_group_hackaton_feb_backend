class AppError {
    message;
    status;
    constructor(res, data, status){
        this.message = data;
        this.status = status;

        return res.status(status).json(data);
    }
}

module.exports = AppError;