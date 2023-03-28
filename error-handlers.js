exports.handleBadRequest = (err, req, res, next) => {
	if (err.code === '22P02' || err.code === 400) {
		res.status(400).send({ msg: 'Bad request' });
	} else {
		next(err);
	}
};

exports.handleNotFound = (err, req, res, next) => {
	if (err.code === 404) {
		res.status(404).send({ msg: 'Resource not found' });
	} else {
		next(err);
	}
};

exports.handleWrongPath = (req, res, next) => {
	res.status(404).send({ msg: 'Resource not found' });
};

exports.handleUncaughtError = (err, req, res, next) => {
	res.status(500).send({ msg: 'Something went wrong there, try again' });
};
