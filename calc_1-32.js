let digitscr = '0';
let digitans = '0';
let digitfix = '0';
let digitlength = digitscr.length;
let digittemp = Number(digitans);
let lastaction = ['zero', null, '', 0]//lastaction = [lastcategory, lastnumber, lastoperation, calc_mode]
finalization();

function finalization() {
  digitlength = digitscr.length;
  //digitcal = Number(digitscr);
  document.querySelector('.display').textContent = digitscr;
}

function numclick(numname) {
  if (digitlength < 10) {//adding numbers
      digitscr = (digitscr !== '0') ? digitscr + String(numname) : String(numname);
      [lastaction[0], lastaction[1]] = ['number', numname];
      finalization();
      //console.log(lastaction);
  }
}

function digit0(numname) {
  if (digitscr !== '0') numclick(numname);//adding 0 following other numbers
  else [lastaction[0],lastaction[1]] = ['zero', numname];//spamming 0 from start
  finalization();
  //console.log(lastaction);
}

function cancellation(amount) {
  if(amount === -10){//C = wipeout
    digitscr = digitscr.slice(0, amount) + '0';
    lastaction  = ['cancelout', null, '', 0];
  }
  else{//del
    if(lastaction[0] !== 'operation'){//deleting number
      if(digitlength === 1 || (digitlength === 2 && digitscr.includes('-'))){//wipeout
        digitscr = digitscr.slice(0, -digitlength) + '0';
        [lastaction[0], lastaction[1]] = ['cancelout', null];
      }
      else {//deleting last digit
      digitscr = digitscr.slice(0, amount);
      [lastaction[0], lastaction[1]] = (digitscr[digitlength - 2] === '.') ? ['dot', digitscr[digitlength - 3]] : [lastaction[0] ,digitscr[digitlength - 2]];
      }
    }
    else{//deleting modes
      digitscr = digitfix;
      [lastaction[0], lastaction[2], lastaction[3]] = ['number', '', 0];
    }
  }
  finalization();
  document.querySelector('.mode').textContent = lastaction[2];
  //console.log(lastaction);
}

function dot(){
  if(digitlength < 10 && !digitscr.includes('.')){
    digitscr += '.';
    lastaction[0] = 'dot';
  }
  //console.log(lastaction);
  finalization();
}

function outputpolish(){
  digittemp = Number(digitans);
  if(digittemp > 9999999999 || digittemp < -999999999){
    digitans = '0';
  }
  else{//when within limit
    if(digittemp < 1000000000 && digittemp > -100000000){//not close to limits
        let fractioncapacity = 10 - 1 - digitans.split('.')[0].length;
        digitans = String(Math.round(digittemp*(10 ** fractioncapacity))/(10 ** fractioncapacity));
    }
    else{//at limits
        digitans = String(Math.round(digittemp));
    }
  }
}

function equal(){
  //digitcal = Number(digitscr);
  if(lastaction[3] === 1){//mode active √√
    if(lastaction[2] === '+') digitans = String(Number(digitfix) + (Number(digitscr)));
    if(lastaction[2] === '-') digitans = String(Number(digitfix) - (Number(digitscr)));
    if(lastaction[2] === '*')      digitans = (lastaction[1]) ? String(Number(digitfix) * (Number(digitscr))) : digitfix;
    if(lastaction[2] === '/') digitans = (digitscr !== '0' && lastaction[1] !== '0') ? String(Number(digitfix) / (Number(digitscr))) : digitfix;
    if(lastaction[2] === '%') digitans = (digitscr !== '0' && lastaction[1] !== '0') ? String(Number(digitfix) % (Number(digitscr))) : digitfix;
    outputpolish();
    digitfix = digitans;
    document.querySelector('.display').textContent = (digittemp <= 9999999999 && digittemp >= -999999999) ? digitans : 'ERROR';
    document.querySelector('.answer').textContent = digitfix;
  }
  else{//mode inactive √√
    if(lastaction[0] !== 'equal'){//executing equal after inputting new values
      digitans = String(Number(digitscr));
      digitfix = digitans;
      document.querySelector('.display').textContent = digitans;
      document.querySelector('.answer').textContent = digitfix;
    }
    else{//spamming equal button
      document.querySelector('.display').textContent = digitfix;//or digitans
      }
  }
  lastaction = ['equal', null, '', 0];
  digitscr = '0';
  document.querySelector('.mode').textContent = lastaction[2];
  digitlength = digitscr.length;
  //console.log(lastaction);
}

function operation(operator){
  //equal();
  //calc_mode = (digitscr !== 0 || lastaction[2] !== operator) ? 'active' : 'inactive';
  if(!lastaction[3]){//mode has not yet been turned on
    if(lastaction[0] !== 'equal'){//operation after inputting numbers
      digitans = String(Number(digitscr));
      digitfix = digitans;
      digitscr = '0';
      digitlength = digitscr.length;
      [lastaction[0], lastaction[2], lastaction[3]] = ['operation', operator, 1];
      document.querySelector('.display').textContent = digitans;
      document.querySelector('.answer').textContent = digitfix;
      document.querySelector('.mode').textContent = lastaction[2];
    }
    else{//operation after equal
      [lastaction[0], lastaction[2], lastaction[3]] = ['operation', operator, 1];
      document.querySelector('.mode').textContent = lastaction[2];
    }
    
  }
  else{//mode was turned on
    if(lastaction[0] === 'operation'){//mode was turned on just in the previous command
      if(lastaction[2] === operator){//same command as before
        digitscr = digitfix;
        digitlength = digitscr.length;
        [lastaction[0], lastaction[2], lastaction[3]] = ['number', '', 0]//cancels the operator
        document.querySelector('.mode').textContent = lastaction[2];
      }
      else{//different command than before
        lastaction[2] = operator;
        document.querySelector('.mode').textContent = lastaction[2];
      }
    }
    else{//mode was turned on a while ago
      equal(lastaction[2]);
      lastaction = ['operation', null, operator, 1];
      document.querySelector('.mode').textContent = lastaction[2];
    }
  }
  //console.log(lastaction);
}

function minus1() { //changing direction sign
  if (lastaction[0] === 'equal' || lastaction[0] === 'operation') {
    if (!lastaction[3]) { //digitscr zero, function on answer
      if (digitfix.length < 10 || digitfix.includes('-')) {
        digitfix = String(Number(digitfix) * (-1));
        document.querySelector('.display').textContent = digitfix;
        document.querySelector('.answer').textContent = digitfix;
      }
    }
  }
  else { //digitscr not zero, function on digitscr()
    if (digitlength < 10) {
      //after entering digits
      digitscr = String(Number(digitscr) * (-1));
      document.querySelector('.display').textContent = digitscr;
    }
  }
  digitlength = digitscr.length;
}