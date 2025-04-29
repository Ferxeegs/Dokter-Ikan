// ResponseFormatter.js
export const responseFormatter = (req, res, next) => {
    res.success = function (message, data = null) {
      return res.status(200).json({
        success: true,
        message,
        data
      });
    };
  
    res.fail = function (message, errors = null, status = 400) {
      return res.status(status).json({
        success: false,
        message,
        errors
      });
    };
  
    next();
  };
  