/**
 * Inject subtitle menu element to jwplayer
 * @typedef {Object} Subtitle
 * @property {string} lang
 * @property {string} url
 * @param {(subtitle: Subtitle | undefined) => void} onChangeSub
 */
export function injectMenuSubElement(onChangeSub) {
  function renderMenuContent() {
    const root = document.createElement("div");
    root.classList.add("jw-reset", "jw-settings-menu");
    root.style.display = "none";
    document.querySelector(".jw-controls").appendChild(root);

    /**
     * @type {{label: string, id: string}[]}
     */
    const captionsList = window.jw().getCaptionsList();
    const arr = captionsList
      .filter(({ id }) => id.includes("https"))
      .map((i) => {
        return {
          lang: i.label,
          url: i.id,
        };
      });

    const container = document.createElement("div");
    container.className = "jw-reset jw-settings-submenu jw-settings-submenu-active";
    const wrapper = document.createElement("div");
    wrapper.className = "jw-reset jw-settings-submenu-items";
    container.appendChild(wrapper);

    renderMenuItem(arr);

    /**
     *
     * @param {{lang: string;url: string;}[]} arr
     * @param {string | undefined} selected
     */
    function renderMenuItem(arr, selected) {
      wrapper.innerHTML = "";

      const btnOff = document.createElement("button");
      btnOff.type = "button";
      btnOff.innerText = "Off";
      btnOff.className = "jw-reset-text jw-settings-content-item";
      if (!selected) {
        btnOff.className += " jw-settings-item-active";
      }
      btnOff.onclick = function () {
        renderMenuItem(arr);
        onChangeSub(undefined);
        root.style.display = "none";
      };
      wrapper.appendChild(btnOff);
      arr.forEach((i) => {
        const button = document.createElement("button");
        button.className = "jw-reset-text jw-settings-content-item";
        button.innerText = i.lang;
        if (selected === i.lang) {
          button.classList.add("jw-settings-item-active");
        }
        button.addEventListener("click", function () {
          if (selected !== i.lang) {
            renderMenuItem(arr, i.lang);
            onChangeSub(i);
            root.style.display = "none";
          }
        });
        wrapper.appendChild(button);
      });
    }

    root.appendChild(container);

    return root;
  }

  const container = renderMenuContent();
  window
    .jw()
    .addButton(
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuOTQgOS43OEM5LjcgOS43NiA5LjQ2IDkuODUgOS4yOCAxMC4wMUM5LjExIDEwLjE4IDkuMDMgMTAuNDIgOS4wNCAxMC42NlYxMy4yMkM5LjA0IDE0LjE4IDEwLjIgMTQuMzYgMTAuODEgMTMuNzdDMTAuODggMTMuNyAxMC45NiAxMy42MiAxMS4wNSAxMy41NEwxMS43MSAxNC4zMkMxMS40OSAxNC41NiAxMS4yMSAxNC43NiAxMC45MSAxNC45QzEwLjExIDE1LjI1IDkuMTggMTUuMTQgOC40OCAxNC42MUM4LjA5IDE0LjI1IDcuODkgMTMuNzQgNy45MyAxMy4yMVYxMC42NUM3LjkzIDEwLjM4IDcuOTggMTAuMTIgOC4wOCA5Ljg3QzguMTcgOS42NSA4LjMyIDkuNDQgOC41IDkuMjhDOS4wNyA4LjgzIDkuODIgOC42NiAxMC41MyA4LjgyQzEwLjg2IDguODcgMTEuMTYgOS4wMiAxMS40IDkuMjVDMTEuNTMgOS4zOCAxMS42NSA5LjUxIDExLjc1IDkuNjdMMTEuMDQgMTAuMzZDMTAuNzkgMTAgMTAuMzggOS43OCA5Ljk0IDkuNzhaTTE0LjQxIDkuNzhDMTQuMTcgOS43NiAxMy45MyA5Ljg1IDEzLjc1IDEwLjAxQzEzLjU4IDEwLjE4IDEzLjUgMTAuNDIgMTMuNTEgMTAuNjZWMTMuMjJDMTMuNTEgMTQuMTggMTQuNjcgMTQuMzYgMTUuMjggMTMuNzdDMTUuMzUgMTMuNyAxNS40MyAxMy42MiAxNS41MiAxMy41NEwxNi4xOCAxNC4zMkMxNS45NiAxNC41NiAxNS42OCAxNC43NiAxNS4zOCAxNC45QzE0LjU4IDE1LjI1IDEzLjY1IDE1LjE0IDEyLjk1IDE0LjYxQzEyLjU2IDE0LjI1IDEyLjM2IDEzLjc0IDEyLjQgMTMuMjFWMTAuNjVDMTIuNCAxMC4zOCAxMi40NSAxMC4xMiAxMi41NSA5Ljg3QzEyLjY0IDkuNjUgMTIuNzkgOS40NCAxMi45NyA5LjI4QzEzLjU0IDguODMgMTQuMjkgOC42NiAxNSA4LjgyQzE1LjMzIDguODcgMTUuNjMgOS4wMiAxNS44NyA5LjI1QzE2IDkuMzggMTYuMTIgOS41MSAxNi4yMiA5LjY3TDE1LjUxIDEwLjM2QzE1LjI2IDEwIDE0Ljg1IDkuNzggMTQuNDEgOS43OFpNMjAgNlYxOEg0VjZIMjBaTTIxLjUgNEgyLjVDMi4yMyA0IDIgNC4yMiAyIDQuNVYxOS41QzIgMTkuNzcgMi4yMiAyMCAyLjUgMjBIMjEuNUMyMS43NyAyMCAyMiAxOS43OCAyMiAxOS41VjQuNUMyMiA0LjIyIDIxLjc4IDQgMjEuNSA0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
      "Subtitles 2 by Nihta",
      function () {
        if (container.style.display === "none") {
          container.style.display = "block";
        } else {
          container.style.display = "none";
        }
      }
    );
}

/**
 * Injects a stylesheet into the document head.
 * @param {string[]} links
 */
export function injectStyleSheet(links) {
  links.forEach((link) => {
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = link;
    document.head.appendChild(linkEl);
  });
}
