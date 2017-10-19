'use strict';
var Model = require('../lib/Model');
var CompanyLanguages = require('../collections/cmplang');

class ScreenItem extends Model {
  constructor(options={}) {
    super(options);
  }
  props() {
    return [
      "Ar",
      "Av",
      "Beta",
      "Bvps",
      "Ch",
      "Chp",
      "Cmp",
      "Country",
      "CrntRt",
      "CshFlEstmt",
      "DcrDt",
      "De",
      "Dh",
      "DiffYhDh",
      "DiffYlDl",
      "Dl",
      "DlEPS3YrGrth",
      "Dy",
      "DyIndexCmpr",
      "DyIndexDiff",
      "E1",
      "E2",
      "EbitEstmt",
      "Eps",
      "EpsEsmt",
      "Eqsm",
      "ExSn",
      "ExdDt",
      "FpEPS",
      "FrNm",
      "FwdDYld",
      "Grm",
      "Ind",
      "It",
      "Mc",
      "MstarGrRt",
      "MstarPrftRt",
      "NetIncome5YrAvg",
      "NetMrgnIndexCmpr",
      "NetMrgnIndexDiff",
      "NiLQr",
      "NiLYr",
      "Nmp",
      "NtIn1YrGr",
      "Opm",
      "Opn",
      "OprtCF",
      "PEIndexCmpr",
      "PEIndexDiff",
      "Pe",
      "Pp",
      "PrCh1Mo",
      "PrCh3Mo",
      "PrCh6Mo",
      "PrCshfl",
      "PtB",
      "PtS",
      "QckRt",
      "ROEIndexCmpr",
      "ROEIndexDiff",
      "Re1YrGr",
      "Re3Yr",
      "Re5Yr",
      "ReLQr",
      "ReLYr",
      "Roa",
      "Roe",
      "RtCap",
      "Sales5YrAvg",
      "Sec",
      "SlsGrthRt",
      "St",
      "StkStyl",
      "StkTyp",
      "Sym",
      "Typ",
      "V",
      "VolumeSurge",
      "Yh",
      "Yl",
      "YrPrTgt",
      "cmpLang",
      "dividendYieldCategory",
      "eqType",
      "instrument",
      "marketCapCat",
      "mkt",
      "shrsOs"
    ];
  }

  collections() {
    return {
      cmpLang: CompanyLanguages
    };
  }
}

module.exports.getInstance = function(options) {
  var instance = instance || null;
  if (!instance) {
    instance = new ScreenItem(options)
    return instance;
  }
};
