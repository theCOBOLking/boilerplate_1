function ConvertHandler() {
  
  this.getNum = function(input) {
    // Use a regex to separate the numeric part from the unit part
    // e.g. "3.2/4kg" => match[1] = "3.2/4", match[2] = "kg"
    let regex = /^([.\d/]+)?([a-zA-Z]+)$/;
    let match = input.match(regex);

    if (!match) {
      // If the input format doesn’t match at all, let’s return undefined
      // so that we know something was invalid. The router can then handle it.
      return undefined;
    }

    let numStr = match[1];
    // If there's no numeric part, default to 1
    if (!numStr) {
      numStr = '1';
    }

    // Check for multiple slashes => invalid number
    let slashCount = (numStr.match(/\//g) || []).length;
    if (slashCount > 1) {
      return undefined; // "invalid number" scenario
    } else if (slashCount === 1) {
      // e.g. "3/2"
      let [numerator, denominator] = numStr.split('/');
      let fractionValue = parseFloat(numerator) / parseFloat(denominator);
      if (isNaN(fractionValue)) {
        return undefined;
      }
      return fractionValue;
    } else {
      // If there's no slash, just parse a float
      let value = parseFloat(numStr);
      if (isNaN(value)) {
        return undefined;
      }
      return value;
    }
  };
  
  this.getUnit = function(input) {
    // Extract the unit from the end of the string (letters only).
    let unitMatch = input.match(/[a-zA-Z]+$/);
    if (!unitMatch) {
      return undefined; 
    }
    
    let unit = unitMatch[0].toLowerCase();
    let validUnits = ['gal','l','mi','km','lbs','kg'];
    
    if (!validUnits.includes(unit)) {
      return undefined;
    }
    
    // We typically preserve uppercase 'L' instead of 'l'
    if (unit === 'l') {
      unit = 'L';
    }
    
    return unit;
  };
  
  this.getReturnUnit = function(initUnit) {
    // Map each valid unit to its return unit
    const lookup = {
      gal: 'L',
      L:   'gal',
      mi:  'km',
      km:  'mi',
      lbs: 'kg',
      kg:  'lbs'
    };
    
    return lookup[initUnit];
  };

  this.spellOutUnit = function(unit) {
    // Return spelled-out strings
    const spelledOut = {
      gal: 'gallons',
      L:   'liters',
      mi:  'miles',
      km:  'kilometers',
      lbs: 'pounds',
      kg:  'kilograms'
    };
    
    return spelledOut[unit];
  };
  
  this.convert = function(initNum, initUnit) {
    // Conversion rates
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    
    let result;
    
    switch (initUnit) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'L':
        result = initNum / galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
    }
    
    // Round to 5 decimal places
    return parseFloat(result.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    // Construct a string like: "3.1 miles converts to 4.98895 kilometers"
    let result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
    return result;
  };
  
}

module.exports = ConvertHandler;
