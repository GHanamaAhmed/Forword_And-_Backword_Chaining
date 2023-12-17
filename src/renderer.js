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
const knowledgeStructureInput = document.getElementById("letters_between");
const expressionSignInput = document.getElementById("expression_sign");
const divSetting = document.getElementById("divSetting");
const divExecute = document.getElementById("divExecute");
const warring = document.getElementById("warring");
const warringText = document.getElementById("warring-text");
const next = document.getElementsByClassName("next");
const knowledge_base_file = document.getElementById("knowledge_base_file");
const knowledge_base_text = document.getElementById("knowledge_base_text");
const execute_button = document.getElementById("execute_button");
const execution_steps = document.getElementById("execution_steps");
const algoOfConflit = document.getElementsByName("conflit");
const engine_speed = document.getElementsByName("engine_speed");
let knowledgeBase = {
    facts: [],
    rules: [],
};
let goal;
// Set default values for the inputs
knowledgeStructureInput.value = ",";
expressionSignInput.value = "=>";
warring.classList.add("hidden");
// Set default values for radio buttons
document.getElementById("avant").checked = true;
document.getElementById("depth_first").checked = true;
algoOfConflit[0].checked = true;
engine_speed[0].checked = true;
next[0].addEventListener("click", (e) => {
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
next[1].addEventListener("click", (e) => {
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
knowledge_base_file.addEventListener("change", (e) => {
    const fileReader = new FileReader();
    if (!knowledge_base_file.files)
        return;
    fileReader.readAsText(knowledge_base_file.files[0]);
    fileReader.addEventListener("loadend", () => {
        knowledge_base_text.value = fileReader.result.trim();
    });
});
function checkFormat(input) {
    if (!input.includes("but")) {
        if (warring.classList.contains("hidden")) {
            warring.classList.remove("hidden");
        }
        warringText.innerHTML = "add but";
    }
    const lines = input.split("\n");
    if (!/^[a-zA-Z](,[a-zA-Z])*$/.test(lines[0])) {
        if (warring.classList.contains("hidden")) {
            warring.classList.remove("hidden");
        }
        warringText.innerHTML = "you forgot bf";
        return false;
    }
    if (lines[1] !== "br") {
        if (warring.classList.contains("hidden")) {
            warring.classList.remove("hidden");
        }
        warringText.innerHTML = "you forgot br";
        return false;
    }
    for (let i = 2; i < lines.length; i++) {
        if (lines[i] === "but") {
            if (i === lines.length - 2) {
                if (!warring.classList.contains("hidden")) {
                    warring.classList.add("hidden");
                }
                return true;
            }
            else {
                if (warring.classList.contains("hidden")) {
                    warring.classList.remove("hidden");
                }
                warringText.innerHTML = "add but";
                return false;
            }
        }
        else if (!/^[a-zA-Z](,[a-zA-Z])*=>[a-zA-Z]$/.test(lines[i])) {
            if (warring.classList.contains("hidden")) {
                warring.classList.remove("hidden");
            }
            warringText.innerHTML =
                "you should write it in the standard format ex : a=>b";
            return false;
        }
    }
    return false;
}
const fillKnowledgeBase = () => {
    var _a;
    knowledgeBase.facts = [];
    knowledgeBase.rules = [];
    checkFormat(knowledge_base_text.value);
    const newB = knowledge_base_text.value
        .split("but")[0]
        .replace("bf", "")
        .split("br");
    goal = (_a = knowledge_base_text.value.split("but")) === null || _a === void 0 ? void 0 : _a[1].trim();
    newB[0].split(knowledgeStructureInput.value).map((e) => {
        knowledgeBase.facts.push(e.replace(/\n/g, ""));
    });
    newB[1]
        .replace(/\r/g, "")
        .split("\n")
        .map((e) => {
        if (!e)
            return;
        knowledgeBase.rules.push([
            ...e
                .split(expressionSignInput.value)[0]
                .split(knowledgeStructureInput.value),
            e.split(expressionSignInput.value)[1],
        ]);
    });
};
execute_button.addEventListener("click", () => {
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
            backwardChainBFS([goal]);
            // arrière avec largeur
        }
    }
});
function getRegleForword(visited) {
    return [
        ...knowledgeBase.rules.filter((rule) => {
            return (rule
                .slice(0, -1)
                .every((subRule) => knowledgeBase.facts.includes(subRule)) &&
                !visited.includes(rule.toString()));
        }),
    ];
}
const sleep = (time = 1500) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve) => setTimeout(resolve, time));
});
function forwardChainDFS(conflit, visited, etap = 1) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (knowledgeBase.facts.includes(goal)) {
            return;
        }
        const newRegle = getRegleForword(visited);
        if (!newRegle.length && !conflit.length) {
            execution_steps.value += `${goal} non déterminé`;
            return;
        }
        if (algoOfConflit[0].checked) {
            conflit = [...conflit, ...newRegle];
        }
        else if (algoOfConflit[1].checked) {
            conflit = [...newRegle.reverse(), ...conflit];
        }
        else {
            // Handle other cases if needed
            conflit = [
                ...knowledgeBase.rules.filter((rule) => newRegle.findIndex((regle) => regle.toString() == rule.toString()) >
                    -1 || conflit.findIndex((r) => rule.toString() == r.toString()) > -1),
            ];
        }
        visited = [...visited, ...conflit.map((rule) => rule.toString())];
        if (!knowledgeBase.facts.includes(conflit[0][((_a = conflit[0]) === null || _a === void 0 ? void 0 : _a.length) - 1])) {
            if (engine_speed[1].checked) {
                yield sleep(750);
            }
            else if (engine_speed[2].checked) {
                yield sleep();
            }
            knowledgeBase.facts.push(conflit[0][conflit[0].length - 1]);
            execution_steps.value += `étape ${etap}: conflit[`;
            conflit.map((rule) => {
                execution_steps.value += `${rule.slice(0, -1).toString()}=>${rule[rule.length - 1]},`;
            });
            execution_steps.value += "]\n";
            execution_steps.value +=
                "on choisit " +
                    conflit[0].slice(0, -1).toString() +
                    "=>" +
                    conflit[0][conflit[0].length - 1] +
                    "\n";
            execution_steps.value += "BF=[" + knowledgeBase.facts + "]\n";
        }
        knowledgeBase.rules = knowledgeBase.rules.filter((rule) => rule.toString() != conflit[0].toString());
        conflit.shift();
        forwardChainDFS(conflit, visited, etap + 1);
    });
}
// Forward chaining algorithm with breadth-first search
function forwardChainBFS(conflit, visited, etap = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implement BFS logic here
        if (knowledgeBase.facts.includes(goal)) {
            return;
        }
        const newRegle = getRegleForword(visited);
        if (!newRegle.length && !conflit.length) {
            execution_steps.value += `${goal} non déterminé`;
            return;
        }
        if (algoOfConflit[0].checked) {
            conflit = [...conflit, ...newRegle];
        }
        else if (algoOfConflit[1].checked) {
            conflit = [...newRegle.reverse(), ...conflit];
        }
        else {
            // Handle other cases if needed
            conflit = [
                ...knowledgeBase.rules.filter((rule) => newRegle.findIndex((regle) => regle.toString() == rule.toString()) >
                    -1 || conflit.findIndex((r) => rule.toString() == r.toString()) > -1),
            ];
        }
        visited = [...visited, ...conflit.map((rule) => rule.toString())];
        for (const [index, rule] of conflit.entries()) {
            if (!knowledgeBase.facts.includes(rule[(rule === null || rule === void 0 ? void 0 : rule.length) - 1])) {
                knowledgeBase.facts.push(rule[rule.length - 1]);
                if (index == 0) {
                    if (engine_speed[1].checked) {
                        yield sleep(750);
                    }
                    else if (engine_speed[2].checked) {
                        yield sleep();
                    }
                    execution_steps.value += `étape ${etap}: conflit[`;
                    conflit.map((rule) => {
                        execution_steps.value += `${rule.slice(0, -1).toString()}=>${rule[rule.length - 1]},`;
                    });
                    execution_steps.value += "]\n";
                }
                execution_steps.value +=
                    "on choisit " +
                        rule.slice(0, -1).toString() +
                        "=>" +
                        rule[rule.length - 1] +
                        "\n";
                execution_steps.value += "BF=[" + knowledgeBase.facts + "]\n";
            }
            knowledgeBase.rules = knowledgeBase.rules.filter((r) => r.toString() != rule.toString());
        }
        conflit = [];
        forwardChainBFS(conflit, visited, etap + 1);
    });
}
function getRegleBackward(char) {
    const result = knowledgeBase.rules.filter((rule) => rule[rule.length - 1] == char);
    return result;
}
function getRegleBackwardBFS(chars) {
    return chars.map((char) => knowledgeBase.rules.filter((rule) => rule[rule.length - 1] == char));
}
function backwardChainBFS(chars) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implement backward chaining with DFS logic here
        const chars2 = chars.filter((char) => knowledgeBase.facts.includes(char));
        if (chars2.length == chars.length) {
            return true;
        }
        chars = chars.filter((char) => !knowledgeBase.facts.includes(char));
        let conflit = getRegleBackwardBFS(chars);
        if (conflit.length == 0)
            return false;
        return conflit.every((rules) => __awaiter(this, void 0, void 0, function* () {
            let ldps = [];
            for (const rule of rules) {
                ldps = [...ldps, rule.filter((r, i) => i + 1 != rule.length)];
            }
            if (ldps.findIndex((c) => __awaiter(this, void 0, void 0, function* () {
                if (engine_speed[1].checked) {
                    yield sleep(750);
                }
                else if (engine_speed[2].checked) {
                    yield sleep();
                }
                printBackwordBFS(conflit, c);
                return c.every((char) => {
                    if (knowledgeBase.facts.includes(char)) {
                        return true;
                    }
                    return backwardChainBFS(c);
                });
            })) >= 0)
                return true;
        }));
    });
}
function backwardChainDFS(char) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implement backward chaining with DFS logic here
        if (knowledgeBase.facts.includes(char))
            return true;
        let conflit = getRegleBackward(char);
        if (conflit.length == 0)
            return false;
        for (const rule of conflit) {
            let ldp = rule.filter((r, i) => i + 1 != rule.length);
            if (engine_speed[1].checked) {
                yield sleep(750);
            }
            else if (engine_speed[2].checked) {
                yield sleep();
            }
            printBackword(conflit, ldp);
            if (ldp.every((c) => {
                if (knowledgeBase.facts.includes(c))
                    return true;
                return backwardChainDFS(c);
            }))
                return true;
        }
        return false;
    });
}
const printBackword = (conflit, ldp, etap) => {
    execution_steps.value += `étape : conflit[`;
    conflit.map((rule) => {
        execution_steps.value += `${rule.slice(0, -1).toString()}=>${rule[rule.length - 1]},`;
    });
    execution_steps.value += "]\n";
    execution_steps.value += `ldp=[${ldp.toString()}]\n`;
};
const printBackwordBFS = (conflit, ldp, etap) => {
    execution_steps.value += `étape : conflit[`;
    conflit.map((rules) => {
        rules.map((rule) => {
            execution_steps.value += `${rule.slice(0, -1).toString()}=>${rule[rule.length - 1]},`;
        });
    });
    execution_steps.value += "]\n";
    execution_steps.value += `ldp=[${ldp.toString()}]\n`;
};
