"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPartNumber = exports.getPartsNumber = exports.getPetR1R2Prob = exports.getPartName = exports.getR1R2 = exports.getR1R2Prob = exports.getLifeStage = exports.byId = exports.getItemsNumber = exports.queryNinnekos = void 0;
const query_js_1 = __importDefault(require("./query.js"));
const parts_js_1 = require("./parts.js");
const ethers_1 = require("ethers");
const ascii_table3_1 = require("ascii-table3");
const WrongItemError_1 = __importDefault(require("./WrongItemError"));
const queryNinnekos = ({ faction = null, clazz = null, breed = null, lifeStage = null, parts, sort = null, }, graphClient) => __awaiter(void 0, void 0, void 0, function* () {
    if (breed === null || breed < 0 || breed > 6) {
        breed = [0, 1, 2, 3, 4, 5, 6];
    }
    else {
        breed = [breed];
    }
    let sortPrice = null;
    let priceSetAt = true;
    let sortID = null;
    if (sort === 'price') {
        sortPrice = false;
        priceSetAt = null;
        sortID = null;
    }
    let lifeStageId = null;
    if ((lifeStage === null || lifeStage === void 0 ? void 0 : lifeStage.toLowerCase()) === 'new born') {
        lifeStageId = 0;
    }
    else if ((lifeStage === null || lifeStage === void 0 ? void 0 : lifeStage.toLowerCase()) === 'adult') {
        lifeStageId = 1;
    }
    const variables = Object.assign(Object.assign({ page: 0, lifeStage: lifeStageId, limit: 1000, forSale: 1, breedCount: breed, faction, class: clazz }, parts), { sortID,
        sortPrice,
        priceSetAt });
    console.log(variables);
    const data = yield graphClient.request(query_js_1.default, variables);
    const table = new ascii_table3_1.AsciiTable3()
        .setHeading('BNB', 'FACTION', 'ID', 'B', 'Age', 'H1H2 Weapon', 'H1H2')
        .setAlign(3, ascii_table3_1.AlignmentEnum.RIGHT)
        .addRowMatrix(data.pets
        .map((pet) => [
        parseFloat(ethers_1.utils.formatEther(pet.price.toString())).toFixed(2),
        byId(parts_js_1.factions, pet.faction),
        pet.id,
        pet.breedCount,
        getLifeStage(pet.createdAt),
        getR1R2(pet),
        getPetR1R2Prob(pet) + '%',
    ])
        .slice(0, 25));
    table.setStyle('compact');
    return `\`\`\`${table.toString()}\`\`\``;
});
exports.queryNinnekos = queryNinnekos;
function getItemsNumber(item, items, isList = true) {
    let ret = null;
    if (item) {
        ret = (items === null || items === void 0 ? void 0 : items[item]) || -1;
        if (ret === -1)
            throw new WrongItemError_1.default(item);
        if (isList)
            ret = [ret];
    }
    return ret;
}
exports.getItemsNumber = getItemsNumber;
function byId(obj, id) {
    return Object.keys(obj)[Object.values(obj).indexOf(id)];
}
exports.byId = byId;
function getLifeStage(createdAt) {
    const createdDate = new Date(createdAt);
    let delta = Math.abs(Date.now() - createdDate) / 1000;
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let ret = `${hours}h`;
    if (days > 6) {
        return 'Adult';
    }
    else if (days > 0) {
        ret = `${days}d ${ret}`;
    }
    return ret;
}
exports.getLifeStage = getLifeStage;
function getR1R2Prob({ partD, partR, partR1 }) {
    let prob = 72;
    partD === partR ? (prob += 20) : (prob += 6);
    partD === partR1 ? (prob += 8) : (prob += 2);
    return prob;
}
exports.getR1R2Prob = getR1R2Prob;
function getR1R2(pet, part = 'hand') {
    var _a, _b;
    return `${(_a = getPartName(pet[part + 'R'])) === null || _a === void 0 ? void 0 : _a.substring(0, 4)}|${(_b = getPartName(pet[part + 'R1'])) === null || _b === void 0 ? void 0 : _b.substring(0, 4)}`;
}
exports.getR1R2 = getR1R2;
function getPartName(partID) {
    var _a;
    const partName = (_a = parts_js_1.parts === null || parts_js_1.parts === void 0 ? void 0 : parts_js_1.parts[partID]) === null || _a === void 0 ? void 0 : _a.name;
    return partName ? `${partName}` : '\u25AB';
}
exports.getPartName = getPartName;
function getPetR1R2Prob(pet) {
    let prob = 0;
    for (const part of parts_js_1.partArray) {
        prob += getR1R2Prob({
            partD: pet[part + 'D'],
            partR: pet[part + 'R'],
            partR1: pet[part + 'R1'],
        });
    }
    return (prob / parts_js_1.partArray.length).toFixed(1);
}
exports.getPetR1R2Prob = getPetR1R2Prob;
function getPartsNumber(part, partType) {
    var _a, _b, _c, _d;
    let rets = [null, null, null];
    if (part) {
        const r = part.split('/').map((args) => (args === '' ? null : args));
        if (r) {
            rets[0] =
                (_a = [
                    Object.keys(parts_js_1.parts).find((key) => parts_js_1.parts[key].name.toLowerCase() === r[0]),
                ]) !== null && _a !== void 0 ? _a : -1;
            if (r.length > 1) {
                rets[1] =
                    r[1] === null
                        ? null
                        : (_b = [
                            Object.keys(parts_js_1.parts).find((key) => parts_js_1.parts[key].name.toLowerCase() === r[1]),
                        ]) !== null && _b !== void 0 ? _b : -1;
            }
            if (r.length > 2) {
                rets[2] =
                    r[2] === null
                        ? null
                        : (_c = [
                            Object.keys(parts_js_1.parts).find((key) => parts_js_1.parts[key].name.toLowerCase() === r[2]),
                        ]) !== null && _c !== void 0 ? _c : -1;
            }
            if (r.length === 3 && !r[1] && !r[2]) {
                rets[1] = rets[0];
                rets[2] = rets[0];
            }
            else if (r.length === 3 && !r[2]) {
                const p = (_d = [
                    Object.keys(parts_js_1.parts).find((key) => parts_js_1.parts[key].name.toLowerCase() === r[1]),
                ]) !== null && _d !== void 0 ? _d : -1;
                rets[1] = p;
                rets[2] = p;
            }
            for (const ret of rets) {
                if (ret) {
                    if (ret[0] === -1)
                        throw new WrongItemError_1.default(part);
                    if (partType !== parts_js_1.parts[ret[0]].part)
                        throw new WrongItemError_1.default(part);
                }
            }
        }
    }
    return rets;
}
exports.getPartsNumber = getPartsNumber;
function getPartNumber(part, partId) {
    if (part !== null) {
        const id = Object.keys(parts_js_1.parts).find((key) => { var _a; return ((_a = parts_js_1.parts[key].name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (part === null || part === void 0 ? void 0 : part.toLowerCase()); });
        if (!id || partId !== parts_js_1.parts[id].part) {
            throw new WrongItemError_1.default(part);
        }
        return id;
    }
    else {
        return null;
    }
}
exports.getPartNumber = getPartNumber;
