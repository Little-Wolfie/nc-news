exports.handleUncaughtError = res => {
	res.status(500).send({ msg: 'Something went wrong there, try again' });
};

exports.handleNotFound = res => {
	res.status(404).send({ msg: 'Resource not found' });
};

exports.handleBadRequest = res => {
	res.status(400).send({ msg: 'Bad request' });
};
