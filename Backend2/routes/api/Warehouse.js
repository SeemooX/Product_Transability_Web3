const warehouseRouter = express.Router();
const warehouseController = require('../../controllers/warehouseController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

warehouseRouter.route('/products/statistics')
    .get(verifyRoles("WAREHOUSE", "ADMIN"), warehouseController.warehouseStatistics);

warehouseRouter.route('/products')
    .get(verifyRoles("WAREHOUSE", "ADMIN"), warehouseController.warehouseProducts);

module.exports = warehouseRouter;