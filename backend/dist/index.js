"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

// import db from "./config/Database.js";

var _routesUserRouteJs = require("./routes/UserRoute.js");

var _routesUserRouteJs2 = _interopRequireDefault(_routesUserRouteJs);

var _routesFishTypeRouteJs = require("./routes/FishTypeRoute.js");

var _routesFishTypeRouteJs2 = _interopRequireDefault(_routesFishTypeRouteJs);

var _routesFishExpertRouteJs = require("./routes/FishExpertRoute.js");

var _routesFishExpertRouteJs2 = _interopRequireDefault(_routesFishExpertRouteJs);

var _routesUserConsultationRouteJs = require("./routes/UserConsultationRoute.js");

var _routesUserConsultationRouteJs2 = _interopRequireDefault(_routesUserConsultationRouteJs);

var _routesFishExpertAnswerRouteJs = require("./routes/FishExpertAnswerRoute.js");

var _routesFishExpertAnswerRouteJs2 = _interopRequireDefault(_routesFishExpertAnswerRouteJs);

var _routesVendorRouteJs = require("./routes/VendorRoute.js");

var _routesVendorRouteJs2 = _interopRequireDefault(_routesVendorRouteJs);

var _routesMedicineRouteJs = require("./routes/MedicineRoute.js");

var _routesMedicineRouteJs2 = _interopRequireDefault(_routesMedicineRouteJs);

var _routesConsultationRouteJs = require("./routes/ConsultationRoute.js");

var _routesConsultationRouteJs2 = _interopRequireDefault(_routesConsultationRouteJs);

var _routesPrescriptionRouteJs = require('./routes/PrescriptionRoute.js');

var _routesPrescriptionRouteJs2 = _interopRequireDefault(_routesPrescriptionRouteJs);

var _routesPaymentRouteJs = require("./routes/PaymentRoute.js");

var _routesPaymentRouteJs2 = _interopRequireDefault(_routesPaymentRouteJs);

var _routesPrescriptionMedicineRouteJs = require("./routes/PrescriptionMedicineRoute.js");

var _routesPrescriptionMedicineRouteJs2 = _interopRequireDefault(_routesPrescriptionMedicineRouteJs);

var _routesAuthRoutesJs = require("./routes/AuthRoutes.js");

var _routesAuthRoutesJs2 = _interopRequireDefault(_routesAuthRoutesJs);

var _routesUploadRouteJs = require("./routes/UploadRoute.js");

var _routesUploadRouteJs2 = _interopRequireDefault(_routesUploadRouteJs);

var _routesMessageRoutesJs = require("./routes/MessageRoutes.js");

var _routesMessageRoutesJs2 = _interopRequireDefault(_routesMessageRoutesJs);

var _routesSymptomRouteJs = require("./routes/SymptomRoute.js");

var _routesSymptomRouteJs2 = _interopRequireDefault(_routesSymptomRouteJs);

var _routesFishDiseaseRouteJs = require("./routes/FishDiseaseRoute.js");

var _routesFishDiseaseRouteJs2 = _interopRequireDefault(_routesFishDiseaseRouteJs);

_dotenv2["default"].config();
var app = (0, _express2["default"])();

// Konfigurasi session
app.use((0, _expressSession2["default"])({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'true' // Atur sesuai kebutuhan (true jika menggunakan HTTPS)
    }
}));

// Konfigurasi CORS
app.use((0, _cors2["default"])({
    credentials: true,
    origin: process.env.FRONTEND_URL || "*" }));

// Sesuaikan dengan frontend kamu
app.use(_express2["default"].json());
app.use('/uploads', _express2["default"]["static"]('uploads'));

// Gunakan route
app.use(_routesUserRouteJs2["default"]);
app.use(_routesFishTypeRouteJs2["default"]);
app.use(_routesFishDiseaseRouteJs2["default"]);
app.use(_routesFishExpertRouteJs2["default"]);
app.use(_routesUserConsultationRouteJs2["default"]);
app.use(_routesFishExpertAnswerRouteJs2["default"]);
app.use(_routesVendorRouteJs2["default"]);
app.use(_routesMedicineRouteJs2["default"]);
app.use(_routesConsultationRouteJs2["default"]);
app.use(_routesPrescriptionRouteJs2["default"]);
app.use(_routesPaymentRouteJs2["default"]);
app.use(_routesPrescriptionMedicineRouteJs2["default"]);
app.use(_routesAuthRoutesJs2["default"]);
app.use(_routesUploadRouteJs2["default"]);
app.use(_routesMessageRoutesJs2["default"]);
app.use(_routesSymptomRouteJs2["default"]);

// Menjalankan server
app.listen(process.env.APP_PORT, function () {
    console.log("Server up and running on port " + process.env.APP_PORT + "...");
});