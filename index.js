export const App = {
  elements: {},

  start: () => {
    App.createUI();
    App.loadCurrentState();
  },

  createUI: () => {
    App.elements.main = document.querySelector("main");
    App.elements.statList = document.createElement("ul");
    App.elements.statList.classList.add("stat-list");
    App.elements.addStat = document.createElement("button");
    App.elements.addStat.classList.add("add-stat");
    App.elements.addStat.innerHTML = "Add Stat";
    App.elements.addStat.addEventListener("click", () => {
      App.elements.statList.append(App.createStat());
      App.saveCurrentState();
    });
    App.elements.main.append(App.elements.statList, App.elements.addStat);
  },

  createStat: (name = "", value = 0) => {
    const id = crypto.randomUUID();
    if (App.elements.stats == null) {
      App.elements.stats = {};
    }
    App.elements.stats[id] = document.createElement("li");
    App.elements.stats[id].classList.add("stat");
    const statName = document.createElement("input");
    statName.classList.add("stat-name");
    statName.type = "text";
    statName.value = name;
    statName.addEventListener("input", () => {
      App.saveCurrentState();
    });
    statName.addEventListener("change", () => {
      App.saveCurrentState();
    });
    const statValue = document.createElement("input");
    statValue.classList.add("stat-value");
    statValue.type = "number";
    statValue.value = value;
    statValue.addEventListener("input", () => {
      App.saveCurrentState();
    });
    statValue.addEventListener("change", () => {
      App.saveCurrentState();
    });
    const statMinus = document.createElement("button");
    statMinus.classList.add("stat-minus");
    statMinus.innerHTML = "-";
    statMinus.addEventListener("click", () => {
      statValue.value = parseInt(statValue.value) - 1;
      statValue.dispatchEvent(new Event("input"));
    });
    const statPlus = document.createElement("button");
    statPlus.classList.add("stat-plus");
    statPlus.innerHTML = "+";
    statPlus.addEventListener("click", () => {
      statValue.value = parseInt(statValue.value) + 1;
      statValue.dispatchEvent(new Event("input"));
    });
    const statReset = document.createElement("button");
    statReset.classList.add("stat-reset");
    statReset.innerHTML = "Reset";
    statReset.addEventListener("click", () => {
      statValue.value = 0;
      statValue.dispatchEvent(new Event("input"));
    });
    const statDelete = document.createElement("button");
    statDelete.classList.add("stat-delete");
    statDelete.innerHTML = "Delete";
    statDelete.addEventListener("click", () => {
      App.elements.statList.removeChild(App.elements.stats[id]);
      delete App.elements.stats[id];
      App.saveCurrentState();
    });
    App.elements.stats[id].append(
      statName,
      statMinus,
      statValue,
      statPlus,
      statReset,
      statDelete,
    );
    return App.elements.stats[id];
  },

  calculateCurrentState: () => {
    return Object.entries(App.elements.stats ?? {}).reduce(
      (state, [id, stat]) => {
        state[id] = {
          name: stat.querySelector(".stat-name")?.value,
          value: parseInt(stat.querySelector(".stat-value")?.value),
        };
        return state;
      },
      {},
    );
  },

  saveCurrentState: () => {
    const state = App.calculateCurrentState();
    localStorage.setItem("stats", JSON.stringify(state));
  },

  loadCurrentState: () => {
    const state = localStorage.getItem("stats");
    if (state) {
      Object.entries(JSON.parse(state)).forEach(([id, stat]) => {
        console.log(id, stat);
        if (App.elements.stats?.[id] == null) {
          App.elements.statList.append(App.createStat(stat.name, stat.value));
        } else {
          const statName = App.elements.stats[id].querySelector(".stat-name");
          const statValue = App.elements.stats[id].querySelector(".stat-value");
          statName.value = stat.name;
          statValue.value = stat.value;
          statName.dispatchEvent(new Event("input"));
          statValue.dispatchEvent(new Event("input"));
        }
      });
    } else {
      App.elements.statList.append(App.createStat());
    }
  },
};
