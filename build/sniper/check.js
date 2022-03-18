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
Object.defineProperty(exports, "__esModule", { value: true });
const parts_1 = require("../parts");
const searchHelper_1 = require("../searchHelper");
function check(user, interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield interaction.reply({
                content: yield checkSnipe(user),
                ephemeral: true,
            });
        }
        catch (e) {
            if (e.message) {
                yield interaction.reply({ content: e.message, ephemeral: true });
            }
            else {
                console.log(e);
            }
        }
    });
}
exports.default = check;
const checkSnipe = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const snipes = yield user.getSnipes();
    if (snipes.length > 0) {
        const snipeArray = [];
        for (const snipe of snipes) {
            const fields = parts_1.importantPartArray.map((part) => {
                var _a;
                return `${(_a = (0, searchHelper_1.byId)(parts_1.partTypes, part.id)) === null || _a === void 0 ? void 0 : _a.toUpperCase()}: ${(0, searchHelper_1.getPartName)(snipe[part.name + 'D'])} | ${(0, searchHelper_1.getPartName)(snipe[part.name + 'R'])} | ${(0, searchHelper_1.getPartName)(snipe[part.name + 'R1'])}`;
            });
            snipeArray.push(`**${snipe.name}**\n${fields.join('\n')}`);
        }
        return snipeArray.join('\n');
    }
    return 'No snipes to check';
});
