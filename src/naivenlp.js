"use strict"

const SpellChecker = require("spellchecker");
const is           = require("is");
const sw           = require("stopword");
const stem         = require("wink-porter2-stemmer" );
const w2n          = require("words-to-numbers");
const Regex        = require("regex");

// Trim any multiple occuring white spaces
function trim(str) {
   if(!is.string(str)) throw new Error("Parameter to trim must be a string.");
   return str.replace(/\s{2,}/g," ").trim();
}

// Convert words to numbers
function words2numbers(str) {
   if(!is.string(str)) throw new Error("Parameter to words2numbers must be a string.");
   return w2n.wordsToNumbers(str);
}

// Lowercase all letters
function lower(str) {
   if(!is.string(str)) throw new Error("Parameter to lower must be a string.");
   return str.toLowerCase();
}
// Perform spell check
function fixSpelling(str) {
   if(!is.string(str)) throw new Error("Parmater to fixSpelling must be a string.");
   let split = str.split(" ");
   for(let i = 0; i < split.length; i++) {
      if(SpellChecker.isMisspelled(split[i])) {
         split[i] = SpellChecker.getCorrectionsForMisspelling(split[i])[0] || split[i];
      }
   }
   return split.join(" ");
}

function addWordToDict(str) {
   if(!is.string(str)) throw new Error("Parmater to fixSpelling must be a string.");
   SpellChecker.add(str);
}

// Remove stop words
function stops(str) {
   if(!is.string(str)) throw new Error("Parmater to stops must be a string.");
   return sw.removeStopwords(str.split(" ")).join(" ");
}

// Convert to stem words
function stems(str) {
   if(!is.string(str)) throw new Error("First parmater to stems must be a string.");
   return str.split(" ").map((e) => stem(e)).join(" ");
}

// Extract math
function extractMath(str) {
   if(!is.string(str)) throw new Error("First parmater to extractMath must be a string.");
   str = words2numbers(str);
   const toFilter = ["!", "=<", "=>", "\\[", "\]", "%", "\|", "&", "~", "\,", "{", "}", "\\?", "@", "#", "’", "'", "\\."];
   const toKeep   = ["+", "*", "^", "-", "/", "="];
   toFilter.map((e) => {
      let tmpReg = new RegExp(e, "g");
      str = str.replace(tmpReg, "");
   });
   str = str.replace(/\w{3,}/g,"");

   let split = str.split(" ");

   let ret = [];
   for(const x of split) {
      let tmpSplit = x.split("");
      let nums = [];
      for(const y of tmpSplit){
         if(toKeep.indexOf(y) !== -1) {
            ret.push(nums.join(""));
            nums = [];
            ret.push(y);
         } else {
            nums.push(y);
         }
      }
      ret.push(nums.join(""));
   }

   // console.log(str.split("+"));
   // console.log(str.split("+").join(" "));
   str = trim(ret.join(" "));
   str = stops(str);
   return str;
}

function parse(str, skip) {
   if(!is.string(str)) throw new Error("First parmater to parse must be a string.");
   if(is.object(skip)) {
      if(!(!!skip.trim))    str = trim(str);
      if(!(!!skip.lower))   str = lower(str);
      if(!(!!skip.fixSp))   str = fixSpelling(str);
      if(!(!!skip.w2n))     str = words2numbers(str);
      if(!(!!skip.extMath)) str = extractMath(str);
      if(!(!!skip.stops))   str = stops(str);
      if(!(!!skip.stems))   str = stems(str);
   } else {
      str = trim(str);
      str = lower(str);
      str = fixSpelling(str);
      str = words2numbers(str);
      str = extractMath(str);
      str = stops(str);
      str = stems(str);
   }
   return str;
}

module.exports = {
   trim:        trim,
   lower:       lower,
   fixSpelling: fixSpelling,
   stops:       stops,
   stems:       stems,
   extractMath: extractMath,
   parse:       parse
}