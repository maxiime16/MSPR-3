const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        info: {
            title: 'MicroService authentification MSPR',
            version: '3.0.0',
            description: 'Documentation de votre micro-service',
        },
    },
    apis: ['routes/conversationRoute.js', 'routes/messageRoute.js', 'routes/participantRoute.js', ],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
