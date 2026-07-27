class SPA {
  routes = [];

  constructor(config = {}) {
    this.context = {
      root: config?.root || document.getElementById("app"),
      redirect: this.redirect.bind(this),
    };

    this.defaultRoute = {
      key: "*",
      callback: (config?.defaultRoute || (() => { })).bind(this.context),
    };
  }

  add(path, cb) {
    this.routes.push({
      key: path,
      callback: cb.bind(this.context),
    });
  }

  get(path) {
    const route = this.routes.find(
      (r) => (r.key instanceof RegExp && r.key.test(path)) || r.key === path,
    );
    return route || this.defaultRoute;
  }

  execute(path) {
    const route = this.get(path);
    let params;

    if (route?.key && route?.key instanceof RegExp) {
      params = route.key.exec(window.location.pathname);

      if (params?.groups && Object.keys(params?.groups).length > 0) {
        params = params.groups;
      } else {
        params = Array.from(params);
        params?.shift();
      }
    }

    route?.callback(params);
  }

  setDefault(cb) {
    this.defaultRoute = {
      key: "*",
      callback: cb,
    };
  }

  redirect(url) {
    history.pushState({}, "", url);
    this.execute(window.location.pathname);
  }

  handleClick(e) {
    try {
      const targetUrl = new URL(e.target.href);
      const target = e.target.getAttribute("target") || "_self";

      if (targetUrl.origin === window.location.origin && target === "_self") {
        e.preventDefault();
        history.pushState({}, "", e.target.href);
        this.execute(window.location.pathname);

        // simulate scroll into
        if (targetUrl.hash) {
          const focusElem = document.querySelector(targetUrl.hash);
          focusElem &&
            setTimeout(
              focusElem.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              }),
              500,
            );
        }
      }
    } catch (err) {
      console.error("spa: cannot parse target href", err);
    }
  }

  handleRouteChanges() {
    window.addEventListener("popstate", () => {
      this.execute(window.location.pathname);
    });

    const observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        mutation?.addedNodes?.forEach((e) => {
          if (e.nodeName.toLowerCase() === "a") {
            e.addEventListener("click", this.handleClick.bind(this));
          } else {
            // find any links in the container
            if (
              typeof e === "object" &&
              typeof e.getElementsByTagName !== "undefined"
            ) {
              const as = e.getElementsByTagName("a");

              for (let i = 0; i < as.length; i++) {
                as[i].addEventListener("click", this.handleClick.bind(this));
              }
            }
          }
        });
      });
    });

    observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    this.execute(window.location.pathname);
  }
}

export default SPA;
