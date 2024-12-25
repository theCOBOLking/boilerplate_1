'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();
  
  app.get('/api/convert', (req, res) => {
    const input = req.query.input;
    
    // Extract the initial number and unit from the input
    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);
    
    // Check for invalid number/unit/both
    if (!initNum && !initUnit) {
      return res.json({ error: 'invalid number and unit' });
    } else if (!initNum) {
      return res.json({ error: 'invalid number' });
    } else if (!initUnit) {
      return res.json({ error: 'invalid unit' });
    }
    
    // Convert
    const returnNum = convertHandler.convert(initNum, initUnit);
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    
    // Construct response string
    const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
    
    // Send back JSON
    return res.json({
      initNum: initNum,
      initUnit: initUnit,
      returnNum: returnNum,
      returnUnit: returnUnit,
      string: string
    });
  });
  
};
