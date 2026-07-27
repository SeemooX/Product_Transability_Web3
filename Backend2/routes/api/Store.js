const storeRouter = express.Router();
const storeController = require('../../controllers/warehouseController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

storeRouter.route('/products/statistics')
    .get(verifyRoles("STORE", "ADMIN"), storeController.storeStatistics);

storeRouter.route('/products')
    .get(verifyRoles("STORE", "ADMIN"), storeController.storeProducts);

module.exports = storeRouter;