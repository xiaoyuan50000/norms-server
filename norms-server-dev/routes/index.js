let express = require('express');
let router = express.Router();

let testService = require('../services/testService')
const iUService = require('../services/iransportUnitService')
const overviewService = require('../services/overviewService')
const orderPriceListService = require('../services/orderPriceListService')
const storageService = require('../services/storageService')
const irsService = require('../services/issuingReceivingScheduleService')
const toiIssuesService = require('../services/transportOrderIssuesService')
const getUserDetailService = require('../services/getUserDetailService')
const mapDeviceService = require('../services/mapDeviceService')
const apiKeyListService = require('../services/apiKeyListService')

const transportUnitService = require('../services/transportUnit')
const transportOrderService = require('../services/transportOrder')
const transportOrderFlowService = require('../services/transportOrderFlowService')
const flowStateService = require('../services/flowStateService')
const togglingPageDataService = require('../services/togglingPageDataService')
const receivingScheduleData = require('../services/receivingScheduleData')


router.post('/initStorageStatus', storageService.InitStorageStatus);
router.post('/initIssuingReveivingScheduleTable', irsService.InitIssuingReveivingScheduleTable);
router.post('/initTransportOrderIssuesTable', toiIssuesService.InitTransportOrderIssuesTable);
router.post('/initTransportOrderIssuesStatistic', toiIssuesService.InitTransportOrderIssuesStatistic);


// router.get('/', testService.Test);
// router.post('/initTransportUnitTable', iUService.InitTransportUnitTable);
// router.post('/initIssuingStatus', overviewService.InitIssuingStatus);
// router.post('/initReceivingStatus', overviewService.InitReceivingStatus);
// router.post('/initStorageCapacityStatus', overviewService.InitStorageCapacityStatus);

// router.post('/initDrawTable', overviewService.InitDrawTable);
// router.post('/initNpm1Status', overviewService.InitNpm1Status);
// router.post('/initNpm2Status', overviewService.InitNpm2Status);
// router.post('/initNpm3Status', overviewService.InitNpm3Status);
// router.post('/initNpm4Status', overviewService.InitNpm4Status);

// router.post('/initStatisticsStatus', orderPriceListService.InitStatisticsStatus);
// router.post('/initSalesDetailsStatus', orderPriceListService.InitSalesDetailsStatus);
// router.post('/initOrderPriceListTable', orderPriceListService.InitOrderPriceListTable);
// router.post('/initProductDetailsStatus', orderPriceListService.InitProductDetailsStatus);
// router.post('/iniAnalyticsDataStatus', orderPriceListService.IniAnalyticsDataStatus);


router.post('/sendTokenInfo', getUserDetailService.SendTokenInfo);

router.post('/getMapDevices', mapDeviceService.getDevices);
router.post('/updateMapDeviceStatus', mapDeviceService.updateStatus);
router.post('/updateAllStatus', mapDeviceService.updateAllStatus);

router.post('/getApiKeyList', apiKeyListService.getApiKeyList);
router.post('/updateApiKey', apiKeyListService.updateApiKey);
router.post('/sendToken', apiKeyListService.sendToken);
router.post('/receiveToken', apiKeyListService.receiveToken);
router.post('/updateStatus', apiKeyListService.updateStatus);

router.post('/initTransportUnitListTable', transportUnitService.InitTransportUnitListTable);

router.post('/initTransportOrderListTable', transportOrderService.InitTransportOrderListTable);
router.post('/initTransportOrderFlowListTable', transportOrderFlowService.InitTransportOrderFlowListTable);
router.post('/saveDiagramData', transportOrderFlowService.SaveDiagramData);

router.post('/getFlowStateTable', flowStateService.getFlowStateTable);
router.post('/getTogglingPageData', togglingPageDataService.getTogglingPageData);
router.post('/updateTogglingPage', togglingPageDataService.updateTogglingPage);
router.post('/getReceivingScheduleData', receivingScheduleData.getReceivingScheduleData);
router.post('/getCartonsReceivedData', receivingScheduleData.getCartonsReceivedData);

router.post('/receivingScheduleAddTuNamber', receivingScheduleData.receivingScheduleAddTuNamber);
router.post('/receivingScheduleAddNewData', receivingScheduleData.receivingScheduleAddNewData);
router.post('/getRsDetailedData', receivingScheduleData.getRsDetailedData);
// router.post('/receivingScheduleCoordinateUpdating', receivingScheduleData.receivingScheduleCoordinateUpdating);



module.exports = router;