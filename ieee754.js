/*
Albin Vinoy
CPSC 440

*/

var bias = {
    single: 127,
    double: 1023
}

function decimalToSinglePrecision(number) {
    /*=========================================
    Step 1 : get the sign value
    ==========================================*/
    // check the sign
    var sign = (number <0) ? 1 :0
    if(sign == 1){
        number = Math.abs(number);
    }

    /*=====================================================================
    Step 2 : Take the whole number and convert it to a binary
    ======================================================================*/

    // parse the whole number first
    var wholeNum = parseInt(number);

    // parse out the decimal value
    var decimalNum = number - wholeNum;

    // convert the whole number to binary
    var wholeNumBin = wholeNum.toString(2);


    /*=====================================================================
    Step 3 : Take the decimal number and mul it by 2 for 23 times
    This will also take care of the repeating decimal values
    ======================================================================*/

    var counter = 0;
    var stringBin = "";
        var x = decimalNum;

    while(1){
        if (counter > 23) {break;}
        // multiply the number by 2
        x = x * 2;

        // get the number before decimal and place it into the string
        stringBin += parseInt(x);
        var tempInt = parseInt(x);
        x = x - tempInt;

        counter++;
    }


    /*=====================================================================
    Step 4 : Take the decimal and the number and put them together
    and do exponential to get the exponent
    ======================================================================*/



    var wholePointDecimal = wholeNumBin + "." + stringBin;

    var normalizedValue = (+wholePointDecimal).toExponential();

    var expoValue = normalizedValue.split("e")[1];

    /*=====================================================================
    Step 5 : get the exponent and convert it into a binary
    ======================================================================*/


    var EXPO = +(expoValue) + bias.single;
    EXPO = EXPO.toString(2).padStart(8,"0");


    /*=====================================================================
    Step 6 : get the mantissa
    ======================================================================*/

    var wholePBinary = wholeNumBin + stringBin;
    var index = wholePBinary.indexOf('1');


    var MANTISSA = wholePBinary.substr(index + 1, 23).padEnd(23, "0");

    document.getElementById("output").innerHTML = "Sign (1 bit) : " +sign + "<p>Exponent (8 bits) : " + EXPO + "</p>" + "<p>Mantissa (52 bits) : " + MANTISSA;

}


function decimalToDoublePrecision(number) {
	// todo
    /*=========================================
    Step 1 : get the sign value
    ==========================================*/
    // check the sign
    var sign = (number < 0) ? 1 :0
    if(sign == 1){
        number = Math.abs(number);
    }

    /*=====================================================================
    Step 2 : Take the whole number and convert it to a binary
    ======================================================================*/

    // parse the whole number first
    var wholeNumber = parseInt(number);
    var wholeNum = wholeNumber;
    var wholeNumBin = "";
    while(1){
    	if(wholeNum == 0){break;}
    	wholeNumBin += wholeNum % 2;
    	wholeNum = parseInt(wholeNum / 2);
    }
    // read it reverse
    wholeNumBin = wholeNumBin.split("").reverse().join("");

    // parse out the decimal value
    var decplaces = 0;
    // var decimalNum = +(number.toString().split(".")[1]);

    // length of decimal
    var decLen = (number.toString()).length;
    if(number.toString().indexOf('.') > -1){
    	//found
    	decplaces = number.toString().split('.')[1].length;
    }
   
   	var decimalNum = +(parseFloat(number)- parseInt(number)).toFixed(decplaces); 

    /*=====================================================================
    Step 3 : Take the decimal number and mul it by 2 for 23 times
    This will also take care of the repeating decimal values
    ======================================================================*/

    var counter = 0;
    var stringBin = "";
    var x = decimalNum;

    while(1){
        if (counter > 51) {break;}
        // if(x % 10 == 0) {(x).toFixed(decLen);}
        // multiply the number by 2
        x = x * 2;

        // get the number before decimal and place it into the string
        stringBin += parseInt(x);
        var tempInt = parseInt(x);
        x = x - tempInt;

        counter++;
    }


    /*=====================================================================
    Step 4 : Take the decimal and the number and put them together
    and do exponential to get the exponent
    ======================================================================*/

    var wholePointDecimal = wholeNumBin + "." + stringBin;

    var normalizedValue = (+wholePointDecimal).toExponential();

    var expoValue = normalizedValue.split("e")[1];

    /*=====================================================================
    Step 5 : get the exponent and convert it into a binary
    ======================================================================*/


    var EXPO = +(expoValue) + bias.double;
    EXPO = EXPO.toString(2).padStart(11,"0");


    /*=====================================================================
    Step 6 : get the mantissa
    ======================================================================*/

    var wholePBinary = wholeNumBin + stringBin;
    var index = wholePBinary.indexOf('1');


    var MANTISSA = wholePBinary.substr(index + 1, 52).padEnd(52, "0");

    document.getElementById("output").innerHTML = "Sign (1 bit) : " +sign + "<p>Exponent (11 bits) : " + EXPO + "</p>" + "<p>Mantissa (52 bits) : " + MANTISSA;

}

function singlePointToDecimal(binary) {
    // console.log(typeof(binary));
    var s = +binary[0];
    var e = binary.substr(1, 8);
    var m = binary.substr(9);

    var exp = parseInt(e, 2);
    var total = 0;
    for (var index = 0; index < m.length; index++) {
        if (m[index] == "1") {
            total += (1 / Math.pow(2, index + 1));
        }
    }

    var answer = calculateFormula(s, total, exp, bias.single);
    document.getElementById("output").innerHTML = "<p>Decimal : " + answer[0] + "</p>" + "<p>Expression : " + answer[1];
}

function doublePointToDecimal(binary) {
    var s = +binary[0];
    var e = binary.substr(1, 11);
    var m = binary.substr(12);

    var exp = parseInt(e, 2);
    var total = 0.0;
    for (var index = 0; index < m.length; index++) {
        if (m[index] == "1") {
            total += (1 / Math.pow(2, index + 1));
        }
    }

    var answer = calculateFormula(s, total, exp, bias.double);
    document.getElementById("output").innerHTML = "<p>Decimal : " + answer[0] + "</p>" + "<p>Expression : " + answer[1];

}

function precision(object) {
    if (object == "SPTD") {
        return 6;
    } else if (object == "DPTD") {
        return 16;
    } else {
        return 0;
    }
}

function calculateFormula(s, frac, exp, bias) {
    // var x = Math.pow(-1, s) * (1 + frac) * Math.pow(2, (exp - bias));
    var a = Math.pow(-1, s);
    var b = (1 + frac);
    var expAdj = exp - bias;
    var pow2 = Math.pow(2, expAdj);

    var One = a * b;
    var x = One * pow2;


    var power = expAdj;
    var expression = "";
    expression += One;
    expression += " * ";
    expression += "2" + "<sup>" + power + "</sup>";
    return [x, expression];
    // return x;
}

function getSubmitValue() {
    var selectValue = document.querySelector('input[name="convert"]:checked').value;
    if (document.querySelector('input[name="convert"]'.checked)) {
        document.getElementById("test").innerHTML = "<p style=color:red> Please select the from the conversion list. </p>";
    }
    else {
        var type = checkInputType();
        if (selectValue == "DTSP") {
            if (type[0] == "numeric") {
                decimalToSinglePrecision(type[1])
            } else {
                document.getElementById("error").innerHTML = "Enter a binary number";
            }
        } else if (selectValue == "DTDP") {
            if (type[0] == "numeric") {
                decimalToDoublePrecision(type[1])
            } else {
                document.getElementById("error").innerHTML = "Enter a binary number";
            }
        } else if (selectValue == "SPTD") {
            if (type[0] == "binary") {
                singlePointToDecimal(type[1]); // implemented
            } else {
                document.getElementById("error").innerHTML = "Enter a binary number";
            }
        } else if (selectValue == "DPTD") {
            if (type[0] == "binary") {
                doublePointToDecimal(type[1]); // implemented
            } else {
                document.getElementById("error").innerHTML = "Enter a binary number";
            }
        }
    }
}

function checkInputType() {
    // come up with a way to check if the input is binary or a number
    var input = document.getElementById("input").value;
    input = input.replace(/[ ]/g, "");
    // console.log(typeof(input))
    var binary = /^[0-1]+$/;
    var number = /^[0-9.-]+$/;
    if (input.match(binary)) {
        // document.getElementById("test").innerHTML = "binary";
        return ["binary", input];
    } else if (input.match(number)) {
        // document.getElementById("test").innerHTML = "number";
        return ["numeric", input];
    } else {
        document.getElementById("test").innerHTML = "<p style=color:red> Invalid Data, please check your input. </p>";
    }
}
