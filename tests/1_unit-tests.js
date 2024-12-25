const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function() {
  
  suite('Function convertHandler.getNum(input)', function() {
    
    test('Whole number input', function(done) {
      let input = '32L';
      assert.strictEqual(convertHandler.getNum(input), 32);
      done();
    });
    
    test('Decimal number input', function(done) {
      let input = '3.14mi';
      assert.strictEqual(convertHandler.getNum(input), 3.14);
      done();
    });
    
    test('Fractional input', function(done) {
      let input = '1/2km';
      assert.strictEqual(convertHandler.getNum(input), 0.5);
      done();
    });
    
    test('Fractional input with decimal', function(done) {
      let input = '1.5/2.5gal';
      // 1.5 / 2.5 = 0.6
      assert.strictEqual(convertHandler.getNum(input), 0.6);
      done();
    });
    
    test('Invalid input (double fraction)', function(done) {
      let input = '3/2/3lbs';  // not valid => should return undefined
      assert.isUndefined(convertHandler.getNum(input));
      done();
    });
    
    test('No numerical input defaults to 1', function(done) {
      let input = 'kg';  // no number, just unit
      assert.strictEqual(convertHandler.getNum(input), 1);
      done();
    });
    
  });
  
  suite('Function convertHandler.getUnit(input)', function() {
    
    test('Each valid unit input', function(done) {
      let input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
      let output = ['gal','L','mi','km','lbs','kg','gal','L','mi','km','lbs','kg'];
      input.forEach(function(ele, i) {
        assert.strictEqual(convertHandler.getUnit(ele), output[i]);
      });
      done();
    });
    
    test('Unknown unit input', function(done) {
      let input = '32g';  // 'g' is not a valid unit in this project
      assert.isUndefined(convertHandler.getUnit(input));
      done();
    });
    
  });
  
  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('Return correct return unit for each valid unit', function(done) {
      let input = ['gal','L','mi','km','lbs','kg'];
      let expect = ['L','gal','km','mi','kg','lbs'];
      input.forEach(function(ele, i) {
        assert.strictEqual(convertHandler.getReturnUnit(ele), expect[i]);
      });
      done();
    });
    
  });
  
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    
    test('Return spelled-out string unit for each valid input unit', function(done) {
      let input = ['gal','L','mi','km','lbs','kg'];
      let expect = ['gallons','liters','miles','kilometers','pounds','kilograms'];
      input.forEach(function(ele, i) {
        assert.strictEqual(convertHandler.spellOutUnit(ele), expect[i]);
      });
      done();
    });
    
  });
  
  suite('Function convertHandler.convert(initNum, initUnit)', function() {
    
    test('gal to L', function(done) {
      let input = [1, 'gal'];
      let expected = 3.78541;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.0001);
      done();
    });
    
    test('L to gal', function(done) {
      let input = [1, 'L'];
      let expected = 0.26417;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.0001);
      done();
    });
    
    test('mi to km', function(done) {
      let input = [1, 'mi'];
      let expected = 1.60934;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.0001);
      done();
    });
    
    test('km to mi', function(done) {
      let input = [1, 'km'];
      let expected = 0.62137;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.0001);
      done();
    });
    
    test('lbs to kg', function(done) {
      let input = [1, 'lbs'];
      let expected = 0.45359;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.0001);
      done();
    });
    
    test('kg to lbs', function(done) {
      let input = [1, 'kg'];
      let expected = 2.20462;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.0001);
      done();
    });
    
  });
  
});
