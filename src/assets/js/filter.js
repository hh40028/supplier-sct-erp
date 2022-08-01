exports.number2 = (value) => {
    if (!value || isNaN(value)) {
        return "0.00";
    }
    if (value) {
        value = Number(value);
        return value.toFixed(2);
    } else {
        return '0.00';
    }
};
exports.number0 = (value) => {
    if (!value || isNaN(value)) {
        return "0";
    }
    if (value) {
        value = Number(value);
        return value.toFixed(0);
    } else {
        return '0.0';
    }
};

exports.numberNull = (value) => {
    if (!value || isNaN(value)) {
        return "0";
    }
    if (value) {
        value = Number(value);
        return value.toFixed(0);
    } else {
        return '0';
    }
};


exports.number2Null = (value) => {
    if (!value || isNaN(value)) {
        return "0.00";
    }
    if (value) {
        value = Number(value);
        value = value.toFixed(2);
        return value;
    } else {
        return '0.00';
    }
};
