(function () {
  var subjects = {
    networking: {
      groups: [
        {
          name: "Foundations",
          items: [
            { href: "index.html", label: "Home" },
            { href: "osi-layers.html", label: "OSI / TCP-IP" },
            { href: "subnetting.html", label: "Subnetting" },
            { href: "tcp-handshake.html", label: "TCP Handshake" },
            { href: "dns-resolution.html", label: "DNS Resolution" },
            { href: "linux-networking.html", label: "Linux Netns" }
          ]
        },
        {
          name: "Deep Dives & Orchestration",
          items: [
            { href: "l3-routing.html", label: "L3 Routing" },
            { href: "firewalls.html", label: "Firewalls" },
            { href: "l4-tcp-udp.html", label: "L4 TCP/UDP" },
            { href: "l7-protocols.html", label: "L7 HTTP+" },
            { href: "container-networking.html", label: "Containers" },
            { href: "kubernetes-networking.html", label: "Kubernetes" }
          ]
        }
      ]
    }
  };

  var segments = location.pathname.split("/").filter(Boolean);
  var current = segments[segments.length - 1] || "index.html";
  // Current subject is the folder name directly above the current file, if
  // that folder name is a key in `subjects` -- e.g. ".../networking/foo.html".
  var subjectKey = segments.length >= 2 ? segments[segments.length - 2] : null;
  var subject = subjectKey && subjects[subjectKey] ? subjects[subjectKey] : null;
  var brandPrefix = subject ? "../" : "";

  function renderGroup(group) {
    var itemsHtml = group.items
      .map(function (p) {
        var active = p.href === current ? " active" : "";
        return '<a href="' + p.href + '" class="' + active.trim() + '">' + p.label + "</a>";
      })
      .join("");
    return '<span class="site-nav-group-label">' + group.name + "</span>" + itemsHtml;
  }

  var linksHtml = subject
    ? '<div class="site-nav-links">' + subject.groups.map(renderGroup).join('<span class="site-nav-divider"></span>') + "</div>"
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
