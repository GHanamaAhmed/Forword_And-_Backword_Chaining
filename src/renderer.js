var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var knowledgeStructureInput = document.getElementById("letters_between");
var expressionSignInput = document.getElementById("expression_sign");
var divSetting = document.getElementById("divSetting");
var divExecute = document.getElementById("divExecute");
var next = document.getElementsByClassName("next");
var knowledge_base_file = document.getElementById("knowledge_base_file");
var knowledge_base_text = document.getElementById("knowledge_base_text");
var execute_button = document.getElementById("execute_button");
var execution_steps = document.getElementById("execution_steps");
var algoOfConflit = document.getElementsByName("conflit");
var engine_speed = document.getElementsByName("engine_speed");
var knowledgeBase = {
    facts: [],
    rules: [],
};
var goal;
// Set default values for the inputs
knowledgeStructureInput.value = ",";
expressionSignInput.value = "=>";
// Set default values for radio buttons
document.getElementById("avant").checked = true;
document.getElementById("depth_first").checked = true;
algoOfConflit[0].checked = true;
engine_speed[0].checked = true;
next[0].addEventListener("click", function (e) {
    e.preventDefault();
    if (divSetting.classList.contains("hidden")) {
        divSetting.classList.remove("hidden");
        divExecute.classList.add("hidden");
    }
    else {
        divExecute.classList.remove("hidden");
        divSetting.classList.add("hidden");
    }
});
next[1].addEventListener("click", function (e) {
    e.preventDefault();
    if (divSetting.classList.contains("hidden")) {
        divSetting.classList.remove("hidden");
        divExecute.classList.add("hidden");
    }
    else {
        divExecute.classList.remove("hidden");
        divSetting.classList.add("hidden");
    }
});
knowledge_base_file.addEventListener("change", function (e) {
    var fileReader = new FileReader();
    if (!knowledge_base_file.files)
        return;
    fileReader.readAsText(knowledge_base_file.files[0]);
    fileReader.addEventListener("loadend", function () {
        knowledge_base_text.value = fileReader.result.trim();
    });
});
var fillKnowledgeBase = function () {
    var _a;
    knowledgeBase.facts = [];
    knowledgeBase.rules = [];
    var newB = knowledge_base_text.value
        .split("but")[0]
        .replace("bf", "")
        .split("br");
    goal = (_a = knowledge_base_text.value.split("but")) === null || _a === void 0 ? void 0 : _a[1].trim();
    newB[0].split(knowledgeStructureInput.value).map(function (e) {
        knowledgeBase.facts.push(e.replace(/\n/g, ""));
    });
    newB[1]
        .replace(/\r/g, "")
        .split("\n")
        .map(function (e) {
        if (!e)
            return;
        knowledgeBase.rules.push(__spreadArray(__spreadArray([], e
            .split(expressionSignInput.value)[0]
            .split(knowledgeStructureInput.value), true), [
            e.split(expressionSignInput.value)[1],
        ], false));
    });
};
execute_button.addEventListener("click", function () {
    execution_steps.value = "";
    fillKnowledgeBase();
    if (document.getElementById("avant").checked) {
        // avant
        if (document.getElementById("depth_first").checked) {
            // avant avec profondeur
            console.log("pAv");
            forwardChainDFS([], []);
        }
        else {
            // avant avec largeur
            console.log("lAv");
            forwardChainBFS([], []);
        }
    }
    else {
        // arrière
        if (document.getElementById("depth_first").checked) {
            // arrière avec profondeur
            console.log("pA");
            backwardChainDFS(goal);
        }
        else {
            console.log("lA");
            backwardChainBFS(knowledgeBase, goal);
            // arrière avec largeur
        }
    }
});
function getRegleForword(visited) {
    return __spreadArray([], knowledgeBase.rules.filter(function (rule) {
        return (rule
            .slice(0, -1)
            .every(function (subRule) { return knowledgeBase.facts.includes(subRule); }) &&
            !visited.includes(rule.toString()));
    }), true);
}
var sleep = function (time) {
    if (time === void 0) { time = 1500; }
    return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, time); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
function forwardChainDFS(conflit, visited, etap) {
    var _a;
    if (etap === void 0) { etap = 1; }
    return __awaiter(this, void 0, void 0, function () {
        var newRegle;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (knowledgeBase.facts.includes(goal)) {
                        return [2 /*return*/];
                    }
                    newRegle = getRegleForword(visited);
                    if (!newRegle.length && !conflit.length) {
                        execution_steps.value += "".concat(goal, " non d\u00E9termin\u00E9");
                        return [2 /*return*/];
                    }
                    if (algoOfConflit[0].checked) {
                        conflit = __spreadArray(__spreadArray([], conflit, true), newRegle, true);
                    }
                    else if (algoOfConflit[1].checked) {
                        conflit = __spreadArray(__spreadArray([], newRegle.reverse(), true), conflit, true);
                    }
                    else {
                        // Handle other cases if needed
                        conflit = __spreadArray([], knowledgeBase.rules.filter(function (rule) {
                            return newRegle.findIndex(function (regle) { return regle.toString() == rule.toString(); }) >
                                -1 || conflit.findIndex(function (r) { return rule.toString() == r.toString(); }) > -1;
                        }), true);
                    }
                    visited = __spreadArray(__spreadArray([], visited, true), conflit.map(function (rule) { return rule.toString(); }), true);
                    if (!!knowledgeBase.facts.includes(conflit[0][((_a = conflit[0]) === null || _a === void 0 ? void 0 : _a.length) - 1])) return [3 /*break*/, 5];
                    if (!engine_speed[1].checked) return [3 /*break*/, 2];
                    return [4 /*yield*/, sleep(750)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 2:
                    if (!engine_speed[2].checked) return [3 /*break*/, 4];
                    return [4 /*yield*/, sleep()];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    knowledgeBase.facts.push(conflit[0][conflit[0].length - 1]);
                    execution_steps.value += "\u00E9tape ".concat(etap, ": conflit[");
                    conflit.map(function (rule) {
                        execution_steps.value += "".concat(rule.slice(0, -1).toString(), "=>").concat(rule[rule.length - 1], ",");
                    });
                    execution_steps.value += "]\n";
                    execution_steps.value +=
                        "on choisit " +
                            conflit[0].slice(0, -1).toString() +
                            "=>" +
                            conflit[0][conflit[0].length - 1] +
                            "\n";
                    execution_steps.value += "BF=[" + knowledgeBase.facts + "]\n";
                    _b.label = 5;
                case 5:
                    knowledgeBase.rules = knowledgeBase.rules.filter(function (rule) { return rule.toString() != conflit[0].toString(); });
                    conflit.shift();
                    forwardChainDFS(conflit, visited, etap + 1);
                    return [2 /*return*/];
            }
        });
    });
}
// Forward chaining algorithm with breadth-first search
function forwardChainBFS(conflit, visited, etap) {
    if (etap === void 0) { etap = 1; }
    // Implement BFS logic here
    if (knowledgeBase.facts.includes(goal)) {
        return;
    }
    var newRegle = getRegleForword(visited);
    if (!newRegle.length && !conflit.length) {
        execution_steps.value += "".concat(goal, " non d\u00E9termin\u00E9");
        return;
    }
    if (algoOfConflit[0].checked) {
        conflit = __spreadArray(__spreadArray([], conflit, true), newRegle, true);
    }
    else if (algoOfConflit[1].checked) {
        conflit = __spreadArray(__spreadArray([], newRegle.reverse(), true), conflit, true);
    }
    else {
        // Handle other cases if needed
        conflit = __spreadArray([], knowledgeBase.rules.filter(function (rule) {
            return newRegle.findIndex(function (regle) { return regle.toString() == rule.toString(); }) >
                -1 || conflit.findIndex(function (r) { return rule.toString() == r.toString(); }) > -1;
        }), true);
    }
    visited = __spreadArray(__spreadArray([], visited, true), conflit.map(function (rule) { return rule.toString(); }), true);
    var _loop_1 = function (rule) {
        if (!knowledgeBase.facts.includes(rule[(rule === null || rule === void 0 ? void 0 : rule.length) - 1])) {
            knowledgeBase.facts.push(rule[rule.length - 1]);
            execution_steps.value += "\u00E9tape ".concat(etap, ": conflit[");
            conflit.map(function (rule) {
                execution_steps.value += "".concat(rule.slice(0, -1).toString(), "=>").concat(rule[rule.length - 1], ",");
            });
            execution_steps.value += "]\n";
            execution_steps.value +=
                "on choisit " +
                    rule.slice(0, -1).toString() +
                    "=>" +
                    rule[rule.length - 1] +
                    "\n";
            execution_steps.value += "BF=[" + knowledgeBase.facts + "]\n";
        }
        knowledgeBase.rules = knowledgeBase.rules.filter(function (r) { return r.toString() != rule.toString(); });
    };
    for (var _i = 0, conflit_1 = conflit; _i < conflit_1.length; _i++) {
        var rule = conflit_1[_i];
        _loop_1(rule);
    }
    conflit = [];
    forwardChainBFS(conflit, visited, etap + 1);
}
function getRegleBackward(char) {
    var result = knowledgeBase.rules.filter(function (rule) { return rule[rule.length - 1] == char; });
    return result;
}
function backwardChainBFS(kb, goal) {
    // Implement backward chaining with BFS logic here
}
function backwardChainDFS(char) {
    // Implement backward chaining with DFS logic here
    if (knowledgeBase.facts.includes(char))
        return true;
    var conflit = getRegleBackward(char);
    if (conflit.length == 0)
        return false;
    var _loop_2 = function (rule) {
        var ldp = rule.filter(function (r, i) { return i + 1 != rule.length; });
        printBackword(conflit, ldp);
        if (ldp.every(function (c) {
            if (knowledgeBase.facts.includes(c))
                return true;
            return backwardChainDFS(c);
        }))
            return { value: true };
    };
    for (var _i = 0, conflit_2 = conflit; _i < conflit_2.length; _i++) {
        var rule = conflit_2[_i];
        var state_1 = _loop_2(rule);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
var printBackword = function (conflit, ldp, etap) {
    execution_steps.value += "\u00E9tape : conflit[";
    conflit.map(function (rule) {
        execution_steps.value += "".concat(rule.slice(0, -1).toString(), "=>").concat(rule[rule.length - 1], ",");
    });
    execution_steps.value += "]\n";
    execution_steps.value += "ldp=[".concat(ldp.toString(), "]\n");
};
