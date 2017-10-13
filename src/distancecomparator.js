"use strict"

const is          = require("is");
const strSim      = require('string-similarity');
const levenshtein = require('js-levenshtein');
const nameParse   = require('humanparser');
const Regex       = require("regex");

function all(ar, cond) {
    if(!is.array(ar)) throw new Error("First parameter to all must be an array.");
    if(!is.fn(cond))  throw new Error("Second parameter to all must be a function.");
    return ar.map((elem) => cond(elem))
             .reduce((acc, elem) => acc && elem);
}

const Privates    = Symbol("Privates");
const ClassSymbol = Symbol("DistanceComparator");

class DistanceComparator {
   constructor(comp, split) {
      this.Privates = {};
      this.ClassSymbol = ClassSymbol;

      // Validate Comparator
      if(is.string(comp)) {
         // If string, turn into a regex
         comp = new Regex(comp, "g");
         this.Privates.comp = (val) => (comp.test(val)) ? 1 : 0;
      } else if(is.regexp(comp)) {
         // If regex turn into a function that returns binary distance on matches
         comp = new Regex(comp, "g");
         this.Privates.comp = (val) => (comp.test(val)) ? 1 : 0;
      } else if(is.object(comp)) {
         // If object, check for mutually exclusive dice or leven properies
         if(comp.dice && comp.leven) {
            throw new Error("Cannot have dice and leven property on "
                                             + "object passed to first parameter of DistanceComparator");
         } else if(comp.dice) {
            // If dice, must have a string value, returns a compare function on the value
            if(is.string(comp.dice.val)) {
               this.Privates.comp = (val) => (strSim.compareTwoStrings(val, comp.dice.val));
            } else {
               throw new Error("dice property must have val property that is a string");
            }
         } else if(comp.leven) {
            // If leven, must have a string value, returns a compare function on the value
            if(is.string(comp.leven.val)) {
               this.Privates.comp = (val) => (levenshtein(val, comp.leven.val));
            } else {
               throw new Error("leven property must have val property that is a string");
            }
         } else {
            throw new Error("Object passed in to first parameter of DistanceComparator"
                              + "must have dice or leven a property");
         }
      } else if(is.fn(comp)) {
         // If function, trust it and add it to our Private variable.
         this.Privates.comp = comp;
      } else {
         throw new Error("Must pass string, regex, function or object to first parameter of DistanceComparator.");
      }

      // Validate Split
      if(!!split) {
         if(is.string(split)) {
            // If string, turn into a regex
            let reg = new RegExp(split+"", "g");
            split = (val) => val.split(reg);
            this.Privates.split = split;
         } else if(is.regexp(split)) {
            // If regex turn into a function that returns binary distance on matches
            split = new RegExp(split, "g");
            split = (val) => val.split(split);
            this.Privates.split = split;
         } else if(is.object(split)) {
            // If object, check for mutually exclusive dice or leven properies
            if(split.human === true) {
               split = (val) => Object.values(nameParse.parseName(val));
               this.Privates.split = split;
            } else {
               throw new Error("Object passed in to first parameter of DistanceComparator"
                                 + "must have human property set to true");
            }
         } else if(is.fn(split)) {
            // If function, trust it and add it to our Private variable.
            this.Privates.split = split;
         } else {
            throw new Error("Must pass string, regex, function or object to first parameter of DistanceComparator.");
         }
      }
   }

   static get symbol() {
      return ClassSymbol;
   }

   static isClass(obj) {
      if(!is.object(obj)) return false;
      return (obj.ClassSymbol === ClassSymbol);
   }

   isClass(obj) {
      if(!is.object(obj)) return false;
      return (obj.ClassSymbol === ClassSymbol);
   }

   get symbol() {
      return ClassSymbol;
   }

   comp(val, minOrMax) {
      if(!val) throw new Error("First parameter to comp must be a value to compare");
      if(minOrMax) {
         if(minOrMax !== "min" & minOrMax !== "max") {
            throw new Error("Second parameter to comp must be min or max");
         }
      }

      let trim = (str) => str.replace(/\s{2,}/g," ").trim();
      if(is.string(val)) val = trim(val); // trim extra spaces

      if(this.Privates.split) {
         val = this.Privates.split(val);
         if(!is.array(val)) throw new Error("Split function must return an array");
      }
      if(is.array(val)) {
         let comps = val.map((elem) => this.Privates.comp(elem));
         if(!all(comps,is.number)) throw new Error("comp function must return a number for all values");
         if(!all(comps, (val) => val >= 0)) throw new Error("comp function must return positive number for all values");
         if(minOrMax && minOrMax === "min") {
            return comps.reduce((a,c) => (a > c) ? c : a)
         } else {
            return comps.reduce((a,c) => (a < c) ? c : a);
         }
      } else {
         let out = this.Privates.comp(val);
         if(!is.number(out)) throw new Error("comp function must return a number for all values");
         if(out < 0)         throw new Error("comp function must return a positive number for all values");
         return out;
      }
   }
}

module.exports = DistanceComparator;
