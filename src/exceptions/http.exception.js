class HttpException extends Error {
	constructor(message = 'Something went wrong', statusCode = 500) {
		super();
		this.message = message;
		this.statusCode = statusCode;
	}
}

class NotFoundException extends HttpException {
	constructor(message = 'Not found') {
		super(message, 404);
	}
}

class BadRequestException extends HttpException {
	constructor(message = 'Bad request') {
		super(message, 400);
	}
}

class ValidationException extends HttpException {
	constructor(message = 'Validation Failed') {
		super(message, 422);
	}
}

class UnauthorizedException extends HttpException {
	constructor(message = 'Unauthoried') {
		super(message, 401);
	}
}

class ForbiddenException extends HttpException {
	constructor(message = 'Forbidden') {
		super(message, 403);
	}
}

module.exports = {
	HttpException,
	NotFoundException,
	BadRequestException,
	ValidationException,
	UnauthorizedException,
	ForbiddenException
};