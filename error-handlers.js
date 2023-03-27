exports.handleUncaughtError = err => {
	res.status(500).send({ msg: 'Something went wrong there, try again' });
};
