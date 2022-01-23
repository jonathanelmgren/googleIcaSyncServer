const notFound = (request, response, next) => {
	const error = new Error(`Not Found: ${request.originalUrl}`)
	response.status(404)
	next(error)
}

export default { notFound }
