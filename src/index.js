const app = require('./app');

app.listen(process.env.API_PORT || 3000, () => console.log('Running Server API W2Bit Bus Station'));