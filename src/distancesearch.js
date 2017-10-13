"use strict"

const DistanceComparator = require("./distancecomparator.js");
const Privates = Symbol("Privates");
const is = require("is");
const ClassSymbol = Symbol("DistanceSearch");

function all(ar, cond) {
    if(!is.array(ar)) throw new Error("First parameter to all must be an array.");
    if(!is.fn(cond))  throw new Error("Second parameter to all must be a function.");
    return ar.map((elem) => cond(elem))
             .reduce((acc, elem) => acc && elem);
}

/********** API VERY LIKELY TO CHANGE IN FUTURE   *************/
/********** WILL MOST LIKELY REMOVE COMPARATOR
            FROM CONSTRUCTION AND MOVE IT TO FIND *************/

class DistanceSearch {
   constructor(conObj) {
      this.Privates = {};
      this.Privates.perfect = !!conObj.perfect;
      this.ClassSymbol = ClassSymbol;

      if(!is.object(conObj)) {
         throw new Error("Must pass construction object to DistanceSearch constructor.");
      }
      if(!all(conObj.data, is.object)) {
         throw new Error("DistanceSearch construction object must"
                           + "have a data property that is an array of objects.");
      } else {
         if(this.Privates.perfect) {
            const keys    = Reflect.ownKeys(conObj.data[0]);

            for(let i = 0; i < keys.length; i++) {
               // Grab type of element in position i for row 0
               let tmpType = typeof conObj.data[0][keys[i]];

               // Go through every element in object
               for(let j = 0; j < conObj.data.length; j++) {
                  // Grab value at key[i] in row j
                  let tmpVal = conObj.data[j][keys[i]];

                  // Ensure it isn't undefined or missing
                  if(tmpVal === undefined || tmpVal === null) throw new Error(`Property ${keys[i]} in row ${j} is undefined.`);

                  // Throw error if type doesn't match type of value in first row
                  if(typeof tmpVal !== tmpType) {
                     throw new Error(`Property in ${JSON.stringify(conObj.data[j])} in row ${j}, col ${i}, val: ${tmpVal} is different type than expected: ${tmpType}`);
                  }
               }
            }
            this.Privates.data = conObj.data;
         } else {
            this.Privates.data = conObj.data;
         }
      }

      if(!DistanceComparator.isClass(conObj.comparator)) {
         throw new Error("DistanceSearch construction object must have a comparator" +
                           "property that is a DistanceComparator instance.");
      } else {
         this.Privates.comparator = conObj.comparator;
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

   swapComparator(comp) {
      if(!DistanceComparator.isClass(comp)) throw new Error("Must pass DistanceComparator to swapComparator");
      return new DistanceSearch({
         data:       this.Privates.data,
         perfect:    this.Privates.perfect,
         comparator: this.Privates.comparator
      });
   }

   find(qOpts) {
      return this.findN(qOpts, 1)[0];
   }

   findN(qOpts, n) {
      if(!is.object(qOpts)) throw new Error("Mast pass query options object to second parameter of find");
      if(!(all(qOpts.search, is.string) && all(qOpts.ret, is.string) && is.string(qOpts.minOrMax))) {
         throw new Error("Query options object must have a search and "
                              + "ret property both arrays of string properties "
                              + "and minOrMax, string either min or max.");
      }
      if(!is.number(n)) throw new Error("Third parameter passed to findN must be an integer number");
      n = parseInt(n);

      let extVal;
      if(qOpts.minOrMax === "max") {
         extVal = 0;
      } else if(qOpts.minOrMax === "min") {
         extVal = Number.MAX_SAFE_INTEGER;
      } else {
         throw new Error("qOpts.minOrMax must be min or max");
      }

      let out = [];
      let tmpComp;
      let comp = (qOpts.minOrMax === "max") ? (() => tmpComp >= extVal)
                                            : (() => tmpComp <= extVal);

      /******** CAN CLEAN THIS UP USING A PRIORITY QUEUE
      ///
      //////
      //////////
      */

      // For Every row of data
      for(const obj of this.Privates.data) {
         // For every search column
         for(const sq of qOpts.search) {
            tmpComp = this.Privates.comparator.comp(obj[sq], qOpts.minOrMax);
            // computing mins or maxs based on qOpts.minOrMax and comp set above
            if(comp()) {
               extVal = tmpComp;
               let tmpObj = {};
               for(const pullProp of qOpts.ret) {
                  if(qOpts.ret.length === 1 && pullProp === "*") {
                     for(const tmpProp of Reflect.ownKeys(obj)) {
                        tmpObj[tmpProp] = obj[tmpProp];
                     }
                  } else {
                     tmpObj[pullProp] = obj[pullProp];
                  }
               }
               out.unshift({pri: extVal, data: tmpObj});
               if(out.length > n) {
                  out.pop();
               }
            }
         }
      }
      return out;
   }
}

module.exports = DistanceSearch;
