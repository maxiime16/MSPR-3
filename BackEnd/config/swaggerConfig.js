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
    apis: ['routes/addressRoute.js', 'routes/advertisementRoute.js', 'routes/adviceRoute.js', 'routes/categoryRoute.js', 'routes/subCategoryRoute.js', 'routes/imageRoute.js', 'routes/plantRoute.js', ],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
// 'routes/adviceRoute.js', 'routes/categoryRoute.js', 'routes/subCategoryRoute.js', 'routes/imageRoute.js'