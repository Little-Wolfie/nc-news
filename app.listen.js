const app = require('./app.js');

const { PORT = 9090 } = process.env;

app.listen(PORT, err => {
	if (err) console.error(err);
	else console.log(`Server running on port: ${port}`);
});
