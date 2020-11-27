const app = require('./app');

app.listen(process.env.API_PORT, () => console.log(`Server API W2Bit Bus Station rodando na porta ${process.env.API_PORT || 3000} `));