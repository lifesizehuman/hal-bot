"use strict"

const is           = require("is");
const sw           = require("stopword");
const stem         = require("wink-porter2-stemmer" );
const w2n          = require("words-to-numbers");
const Regex        = require("regex");
const RegReplacer  = require("regreplacer");

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
   str = stops(str);
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

   str = trim(ret.join(" "));

   return str;
}

function parse(str, skip) {
   if(!is.string(str)) throw new Error("First parmater to parse must be a string.");
   if(is.object(skip)) {
      if(!(!!skip.trim))    str = trim(str);
      if(!(!!skip.lower))   str = lower(str);
      if(!(!!skip.extMath)) str = extractMath(str);
      if(!(!!skip.stops))   str = stops(str);
      if(!(!!skip.stems))   str = stems(str);
   } else {
      str = trim(str);
      str = lower(str);
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