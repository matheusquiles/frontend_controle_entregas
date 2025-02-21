class camelCaseFormData {
    static toCamelCase(str) {
      return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    }
  
    static convertKeysToCamelCase(obj) {
      return Object.keys(obj).reduce((acc, key) => {
        const camelCaseKey = camelCaseFormData.toCamelCase(key);
        acc[camelCaseKey] = obj[key];
        return acc;
      }, {});
    }
  }
  
  export default camelCaseFormData;