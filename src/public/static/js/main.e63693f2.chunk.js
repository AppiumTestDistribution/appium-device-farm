(this['webpackJsonpappium-device-plugin-web'] =
  this['webpackJsonpappium-device-plugin-web'] || []).push([
  [0],
  {
    25: function (e, c, t) {},
    26: function (e, c, t) {},
    32: function (e, c, t) {},
    36: function (e, c, t) {
      'use strict';
      t.r(c);
      var i = t(0),
        n = t.n(i),
        s = t(4),
        j = t.n(s),
        l = (t(25), t(26), t(13)),
        d = t(5),
        r = t(7),
        b = t(43),
        h = t(42),
        a = (t(32), t(33), t(18)),
        o = t(2),
        x = function (e) {
          var c = e.device,
            t = c.platform,
            i = c.name,
            n = c.udid,
            s = c.busy,
            j = c.sdk,
            l = c.realDevice;
          return Object(o.jsx)('div', {
            children: Object(o.jsxs)('div', {
              class:
                'd-flex flex-row bd-highlight mb-1 justify-content-between device-row ml-2 mr-2',
              children: [
                Object(o.jsx)('div', {
                  class: 'p-2 bd-highlight',
                  children:
                    'android' === t
                      ? Object(o.jsx)(d.a, { icon: a.a, color: 'green' })
                      : Object(o.jsx)(d.a, { icon: a.b }),
                }),
                Object(o.jsx)('div', {
                  class: 'p-2 bd-highlight flex-fill',
                  children: Object(o.jsx)(b.a, {
                    placement: 'bottom',
                    overlay: Object(o.jsx)(h.a, {
                      id: 'tooltip-bottom',
                      children: n,
                    }),
                    children: Object(o.jsx)('div', {
                      children: i ? ''.concat(i, ' (SDK - ').concat(j, ')') : n,
                    }),
                  }),
                }),
                Object(o.jsx)('div', {
                  class: 'p-2 bd-highlight',
                  children: l
                    ? Object(o.jsxs)('div', {
                        children: [
                          Object(o.jsx)(d.a, { icon: r.b, color: 'grey' }),
                          Object(o.jsx)('span', {
                            className: 'text-muted',
                            children: '\xa0Mobile',
                          }),
                        ],
                      })
                    : Object(o.jsxs)('div', {
                        children: [
                          Object(o.jsx)(d.a, { icon: r.a, color: 'grey' }),
                          Object(o.jsx)('span', {
                            className: 'text-muted',
                            children: '\xa0Emulated',
                          }),
                        ],
                      }),
                }),
                Object(o.jsx)('div', {
                  class: 'p-2 bd-highlight',
                  children: s
                    ? Object(o.jsxs)('div', {
                        children: [
                          Object(o.jsx)(d.a, { icon: r.b, color: 'red' }),
                          Object(o.jsx)('span', {
                            className: 'text-danger',
                            children: '\xa0Busy',
                          }),
                        ],
                      })
                    : Object(o.jsxs)('div', {
                        children: [
                          Object(o.jsx)(d.a, { icon: r.b, color: 'green' }),
                          Object(o.jsx)('span', {
                            className: 'text-success',
                            children: '\xa0Free',
                          }),
                        ],
                      }),
                }),
              ],
            }),
          });
        },
        u = function (e) {
          var c = e.devices;
          return Object(o.jsx)('div', {
            children: c.map(function (e) {
              return Object(o.jsx)(x, { device: e });
            }),
          });
        },
        O = function () {
          var e = Object(i.useState)(!0),
            c = Object(l.a)(e, 2),
            t = c[0],
            n = c[1],
            s = Object(i.useState)([]),
            j = Object(l.a)(s, 2),
            b = j[0],
            h = j[1],
            a = Object(i.useState)(''),
            x = Object(l.a)(a, 2),
            O = x[0],
            g = x[1];
          return (
            Object(i.useEffect)(function () {
              fetch('./sample.json')
                .then(function (e) {
                  return e.json();
                })
                .then(
                  function (e) {
                    n(!1), h(e);
                  },
                  function (e) {
                    n(!1), g(!0);
                  }
                );
            }, []),
            t
              ? Object(o.jsxs)('div', {
                  class: 'd-flex flex-column bd-highlight mt-4 text-center',
                  children: [
                    Object(o.jsx)('div', {
                      class: 'p-2 bd-highlight',
                      children: Object(o.jsx)(d.a, {
                        icon: r.d,
                        size: '9x',
                        color: 'green',
                      }),
                    }),
                    Object(o.jsx)('div', {
                      class: 'p-2 bd-highlight',
                      children: 'Loading your devices',
                    }),
                  ],
                })
              : O
              ? Object(o.jsxs)('div', {
                  class: 'd-flex flex-column bd-highlight mb-4 text-center',
                  children: [
                    Object(o.jsx)('div', {
                      class: 'p-2 bd-highlight',
                      children: Object(o.jsx)(d.a, {
                        icon: r.c,
                        size: '9x',
                        color: 'red',
                      }),
                    }),
                    Object(o.jsx)('div', {
                      class: 'p-2 bd-highlight',
                      children: 'Muhahahah Something went wrong',
                    }),
                  ],
                })
              : Object(o.jsx)(u, { devices: b })
          );
        },
        g = function () {
          return Object(o.jsxs)('div', {
            children: [
              Object(o.jsx)('h1', {
                className: 'mb-4 mt-4 ml-2',
                children: 'Appium Device Plugin',
              }),
              Object(o.jsx)(O, {}),
            ],
          });
        },
        v = function (e) {
          e &&
            e instanceof Function &&
            t
              .e(3)
              .then(t.bind(null, 44))
              .then(function (c) {
                var t = c.getCLS,
                  i = c.getFID,
                  n = c.getFCP,
                  s = c.getLCP,
                  j = c.getTTFB;
                t(e), i(e), n(e), s(e), j(e);
              });
        };
      j.a.render(
        Object(o.jsx)(n.a.StrictMode, { children: Object(o.jsx)(g, {}) }),
        document.getElementById('root')
      ),
        v();
    },
  },
  [[36, 1, 2]],
]);
//# sourceMappingURL=main.e63693f2.chunk.js.map
