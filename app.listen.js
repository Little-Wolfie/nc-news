const app = require('app.js');

const port = 9090;

app.listen(port, err => {
	if (err) console.error(err);
	else console.log(`Server running on port: ${port}`);
});
