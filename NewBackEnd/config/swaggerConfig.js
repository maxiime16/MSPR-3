const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        info: {
            title: 'BackEnd MSPR',
            version: '3.0.0',
            description: 'Documentation de votre API',
        },
    },
    apis: ['routes/advertisementRoute.js', 'routes/adviceRoute.js', 'routes/categoryRoute.js', ],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
