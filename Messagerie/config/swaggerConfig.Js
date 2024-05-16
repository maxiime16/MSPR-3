const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        info: {
            title: 'MicroService messagerie MSPR',
            version: '3.0.0',
            description: 'Documentation de votre micro-service',
        },
    },
    apis: ['routes/conversationRoute.js','routes/participantRoute.js', 'routes/messageRoute.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
