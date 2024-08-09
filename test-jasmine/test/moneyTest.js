import {formatCurrency} from '../../scripts/utils/money.js';

if (formatCurrency(2095) === '20.95') {
    console.log('Test passed');
}else {
    console.log('Failed');
}

if (formatCurrency(2000.4) === '20.00') {
    console.log('Test passed');
}else {
    console.log('failed');
}
