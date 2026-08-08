(function () {
  var content = window.CONTENT || [];
  var segments = location.pathname.split("/").filter(Boolean);
  var current = segments[segments.length - 1] || "index.html";
  // Current subject is the folder name directly above the current file, if
  // any CONTENT entries live there -- e.g. ".../networking/foo.html".
  var folder = segments.length >= 2 ? segments[segments.length - 2] : null;

  var folderItems = folder
    ? content.filter(function (entry) { return entry.path.indexOf(folder + "/") === 0; })
    : [];
  var isSubject = folderItems.length > 0;
  var brandPrefix = isSubject ? "../" : "";

  function buildGroups() {
    var groups = [];
    var byName = {};
    folderItems.forEach(function (entry) {
      var name = entry.group || "";
      if (!byName[name]) {
        byName[name] = { name: name, items: [] };
        groups.push(byName[name]);
      }
      byName[name].items.push({ href: entry.path.slice(folder.length + 1), label: entry.navLabel });
    });
    // The current folder's own index.html isn't in CONTENT -- synthesize a
    // "Home" link as the first item of the first group, same spot it held
    // when this nav was hardcoded per subject.
    if (groups.length > 0) {
      groups[0].items.unshift({ href: "index.html", label: "Home" });
    }
    return groups;
  }

  function renderGroup(group) {
    var itemsHtml = group.items
      .map(function (p) {
        var active = p.href === current ? " active" : "";
        return '<a href="' + p.href + '" class="' + active.trim() + '">' + p.label + "</a>";
      })
      .join("");
    return '<span class="site-nav-group-label">' + group.name + "</span>" + itemsHtml;
  }

  var linksHtml = isSubject
    ? '<div class="site-nav-links">' + buildGroups().map(renderGroup).join('<span class="site-nav-divider"></span>') + "</div>"
    : "";

  var nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.innerHTML =
    '<div class="site-nav-inner">' +
    '<a class="site-nav-brand" href="' + brandPrefix + 'index.html">Mastering</a>' +
    linksHtml +
    "</div>";

  var mount = document.getElementById("site-nav");
  if (mount) {
    mount.replaceWith(nav);
  } else {
    document.body.insertBefore(nav, document.body.firstChild);
  }
})();
