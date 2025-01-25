function validateValue(string, min = 3, max = 255, isNumeric = false) {
    if(typeof string !== 'string') return false;
    if(string.length < min || string.length > max) return false;
    if(isNumeric && isNaN(string)) return false;
    return true;
}

export { validateValue };