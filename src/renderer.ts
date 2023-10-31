const knowledgeStructureInput = document.getElementById(
  "letters_between"
) as HTMLInputElement;
const expressionSignInput = document.getElementById(
  "expression_sign"
) as HTMLInputElement;
const divSetting = document.getElementById("divSetting") as HTMLElement;
const divExecute = document.getElementById("divExecute") as HTMLElement;
const next = document.getElementsByClassName(
  "next"
) as HTMLCollectionOf<HTMLElement>;
const knowledge_base_file = document.getElementById(
  "knowledge_base_file"
) as HTMLInputElement;
const knowledge_base_text = document.getElementById(
  "knowledge_base_text"
) as HTMLInputElement;
const execute_button = document.getElementById(
  "execute_button"
) as HTMLButtonElement;
const execution_steps = document.getElementById(
  "execution_steps"
) as HTMLTextAreaElement;
const algoOfConflit = document.getElementsByName(
  "conflit"
) as NodeListOf<HTMLInputElement>;
const engine_speed = document.getElementsByName(
  "engine_speed"
) as NodeListOf<HTMLInputElement>;
interface KnowledgeBase {
  facts: string[];
  rules: string[][];
}

let knowledgeBase: KnowledgeBase = {
  facts: [],
  rules: [],
};

let goal: string;

// Set default values for the inputs
knowledgeStructureInput.value = ",";
expressionSignInput.value = "=>";

// Set default values for radio buttons
(document.getElementById("avant") as HTMLInputElement).checked = true;
(document.getElementById("depth_first") as HTMLInputElement).checked = true;
algoOfConflit[0].checked = true;
engine_speed[0].checked = true;
next[0].addEventListener("click", (e) => {
  e.preventDefault();
  if (divSetting.classList.contains("hidden")) {
    divSetting.classList.remove("hidden");
    divExecute.classList.add("hidden");
  } else {
    divExecute.classList.remove("hidden");
    divSetting.classList.add("hidden");
  }
});

next[1].addEventListener("click", (e) => {
  e.preventDefault();
  if (divSetting.classList.contains("hidden")) {
    divSetting.classList.remove("hidden");
    divExecute.classList.add("hidden");
  } else {
    divExecute.classList.remove("hidden");
    divSetting.classList.add("hidden");
  }
});

knowledge_base_file.addEventListener("change", (e) => {
  const fileReader = new FileReader();
  if (!knowledge_base_file.files) return;
  fileReader.readAsText(knowledge_base_file.files[0]);
  fileReader.addEventListener("loadend", () => {
    knowledge_base_text.value = (fileReader.result as string).trim();
  });
});

const fillKnowledgeBase = () => {
  knowledgeBase.facts = [];
  knowledgeBase.rules = [];
  const newB = knowledge_base_text.value
    .split("but")[0]
    .replace("bf", "")
    .split("br");
  goal = knowledge_base_text.value.split("but")?.[1].trim();
  newB[0].split(knowledgeStructureInput.value).map((e) => {
    knowledgeBase.facts.push(e.replace(/\n/g, ""));
  });
  newB[1]
    .replace(/\r/g, "")
    .split("\n")
    .map((e) => {
      if (!e) return;
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
  if ((document.getElementById("avant") as HTMLInputElement).checked) {
    // avant
    if ((document.getElementById("depth_first") as HTMLInputElement).checked) {
      // avant avec profondeur
      console.log("pAv");
      forwardChainDFS([], []);
    } else {
      // avant avec largeur
      console.log("lAv");
      forwardChainBFS([], []);
    }
  } else {
    // arrière
    if ((document.getElementById("depth_first") as HTMLInputElement).checked) {
      // arrière avec profondeur
      console.log("pA");
      backwardChainDFS(goal);
    } else {
      console.log("lA");
      // backwardChainBFS(knowledgeBase, goal);
      // arrière avec largeur
    }
  }
});

function getRegleForword(visited: string[]): string[][] {
  return [
    ...knowledgeBase.rules.filter((rule) => {
      return (
        rule
          .slice(0, -1)
          .every((subRule) => knowledgeBase.facts.includes(subRule)) &&
        !visited.includes(rule.toString())
      );
    }),
  ];
}
const sleep = async (time: number = 1500): Promise<unknown> => {
  return await new Promise((resolve) => setTimeout(resolve, time));
};
async function forwardChainDFS(
  conflit: string[][],
  visited: string[],
  etap: number = 1
) {
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
  } else if (algoOfConflit[1].checked) {
    conflit = [...newRegle.reverse(), ...conflit];
  } else {
    // Handle other cases if needed
    conflit = [
      ...knowledgeBase.rules.filter(
        (rule) =>
          newRegle.findIndex((regle) => regle.toString() == rule.toString()) >
            -1 || conflit.findIndex((r) => rule.toString() == r.toString()) > -1
      ),
    ];
  }
  visited = [...visited, ...conflit.map((rule) => rule.toString())];
  if (!knowledgeBase.facts.includes(conflit[0][conflit[0]?.length - 1])) {
    if (engine_speed[1].checked) {
      await sleep(750);
    } else if (engine_speed[2].checked) {
      await sleep();
    }
    knowledgeBase.facts.push(conflit[0][conflit[0].length - 1]);
    execution_steps.value += `étape ${etap}: conflit[`;
    conflit.map((rule) => {
      execution_steps.value += `${rule.slice(0, -1).toString()}=>${
        rule[rule.length - 1]
      },`;
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
  knowledgeBase.rules = knowledgeBase.rules.filter(
    (rule) => rule.toString() != conflit[0].toString()
  );
  conflit.shift();
  forwardChainDFS(conflit, visited, etap + 1);
}

// Forward chaining algorithm with breadth-first search
function forwardChainBFS(
  conflit: string[][],
  visited: string[],
  etap: number = 1
) {
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
  } else if (algoOfConflit[1].checked) {
    conflit = [...newRegle.reverse(), ...conflit];
  } else {
    // Handle other cases if needed
    conflit = [
      ...knowledgeBase.rules.filter(
        (rule) =>
          newRegle.findIndex((regle) => regle.toString() == rule.toString()) >
            -1 || conflit.findIndex((r) => rule.toString() == r.toString()) > -1
      ),
    ];
  }
  visited = [...visited, ...conflit.map((rule) => rule.toString())];
  for (const [index, rule] of conflit.entries()) {
    if (!knowledgeBase.facts.includes(rule[rule?.length - 1])) {
      knowledgeBase.facts.push(rule[rule.length - 1]);
      if (index == 0) {
        execution_steps.value += `étape ${etap}: conflit[`;
        conflit.map((rule) => {
          execution_steps.value += `${rule.slice(0, -1).toString()}=>${
            rule[rule.length - 1]
          },`;
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
    knowledgeBase.rules = knowledgeBase.rules.filter(
      (r) => r.toString() != rule.toString()
    );
  }
  conflit = [];
  forwardChainBFS(conflit, visited, etap + 1);
}
function getRegleBackward(char: string): string[][] {
  const result = knowledgeBase.rules.filter(
    (rule) => rule[rule.length - 1] == char
  );
  return result;
}
function getRegleBackwardBFS(chars: string[]): string[][][] {
  return chars.map((char) =>
    knowledgeBase.rules.filter((rule) => rule[rule.length - 1] == char)
  );
}
function backwardChainBFS(chars: string[]): boolean {
  // Implement backward chaining with DFS logic here
  const chars2 = chars.filter((char) => knowledgeBase.facts.includes(char));
  if (chars2.length == chars.length) {
    return true;
  }
  chars = chars.filter((char) => !knowledgeBase.facts.includes(char));
  // if (chars.length == 0) {
  // return false;
  //}
  let conflit = getRegleBackwardBFS(chars);
  if (conflit.length == 0) return false;
  conflit.every((rules) => {
    for (const rule of rules) {
      let ldp = rule.filter((r, i) => i + 1 != rule.length);
      if (
        ldp.every((c) => {
          if (knowledgeBase.facts.includes(c)) return true;
          return backwardChainDFS(c);
        })
      )
        return true;
    }
  });

  return false;
}

function backwardChainDFS(char: string): boolean {
  // Implement backward chaining with DFS logic here
  if (knowledgeBase.facts.includes(char)) return true;
  let conflit = getRegleBackward(char);
  if (conflit.length == 0) return false;
  for (const rule of conflit) {
    let ldp = rule.filter((r, i) => i + 1 != rule.length);
    printBackword(conflit, ldp);
    if (
      ldp.every((c) => {
        if (knowledgeBase.facts.includes(c)) return true;
        return backwardChainDFS(c);
      })
    )
      return true;
  }
  return false;
}
const printBackword = (conflit: string[][], ldp: string[], etap?: number) => {
  execution_steps.value += `étape : conflit[`;
  conflit.map((rule) => {
    execution_steps.value += `${rule.slice(0, -1).toString()}=>${
      rule[rule.length - 1]
    },`;
  });
  execution_steps.value += "]\n";
  execution_steps.value += `ldp=[${ldp.toString()}]\n`;
};
