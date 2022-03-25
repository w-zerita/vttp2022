"use strict";
(self.webpackChunkclient = self.webpackChunkclient || []).push([
  [179],
  {
    338: () => {
      function ee(e) {
        return "function" == typeof e;
      }
      function ni(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const wo = ni(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, i) => `${i + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function ri(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class ct {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const o of n) o.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (ee(r))
              try {
                r();
              } catch (o) {
                t = o instanceof wo ? o.errors : [o];
              }
            const { _finalizers: i } = this;
            if (i) {
              this._finalizers = null;
              for (const o of i)
                try {
                  Qd(o);
                } catch (s) {
                  (t = null != t ? t : []),
                    s instanceof wo ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new wo(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) Qd(t);
            else {
              if (t instanceof ct) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && ri(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && ri(n, t), t instanceof ct && t._removeParent(this);
        }
      }
      ct.EMPTY = (() => {
        const e = new ct();
        return (e.closed = !0), e;
      })();
      const qd = ct.EMPTY;
      function Wd(e) {
        return (
          e instanceof ct ||
          (e && "closed" in e && ee(e.remove) && ee(e.add) && ee(e.unsubscribe))
        );
      }
      function Qd(e) {
        ee(e) ? e() : e.unsubscribe();
      }
      const Vn = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Eo = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = Eo;
            return (null == r ? void 0 : r.setTimeout)
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = Eo;
            return ((null == t ? void 0 : t.clearTimeout) || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Zd(e) {
        Eo.setTimeout(() => {
          const { onUnhandledError: t } = Vn;
          if (!t) throw e;
          t(e);
        });
      }
      function Kd() {}
      const pC = Aa("C", void 0, void 0);
      function Aa(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let Ln = null;
      function bo(e) {
        if (Vn.useDeprecatedSynchronousErrorHandling) {
          const t = !Ln;
          if ((t && (Ln = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = Ln;
            if (((Ln = null), n)) throw r;
          }
        } else e();
      }
      class Sa extends ct {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), Wd(t) && t.add(this))
              : (this.destination = CC);
        }
        static create(t, n, r) {
          return new ii(t, n, r);
        }
        next(t) {
          this.isStopped
            ? Ta(
                (function mC(e) {
                  return Aa("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? Ta(
                (function gC(e) {
                  return Aa("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? Ta(pC, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const vC = Function.prototype.bind;
      function Ia(e, t) {
        return vC.call(e, t);
      }
      class _C {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              Mo(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              Mo(r);
            }
          else Mo(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              Mo(n);
            }
        }
      }
      class ii extends Sa {
        constructor(t, n, r) {
          let i;
          if ((super(), ee(t) || !t))
            i = {
              next: null != t ? t : void 0,
              error: null != n ? n : void 0,
              complete: null != r ? r : void 0,
            };
          else {
            let o;
            this && Vn.useDeprecatedNextContext
              ? ((o = Object.create(t)),
                (o.unsubscribe = () => this.unsubscribe()),
                (i = {
                  next: t.next && Ia(t.next, o),
                  error: t.error && Ia(t.error, o),
                  complete: t.complete && Ia(t.complete, o),
                }))
              : (i = t);
          }
          this.destination = new _C(i);
        }
      }
      function Mo(e) {
        Vn.useDeprecatedSynchronousErrorHandling
          ? (function yC(e) {
              Vn.useDeprecatedSynchronousErrorHandling &&
                Ln &&
                ((Ln.errorThrown = !0), (Ln.error = e));
            })(e)
          : Zd(e);
      }
      function Ta(e, t) {
        const { onStoppedNotification: n } = Vn;
        n && Eo.setTimeout(() => n(e, t));
      }
      const CC = {
          closed: !0,
          next: Kd,
          error: function DC(e) {
            throw e;
          },
          complete: Kd,
        },
        xa =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function jn(e) {
        return e;
      }
      let he = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, i) {
            const o = (function EC(e) {
              return (
                (e && e instanceof Sa) ||
                ((function wC(e) {
                  return e && ee(e.next) && ee(e.error) && ee(e.complete);
                })(e) &&
                  Wd(e))
              );
            })(n)
              ? n
              : new ii(n, r, i);
            return (
              bo(() => {
                const { operator: s, source: a } = this;
                o.add(
                  s
                    ? s.call(o, a)
                    : a
                    ? this._subscribe(o)
                    : this._trySubscribe(o)
                );
              }),
              o
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = Yd(r))((i, o) => {
              const s = new ii({
                next: (a) => {
                  try {
                    n(a);
                  } catch (u) {
                    o(u), s.unsubscribe();
                  }
                },
                error: o,
                complete: i,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [xa]() {
            return this;
          }
          pipe(...n) {
            return (function Jd(e) {
              return 0 === e.length
                ? jn
                : 1 === e.length
                ? e[0]
                : function (n) {
                    return e.reduce((r, i) => i(r), n);
                  };
            })(n)(this);
          }
          toPromise(n) {
            return new (n = Yd(n))((r, i) => {
              let o;
              this.subscribe(
                (s) => (o = s),
                (s) => i(s),
                () => r(o)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function Yd(e) {
        var t;
        return null !== (t = null != e ? e : Vn.Promise) && void 0 !== t
          ? t
          : Promise;
      }
      const bC = ni(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let Xt = (() => {
        class e extends he {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new Xd(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new bC();
          }
          next(n) {
            bo(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            bo(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            bo(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: i, observers: o } = this;
            return r || i
              ? qd
              : ((this.currentObservers = null),
                o.push(n),
                new ct(() => {
                  (this.currentObservers = null), ri(o, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: i, isStopped: o } = this;
            r ? n.error(i) : o && n.complete();
          }
          asObservable() {
            const n = new he();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new Xd(t, n)), e;
      })();
      class Xd extends Xt {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : qd;
        }
      }
      function ef(e) {
        return ee(null == e ? void 0 : e.lift);
      }
      function Te(e) {
        return (t) => {
          if (ef(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Me(e, t, n, r, i) {
        return new MC(e, t, n, r, i);
      }
      class MC extends Sa {
        constructor(t, n, r, i, o, s) {
          super(t),
            (this.onFinalize = o),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (u) {
                    t.error(u);
                  }
                }
              : super._next),
            (this._error = i
              ? function (a) {
                  try {
                    i(a);
                  } catch (u) {
                    t.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function W(e, t) {
        return Te((n, r) => {
          let i = 0;
          n.subscribe(
            Me(r, (o) => {
              r.next(e.call(t, o, i++));
            })
          );
        });
      }
      function Bn(e) {
        return this instanceof Bn ? ((this.v = e), this) : new Bn(e);
      }
      function IC(e, t, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var i,
          r = n.apply(e, t || []),
          o = [];
        return (
          (i = {}),
          s("next"),
          s("throw"),
          s("return"),
          (i[Symbol.asyncIterator] = function () {
            return this;
          }),
          i
        );
        function s(f) {
          r[f] &&
            (i[f] = function (h) {
              return new Promise(function (p, m) {
                o.push([f, h, p, m]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function u(f) {
              f.value instanceof Bn
                ? Promise.resolve(f.value.v).then(l, c)
                : d(o[0][2], f);
            })(r[f](h));
          } catch (p) {
            d(o[0][3], p);
          }
        }
        function l(f) {
          a("next", f);
        }
        function c(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
        }
      }
      function TC(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function rf(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(o) {
          n[o] =
            e[o] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function i(o, s, a, u) {
                  Promise.resolve(u).then(function (l) {
                    o({ value: l, done: a });
                  }, s);
                })(a, u, (s = e[o](s)).done, s.value);
              });
            };
        }
      }
      const of = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function sf(e) {
        return ee(null == e ? void 0 : e.then);
      }
      function af(e) {
        return ee(e[xa]);
      }
      function uf(e) {
        return (
          Symbol.asyncIterator &&
          ee(null == e ? void 0 : e[Symbol.asyncIterator])
        );
      }
      function lf(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const cf = (function NC() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function df(e) {
        return ee(null == e ? void 0 : e[cf]);
      }
      function ff(e) {
        return IC(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: i } = yield Bn(n.read());
              if (i) return yield Bn(void 0);
              yield yield Bn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function hf(e) {
        return ee(null == e ? void 0 : e.getReader);
      }
      function Vt(e) {
        if (e instanceof he) return e;
        if (null != e) {
          if (af(e))
            return (function RC(e) {
              return new he((t) => {
                const n = e[xa]();
                if (ee(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (of(e))
            return (function FC(e) {
              return new he((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (sf(e))
            return (function OC(e) {
              return new he((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, Zd);
              });
            })(e);
          if (uf(e)) return pf(e);
          if (df(e))
            return (function PC(e) {
              return new he((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (hf(e))
            return (function kC(e) {
              return pf(ff(e));
            })(e);
        }
        throw lf(e);
      }
      function pf(e) {
        return new he((t) => {
          (function VC(e, t) {
            var n, r, i, o;
            return (function AC(e, t, n, r) {
              return new (n || (n = Promise))(function (o, s) {
                function a(c) {
                  try {
                    l(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  try {
                    l(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  c.done
                    ? o(c.value)
                    : (function i(o) {
                        return o instanceof n
                          ? o
                          : new n(function (s) {
                              s(o);
                            });
                      })(c.value).then(a, u);
                }
                l((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = TC(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                i = { error: s };
              } finally {
                try {
                  r && !r.done && (o = n.return) && (yield o.call(n));
                } finally {
                  if (i) throw i.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function en(e, t, n, r = 0, i = !1) {
        const o = t.schedule(function () {
          n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(o), !i)) return o;
      }
      function Ae(e, t, n = 1 / 0) {
        return ee(t)
          ? Ae((r, i) => W((o, s) => t(r, o, i, s))(Vt(e(r, i))), n)
          : ("number" == typeof t && (n = t),
            Te((r, i) =>
              (function LC(e, t, n, r, i, o, s, a) {
                const u = [];
                let l = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !l && t.complete();
                  },
                  h = (m) => (l < r ? p(m) : u.push(m)),
                  p = (m) => {
                    o && t.next(m), l++;
                    let D = !1;
                    Vt(n(m, c++)).subscribe(
                      Me(
                        t,
                        (_) => {
                          null == i || i(_), o ? h(_) : t.next(_);
                        },
                        () => {
                          D = !0;
                        },
                        void 0,
                        () => {
                          if (D)
                            try {
                              for (l--; u.length && l < r; ) {
                                const _ = u.shift();
                                s ? en(t, s, () => p(_)) : p(_);
                              }
                              f();
                            } catch (_) {
                              t.error(_);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Me(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    null == a || a();
                  }
                );
              })(r, i, e, n)
            ));
      }
      function oi(e = 1 / 0) {
        return Ae(jn, e);
      }
      const tn = new he((e) => e.complete());
      function Ra(e) {
        return e[e.length - 1];
      }
      function gf(e) {
        return ee(Ra(e)) ? e.pop() : void 0;
      }
      function si(e) {
        return (function BC(e) {
          return e && ee(e.schedule);
        })(Ra(e))
          ? e.pop()
          : void 0;
      }
      function mf(e, t = 0) {
        return Te((n, r) => {
          n.subscribe(
            Me(
              r,
              (i) => en(r, e, () => r.next(i), t),
              () => en(r, e, () => r.complete(), t),
              (i) => en(r, e, () => r.error(i), t)
            )
          );
        });
      }
      function yf(e, t = 0) {
        return Te((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function vf(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new he((n) => {
          en(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            en(
              n,
              t,
              () => {
                r.next().then((i) => {
                  i.done ? n.complete() : n.next(i.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Se(e, t) {
        return t
          ? (function WC(e, t) {
              if (null != e) {
                if (af(e))
                  return (function UC(e, t) {
                    return Vt(e).pipe(yf(t), mf(t));
                  })(e, t);
                if (of(e))
                  return (function GC(e, t) {
                    return new he((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (sf(e))
                  return (function $C(e, t) {
                    return Vt(e).pipe(yf(t), mf(t));
                  })(e, t);
                if (uf(e)) return vf(e, t);
                if (df(e))
                  return (function zC(e, t) {
                    return new he((n) => {
                      let r;
                      return (
                        en(n, t, () => {
                          (r = e[cf]()),
                            en(
                              n,
                              t,
                              () => {
                                let i, o;
                                try {
                                  ({ value: i, done: o } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                o ? n.complete() : n.next(i);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ee(null == r ? void 0 : r.return) && r.return()
                      );
                    });
                  })(e, t);
                if (hf(e))
                  return (function qC(e, t) {
                    return vf(ff(e), t);
                  })(e, t);
              }
              throw lf(e);
            })(e, t)
          : Vt(e);
      }
      function Ao(e) {
        return e <= 0
          ? () => tn
          : Te((t, n) => {
              let r = 0;
              t.subscribe(
                Me(n, (i) => {
                  ++r <= e && (n.next(i), e <= r && n.complete());
                })
              );
            });
      }
      function Fa(e, t, ...n) {
        return !0 === t
          ? (e(), null)
          : !1 === t
          ? null
          : t(...n)
              .pipe(Ao(1))
              .subscribe(() => e());
      }
      function Y(e) {
        for (let t in e) if (e[t] === Y) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function Oa(e, t) {
        for (const n in t)
          t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
      }
      function Z(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(Z).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function Pa(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const KC = Y({ __forward_ref__: Y });
      function te(e) {
        return (
          (e.__forward_ref__ = te),
          (e.toString = function () {
            return Z(this());
          }),
          e
        );
      }
      function P(e) {
        return _f(e) ? e() : e;
      }
      function _f(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(KC) &&
          e.__forward_ref__ === te
        );
      }
      class $ extends Error {
        constructor(t, n) {
          super(
            (function ka(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function x(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function Be(e) {
        return "function" == typeof e
          ? e.name || e.toString()
          : "object" == typeof e && null != e && "function" == typeof e.type
          ? e.type.name || e.type.toString()
          : x(e);
      }
      function So(e, t) {
        const n = t ? ` in ${t}` : "";
        throw new $(-201, `No provider for ${Be(e)} found${n}`);
      }
      function Ye(e, t) {
        null == e &&
          (function ie(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function R(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function Xe(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function Va(e) {
        return Df(e, Io) || Df(e, wf);
      }
      function Df(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Cf(e) {
        return e && (e.hasOwnProperty(La) || e.hasOwnProperty(rw))
          ? e[La]
          : null;
      }
      const Io = Y({ ɵprov: Y }),
        La = Y({ ɵinj: Y }),
        wf = Y({ ngInjectableDef: Y }),
        rw = Y({ ngInjectorDef: Y });
      var T = (() => (
        ((T = T || {})[(T.Default = 0)] = "Default"),
        (T[(T.Host = 1)] = "Host"),
        (T[(T.Self = 2)] = "Self"),
        (T[(T.SkipSelf = 4)] = "SkipSelf"),
        (T[(T.Optional = 8)] = "Optional"),
        T
      ))();
      let ja;
      function vn(e) {
        const t = ja;
        return (ja = e), t;
      }
      function Ef(e, t, n) {
        const r = Va(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & T.Optional
          ? null
          : void 0 !== t
          ? t
          : void So(Z(e), "Injector");
      }
      function _n(e) {
        return { toString: e }.toString();
      }
      var wt = (() => (
          ((wt = wt || {})[(wt.OnPush = 0)] = "OnPush"),
          (wt[(wt.Default = 1)] = "Default"),
          wt
        ))(),
        Lt = (() => {
          return (
            ((e = Lt || (Lt = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            Lt
          );
          var e;
        })();
      const ow = "undefined" != typeof globalThis && globalThis,
        sw = "undefined" != typeof window && window,
        aw =
          "undefined" != typeof self &&
          "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          self,
        J = ow || ("undefined" != typeof global && global) || sw || aw,
        sr = {},
        X = [],
        To = Y({ ɵcmp: Y }),
        Ba = Y({ ɵdir: Y }),
        Ha = Y({ ɵpipe: Y }),
        bf = Y({ ɵmod: Y }),
        rn = Y({ ɵfac: Y }),
        ai = Y({ __NG_ELEMENT_ID__: Y });
      let uw = 0;
      function ar(e) {
        return _n(() => {
          const n = {},
            r = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: n,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === wt.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              selectors: e.selectors || X,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || Lt.Emulated,
              id: "c",
              styles: e.styles || X,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            i = e.directives,
            o = e.features,
            s = e.pipes;
          return (
            (r.id += uw++),
            (r.inputs = If(e.inputs, n)),
            (r.outputs = If(e.outputs)),
            o && o.forEach((a) => a(r)),
            (r.directiveDefs = i
              ? () => ("function" == typeof i ? i() : i).map(Mf)
              : null),
            (r.pipeDefs = s
              ? () => ("function" == typeof s ? s() : s).map(Af)
              : null),
            r
          );
        });
      }
      function Mf(e) {
        return (
          Re(e) ||
          (function Dn(e) {
            return e[Ba] || null;
          })(e)
        );
      }
      function Af(e) {
        return (function Hn(e) {
          return e[Ha] || null;
        })(e);
      }
      const Sf = {};
      function dt(e) {
        return _n(() => {
          const t = {
            type: e.type,
            bootstrap: e.bootstrap || X,
            declarations: e.declarations || X,
            imports: e.imports || X,
            exports: e.exports || X,
            transitiveCompileScopes: null,
            schemas: e.schemas || null,
            id: e.id || null,
          };
          return null != e.id && (Sf[e.id] = e.type), t;
        });
      }
      function If(e, t) {
        if (null == e) return sr;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let i = e[r],
              o = i;
            Array.isArray(i) && ((o = i[1]), (i = i[0])),
              (n[i] = r),
              t && (t[i] = o);
          }
        return n;
      }
      const S = ar;
      function Qe(e) {
        return {
          type: e.type,
          name: e.name,
          factory: null,
          pure: !1 !== e.pure,
          onDestroy: e.type.prototype.ngOnDestroy || null,
        };
      }
      function Re(e) {
        return e[To] || null;
      }
      function ft(e, t) {
        const n = e[bf] || null;
        if (!n && !0 === t)
          throw new Error(`Type ${Z(e)} does not have '\u0275mod' property.`);
        return n;
      }
      const k = 11;
      function jt(e) {
        return Array.isArray(e) && "object" == typeof e[1];
      }
      function bt(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function Ga(e) {
        return 0 != (8 & e.flags);
      }
      function Fo(e) {
        return 2 == (2 & e.flags);
      }
      function Oo(e) {
        return 1 == (1 & e.flags);
      }
      function Mt(e) {
        return null !== e.template;
      }
      function pw(e) {
        return 0 != (512 & e[2]);
      }
      function zn(e, t) {
        return e.hasOwnProperty(rn) ? e[rn] : null;
      }
      class yw {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function pt() {
        return xf;
      }
      function xf(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = _w), vw;
      }
      function vw() {
        const e = Rf(this),
          t = null == e ? void 0 : e.current;
        if (t) {
          const n = e.previous;
          if (n === sr) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function _w(e, t, n, r) {
        const i =
            Rf(e) ||
            (function Dw(e, t) {
              return (e[Nf] = t);
            })(e, { previous: sr, current: null }),
          o = i.current || (i.current = {}),
          s = i.previous,
          a = this.declaredInputs[n],
          u = s[a];
        (o[a] = new yw(u && u.currentValue, t, s === sr)), (e[r] = t);
      }
      pt.ngInherit = !0;
      const Nf = "__ngSimpleChanges__";
      function Rf(e) {
        return e[Nf] || null;
      }
      let Za;
      function le(e) {
        return !!e.listen;
      }
      const Ff = {
        createRenderer: (e, t) =>
          (function Ka() {
            return void 0 !== Za
              ? Za
              : "undefined" != typeof document
              ? document
              : void 0;
          })(),
      };
      function me(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function Po(e, t) {
        return me(t[e]);
      }
      function mt(e, t) {
        return me(t[e.index]);
      }
      function Ja(e, t) {
        return e.data[t];
      }
      function tt(e, t) {
        const n = t[e];
        return jt(n) ? n : n[0];
      }
      function Ya(e) {
        return 128 == (128 & e[2]);
      }
      function Cn(e, t) {
        return null == t ? null : e[t];
      }
      function Pf(e) {
        e[18] = 0;
      }
      function Xa(e, t) {
        e[5] += t;
        let n = e,
          r = e[3];
        for (
          ;
          null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5]));

        )
          (r[5] += t), (n = r), (r = r[3]);
      }
      const I = {
        lFrame: Gf(null),
        bindingsEnabled: !0,
        isInCheckNoChangesMode: !1,
      };
      function kf() {
        return I.bindingsEnabled;
      }
      function y() {
        return I.lFrame.lView;
      }
      function G() {
        return I.lFrame.tView;
      }
      function Ce() {
        let e = Lf();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Lf() {
        return I.lFrame.currentTNode;
      }
      function Bt(e, t) {
        const n = I.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function eu() {
        return I.lFrame.isParent;
      }
      function ko() {
        return I.isInCheckNoChangesMode;
      }
      function Vo(e) {
        I.isInCheckNoChangesMode = e;
      }
      function He() {
        const e = I.lFrame;
        let t = e.bindingRootIndex;
        return (
          -1 === t && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t
        );
      }
      function hr() {
        return I.lFrame.bindingIndex++;
      }
      function Vw(e, t) {
        const n = I.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), nu(t);
      }
      function nu(e) {
        I.lFrame.currentDirectiveIndex = e;
      }
      function iu(e) {
        I.lFrame.currentQueryIndex = e;
      }
      function jw(e) {
        const t = e[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
      }
      function Uf(e, t, n) {
        if (n & T.SkipSelf) {
          let i = t,
            o = e;
          for (
            ;
            !((i = i.parent),
            null !== i ||
              n & T.Host ||
              ((i = jw(o)), null === i || ((o = o[15]), 10 & i.type)));

          );
          if (null === i) return !1;
          (t = i), (e = o);
        }
        const r = (I.lFrame = $f());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function Lo(e) {
        const t = $f(),
          n = e[1];
        (I.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function $f() {
        const e = I.lFrame,
          t = null === e ? null : e.child;
        return null === t ? Gf(e) : t;
      }
      function Gf(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function zf() {
        const e = I.lFrame;
        return (
          (I.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const qf = zf;
      function jo() {
        const e = zf();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Ue() {
        return I.lFrame.selectedIndex;
      }
      function wn(e) {
        I.lFrame.selectedIndex = e;
      }
      function ce() {
        const e = I.lFrame;
        return Ja(e.tView, e.selectedIndex);
      }
      function Bo(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const o = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: l,
              ngOnDestroy: c,
            } = o;
          s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(n, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
            u && (e.viewHooks || (e.viewHooks = [])).push(-n, u),
            l &&
              ((e.viewHooks || (e.viewHooks = [])).push(n, l),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, l)),
            null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c);
        }
      }
      function Ho(e, t, n) {
        Wf(e, t, 3, n);
      }
      function Uo(e, t, n, r) {
        (3 & e[2]) === n && Wf(e, t, n, r);
      }
      function ou(e, t) {
        let n = e[2];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[2] = n));
      }
      function Wf(e, t, n, r) {
        const o = null != r ? r : -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[18] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else
            t[u] < 0 && (e[18] += 65536),
              (a < o || -1 == o) &&
                (Qw(e, n, t, u), (e[18] = (4294901760 & e[18]) + u + 2)),
              u++;
      }
      function Qw(e, t, n, r) {
        const i = n[r] < 0,
          o = n[r + 1],
          a = e[i ? -n[r] : n[r]];
        if (i) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
            e[2] += 2048;
            try {
              o.call(a);
            } finally {
            }
          }
        } else
          try {
            o.call(a);
          } finally {
          }
      }
      class fi {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function $o(e, t, n) {
        const r = le(e);
        let i = 0;
        for (; i < n.length; ) {
          const o = n[i];
          if ("number" == typeof o) {
            if (0 !== o) break;
            i++;
            const s = n[i++],
              a = n[i++],
              u = n[i++];
            r ? e.setAttribute(t, a, u, s) : t.setAttributeNS(s, a, u);
          } else {
            const s = o,
              a = n[++i];
            au(s)
              ? r && e.setProperty(t, s, a)
              : r
              ? e.setAttribute(t, s, a)
              : t.setAttribute(s, a),
              i++;
          }
        }
        return i;
      }
      function Qf(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function au(e) {
        return 64 === e.charCodeAt(0);
      }
      function Go(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const i = t[r];
              "number" == typeof i
                ? (n = i)
                : 0 === n ||
                  Zf(e, n, i, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function Zf(e, t, n, r, i) {
        let o = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; o < e.length; ) {
            const a = e[o++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = o - 1;
                break;
              }
            }
          }
        for (; o < e.length; ) {
          const a = e[o];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== i && (e[o + 1] = i));
            if (r === e[o + 1]) return void (e[o + 2] = i);
          }
          o++, null !== r && o++, null !== i && o++;
        }
        -1 !== s && (e.splice(s, 0, t), (o = s + 1)),
          e.splice(o++, 0, n),
          null !== r && e.splice(o++, 0, r),
          null !== i && e.splice(o++, 0, i);
      }
      function Kf(e) {
        return -1 !== e;
      }
      function pr(e) {
        return 32767 & e;
      }
      function gr(e, t) {
        let n = (function Xw(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[15]), n--;
        return r;
      }
      let uu = !0;
      function zo(e) {
        const t = uu;
        return (uu = e), t;
      }
      let eE = 0;
      function pi(e, t) {
        const n = cu(e, t);
        if (-1 !== n) return n;
        const r = t[1];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          lu(r.data, e),
          lu(t, null),
          lu(r.blueprint, null));
        const i = qo(e, t),
          o = e.injectorIndex;
        if (Kf(i)) {
          const s = pr(i),
            a = gr(i, t),
            u = a[1].data;
          for (let l = 0; l < 8; l++) t[o + l] = a[s + l] | u[s + l];
        }
        return (t[o + 8] = i), o;
      }
      function lu(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function cu(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function qo(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          i = t;
        for (; null !== i; ) {
          const o = i[1],
            s = o.type;
          if (((r = 2 === s ? o.declTNode : 1 === s ? i[6] : null), null === r))
            return -1;
          if ((n++, (i = i[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return -1;
      }
      function Wo(e, t, n) {
        !(function tE(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(ai) && (r = n[ai]),
            null == r && (r = n[ai] = eE++);
          const i = 255 & r;
          t.data[e + (i >> 5)] |= 1 << i;
        })(e, t, n);
      }
      function Xf(e, t, n) {
        if (n & T.Optional) return e;
        So(t, "NodeInjector");
      }
      function eh(e, t, n, r) {
        if (
          (n & T.Optional && void 0 === r && (r = null),
          0 == (n & (T.Self | T.Host)))
        ) {
          const i = e[9],
            o = vn(void 0);
          try {
            return i ? i.get(t, r, n & T.Optional) : Ef(t, r, n & T.Optional);
          } finally {
            vn(o);
          }
        }
        return Xf(r, t, n);
      }
      function th(e, t, n, r = T.Default, i) {
        if (null !== e) {
          const o = (function oE(e) {
            if ("string" == typeof e) return e.charCodeAt(0) || 0;
            const t = e.hasOwnProperty(ai) ? e[ai] : void 0;
            return "number" == typeof t ? (t >= 0 ? 255 & t : rE) : t;
          })(n);
          if ("function" == typeof o) {
            if (!Uf(t, e, r)) return r & T.Host ? Xf(i, n, r) : eh(t, n, r, i);
            try {
              const s = o(r);
              if (null != s || r & T.Optional) return s;
              So(n);
            } finally {
              qf();
            }
          } else if ("number" == typeof o) {
            let s = null,
              a = cu(e, t),
              u = -1,
              l = r & T.Host ? t[16][6] : null;
            for (
              (-1 === a || r & T.SkipSelf) &&
              ((u = -1 === a ? qo(e, t) : t[a + 8]),
              -1 !== u && ih(r, !1)
                ? ((s = t[1]), (a = pr(u)), (t = gr(u, t)))
                : (a = -1));
              -1 !== a;

            ) {
              const c = t[1];
              if (rh(o, a, c.data)) {
                const d = iE(a, t, n, s, r, l);
                if (d !== nh) return d;
              }
              (u = t[a + 8]),
                -1 !== u && ih(r, t[1].data[a + 8] === l) && rh(o, a, t)
                  ? ((s = c), (a = pr(u)), (t = gr(u, t)))
                  : (a = -1);
            }
          }
        }
        return eh(t, n, r, i);
      }
      const nh = {};
      function rE() {
        return new mr(Ce(), y());
      }
      function iE(e, t, n, r, i, o) {
        const s = t[1],
          a = s.data[e + 8],
          c = (function Qo(e, t, n, r, i) {
            const o = e.providerIndexes,
              s = t.data,
              a = 1048575 & o,
              u = e.directiveStart,
              c = o >> 20,
              f = i ? a + c : e.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < u && n === p) || (h >= u && p.type === n)) return h;
            }
            if (i) {
              const h = s[u];
              if (h && Mt(h) && h.type === n) return u;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? Fo(a) && uu : r != s && 0 != (3 & a.type),
            i & T.Host && o === a
          );
        return null !== c ? gi(t, s, c, a) : nh;
      }
      function gi(e, t, n, r) {
        let i = e[n];
        const o = t.data;
        if (
          (function Zw(e) {
            return e instanceof fi;
          })(i)
        ) {
          const s = i;
          s.resolving &&
            (function JC(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new $(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(Be(o[n]));
          const a = zo(s.canSeeViewProviders);
          s.resolving = !0;
          const u = s.injectImpl ? vn(s.injectImpl) : null;
          Uf(e, r, T.Default);
          try {
            (i = e[n] = s.factory(void 0, o, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function Ww(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: i,
                    ngDoCheck: o,
                  } = t.type.prototype;
                  if (r) {
                    const s = xf(t);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  i &&
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, i),
                    o &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, o),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, o));
                })(n, o[n], t);
          } finally {
            null !== u && vn(u), zo(a), (s.resolving = !1), qf();
          }
        }
        return i;
      }
      function rh(e, t, n) {
        return !!(n[t + (e >> 5)] & (1 << e));
      }
      function ih(e, t) {
        return !(e & T.Self || (e & T.Host && t));
      }
      class mr {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return th(this._tNode, this._lView, t, r, n);
        }
      }
      function Oe(e) {
        return _n(() => {
          const t = e.prototype.constructor,
            n = t[rn] || du(t),
            r = Object.prototype;
          let i = Object.getPrototypeOf(e.prototype).constructor;
          for (; i && i !== r; ) {
            const o = i[rn] || du(i);
            if (o && o !== n) return o;
            i = Object.getPrototypeOf(i);
          }
          return (o) => new o();
        });
      }
      function du(e) {
        return _f(e)
          ? () => {
              const t = du(P(e));
              return t && t();
            }
          : zn(e);
      }
      function mi(e) {
        return (function nE(e, t) {
          if ("class" === t) return e.classes;
          if ("style" === t) return e.styles;
          const n = e.attrs;
          if (n) {
            const r = n.length;
            let i = 0;
            for (; i < r; ) {
              const o = n[i];
              if (Qf(o)) break;
              if (0 === o) i += 2;
              else if ("number" == typeof o)
                for (i++; i < r && "string" == typeof n[i]; ) i++;
              else {
                if (o === t) return n[i + 1];
                i += 2;
              }
            }
          }
          return null;
        })(Ce(), e);
      }
      const vr = "__parameters__";
      function Dr(e, t, n) {
        return _n(() => {
          const r = (function fu(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const i in r) this[i] = r[i];
              }
            };
          })(t);
          function i(...o) {
            if (this instanceof i) return r.apply(this, o), this;
            const s = new i(...o);
            return (a.annotation = s), a;
            function a(u, l, c) {
              const d = u.hasOwnProperty(vr)
                ? u[vr]
                : Object.defineProperty(u, vr, { value: [] })[vr];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), u;
            }
          }
          return (
            n && (i.prototype = Object.create(n.prototype)),
            (i.prototype.ngMetadataName = e),
            (i.annotationCls = i),
            i
          );
        });
      }
      class L {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = R({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const aE = new L("AnalyzeForEntryComponents");
      function Ht(e, t) {
        e.forEach((n) => (Array.isArray(n) ? Ht(n, t) : t(n)));
      }
      function sh(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Zo(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function nt(e, t, n) {
        let r = Cr(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function cE(e, t, n, r) {
                let i = e.length;
                if (i == t) e.push(n, r);
                else if (1 === i) e.push(r, e[0]), (e[0] = n);
                else {
                  for (i--, e.push(e[i - 1], e[i]); i > t; )
                    (e[i] = e[i - 2]), i--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function pu(e, t) {
        const n = Cr(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Cr(e, t) {
        return (function lh(e, t, n) {
          let r = 0,
            i = e.length >> n;
          for (; i !== r; ) {
            const o = r + ((i - r) >> 1),
              s = e[o << n];
            if (t === s) return o << n;
            s > t ? (i = o) : (r = o + 1);
          }
          return ~(i << n);
        })(e, t, 1);
      }
      const Di = {},
        mu = "__NG_DI_FLAG__",
        Jo = "ngTempTokenPath",
        yE = /\n/gm,
        dh = "__source",
        _E = Y({ provide: String, useValue: Y });
      let Ci;
      function fh(e) {
        const t = Ci;
        return (Ci = e), t;
      }
      function DE(e, t = T.Default) {
        if (void 0 === Ci) throw new $(203, "");
        return null === Ci
          ? Ef(e, void 0, t)
          : Ci.get(e, t & T.Optional ? null : void 0, t);
      }
      function b(e, t = T.Default) {
        return (
          (function iw() {
            return ja;
          })() || DE
        )(P(e), t);
      }
      const CE = b;
      function yu(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = P(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new $(900, "");
            let i,
              o = T.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = wE(a);
              "number" == typeof u
                ? -1 === u
                  ? (i = a.token)
                  : (o |= u)
                : (i = a);
            }
            t.push(b(i, o));
          } else t.push(b(r));
        }
        return t;
      }
      function wi(e, t) {
        return (e[mu] = t), (e.prototype[mu] = t), e;
      }
      function wE(e) {
        return e[mu];
      }
      const Yo = wi(
          Dr("Inject", (e) => ({ token: e })),
          -1
        ),
        bn = wi(Dr("Optional"), 8),
        Ei = wi(Dr("SkipSelf"), 4);
      const Nh = "__ngContext__";
      function Pe(e, t) {
        e[Nh] = t;
      }
      function Su(e) {
        const t = (function Ii(e) {
          return e[Nh] || null;
        })(e);
        return t ? (Array.isArray(t) ? t : t.lView) : null;
      }
      function Tu(e) {
        return e.ngOriginalError;
      }
      function pb(e, ...t) {
        e.error(...t);
      }
      class Ti {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t),
            r = (function hb(e) {
              return (e && e.ngErrorLogger) || pb;
            })(t);
          r(this._console, "ERROR", t),
            n && r(this._console, "ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Tu(t);
          for (; n && Tu(n); ) n = Tu(n);
          return n || null;
        }
      }
      const bb = (() =>
        (
          ("undefined" != typeof requestAnimationFrame &&
            requestAnimationFrame) ||
          setTimeout
        ).bind(J))();
      function $t(e) {
        return e instanceof Function ? e() : e;
      }
      var rt = (() => (
        ((rt = rt || {})[(rt.Important = 1)] = "Important"),
        (rt[(rt.DashCase = 2)] = "DashCase"),
        rt
      ))();
      function Nu(e, t) {
        return undefined(e, t);
      }
      function xi(e) {
        const t = e[3];
        return bt(t) ? t[3] : t;
      }
      function Ru(e) {
        return Bh(e[13]);
      }
      function Fu(e) {
        return Bh(e[4]);
      }
      function Bh(e) {
        for (; null !== e && !bt(e); ) e = e[4];
        return e;
      }
      function Mr(e, t, n, r, i) {
        if (null != r) {
          let o,
            s = !1;
          bt(r) ? (o = r) : jt(r) && ((s = !0), (r = r[0]));
          const a = me(r);
          0 === e && null !== n
            ? null == i
              ? qh(t, n, a)
              : qn(t, n, a, i || null, !0)
            : 1 === e && null !== n
            ? qn(t, n, a, i || null, !0)
            : 2 === e
            ? (function Xh(e, t, n) {
                const r = is(e, t);
                r &&
                  (function Lb(e, t, n, r) {
                    le(e) ? e.removeChild(t, n, r) : t.removeChild(n);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != o &&
              (function Hb(e, t, n, r, i) {
                const o = n[7];
                o !== me(n) && Mr(t, e, r, o, i);
                for (let a = 10; a < n.length; a++) {
                  const u = n[a];
                  Ni(u[1], u, e, t, r, o);
                }
              })(t, e, o, n, i);
        }
      }
      function Pu(e, t, n) {
        if (le(e)) return e.createElement(t, n);
        {
          const r =
            null !== n
              ? (function bw(e) {
                  const t = e.toLowerCase();
                  return "svg" === t
                    ? "http://www.w3.org/2000/svg"
                    : "math" === t
                    ? "http://www.w3.org/1998/MathML/"
                    : null;
                })(n)
              : null;
          return null === r ? e.createElement(t) : e.createElementNS(r, t);
        }
      }
      function Uh(e, t) {
        const n = e[9],
          r = n.indexOf(t),
          i = t[3];
        1024 & t[2] && ((t[2] &= -1025), Xa(i, -1)), n.splice(r, 1);
      }
      function ku(e, t) {
        if (e.length <= 10) return;
        const n = 10 + t,
          r = e[n];
        if (r) {
          const i = r[17];
          null !== i && i !== e && Uh(i, r), t > 0 && (e[n - 1][4] = r[4]);
          const o = Zo(e, 10 + t);
          !(function xb(e, t) {
            Ni(e, t, t[k], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const s = o[19];
          null !== s && s.detachView(o[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -129);
        }
        return r;
      }
      function $h(e, t) {
        if (!(256 & t[2])) {
          const n = t[k];
          le(n) && n.destroyNode && Ni(e, t, n, 3, null, null),
            (function Fb(e) {
              let t = e[13];
              if (!t) return Vu(e[1], e);
              for (; t; ) {
                let n = null;
                if (jt(t)) n = t[13];
                else {
                  const r = t[10];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[4] && t !== e; )
                    jt(t) && Vu(t[1], t), (t = t[3]);
                  null === t && (t = e), jt(t) && Vu(t[1], t), (n = t && t[4]);
                }
                t = n;
              }
            })(t);
        }
      }
      function Vu(e, t) {
        if (!(256 & t[2])) {
          (t[2] &= -129),
            (t[2] |= 256),
            (function Vb(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const i = t[n[r]];
                  if (!(i instanceof fi)) {
                    const o = n[r + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = i[o[s]],
                          u = o[s + 1];
                        try {
                          u.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        o.call(i);
                      } finally {
                      }
                  }
                }
            })(e, t),
            (function kb(e, t) {
              const n = e.cleanup,
                r = t[7];
              let i = -1;
              if (null !== n)
                for (let o = 0; o < n.length - 1; o += 2)
                  if ("string" == typeof n[o]) {
                    const s = n[o + 1],
                      a = "function" == typeof s ? s(t) : me(t[s]),
                      u = r[(i = n[o + 2])],
                      l = n[o + 3];
                    "boolean" == typeof l
                      ? a.removeEventListener(n[o], u, l)
                      : l >= 0
                      ? r[(i = l)]()
                      : r[(i = -l)].unsubscribe(),
                      (o += 2);
                  } else {
                    const s = r[(i = n[o + 1])];
                    n[o].call(s);
                  }
              if (null !== r) {
                for (let o = i + 1; o < r.length; o++) r[o]();
                t[7] = null;
              }
            })(e, t),
            1 === t[1].type && le(t[k]) && t[k].destroy();
          const n = t[17];
          if (null !== n && bt(t[3])) {
            n !== t[3] && Uh(n, t);
            const r = t[19];
            null !== r && r.detachView(e);
          }
        }
      }
      function Gh(e, t, n) {
        return (function zh(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[0];
          if (2 & r.flags) {
            const i = e.data[r.directiveStart].encapsulation;
            if (i === Lt.None || i === Lt.Emulated) return null;
          }
          return mt(r, n);
        })(e, t.parent, n);
      }
      function qn(e, t, n, r, i) {
        le(e) ? e.insertBefore(t, n, r, i) : t.insertBefore(n, r, i);
      }
      function qh(e, t, n) {
        le(e) ? e.appendChild(t, n) : t.appendChild(n);
      }
      function Wh(e, t, n, r, i) {
        null !== r ? qn(e, t, n, r, i) : qh(e, t, n);
      }
      function is(e, t) {
        return le(e) ? e.parentNode(t) : t.parentNode;
      }
      let Kh = function Zh(e, t, n) {
        return 40 & e.type ? mt(e, n) : null;
      };
      function os(e, t, n, r) {
        const i = Gh(e, r, t),
          o = t[k],
          a = (function Qh(e, t, n) {
            return Kh(e, t, n);
          })(r.parent || t[6], r, t);
        if (null != i)
          if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) Wh(o, i, n[u], a, !1);
          else Wh(o, i, n, a, !1);
      }
      function ss(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return mt(t, e);
          if (4 & n) return ju(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return ss(e, r);
            {
              const i = e[t.index];
              return bt(i) ? ju(-1, i) : me(i);
            }
          }
          if (32 & n) return Nu(t, e)() || me(e[t.index]);
          {
            const r = Yh(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : ss(xi(e[16]), r)
              : ss(e, t.next);
          }
        }
        return null;
      }
      function Yh(e, t) {
        return null !== t ? e[16][6].projection[t.projection] : null;
      }
      function ju(e, t) {
        const n = 10 + e + 1;
        if (n < t.length) {
          const r = t[n],
            i = r[1].firstChild;
          if (null !== i) return ss(r, i);
        }
        return t[7];
      }
      function Bu(e, t, n, r, i, o, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if (
            (s && 0 === t && (a && Pe(me(a), r), (n.flags |= 4)),
            64 != (64 & n.flags))
          )
            if (8 & u) Bu(e, t, n.child, r, i, o, !1), Mr(t, e, i, a, o);
            else if (32 & u) {
              const l = Nu(n, r);
              let c;
              for (; (c = l()); ) Mr(t, e, i, c, o);
              Mr(t, e, i, a, o);
            } else 16 & u ? ep(e, t, r, n, i, o) : Mr(t, e, i, a, o);
          n = s ? n.projectionNext : n.next;
        }
      }
      function Ni(e, t, n, r, i, o) {
        Bu(n, r, e.firstChild, t, i, o, !1);
      }
      function ep(e, t, n, r, i, o) {
        const s = n[16],
          u = s[6].projection[r.projection];
        if (Array.isArray(u))
          for (let l = 0; l < u.length; l++) Mr(t, e, i, u[l], o);
        else Bu(e, t, u, s[3], i, o, !0);
      }
      function tp(e, t, n) {
        le(e) ? e.setAttribute(t, "style", n) : (t.style.cssText = n);
      }
      function Hu(e, t, n) {
        le(e)
          ? "" === n
            ? e.removeAttribute(t, "class")
            : e.setAttribute(t, "class", n)
          : (t.className = n);
      }
      function np(e, t, n) {
        let r = e.length;
        for (;;) {
          const i = e.indexOf(t, n);
          if (-1 === i) return i;
          if (0 === i || e.charCodeAt(i - 1) <= 32) {
            const o = t.length;
            if (i + o === r || e.charCodeAt(i + o) <= 32) return i;
          }
          n = i + 1;
        }
      }
      const rp = "ng-template";
      function $b(e, t, n) {
        let r = 0;
        for (; r < e.length; ) {
          let i = e[r++];
          if (n && "class" === i) {
            if (((i = e[r]), -1 !== np(i.toLowerCase(), t, 0))) return !0;
          } else if (1 === i) {
            for (; r < e.length && "string" == typeof (i = e[r++]); )
              if (i.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function ip(e) {
        return 4 === e.type && e.value !== rp;
      }
      function Gb(e, t, n) {
        return t === (4 !== e.type || n ? e.value : rp);
      }
      function zb(e, t, n) {
        let r = 4;
        const i = e.attrs || [],
          o = (function Qb(e) {
            for (let t = 0; t < e.length; t++) if (Qf(e[t])) return t;
            return e.length;
          })(i);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !Gb(e, u, n)) || ("" === u && 1 === t.length))
                ) {
                  if (At(r)) return !1;
                  s = !0;
                }
              } else {
                const l = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!$b(e.attrs, l, n)) {
                    if (At(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = qb(8 & r ? "class" : u, i, ip(e), n);
                if (-1 === d) {
                  if (At(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== l) {
                  let f;
                  f = d > o ? "" : i[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== np(h, l, 0)) || (2 & r && l !== f)) {
                    if (At(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !At(r) && !At(u)) return !1;
            if (s && At(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return At(r) || s;
      }
      function At(e) {
        return 0 == (1 & e);
      }
      function qb(e, t, n, r) {
        if (null === t) return -1;
        let i = 0;
        if (r || !n) {
          let o = !1;
          for (; i < t.length; ) {
            const s = t[i];
            if (s === e) return i;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++i];
                for (; "string" == typeof a; ) a = t[++i];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                i += 4;
                continue;
              }
            }
            i += o ? 1 : 2;
          }
          return -1;
        }
        return (function Zb(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function op(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (zb(e, t[r], n)) return !0;
        return !1;
      }
      function sp(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function Jb(e) {
        let t = e[0],
          n = 1,
          r = 2,
          i = "",
          o = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (i += "." + s) : 4 & r && (i += " " + s);
          else
            "" !== i && !At(s) && ((t += sp(o, i)), (i = "")),
              (r = s),
              (o = o || !At(r));
          n++;
        }
        return "" !== i && (t += sp(o, i)), t;
      }
      const N = {};
      function it(e) {
        ap(G(), y(), Ue() + e, ko());
      }
      function ap(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const o = e.preOrderCheckHooks;
            null !== o && Ho(t, o, n);
          } else {
            const o = e.preOrderHooks;
            null !== o && Uo(t, o, 0, n);
          }
        wn(n);
      }
      function as(e, t) {
        return (e << 17) | (t << 2);
      }
      function St(e) {
        return (e >> 17) & 32767;
      }
      function Uu(e) {
        return 2 | e;
      }
      function an(e) {
        return (131068 & e) >> 2;
      }
      function $u(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function Gu(e) {
        return 1 | e;
      }
      function vp(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r],
              o = n[r + 1];
            if (-1 !== o) {
              const s = e.data[o];
              iu(i), s.contentQueries(2, t[o], o);
            }
          }
      }
      function Ri(e, t, n, r, i, o, s, a, u, l) {
        const c = t.blueprint.slice();
        return (
          (c[0] = i),
          (c[2] = 140 | r),
          Pf(c),
          (c[3] = c[15] = e),
          (c[8] = n),
          (c[10] = s || (e && e[10])),
          (c[k] = a || (e && e[k])),
          (c[12] = u || (e && e[12]) || null),
          (c[9] = l || (e && e[9]) || null),
          (c[6] = o),
          (c[16] = 2 == t.type ? e[16] : c),
          c
        );
      }
      function Ar(e, t, n, r, i) {
        let o = e.data[t];
        if (null === o)
          (o = (function Xu(e, t, n, r, i) {
            const o = Lf(),
              s = eu(),
              u = (e.data[t] = (function m0(e, t, n, r, i, o) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: i,
                  attrs: o,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? o : o && o.parent, n, t, r, i));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== o &&
                (s
                  ? null == o.child && null !== u.parent && (o.child = u)
                  : null === o.next && (o.next = u)),
              u
            );
          })(e, t, n, r, i)),
            (function kw() {
              return I.lFrame.inI18n;
            })() && (o.flags |= 64);
        else if (64 & o.type) {
          (o.type = n), (o.value = r), (o.attrs = i);
          const s = (function di() {
            const e = I.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Bt(o, !0), o;
      }
      function Sr(e, t, n, r) {
        if (0 === n) return -1;
        const i = t.length;
        for (let o = 0; o < n; o++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return i;
      }
      function Fi(e, t, n) {
        Lo(t);
        try {
          const r = e.viewQuery;
          null !== r && ul(1, r, n);
          const i = e.template;
          null !== i && _p(e, t, i, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && vp(e, t),
            e.staticViewQueries && ul(2, e.viewQuery, n);
          const o = e.components;
          null !== o &&
            (function h0(e, t) {
              for (let n = 0; n < t.length; n++) O0(e, t[n]);
            })(t, o);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[2] &= -5), jo();
        }
      }
      function Ir(e, t, n, r) {
        const i = t[2];
        if (256 == (256 & i)) return;
        Lo(t);
        const o = ko();
        try {
          Pf(t),
            (function jf(e) {
              return (I.lFrame.bindingIndex = e);
            })(e.bindingStartIndex),
            null !== n && _p(e, t, n, 2, r);
          const s = 3 == (3 & i);
          if (!o)
            if (s) {
              const l = e.preOrderCheckHooks;
              null !== l && Ho(t, l, null);
            } else {
              const l = e.preOrderHooks;
              null !== l && Uo(t, l, 0, null), ou(t, 0);
            }
          if (
            ((function R0(e) {
              for (let t = Ru(e); null !== t; t = Fu(t)) {
                if (!t[2]) continue;
                const n = t[9];
                for (let r = 0; r < n.length; r++) {
                  const i = n[r],
                    o = i[3];
                  0 == (1024 & i[2]) && Xa(o, 1), (i[2] |= 1024);
                }
              }
            })(t),
            (function N0(e) {
              for (let t = Ru(e); null !== t; t = Fu(t))
                for (let n = 10; n < t.length; n++) {
                  const r = t[n],
                    i = r[1];
                  Ya(r) && Ir(i, r, i.template, r[8]);
                }
            })(t),
            null !== e.contentQueries && vp(e, t),
            !o)
          )
            if (s) {
              const l = e.contentCheckHooks;
              null !== l && Ho(t, l);
            } else {
              const l = e.contentHooks;
              null !== l && Uo(t, l, 1), ou(t, 1);
            }
          !(function d0(e, t) {
            const n = e.hostBindingOpCodes;
            if (null !== n)
              try {
                for (let r = 0; r < n.length; r++) {
                  const i = n[r];
                  if (i < 0) wn(~i);
                  else {
                    const o = i,
                      s = n[++r],
                      a = n[++r];
                    Vw(s, o), a(2, t[o]);
                  }
                }
              } finally {
                wn(-1);
              }
          })(e, t);
          const a = e.components;
          null !== a &&
            (function f0(e, t) {
              for (let n = 0; n < t.length; n++) F0(e, t[n]);
            })(t, a);
          const u = e.viewQuery;
          if ((null !== u && ul(2, u, r), !o))
            if (s) {
              const l = e.viewCheckHooks;
              null !== l && Ho(t, l);
            } else {
              const l = e.viewHooks;
              null !== l && Uo(t, l, 2), ou(t, 2);
            }
          !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
            o || (t[2] &= -73),
            1024 & t[2] && ((t[2] &= -1025), Xa(t[3], -1));
        } finally {
          jo();
        }
      }
      function p0(e, t, n, r) {
        const i = t[10],
          o = !ko(),
          s = (function Of(e) {
            return 4 == (4 & e[2]);
          })(t);
        try {
          o && !s && i.begin && i.begin(), s && Fi(e, t, r), Ir(e, t, n, r);
        } finally {
          o && !s && i.end && i.end();
        }
      }
      function _p(e, t, n, r, i) {
        const o = Ue(),
          s = 2 & r;
        try {
          wn(-1), s && t.length > 20 && ap(e, t, 20, ko()), n(r, i);
        } finally {
          wn(o);
        }
      }
      function el(e, t, n) {
        !kf() ||
          ((function E0(e, t, n, r) {
            const i = n.directiveStart,
              o = n.directiveEnd;
            e.firstCreatePass || pi(n, t), Pe(r, t);
            const s = n.initialInputs;
            for (let a = i; a < o; a++) {
              const u = e.data[a],
                l = Mt(u);
              l && I0(t, n, u);
              const c = gi(t, e, a, n);
              Pe(c, t),
                null !== s && T0(0, a - i, c, u, 0, s),
                l && (tt(n.index, t)[8] = c);
            }
          })(e, t, n, mt(n, t)),
          128 == (128 & n.flags) &&
            (function b0(e, t, n) {
              const r = n.directiveStart,
                i = n.directiveEnd,
                s = n.index,
                a = (function Lw() {
                  return I.lFrame.currentDirectiveIndex;
                })();
              try {
                wn(s);
                for (let u = r; u < i; u++) {
                  const l = e.data[u],
                    c = t[u];
                  nu(u),
                    (null !== l.hostBindings ||
                      0 !== l.hostVars ||
                      null !== l.hostAttrs) &&
                      Ip(l, c);
                }
              } finally {
                wn(-1), nu(a);
              }
            })(e, t, n));
      }
      function tl(e, t, n = mt) {
        const r = t.localNames;
        if (null !== r) {
          let i = t.index + 1;
          for (let o = 0; o < r.length; o += 2) {
            const s = r[o + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[i++] = a;
          }
        }
      }
      function Cp(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = cs(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : t;
      }
      function cs(e, t, n, r, i, o, s, a, u, l) {
        const c = 20 + r,
          d = c + i,
          f = (function g0(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : N);
            return n;
          })(c, d),
          h = "function" == typeof l ? l() : l;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof o ? o() : o,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function Mp(e, t, n) {
        for (let r in e)
          if (e.hasOwnProperty(r)) {
            const i = e[r];
            (n = null === n ? {} : n).hasOwnProperty(r)
              ? n[r].push(t, i)
              : (n[r] = [t, i]);
          }
        return n;
      }
      function nl(e, t, n, r) {
        let i = !1;
        if (kf()) {
          const o = (function M0(e, t, n) {
              const r = e.directiveRegistry;
              let i = null;
              if (r)
                for (let o = 0; o < r.length; o++) {
                  const s = r[o];
                  op(n, s.selectors, !1) &&
                    (i || (i = []),
                    Wo(pi(n, t), e, s.type),
                    Mt(s) ? (Tp(e, n), i.unshift(s)) : i.push(s));
                }
              return i;
            })(e, t, n),
            s = null === r ? null : { "": -1 };
          if (null !== o) {
            (i = !0), xp(n, e.data.length, o.length);
            for (let c = 0; c < o.length; c++) {
              const d = o[c];
              d.providersResolver && d.providersResolver(d);
            }
            let a = !1,
              u = !1,
              l = Sr(e, t, o.length, null);
            for (let c = 0; c < o.length; c++) {
              const d = o[c];
              (n.mergedAttrs = Go(n.mergedAttrs, d.hostAttrs)),
                Np(e, n, t, l, d),
                S0(l, d, s),
                null !== d.contentQueries && (n.flags |= 8),
                (null !== d.hostBindings ||
                  null !== d.hostAttrs ||
                  0 !== d.hostVars) &&
                  (n.flags |= 128);
              const f = d.type.prototype;
              !a &&
                (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) &&
                ((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index),
                (a = !0)),
                !u &&
                  (f.ngOnChanges || f.ngDoCheck) &&
                  ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(
                    n.index
                  ),
                  (u = !0)),
                l++;
            }
            !(function y0(e, t) {
              const r = t.directiveEnd,
                i = e.data,
                o = t.attrs,
                s = [];
              let a = null,
                u = null;
              for (let l = t.directiveStart; l < r; l++) {
                const c = i[l],
                  d = c.inputs,
                  f = null === o || ip(t) ? null : x0(d, o);
                s.push(f), (a = Mp(d, l, a)), (u = Mp(c.outputs, l, u));
              }
              null !== a &&
                (a.hasOwnProperty("class") && (t.flags |= 16),
                a.hasOwnProperty("style") && (t.flags |= 32)),
                (t.initialInputs = s),
                (t.inputs = a),
                (t.outputs = u);
            })(e, n);
          }
          s &&
            (function A0(e, t, n) {
              if (t) {
                const r = (e.localNames = []);
                for (let i = 0; i < t.length; i += 2) {
                  const o = n[t[i + 1]];
                  if (null == o) throw new $(-301, !1);
                  r.push(t[i], o);
                }
              }
            })(n, r, s);
        }
        return (n.mergedAttrs = Go(n.mergedAttrs, n.attrs)), i;
      }
      function Sp(e, t, n, r, i, o) {
        const s = o.hostBindings;
        if (s) {
          let a = e.hostBindingOpCodes;
          null === a && (a = e.hostBindingOpCodes = []);
          const u = ~t.index;
          (function w0(e) {
            let t = e.length;
            for (; t > 0; ) {
              const n = e[--t];
              if ("number" == typeof n && n < 0) return n;
            }
            return 0;
          })(a) != u && a.push(u),
            a.push(r, i, s);
        }
      }
      function Ip(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Tp(e, t) {
        (t.flags |= 2), (e.components || (e.components = [])).push(t.index);
      }
      function S0(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          Mt(t) && (n[""] = e);
        }
      }
      function xp(e, t, n) {
        (e.flags |= 1),
          (e.directiveStart = t),
          (e.directiveEnd = t + n),
          (e.providerIndexes = t);
      }
      function Np(e, t, n, r, i) {
        e.data[r] = i;
        const o = i.factory || (i.factory = zn(i.type)),
          s = new fi(o, Mt(i), null);
        (e.blueprint[r] = s),
          (n[r] = s),
          Sp(e, t, 0, r, Sr(e, n, i.hostVars, N), i);
      }
      function I0(e, t, n) {
        const r = mt(t, e),
          i = Cp(n),
          o = e[10],
          s = ds(
            e,
            Ri(
              e,
              i,
              null,
              n.onPush ? 64 : 16,
              r,
              t,
              o,
              o.createRenderer(r, n),
              null,
              null
            )
          );
        e[t.index] = s;
      }
      function Gt(e, t, n, r, i, o) {
        const s = mt(e, t);
        !(function rl(e, t, n, r, i, o, s) {
          if (null == o)
            le(e) ? e.removeAttribute(t, i, n) : t.removeAttribute(i);
          else {
            const a = null == s ? x(o) : s(o, r || "", i);
            le(e)
              ? e.setAttribute(t, i, a, n)
              : n
              ? t.setAttributeNS(n, i, a)
              : t.setAttribute(i, a);
          }
        })(t[k], s, o, e.value, n, r, i);
      }
      function T0(e, t, n, r, i, o) {
        const s = o[t];
        if (null !== s) {
          const a = r.setInput;
          for (let u = 0; u < s.length; ) {
            const l = s[u++],
              c = s[u++],
              d = s[u++];
            null !== a ? r.setInput(n, d, l, c) : (n[c] = d);
          }
        }
      }
      function x0(e, t) {
        let n = null,
          r = 0;
        for (; r < t.length; ) {
          const i = t[r];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              e.hasOwnProperty(i) &&
                (null === n && (n = []), n.push(i, e[i], t[r + 1])),
                (r += 2);
            } else r += 2;
          else r += 4;
        }
        return n;
      }
      function Rp(e, t, n, r) {
        return new Array(e, !0, !1, t, null, 0, r, n, null, null);
      }
      function F0(e, t) {
        const n = tt(t, e);
        if (Ya(n)) {
          const r = n[1];
          80 & n[2] ? Ir(r, n, r.template, n[8]) : n[5] > 0 && il(n);
        }
      }
      function il(e) {
        for (let r = Ru(e); null !== r; r = Fu(r))
          for (let i = 10; i < r.length; i++) {
            const o = r[i];
            if (1024 & o[2]) {
              const s = o[1];
              Ir(s, o, s.template, o[8]);
            } else o[5] > 0 && il(o);
          }
        const n = e[1].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const i = tt(n[r], e);
            Ya(i) && i[5] > 0 && il(i);
          }
      }
      function O0(e, t) {
        const n = tt(t, e),
          r = n[1];
        (function P0(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n),
          Fi(r, n, n[8]);
      }
      function ds(e, t) {
        return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
      }
      function ol(e) {
        for (; e; ) {
          e[2] |= 64;
          const t = xi(e);
          if (pw(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function al(e, t, n) {
        const r = t[10];
        r.begin && r.begin();
        try {
          Ir(e, t, e.template, n);
        } catch (i) {
          throw (Vp(t, i), i);
        } finally {
          r.end && r.end();
        }
      }
      function Fp(e) {
        !(function sl(e) {
          for (let t = 0; t < e.components.length; t++) {
            const n = e.components[t],
              r = Su(n),
              i = r[1];
            p0(i, r, i.template, n);
          }
        })(e[8]);
      }
      function ul(e, t, n) {
        iu(0), t(e, n);
      }
      const j0 = (() => Promise.resolve(null))();
      function Op(e) {
        return e[7] || (e[7] = []);
      }
      function Pp(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function Vp(e, t) {
        const n = e[9],
          r = n ? n.get(Ti, null) : null;
        r && r.handleError(t);
      }
      function Lp(e, t, n, r, i) {
        for (let o = 0; o < n.length; ) {
          const s = n[o++],
            a = n[o++],
            u = t[s],
            l = e.data[s];
          null !== l.setInput ? l.setInput(u, i, r, a) : (u[a] = i);
        }
      }
      function un(e, t, n) {
        const r = Po(t, e);
        !(function Hh(e, t, n) {
          le(e) ? e.setValue(t, n) : (t.textContent = n);
        })(e[k], r, n);
      }
      function fs(e, t, n) {
        let r = n ? e.styles : null,
          i = n ? e.classes : null,
          o = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (o = a)
              : 1 == o
              ? (i = Pa(i, a))
              : 2 == o && (r = Pa(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = i) : (e.classesWithoutHost = i);
      }
      const ll = new L("INJECTOR", -1);
      class jp {
        get(t, n = Di) {
          if (n === Di) {
            const r = new Error(`NullInjectorError: No provider for ${Z(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      const cl = new L("Set Injector scope."),
        Oi = {},
        U0 = {};
      let dl;
      function Bp() {
        return void 0 === dl && (dl = new jp()), dl;
      }
      function Hp(e, t = null, n = null, r) {
        const i = Up(e, t, n, r);
        return i._resolveInjectorDefTypes(), i;
      }
      function Up(e, t = null, n = null, r) {
        return new $0(e, n, t || Bp(), r);
      }
      class $0 {
        constructor(t, n, r, i = null) {
          (this.parent = r),
            (this.records = new Map()),
            (this.injectorDefTypes = new Set()),
            (this.onDestroy = new Set()),
            (this._destroyed = !1);
          const o = [];
          n && Ht(n, (a) => this.processProvider(a, t, n)),
            Ht([t], (a) => this.processInjectorType(a, [], o)),
            this.records.set(ll, Tr(void 0, this));
          const s = this.records.get(cl);
          (this.scope = null != s ? s.value : null),
            (this.source = i || ("object" == typeof t ? null : Z(t)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            this.onDestroy.forEach((t) => t.ngOnDestroy());
          } finally {
            this.records.clear(),
              this.onDestroy.clear(),
              this.injectorDefTypes.clear();
          }
        }
        get(t, n = Di, r = T.Default) {
          this.assertNotDestroyed();
          const i = fh(this),
            o = vn(void 0);
          try {
            if (!(r & T.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const u =
                  (function J0(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof L)
                    );
                  })(t) && Va(t);
                (a = u && this.injectableDefInScope(u) ? Tr(fl(t), Oi) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & T.Self ? Bp() : this.parent).get(
              t,
              (n = r & T.Optional && n === Di ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Jo] = s[Jo] || []).unshift(Z(t)), i)) throw s;
              return (function EE(e, t, n, r) {
                const i = e[Jo];
                throw (
                  (t[dh] && i.unshift(t[dh]),
                  (e.message = (function bE(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.substr(2)
                        : e;
                    let i = Z(t);
                    if (Array.isArray(t)) i = t.map(Z).join(" -> ");
                    else if ("object" == typeof t) {
                      let o = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          o.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : Z(a))
                          );
                        }
                      i = `{${o.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${e.replace(
                      yE,
                      "\n  "
                    )}`;
                  })("\n" + e.message, i, n, r)),
                  (e.ngTokenPath = i),
                  (e[Jo] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            vn(o), fh(i);
          }
        }
        _resolveInjectorDefTypes() {
          this.injectorDefTypes.forEach((t) => this.get(t));
        }
        toString() {
          const t = [];
          return (
            this.records.forEach((r, i) => t.push(Z(i))),
            `R3Injector[${t.join(", ")}]`
          );
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new $(205, !1);
        }
        processInjectorType(t, n, r) {
          if (!(t = P(t))) return !1;
          let i = Cf(t);
          const o = (null == i && t.ngModule) || void 0,
            s = void 0 === o ? t : o,
            a = -1 !== r.indexOf(s);
          if ((void 0 !== o && (i = Cf(o)), null == i)) return !1;
          if (null != i.imports && !a) {
            let c;
            r.push(s);
            try {
              Ht(i.imports, (d) => {
                this.processInjectorType(d, n, r) &&
                  (void 0 === c && (c = []), c.push(d));
              });
            } finally {
            }
            if (void 0 !== c)
              for (let d = 0; d < c.length; d++) {
                const { ngModule: f, providers: h } = c[d];
                Ht(h, (p) => this.processProvider(p, f, h || X));
              }
          }
          this.injectorDefTypes.add(s);
          const u = zn(s) || (() => new s());
          this.records.set(s, Tr(u, Oi));
          const l = i.providers;
          if (null != l && !a) {
            const c = t;
            Ht(l, (d) => this.processProvider(d, c, l));
          }
          return void 0 !== o && void 0 !== t.providers;
        }
        processProvider(t, n, r) {
          let i = xr((t = P(t))) ? t : P(t && t.provide);
          const o = (function z0(e, t, n) {
            return Gp(e) ? Tr(void 0, e.useValue) : Tr($p(e), Oi);
          })(t);
          if (xr(t) || !0 !== t.multi) this.records.get(i);
          else {
            let s = this.records.get(i);
            s ||
              ((s = Tr(void 0, Oi, !0)),
              (s.factory = () => yu(s.multi)),
              this.records.set(i, s)),
              (i = t),
              s.multi.push(t);
          }
          this.records.set(i, o);
        }
        hydrate(t, n) {
          return (
            n.value === Oi && ((n.value = U0), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function K0(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this.onDestroy.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = P(t.providedIn);
          return "string" == typeof n
            ? "any" === n || n === this.scope
            : this.injectorDefTypes.has(n);
        }
      }
      function fl(e) {
        const t = Va(e),
          n = null !== t ? t.factory : zn(e);
        if (null !== n) return n;
        if (e instanceof L) throw new $(204, !1);
        if (e instanceof Function)
          return (function G0(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function _i(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new $(204, !1))
              );
            const n = (function tw(e) {
              const t = e && (e[Io] || e[wf]);
              if (t) {
                const n = (function nw(e) {
                  if (e.hasOwnProperty("name")) return e.name;
                  const t = ("" + e).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`
                  ),
                  t
                );
              }
              return null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new $(204, !1);
      }
      function $p(e, t, n) {
        let r;
        if (xr(e)) {
          const i = P(e);
          return zn(i) || fl(i);
        }
        if (Gp(e)) r = () => P(e.useValue);
        else if (
          (function W0(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...yu(e.deps || []));
        else if (
          (function q0(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => b(P(e.useExisting));
        else {
          const i = P(e && (e.useClass || e.provide));
          if (
            !(function Z0(e) {
              return !!e.deps;
            })(e)
          )
            return zn(i) || fl(i);
          r = () => new i(...yu(e.deps));
        }
        return r;
      }
      function Tr(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function Gp(e) {
        return null !== e && "object" == typeof e && _E in e;
      }
      function xr(e) {
        return "function" == typeof e;
      }
      let ke = (() => {
        class e {
          static create(n, r) {
            var i;
            if (Array.isArray(n)) return Hp({ name: "" }, r, n, "");
            {
              const o = null !== (i = n.name) && void 0 !== i ? i : "";
              return Hp({ name: o }, n.parent, n.providers, o);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = Di),
          (e.NULL = new jp()),
          (e.ɵprov = R({ token: e, providedIn: "any", factory: () => b(ll) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function oM(e, t) {
        Bo(Su(e)[1], Ce());
      }
      function K(e) {
        let t = (function ng(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          n = !0;
        const r = [e];
        for (; t; ) {
          let i;
          if (Mt(e)) i = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new $(903, "");
            i = t.ɵdir;
          }
          if (i) {
            if (n) {
              r.push(i);
              const s = e;
              (s.inputs = gl(e.inputs)),
                (s.declaredInputs = gl(e.declaredInputs)),
                (s.outputs = gl(e.outputs));
              const a = i.hostBindings;
              a && lM(e, a);
              const u = i.viewQuery,
                l = i.contentQueries;
              if (
                (u && aM(e, u),
                l && uM(e, l),
                Oa(e.inputs, i.inputs),
                Oa(e.declaredInputs, i.declaredInputs),
                Oa(e.outputs, i.outputs),
                Mt(i) && i.data.animation)
              ) {
                const c = e.data;
                c.animation = (c.animation || []).concat(i.data.animation);
              }
            }
            const o = i.features;
            if (o)
              for (let s = 0; s < o.length; s++) {
                const a = o[s];
                a && a.ngInherit && a(e), a === K && (n = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function sM(e) {
          let t = 0,
            n = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const i = e[r];
            (i.hostVars = t += i.hostVars),
              (i.hostAttrs = Go(i.hostAttrs, (n = Go(n, i.hostAttrs))));
          }
        })(r);
      }
      function gl(e) {
        return e === sr ? {} : e === X ? [] : e;
      }
      function aM(e, t) {
        const n = e.viewQuery;
        e.viewQuery = n
          ? (r, i) => {
              t(r, i), n(r, i);
            }
          : t;
      }
      function uM(e, t) {
        const n = e.contentQueries;
        e.contentQueries = n
          ? (r, i, o) => {
              t(r, i, o), n(r, i, o);
            }
          : t;
      }
      function lM(e, t) {
        const n = e.hostBindings;
        e.hostBindings = n
          ? (r, i) => {
              t(r, i), n(r, i);
            }
          : t;
      }
      let hs = null;
      function Nr() {
        if (!hs) {
          const e = J.Symbol;
          if (e && e.iterator) hs = e.iterator;
          else {
            const t = Object.getOwnPropertyNames(Map.prototype);
            for (let n = 0; n < t.length; ++n) {
              const r = t[n];
              "entries" !== r &&
                "size" !== r &&
                Map.prototype[r] === Map.prototype.entries &&
                (hs = r);
            }
          }
        }
        return hs;
      }
      function Pi(e) {
        return (
          !!(function ml(e) {
            return (
              null !== e && ("function" == typeof e || "object" == typeof e)
            );
          })(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Nr() in e))
        );
      }
      function zt(e, t, n) {
        return (e[t] = n);
      }
      function Ve(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function qt(e, t, n, r) {
        const i = y();
        return Ve(i, hr(), t) && (G(), Gt(ce(), i, e, t, n, r)), qt;
      }
      function Vi(e, t, n, r, i, o, s, a) {
        const u = y(),
          l = G(),
          c = e + 20,
          d = l.firstCreatePass
            ? (function mM(e, t, n, r, i, o, s, a, u) {
                const l = t.consts,
                  c = Ar(t, e, 4, s || null, Cn(l, a));
                nl(t, n, c, Cn(l, u)), Bo(t, c);
                const d = (c.tViews = cs(
                  2,
                  c,
                  r,
                  i,
                  o,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  l
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, c),
                    (d.queries = t.queries.embeddedTView(c))),
                  c
                );
              })(c, l, u, t, n, r, i, o, s)
            : l.data[c];
        Bt(d, !1);
        const f = u[k].createComment("");
        os(l, u, f, d),
          Pe(f, u),
          ds(u, (u[c] = Rp(f, u, f, d))),
          Oo(d) && el(l, u, d),
          null != s && tl(u, d, a);
      }
      function v(e, t = T.Default) {
        const n = y();
        return null === n ? b(e, t) : th(Ce(), n, P(e), t);
      }
      function Cl() {
        throw new Error("invalid");
      }
      function Tt(e, t, n) {
        const r = y();
        return (
          Ve(r, hr(), t) &&
            (function ot(e, t, n, r, i, o, s, a) {
              const u = mt(t, n);
              let c,
                l = t.inputs;
              !a && null != l && (c = l[r])
                ? (Lp(e, n, c, r, i),
                  Fo(t) &&
                    (function _0(e, t) {
                      const n = tt(t, e);
                      16 & n[2] || (n[2] |= 64);
                    })(n, t.index))
                : 3 & t.type &&
                  ((r = (function v0(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (i = null != s ? s(i, t.value || "", r) : i),
                  le(o)
                    ? o.setProperty(u, r, i)
                    : au(r) ||
                      (u.setProperty ? u.setProperty(r, i) : (u[r] = i)));
            })(G(), ce(), r, e, t, r[k], n, !1),
          Tt
        );
      }
      function wl(e, t, n, r, i) {
        const s = i ? "class" : "style";
        Lp(e, n, t.inputs[s], s, r);
      }
      function Q(e, t, n, r) {
        const i = y(),
          o = G(),
          s = 20 + e,
          a = i[k],
          u = (i[s] = Pu(
            a,
            t,
            (function qw() {
              return I.lFrame.currentNamespace;
            })()
          )),
          l = o.firstCreatePass
            ? (function LM(e, t, n, r, i, o, s) {
                const a = t.consts,
                  l = Ar(t, e, 2, i, Cn(a, o));
                return (
                  nl(t, n, l, Cn(a, s)),
                  null !== l.attrs && fs(l, l.attrs, !1),
                  null !== l.mergedAttrs && fs(l, l.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, l),
                  l
                );
              })(s, o, i, 0, t, n, r)
            : o.data[s];
        Bt(l, !0);
        const c = l.mergedAttrs;
        null !== c && $o(a, u, c);
        const d = l.classes;
        null !== d && Hu(a, u, d);
        const f = l.styles;
        return (
          null !== f && tp(a, u, f),
          64 != (64 & l.flags) && os(o, i, u, l),
          0 ===
            (function xw() {
              return I.lFrame.elementDepthCount;
            })() && Pe(u, i),
          (function Nw() {
            I.lFrame.elementDepthCount++;
          })(),
          Oo(l) &&
            (el(o, i, l),
            (function Dp(e, t, n) {
              if (Ga(t)) {
                const i = t.directiveEnd;
                for (let o = t.directiveStart; o < i; o++) {
                  const s = e.data[o];
                  s.contentQueries && s.contentQueries(1, n[o], o);
                }
              }
            })(o, l, i)),
          null !== r && tl(i, l),
          Q
        );
      }
      function z() {
        let e = Ce();
        eu()
          ? (function tu() {
              I.lFrame.isParent = !1;
            })()
          : ((e = e.parent), Bt(e, !1));
        const t = e;
        !(function Rw() {
          I.lFrame.elementDepthCount--;
        })();
        const n = G();
        return (
          n.firstCreatePass && (Bo(n, e), Ga(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function Jw(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            wl(n, t, y(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function Yw(e) {
              return 0 != (32 & e.flags);
            })(t) &&
            wl(n, t, y(), t.stylesWithoutHost, !1),
          z
        );
      }
      function ln(e, t, n, r) {
        return Q(e, t, n, r), z(), ln;
      }
      function Li(e) {
        return !!e && "function" == typeof e.then;
      }
      const Ml = function bg(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function Le(e, t, n, r) {
        const i = y(),
          o = G(),
          s = Ce();
        return (
          (function Ag(e, t, n, r, i, o, s, a) {
            const u = Oo(r),
              c = e.firstCreatePass && Pp(e),
              d = t[8],
              f = Op(t);
            let h = !0;
            if (3 & r.type || a) {
              const D = mt(r, t),
                _ = a ? a(D) : D,
                g = f.length,
                E = a ? (F) => a(me(F[r.index])) : r.index;
              if (le(n)) {
                let F = null;
                if (
                  (!a &&
                    u &&
                    (F = (function BM(e, t, n, r) {
                      const i = e.cleanup;
                      if (null != i)
                        for (let o = 0; o < i.length - 1; o += 2) {
                          const s = i[o];
                          if (s === n && i[o + 1] === r) {
                            const a = t[7],
                              u = i[o + 2];
                            return a.length > u ? a[u] : null;
                          }
                          "string" == typeof s && (o += 2);
                        }
                      return null;
                    })(e, t, i, r.index)),
                  null !== F)
                )
                  ((F.__ngLastListenerFn__ || F).__ngNextListenerFn__ = o),
                    (F.__ngLastListenerFn__ = o),
                    (h = !1);
                else {
                  o = Al(r, t, d, o, !1);
                  const q = n.listen(_, i, o);
                  f.push(o, q), c && c.push(i, E, g, g + 1);
                }
              } else
                (o = Al(r, t, d, o, !0)),
                  _.addEventListener(i, o, s),
                  f.push(o),
                  c && c.push(i, E, g, s);
            } else o = Al(r, t, d, o, !1);
            const p = r.outputs;
            let m;
            if (h && null !== p && (m = p[i])) {
              const D = m.length;
              if (D)
                for (let _ = 0; _ < D; _ += 2) {
                  const lt = t[m[_]][m[_ + 1]].subscribe(o),
                    or = f.length;
                  f.push(o, lt), c && c.push(i, r.index, or, -(or + 1));
                }
            }
          })(o, i, i[k], s, e, t, !!n, r),
          Le
        );
      }
      function Sg(e, t, n, r) {
        try {
          return !1 !== n(r);
        } catch (i) {
          return Vp(e, i), !1;
        }
      }
      function Al(e, t, n, r, i) {
        return function o(s) {
          if (s === Function) return r;
          const a = 2 & e.flags ? tt(e.index, t) : t;
          0 == (32 & t[2]) && ol(a);
          let u = Sg(t, 0, r, s),
            l = o.__ngNextListenerFn__;
          for (; l; ) (u = Sg(t, 0, l, s) && u), (l = l.__ngNextListenerFn__);
          return i && !1 === u && (s.preventDefault(), (s.returnValue = !1)), u;
        };
      }
      function ms(e = 1) {
        return (function Bw(e) {
          return (I.lFrame.contextLView = (function Hw(e, t) {
            for (; e > 0; ) (t = t[15]), e--;
            return t;
          })(e, I.lFrame.contextLView))[8];
        })(e);
      }
      function Vg(e, t, n, r, i) {
        const o = e[n + 1],
          s = null === t;
        let a = r ? St(o) : an(o),
          u = !1;
        for (; 0 !== a && (!1 === u || s); ) {
          const c = e[a + 1];
          qM(e[a], t) && ((u = !0), (e[a + 1] = r ? Gu(c) : Uu(c))),
            (a = r ? St(c) : an(c));
        }
        u && (e[n + 1] = r ? Uu(o) : Gu(o));
      }
      function qM(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && Cr(e, t) >= 0)
        );
      }
      function ys(e, t) {
        return (
          (function xt(e, t, n, r) {
            const i = y(),
              o = G(),
              s = (function sn(e) {
                const t = I.lFrame,
                  n = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + e), n;
              })(2);
            o.firstUpdatePass &&
              (function qg(e, t, n, r) {
                const i = e.data;
                if (null === i[n + 1]) {
                  const o = i[Ue()],
                    s = (function zg(e, t) {
                      return t >= e.expandoStartIndex;
                    })(e, n);
                  (function Kg(e, t) {
                    return 0 != (e.flags & (t ? 16 : 32));
                  })(o, r) &&
                    null === t &&
                    !s &&
                    (t = !1),
                    (t = (function tA(e, t, n, r) {
                      const i = (function ru(e) {
                        const t = I.lFrame.currentDirectiveIndex;
                        return -1 === t ? null : e[t];
                      })(e);
                      let o = r ? t.residualClasses : t.residualStyles;
                      if (null === i)
                        0 === (r ? t.classBindings : t.styleBindings) &&
                          ((n = ji((n = Il(null, e, t, n, r)), t.attrs, r)),
                          (o = null));
                      else {
                        const s = t.directiveStylingLast;
                        if (-1 === s || e[s] !== i)
                          if (((n = Il(i, e, t, n, r)), null === o)) {
                            let u = (function nA(e, t, n) {
                              const r = n ? t.classBindings : t.styleBindings;
                              if (0 !== an(r)) return e[St(r)];
                            })(e, t, r);
                            void 0 !== u &&
                              Array.isArray(u) &&
                              ((u = Il(null, e, t, u[1], r)),
                              (u = ji(u, t.attrs, r)),
                              (function rA(e, t, n, r) {
                                e[St(n ? t.classBindings : t.styleBindings)] =
                                  r;
                              })(e, t, r, u));
                          } else
                            o = (function iA(e, t, n) {
                              let r;
                              const i = t.directiveEnd;
                              for (
                                let o = 1 + t.directiveStylingLast;
                                o < i;
                                o++
                              )
                                r = ji(r, e[o].hostAttrs, n);
                              return ji(r, t.attrs, n);
                            })(e, t, r);
                      }
                      return (
                        void 0 !== o &&
                          (r
                            ? (t.residualClasses = o)
                            : (t.residualStyles = o)),
                        n
                      );
                    })(i, o, t, r)),
                    (function GM(e, t, n, r, i, o) {
                      let s = o ? t.classBindings : t.styleBindings,
                        a = St(s),
                        u = an(s);
                      e[r] = n;
                      let c,
                        l = !1;
                      if (Array.isArray(n)) {
                        const d = n;
                        (c = d[1]), (null === c || Cr(d, c) > 0) && (l = !0);
                      } else c = n;
                      if (i)
                        if (0 !== u) {
                          const f = St(e[a + 1]);
                          (e[r + 1] = as(f, a)),
                            0 !== f && (e[f + 1] = $u(e[f + 1], r)),
                            (e[a + 1] = (function e0(e, t) {
                              return (131071 & e) | (t << 17);
                            })(e[a + 1], r));
                        } else
                          (e[r + 1] = as(a, 0)),
                            0 !== a && (e[a + 1] = $u(e[a + 1], r)),
                            (a = r);
                      else
                        (e[r + 1] = as(u, 0)),
                          0 === a ? (a = r) : (e[u + 1] = $u(e[u + 1], r)),
                          (u = r);
                      l && (e[r + 1] = Uu(e[r + 1])),
                        Vg(e, c, r, !0),
                        Vg(e, c, r, !1),
                        (function zM(e, t, n, r, i) {
                          const o = i ? e.residualClasses : e.residualStyles;
                          null != o &&
                            "string" == typeof t &&
                            Cr(o, t) >= 0 &&
                            (n[r + 1] = Gu(n[r + 1]));
                        })(t, c, e, r, o),
                        (s = as(a, u)),
                        o ? (t.classBindings = s) : (t.styleBindings = s);
                    })(i, o, t, n, s, r);
                }
              })(o, e, s, r),
              t !== N &&
                Ve(i, s, t) &&
                (function Qg(e, t, n, r, i, o, s, a) {
                  if (!(3 & t.type)) return;
                  const u = e.data,
                    l = u[a + 1];
                  vs(
                    (function cp(e) {
                      return 1 == (1 & e);
                    })(l)
                      ? Zg(u, t, n, i, an(l), s)
                      : void 0
                  ) ||
                    (vs(o) ||
                      ((function lp(e) {
                        return 2 == (2 & e);
                      })(l) &&
                        (o = Zg(u, null, n, i, a, s))),
                    (function Ub(e, t, n, r, i) {
                      const o = le(e);
                      if (t)
                        i
                          ? o
                            ? e.addClass(n, r)
                            : n.classList.add(r)
                          : o
                          ? e.removeClass(n, r)
                          : n.classList.remove(r);
                      else {
                        let s = -1 === r.indexOf("-") ? void 0 : rt.DashCase;
                        if (null == i)
                          o
                            ? e.removeStyle(n, r, s)
                            : n.style.removeProperty(r);
                        else {
                          const a =
                            "string" == typeof i && i.endsWith("!important");
                          a && ((i = i.slice(0, -10)), (s |= rt.Important)),
                            o
                              ? e.setStyle(n, r, i, s)
                              : n.style.setProperty(r, i, a ? "important" : "");
                        }
                      }
                    })(r, s, Po(Ue(), n), i, o));
                })(
                  o,
                  o.data[Ue()],
                  i,
                  i[k],
                  e,
                  (i[s + 1] = (function aA(e, t) {
                    return (
                      null == e ||
                        ("string" == typeof t
                          ? (e += t)
                          : "object" == typeof e &&
                            (e = Z(
                              (function Mn(e) {
                                return e instanceof
                                  class Ch {
                                    constructor(t) {
                                      this.changingThisBreaksApplicationSecurity =
                                        t;
                                    }
                                    toString() {
                                      return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
                                    }
                                  }
                                  ? e.changingThisBreaksApplicationSecurity
                                  : e;
                              })(e)
                            ))),
                      e
                    );
                  })(t, n)),
                  r,
                  s
                );
          })(e, t, null, !0),
          ys
        );
      }
      function Il(e, t, n, r, i) {
        let o = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((o = t[a]), (r = ji(r, o.hostAttrs, i)), o !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function ji(e, t, n) {
        const r = n ? 1 : 2;
        let i = -1;
        if (null !== t)
          for (let o = 0; o < t.length; o++) {
            const s = t[o];
            "number" == typeof s
              ? (i = s)
              : i === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                nt(e, s, !!n || t[++o]));
          }
        return void 0 === e ? null : e;
      }
      function Zg(e, t, n, r, i, o) {
        const s = null === t;
        let a;
        for (; i > 0; ) {
          const u = e[i],
            l = Array.isArray(u),
            c = l ? u[1] : u,
            d = null === c;
          let f = n[i + 1];
          f === N && (f = d ? X : void 0);
          let h = d ? pu(f, r) : c === r ? f : void 0;
          if ((l && !vs(h) && (h = pu(u, r)), vs(h) && ((a = h), s))) return a;
          const p = e[i + 1];
          i = s ? St(p) : an(p);
        }
        if (null !== t) {
          let u = o ? t.residualClasses : t.residualStyles;
          null != u && (a = pu(u, r));
        }
        return a;
      }
      function vs(e) {
        return void 0 !== e;
      }
      function ae(e, t = "") {
        const n = y(),
          r = G(),
          i = e + 20,
          o = r.firstCreatePass ? Ar(r, i, 1, t, null) : r.data[i],
          s = (n[i] = (function Ou(e, t) {
            return le(e) ? e.createText(t) : e.createTextNode(t);
          })(n[k], t));
        os(r, n, s, o), Bt(o, !1);
      }
      function Bi(e) {
        return Hi("", e, ""), Bi;
      }
      function Hi(e, t, n) {
        const r = y(),
          i = (function Fr(e, t, n, r) {
            return Ve(e, hr(), n) ? t + x(n) + r : N;
          })(r, e, t, n);
        return i !== N && un(r, Ue(), i), Hi;
      }
      const Qn = void 0;
      var SA = [
        "en",
        [["a", "p"], ["AM", "PM"], Qn],
        [["AM", "PM"], Qn, Qn],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        ],
        Qn,
        [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        Qn,
        [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"],
        ],
        0,
        [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", Qn, "{1} 'at' {0}", Qn],
        [
          ".",
          ",",
          ";",
          "%",
          "+",
          "-",
          "E",
          "\xd7",
          "\u2030",
          "\u221e",
          "NaN",
          ":",
        ],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"],
        "USD",
        "$",
        "US Dollar",
        {},
        "ltr",
        function AA(e) {
          const n = Math.floor(Math.abs(e)),
            r = e.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === n && 0 === r ? 1 : 5;
        },
      ];
      let $r = {};
      function Ge(e) {
        const t = (function IA(e) {
          return e.toLowerCase().replace(/_/g, "-");
        })(e);
        let n = ym(t);
        if (n) return n;
        const r = t.split("-")[0];
        if (((n = ym(r)), n)) return n;
        if ("en" === r) return SA;
        throw new Error(`Missing locale data for the locale "${e}".`);
      }
      function ym(e) {
        return (
          e in $r ||
            ($r[e] =
              J.ng &&
              J.ng.common &&
              J.ng.common.locales &&
              J.ng.common.locales[e]),
          $r[e]
        );
      }
      var w = (() => (
        ((w = w || {})[(w.LocaleId = 0)] = "LocaleId"),
        (w[(w.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
        (w[(w.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
        (w[(w.DaysFormat = 3)] = "DaysFormat"),
        (w[(w.DaysStandalone = 4)] = "DaysStandalone"),
        (w[(w.MonthsFormat = 5)] = "MonthsFormat"),
        (w[(w.MonthsStandalone = 6)] = "MonthsStandalone"),
        (w[(w.Eras = 7)] = "Eras"),
        (w[(w.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
        (w[(w.WeekendRange = 9)] = "WeekendRange"),
        (w[(w.DateFormat = 10)] = "DateFormat"),
        (w[(w.TimeFormat = 11)] = "TimeFormat"),
        (w[(w.DateTimeFormat = 12)] = "DateTimeFormat"),
        (w[(w.NumberSymbols = 13)] = "NumberSymbols"),
        (w[(w.NumberFormats = 14)] = "NumberFormats"),
        (w[(w.CurrencyCode = 15)] = "CurrencyCode"),
        (w[(w.CurrencySymbol = 16)] = "CurrencySymbol"),
        (w[(w.CurrencyName = 17)] = "CurrencyName"),
        (w[(w.Currencies = 18)] = "Currencies"),
        (w[(w.Directionality = 19)] = "Directionality"),
        (w[(w.PluralCase = 20)] = "PluralCase"),
        (w[(w.ExtraData = 21)] = "ExtraData"),
        w
      ))();
      const _s = "en-US";
      let vm = _s;
      function Nl(e, t, n, r, i) {
        if (((e = P(e)), Array.isArray(e)))
          for (let o = 0; o < e.length; o++) Nl(e[o], t, n, r, i);
        else {
          const o = G(),
            s = y();
          let a = xr(e) ? e : P(e.provide),
            u = $p(e);
          const l = Ce(),
            c = 1048575 & l.providerIndexes,
            d = l.directiveStart,
            f = l.providerIndexes >> 20;
          if (xr(e) || !e.multi) {
            const h = new fi(u, i, v),
              p = Fl(a, t, i ? c : c + f, d);
            -1 === p
              ? (Wo(pi(l, s), o, a),
                Rl(o, e, t.length),
                t.push(a),
                l.directiveStart++,
                l.directiveEnd++,
                i && (l.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = Fl(a, t, c + f, d),
              p = Fl(a, t, c, c + f),
              m = h >= 0 && n[h],
              D = p >= 0 && n[p];
            if ((i && !D) || (!i && !m)) {
              Wo(pi(l, s), o, a);
              const _ = (function AS(e, t, n, r, i) {
                const o = new fi(e, n, v);
                return (
                  (o.multi = []),
                  (o.index = t),
                  (o.componentProviders = 0),
                  Um(o, i, r && !n),
                  o
                );
              })(i ? MS : bS, n.length, i, r, u);
              !i && D && (n[p].providerFactory = _),
                Rl(o, e, t.length, 0),
                t.push(a),
                l.directiveStart++,
                l.directiveEnd++,
                i && (l.providerIndexes += 1048576),
                n.push(_),
                s.push(_);
            } else Rl(o, e, h > -1 ? h : p, Um(n[i ? p : h], u, !i && r));
            !i && r && D && n[p].componentProviders++;
          }
        }
      }
      function Rl(e, t, n, r) {
        const i = xr(t),
          o = (function Q0(e) {
            return !!e.useClass;
          })(t);
        if (i || o) {
          const u = (o ? P(t.useClass) : t).prototype.ngOnDestroy;
          if (u) {
            const l = e.destroyHooks || (e.destroyHooks = []);
            if (!i && t.multi) {
              const c = l.indexOf(n);
              -1 === c ? l.push(n, [r, u]) : l[c + 1].push(r, u);
            } else l.push(n, u);
          }
        }
      }
      function Um(e, t, n) {
        return n && e.componentProviders++, e.multi.push(t) - 1;
      }
      function Fl(e, t, n, r) {
        for (let i = n; i < r; i++) if (t[i] === e) return i;
        return -1;
      }
      function bS(e, t, n, r) {
        return Ol(this.multi, []);
      }
      function MS(e, t, n, r) {
        const i = this.multi;
        let o;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = gi(n, n[1], this.providerFactory.index, r);
          (o = a.slice(0, s)), Ol(i, o);
          for (let u = s; u < a.length; u++) o.push(a[u]);
        } else (o = []), Ol(i, o);
        return o;
      }
      function Ol(e, t) {
        for (let n = 0; n < e.length; n++) t.push((0, e[n])());
        return t;
      }
      function se(e, t = []) {
        return (n) => {
          n.providersResolver = (r, i) =>
            (function ES(e, t, n) {
              const r = G();
              if (r.firstCreatePass) {
                const i = Mt(e);
                Nl(n, r.data, r.blueprint, i, !0),
                  Nl(t, r.data, r.blueprint, i, !1);
              }
            })(r, i ? i(e) : e, t);
        };
      }
      class $m {}
      class TS {
        resolveComponentFactory(t) {
          throw (function IS(e) {
            const t = Error(
              `No component factory found for ${Z(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let qi = (() => {
        class e {}
        return (e.NULL = new TS()), e;
      })();
      function xS() {
        return zr(Ce(), y());
      }
      function zr(e, t) {
        return new st(mt(e, t));
      }
      let st = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = xS), e;
      })();
      class zm {}
      let cn = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function FS() {
                const e = y(),
                  n = tt(Ce().index, e);
                return (function RS(e) {
                  return e[k];
                })(jt(n) ? n : e);
              })()),
            e
          );
        })(),
        OS = (() => {
          class e {}
          return (
            (e.ɵprov = R({
              token: e,
              providedIn: "root",
              factory: () => null,
            })),
            e
          );
        })();
      class Wi {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const PS = new Wi("13.2.7"),
        Pl = {};
      function bs(e, t, n, r, i = !1) {
        for (; null !== n; ) {
          const o = t[n.index];
          if ((null !== o && r.push(me(o)), bt(o)))
            for (let a = 10; a < o.length; a++) {
              const u = o[a],
                l = u[1].firstChild;
              null !== l && bs(u[1], u, l, r);
            }
          const s = n.type;
          if (8 & s) bs(e, t, n.child, r);
          else if (32 & s) {
            const a = Nu(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = Yh(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = xi(t[16]);
              bs(u[1], u, a, r, !0);
            }
          }
          n = i ? n.projectionNext : n.next;
        }
        return r;
      }
      class Qi {
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const t = this._lView,
            n = t[1];
          return bs(n, t, n.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 256 == (256 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (bt(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (ku(t, r), Zo(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          $h(this._lView[1], this._lView);
        }
        onDestroy(t) {
          !(function bp(e, t, n, r) {
            const i = Op(t);
            null === n
              ? i.push(r)
              : (i.push(n), e.firstCreatePass && Pp(e).push(r, i.length - 1));
          })(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          ol(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -129;
        }
        reattach() {
          this._lView[2] |= 128;
        }
        detectChanges() {
          al(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {
          !(function V0(e, t, n) {
            Vo(!0);
            try {
              al(e, t, n);
            } finally {
              Vo(!1);
            }
          })(this._lView[1], this._lView, this.context);
        }
        attachToViewContainerRef() {
          if (this._appRef) throw new $(902, "");
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function Rb(e, t) {
              Ni(e, t, t[k], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new $(902, "");
          this._appRef = t;
        }
      }
      class kS extends Qi {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          Fp(this._view);
        }
        checkNoChanges() {
          !(function L0(e) {
            Vo(!0);
            try {
              Fp(e);
            } finally {
              Vo(!1);
            }
          })(this._view);
        }
        get context() {
          return null;
        }
      }
      class qm extends qi {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = Re(t);
          return new kl(n, this.ngModule);
        }
      }
      function Wm(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class kl extends $m {
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function Yb(e) {
              return e.map(Jb).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        get inputs() {
          return Wm(this.componentDef.inputs);
        }
        get outputs() {
          return Wm(this.componentDef.outputs);
        }
        create(t, n, r, i) {
          const o = (i = i || this.ngModule)
              ? (function LS(e, t) {
                  return {
                    get: (n, r, i) => {
                      const o = e.get(n, Pl, i);
                      return o !== Pl || r === Pl ? o : t.get(n, r, i);
                    },
                  };
                })(t, i.injector)
              : t,
            s = o.get(zm, Ff),
            a = o.get(OS, null),
            u = s.createRenderer(null, this.componentDef),
            l = this.componentDef.selectors[0][0] || "div",
            c = r
              ? (function Ep(e, t, n) {
                  if (le(e)) return e.selectRootElement(t, n === Lt.ShadowDom);
                  let r = "string" == typeof t ? e.querySelector(t) : t;
                  return (r.textContent = ""), r;
                })(u, r, this.componentDef.encapsulation)
              : Pu(
                  s.createRenderer(null, this.componentDef),
                  l,
                  (function VS(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(l)
                ),
            d = this.componentDef.onPush ? 576 : 528,
            f = (function tg(e, t) {
              return {
                components: [],
                scheduler: e || bb,
                clean: j0,
                playerHandler: t || null,
                flags: 0,
              };
            })(),
            h = cs(0, null, null, 1, 0, null, null, null, null, null),
            p = Ri(null, h, f, d, null, null, s, u, a, o);
          let m, D;
          Lo(p);
          try {
            const _ = (function Xp(e, t, n, r, i, o) {
              const s = n[1];
              n[20] = e;
              const u = Ar(s, 20, 2, "#host", null),
                l = (u.mergedAttrs = t.hostAttrs);
              null !== l &&
                (fs(u, l, !0),
                null !== e &&
                  ($o(i, e, l),
                  null !== u.classes && Hu(i, e, u.classes),
                  null !== u.styles && tp(i, e, u.styles)));
              const c = r.createRenderer(e, t),
                d = Ri(
                  n,
                  Cp(t),
                  null,
                  t.onPush ? 64 : 16,
                  n[20],
                  u,
                  r,
                  c,
                  o || null,
                  null
                );
              return (
                s.firstCreatePass &&
                  (Wo(pi(u, n), s, t.type), Tp(s, u), xp(u, n.length, 1)),
                ds(n, d),
                (n[20] = d)
              );
            })(c, this.componentDef, p, s, u);
            if (c)
              if (r) $o(u, c, ["ng-version", PS.full]);
              else {
                const { attrs: g, classes: E } = (function Xb(e) {
                  const t = [],
                    n = [];
                  let r = 1,
                    i = 2;
                  for (; r < e.length; ) {
                    let o = e[r];
                    if ("string" == typeof o)
                      2 === i
                        ? "" !== o && t.push(o, e[++r])
                        : 8 === i && n.push(o);
                    else {
                      if (!At(i)) break;
                      i = o;
                    }
                    r++;
                  }
                  return { attrs: t, classes: n };
                })(this.componentDef.selectors[0]);
                g && $o(u, c, g), E && E.length > 0 && Hu(u, c, E.join(" "));
              }
            if (((D = Ja(h, 20)), void 0 !== n)) {
              const g = (D.projection = []);
              for (let E = 0; E < this.ngContentSelectors.length; E++) {
                const F = n[E];
                g.push(null != F ? Array.from(F) : null);
              }
            }
            (m = (function eg(e, t, n, r, i) {
              const o = n[1],
                s = (function C0(e, t, n) {
                  const r = Ce();
                  e.firstCreatePass &&
                    (n.providersResolver && n.providersResolver(n),
                    Np(e, r, t, Sr(e, t, 1, null), n));
                  const i = gi(t, e, r.directiveStart, r);
                  Pe(i, t);
                  const o = mt(r, t);
                  return o && Pe(o, t), i;
                })(o, n, t);
              if (
                (r.components.push(s),
                (e[8] = s),
                i && i.forEach((u) => u(s, t)),
                t.contentQueries)
              ) {
                const u = Ce();
                t.contentQueries(1, s, u.directiveStart);
              }
              const a = Ce();
              return (
                !o.firstCreatePass ||
                  (null === t.hostBindings && null === t.hostAttrs) ||
                  (wn(a.index),
                  Sp(n[1], a, 0, a.directiveStart, a.directiveEnd, t),
                  Ip(t, s)),
                s
              );
            })(_, this.componentDef, p, f, [oM])),
              Fi(h, p, null);
          } finally {
            jo();
          }
          return new BS(this.componentType, m, zr(D, p), p, D);
        }
      }
      class BS extends class SS {} {
        constructor(t, n, r, i, o) {
          super(),
            (this.location = r),
            (this._rootLView = i),
            (this._tNode = o),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new kS(i)),
            (this.componentType = t);
        }
        get injector() {
          return new mr(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      class dn {}
      class Qm {}
      const qr = new Map();
      class Jm extends dn {
        constructor(t, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.injector = this),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new qm(this));
          const r = ft(t);
          (this._bootstrapComponents = $t(r.bootstrap)),
            (this._r3Injector = Up(
              t,
              n,
              [
                { provide: dn, useValue: this },
                { provide: qi, useValue: this.componentFactoryResolver },
              ],
              Z(t)
            )),
            this._r3Injector._resolveInjectorDefTypes(),
            (this.instance = this.get(t));
        }
        get(t, n = ke.THROW_IF_NOT_FOUND, r = T.Default) {
          return t === ke || t === dn || t === ll
            ? this
            : this._r3Injector.get(t, n, r);
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class Vl extends Qm {
        constructor(t) {
          super(),
            (this.moduleType = t),
            null !== ft(t) &&
              (function US(e) {
                const t = new Set();
                !(function n(r) {
                  const i = ft(r, !0),
                    o = i.id;
                  null !== o &&
                    ((function Zm(e, t, n) {
                      if (t && t !== n)
                        throw new Error(
                          `Duplicate module registered for ${e} - ${Z(
                            t
                          )} vs ${Z(t.name)}`
                        );
                    })(o, qr.get(o), r),
                    qr.set(o, r));
                  const s = $t(i.imports);
                  for (const a of s) t.has(a) || (t.add(a), n(a));
                })(e);
              })(t);
        }
        create(t) {
          return new Jm(this.moduleType, t);
        }
      }
      function Xm(e, t, n, r, i, o) {
        const s = t + n;
        return Ve(e, s, i)
          ? zt(e, s + 1, o ? r.call(o, i) : r(i))
          : (function Zi(e, t) {
              const n = e[t];
              return n === N ? void 0 : n;
            })(e, s + 1);
      }
      function Ll(e, t) {
        const n = G();
        let r;
        const i = e + 20;
        n.firstCreatePass
          ? ((r = (function YS(e, t) {
              if (t)
                for (let n = t.length - 1; n >= 0; n--) {
                  const r = t[n];
                  if (e === r.name) return r;
                }
            })(t, n.pipeRegistry)),
            (n.data[i] = r),
            r.onDestroy &&
              (n.destroyHooks || (n.destroyHooks = [])).push(i, r.onDestroy))
          : (r = n.data[i]);
        const o = r.factory || (r.factory = zn(r.type)),
          s = vn(v);
        try {
          const a = zo(!1),
            u = o();
          return (
            zo(a),
            (function yM(e, t, n, r) {
              n >= e.data.length &&
                ((e.data[n] = null), (e.blueprint[n] = null)),
                (t[n] = r);
            })(n, y(), i, u),
            u
          );
        } finally {
          vn(s);
        }
      }
      function jl(e, t, n) {
        const r = e + 20,
          i = y(),
          o = (function fr(e, t) {
            return e[t];
          })(i, r);
        return (function Ki(e, t) {
          return e[1].data[t].pure;
        })(i, r)
          ? Xm(i, He(), t, o.transform, n, o)
          : o.transform(n);
      }
      function Bl(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const fe = class rI extends Xt {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          var i, o, s;
          let a = t,
            u = n || (() => null),
            l = r;
          if (t && "object" == typeof t) {
            const d = t;
            (a = null === (i = d.next) || void 0 === i ? void 0 : i.bind(d)),
              (u = null === (o = d.error) || void 0 === o ? void 0 : o.bind(d)),
              (l =
                null === (s = d.complete) || void 0 === s ? void 0 : s.bind(d));
          }
          this.__isAsync && ((u = Bl(u)), a && (a = Bl(a)), l && (l = Bl(l)));
          const c = super.subscribe({ next: a, error: u, complete: l });
          return t instanceof ct && t.add(c), c;
        }
      };
      Symbol;
      let fn = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = aI), e;
      })();
      const oI = fn,
        sI = class extends oI {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          createEmbeddedView(t) {
            const n = this._declarationTContainer.tViews,
              r = Ri(
                this._declarationLView,
                n,
                t,
                16,
                null,
                n.declTNode,
                null,
                null,
                null,
                null
              );
            r[17] = this._declarationLView[this._declarationTContainer.index];
            const o = this._declarationLView[19];
            return (
              null !== o && (r[19] = o.createEmbeddedView(n)),
              Fi(n, r, t),
              new Qi(r)
            );
          }
        };
      function aI() {
        return (function Ms(e, t) {
          return 4 & e.type ? new sI(t, e, zr(e, t)) : null;
        })(Ce(), y());
      }
      let Rt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = uI), e;
      })();
      function uI() {
        return (function sy(e, t) {
          let n;
          const r = t[e.index];
          if (bt(r)) n = r;
          else {
            let i;
            if (8 & e.type) i = me(r);
            else {
              const o = t[k];
              i = o.createComment("");
              const s = mt(e, t);
              qn(
                o,
                is(o, s),
                i,
                (function jb(e, t) {
                  return le(e) ? e.nextSibling(t) : t.nextSibling;
                })(o, s),
                !1
              );
            }
            (t[e.index] = n = Rp(r, t, i, e)), ds(t, n);
          }
          return new iy(n, e, t);
        })(Ce(), y());
      }
      const lI = Rt,
        iy = class extends lI {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return zr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new mr(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = qo(this._hostTNode, this._hostLView);
            if (Kf(t)) {
              const n = gr(t, this._hostLView),
                r = pr(t);
              return new mr(n[1].data[r + 8], n);
            }
            return new mr(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = oy(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, n, r) {
            const i = t.createEmbeddedView(n || {});
            return this.insert(i, r), i;
          }
          createComponent(t, n, r, i, o) {
            const s =
              t &&
              !(function vi(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (i = d.projectableNodes),
                (o = d.ngModuleRef);
            }
            const u = s ? t : new kl(Re(t)),
              l = r || this.parentInjector;
            if (!o && null == u.ngModule) {
              const f = (s ? l : this.parentInjector).get(dn, null);
              f && (o = f);
            }
            const c = u.create(l, i, void 0, o);
            return this.insert(c.hostView, a), c;
          }
          insert(t, n) {
            const r = t._lView,
              i = r[1];
            if (
              (function Tw(e) {
                return bt(e[3]);
              })(r)
            ) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  f = new iy(d, d[6], d[3]);
                f.detach(f.indexOf(t));
              }
            }
            const o = this._adjustIndex(n),
              s = this._lContainer;
            !(function Ob(e, t, n, r) {
              const i = 10 + r,
                o = n.length;
              r > 0 && (n[i - 1][4] = t),
                r < o - 10
                  ? ((t[4] = n[i]), sh(n, 10 + r, t))
                  : (n.push(t), (t[4] = null)),
                (t[3] = n);
              const s = t[17];
              null !== s &&
                n !== s &&
                (function Pb(e, t) {
                  const n = e[9];
                  t[16] !== t[3][3][16] && (e[2] = !0),
                    null === n ? (e[9] = [t]) : n.push(t);
                })(s, t);
              const a = t[19];
              null !== a && a.insertView(e), (t[2] |= 128);
            })(i, r, s, o);
            const a = ju(o, s),
              u = r[k],
              l = is(u, s[7]);
            return (
              null !== l &&
                (function Nb(e, t, n, r, i, o) {
                  (r[0] = i), (r[6] = t), Ni(e, r, n, 1, i, o);
                })(i, s[6], u, r, l, a),
              t.attachToViewContainerRef(),
              sh(Ul(s), o, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = oy(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = ku(this._lContainer, n);
            r && (Zo(Ul(this._lContainer), n), $h(r[1], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = ku(this._lContainer, n);
            return r && null != Zo(Ul(this._lContainer), n) ? new Qi(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return null == t ? this.length + n : t;
          }
        };
      function oy(e) {
        return e[8];
      }
      function Ul(e) {
        return e[8] || (e[8] = []);
      }
      function Is(...e) {}
      const nc = new L("Application Initializer");
      let rc = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = Is),
              (this.reject = Is),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, i) => {
                (this.resolve = r), (this.reject = i);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let i = 0; i < this.appInits.length; i++) {
                const o = this.appInits[i]();
                if (Li(o)) n.push(o);
                else if (Ml(o)) {
                  const s = new Promise((a, u) => {
                    o.subscribe({ complete: a, error: u });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((i) => {
                this.reject(i);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(nc, 8));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Yi = new L("AppId", {
        providedIn: "root",
        factory: function Iy() {
          return `${ic()}${ic()}${ic()}`;
        },
      });
      function ic() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Ty = new L("Platform Initializer"),
        Ts = new L("Platform ID"),
        xy = new L("appBootstrapListener");
      let Ny = (() => {
        class e {
          log(n) {
            console.log(n);
          }
          warn(n) {
            console.warn(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const In = new L("LocaleId", {
          providedIn: "root",
          factory: () =>
            CE(In, T.Optional | T.SkipSelf) ||
            (function kI() {
              return (
                ("undefined" != typeof $localize && $localize.locale) || _s
              );
            })(),
        }),
        VI = new L("DefaultCurrencyCode", {
          providedIn: "root",
          factory: () => "USD",
        });
      class LI {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let Ry = (() => {
        class e {
          compileModuleSync(n) {
            return new Vl(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              o = $t(ft(n).declarations).reduce((s, a) => {
                const u = Re(a);
                return u && s.push(new kl(u)), s;
              }, []);
            return new LI(r, o);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const BI = (() => Promise.resolve(0))();
      function oc(e) {
        "undefined" == typeof Zone
          ? BI.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class xe {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new fe(!1)),
            (this.onMicrotaskEmpty = new fe(!1)),
            (this.onStable = new fe(!1)),
            (this.onError = new fe(!1)),
            "undefined" == typeof Zone)
          )
            throw new Error("In this configuration Angular requires Zone.js");
          Zone.assertZonePatched();
          const i = this;
          (i._nesting = 0),
            (i._outer = i._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !r && n),
            (i.shouldCoalesceRunChangeDetection = r),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function HI() {
              let e = J.requestAnimationFrame,
                t = J.cancelAnimationFrame;
              if ("undefined" != typeof Zone && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function GI(e) {
              const t = () => {
                !(function $I(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(J, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                ac(e),
                                (e.isCheckStableRunning = !0),
                                sc(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    ac(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, i, o, s, a) => {
                  try {
                    return Fy(e), n.invokeTask(i, o, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === o.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      Oy(e);
                  }
                },
                onInvoke: (n, r, i, o, s, a, u) => {
                  try {
                    return Fy(e), n.invoke(i, o, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), Oy(e);
                  }
                },
                onHasTask: (n, r, i, o) => {
                  n.hasTask(i, o),
                    r === i &&
                      ("microTask" == o.change
                        ? ((e._hasPendingMicrotasks = o.microTask),
                          ac(e),
                          sc(e))
                        : "macroTask" == o.change &&
                          (e.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (n, r, i, o) => (
                  n.handleError(i, o),
                  e.runOutsideAngular(() => e.onError.emit(o)),
                  !1
                ),
              });
            })(i);
        }
        static isInAngularZone() {
          return (
            "undefined" != typeof Zone &&
            !0 === Zone.current.get("isAngularZone")
          );
        }
        static assertInAngularZone() {
          if (!xe.isInAngularZone())
            throw new Error("Expected to be in Angular Zone, but it is not!");
        }
        static assertNotInAngularZone() {
          if (xe.isInAngularZone())
            throw new Error("Expected to not be in Angular Zone, but it is!");
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, i) {
          const o = this._inner,
            s = o.scheduleEventTask("NgZoneEvent: " + i, t, UI, Is, Is);
          try {
            return o.runTask(s, n, r);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const UI = {};
      function sc(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function ac(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Fy(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function Oy(e) {
        e._nesting--, sc(e);
      }
      class zI {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new fe()),
            (this.onMicrotaskEmpty = new fe()),
            (this.onStable = new fe()),
            (this.onError = new fe());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, i) {
          return t.apply(n, r);
        }
      }
      let uc = (() => {
          class e {
            constructor(n) {
              (this._ngZone = n),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    "undefined" == typeof Zone
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      xe.assertNotInAngularZone(),
                        oc(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                oc(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, i) {
              let o = -1;
              r &&
                r > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== o
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: o, updateCb: i });
            }
            whenStable(n, r, i) {
              if (i && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, i), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            findProviders(n, r, i) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(b(xe));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Py = (() => {
          class e {
            constructor() {
              (this._applications = new Map()), lc.addToWindow(this);
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return lc.findTestabilityInTree(this, n, r);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      class qI {
        addToWindow(t) {}
        findTestabilityInTree(t, n, r) {
          return null;
        }
      }
      let Ft,
        lc = new qI();
      const ky = new L("AllowMultipleToken");
      class Vy {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function Ly(e, t, n = []) {
        const r = `Platform: ${t}`,
          i = new L(r);
        return (o = []) => {
          let s = jy();
          if (!s || s.injector.get(ky, !1))
            if (e) e(n.concat(o).concat({ provide: i, useValue: !0 }));
            else {
              const a = n
                .concat(o)
                .concat(
                  { provide: i, useValue: !0 },
                  { provide: cl, useValue: "platform" }
                );
              !(function KI(e) {
                if (Ft && !Ft.destroyed && !Ft.injector.get(ky, !1))
                  throw new $(400, "");
                Ft = e.get(By);
                const t = e.get(Ty, null);
                t && t.forEach((n) => n());
              })(ke.create({ providers: a, name: r }));
            }
          return (function JI(e) {
            const t = jy();
            if (!t) throw new $(401, "");
            return t;
          })();
        };
      }
      function jy() {
        return Ft && !Ft.destroyed ? Ft : null;
      }
      let By = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const a = (function YI(e, t) {
                let n;
                return (
                  (n =
                    "noop" === e
                      ? new zI()
                      : ("zone.js" === e ? void 0 : e) ||
                        new xe({
                          enableLongStackTrace: !1,
                          shouldCoalesceEventChangeDetection: !!(null == t
                            ? void 0
                            : t.ngZoneEventCoalescing),
                          shouldCoalesceRunChangeDetection: !!(null == t
                            ? void 0
                            : t.ngZoneRunCoalescing),
                        })),
                  n
                );
              })(r ? r.ngZone : void 0, {
                ngZoneEventCoalescing: (r && r.ngZoneEventCoalescing) || !1,
                ngZoneRunCoalescing: (r && r.ngZoneRunCoalescing) || !1,
              }),
              u = [{ provide: xe, useValue: a }];
            return a.run(() => {
              const l = ke.create({
                  providers: u,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                c = n.create(l),
                d = c.injector.get(Ti, null);
              if (!d) throw new $(402, "");
              return (
                a.runOutsideAngular(() => {
                  const f = a.onError.subscribe({
                    next: (h) => {
                      d.handleError(h);
                    },
                  });
                  c.onDestroy(() => {
                    dc(this._modules, c), f.unsubscribe();
                  });
                }),
                (function XI(e, t, n) {
                  try {
                    const r = n();
                    return Li(r)
                      ? r.catch((i) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(i)), i)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(d, a, () => {
                  const f = c.injector.get(rc);
                  return (
                    f.runInitializers(),
                    f.donePromise.then(
                      () => (
                        (function RA(e) {
                          Ye(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (vm = e.toLowerCase().replace(/_/g, "-"));
                        })(c.injector.get(In, _s) || _s),
                        this._moduleDoBootstrap(c),
                        c
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const i = Hy({}, r);
            return (function QI(e, t, n) {
              const r = new Vl(n);
              return Promise.resolve(r);
            })(0, 0, n).then((o) => this.bootstrapModuleFactory(o, i));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(cc);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((i) => r.bootstrap(i));
            else {
              if (!n.instance.ngDoBootstrap) throw new $(403, "");
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new $(404, "");
            this._modules.slice().forEach((n) => n.destroy()),
              this._destroyListeners.forEach((n) => n()),
              (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(ke));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function Hy(e, t) {
        return Array.isArray(t)
          ? t.reduce(Hy, e)
          : Object.assign(Object.assign({}, e), t);
      }
      let cc = (() => {
        class e {
          constructor(n, r, i, o, s) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = i),
              (this._componentFactoryResolver = o),
              (this._initStatus = s),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const a = new he((l) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    l.next(this._stable), l.complete();
                  });
              }),
              u = new he((l) => {
                let c;
                this._zone.runOutsideAngular(() => {
                  c = this._zone.onStable.subscribe(() => {
                    xe.assertNotInAngularZone(),
                      oc(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), l.next(!0));
                      });
                  });
                });
                const d = this._zone.onUnstable.subscribe(() => {
                  xe.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        l.next(!1);
                      }));
                });
                return () => {
                  c.unsubscribe(), d.unsubscribe();
                };
              });
            this.isStable = (function QC(...e) {
              const t = si(e),
                n = (function HC(e, t) {
                  return "number" == typeof Ra(e) ? e.pop() : t;
                })(e, 1 / 0),
                r = e;
              return r.length
                ? 1 === r.length
                  ? Vt(r[0])
                  : oi(n)(Se(r, t))
                : tn;
            })(
              a,
              u.pipe(
                (function ZC(e = {}) {
                  const {
                    connector: t = () => new Xt(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: i = !0,
                  } = e;
                  return (o) => {
                    let s = null,
                      a = null,
                      u = null,
                      l = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        null == a || a.unsubscribe(), (a = null);
                      },
                      h = () => {
                        f(), (s = u = null), (c = d = !1);
                      },
                      p = () => {
                        const m = s;
                        h(), null == m || m.unsubscribe();
                      };
                    return Te((m, D) => {
                      l++, !d && !c && f();
                      const _ = (u = null != u ? u : t());
                      D.add(() => {
                        l--, 0 === l && !d && !c && (a = Fa(p, i));
                      }),
                        _.subscribe(D),
                        s ||
                          ((s = new ii({
                            next: (g) => _.next(g),
                            error: (g) => {
                              (d = !0), f(), (a = Fa(h, n, g)), _.error(g);
                            },
                            complete: () => {
                              (c = !0), f(), (a = Fa(h, r)), _.complete();
                            },
                          })),
                          Se(m).subscribe(s));
                    })(o);
                  };
                })()
              )
            );
          }
          bootstrap(n, r) {
            if (!this._initStatus.done) throw new $(405, "");
            let i;
            (i =
              n instanceof $m
                ? n
                : this._componentFactoryResolver.resolveComponentFactory(n)),
              this.componentTypes.push(i.componentType);
            const o = (function ZI(e) {
                return e.isBoundToModule;
              })(i)
                ? void 0
                : this._injector.get(dn),
              a = i.create(ke.NULL, [], r || i.selector, o),
              u = a.location.nativeElement,
              l = a.injector.get(uc, null),
              c = l && a.injector.get(Py);
            return (
              l && c && c.registerApplication(u, l),
              a.onDestroy(() => {
                this.detachView(a.hostView),
                  dc(this.components, a),
                  c && c.unregisterApplication(u);
              }),
              this._loadComponent(a),
              a
            );
          }
          tick() {
            if (this._runningTick) throw new $(101, "");
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            dc(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView),
              this.tick(),
              this.components.push(n),
              this._injector
                .get(xy, [])
                .concat(this._bootstrapListeners)
                .forEach((i) => i(n));
          }
          ngOnDestroy() {
            this._views.slice().forEach((n) => n.destroy()),
              this._onMicrotaskEmptySubscription.unsubscribe();
          }
          get viewCount() {
            return this._views.length;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(xe), b(ke), b(Ti), b(qi), b(rc));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function dc(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      let $y = !0,
        xs = (() => {
          class e {}
          return (e.__NG_ELEMENT_ID__ = nT), e;
        })();
      function nT(e) {
        return (function rT(e, t, n) {
          if (Fo(e) && !n) {
            const r = tt(e.index, t);
            return new Qi(r, r);
          }
          return 47 & e.type ? new Qi(t[16], t) : null;
        })(Ce(), y(), 16 == (16 & e));
      }
      class Qy {
        constructor() {}
        supports(t) {
          return Pi(t);
        }
        create(t) {
          return new lT(t);
        }
      }
      const uT = (e, t) => t;
      class lT {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || uT);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            i = 0,
            o = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < Ky(r, i, o)) ? n : r,
              a = Ky(s, i, o),
              u = s.currentIndex;
            if (s === r) i--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) i++;
            else {
              o || (o = []);
              const l = a - i,
                c = u - i;
              if (l != c) {
                for (let f = 0; f < l; f++) {
                  const h = f < o.length ? o[f] : (o[f] = 0),
                    p = h + f;
                  c <= p && p < l && (o[f] = h + 1);
                }
                o[s.previousIndex] = c - l;
              }
            }
            a !== u && t(s, a, u);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !Pi(t))) throw new $(900, "");
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let i,
            o,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (o = t[a]),
                (s = this._trackByFn(a, o)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, o, s, a)),
                    Object.is(n.item, o) || this._addIdentityChange(n, o))
                  : ((n = this._mismatch(n, o, s, a)), (r = !0)),
                (n = n._next);
          } else
            (i = 0),
              (function gM(e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Nr()]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(i, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, i)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, i)), (r = !0)),
                  (n = n._next),
                  i++;
              }),
              (this.length = i);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, i) {
          let o;
          return (
            null === t ? (o = this._itTail) : ((o = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, o, i))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, i))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, o, i))
              : (t = this._addAfter(new cT(n, r), o, i)),
            t
          );
        }
        _verifyReinsertion(t, n, r, i) {
          let o =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== o
              ? (t = this._reinsertAfter(o, t._prev, i))
              : t.currentIndex != i &&
                ((t.currentIndex = i), this._addToMoves(t, i)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const i = t._prevRemoved,
            o = t._nextRemoved;
          return (
            null === i ? (this._removalsHead = o) : (i._nextRemoved = o),
            null === o ? (this._removalsTail = i) : (o._prevRemoved = i),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const i = null === n ? this._itHead : n._next;
          return (
            (t._next = i),
            (t._prev = n),
            null === i ? (this._itTail = t) : (i._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new Zy()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new Zy()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class cT {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class dT {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class Zy {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new dT()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const i = this.map.get(t);
          return i ? i.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function Ky(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let i = 0;
        return n && r < n.length && (i = n[r]), r + t + i;
      }
      function Yy() {
        return new Fs([new Qy()]);
      }
      let Fs = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const i = r.factories.slice();
              n = n.concat(i);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || Yy()),
              deps: [[e, new Ei(), new bn()]],
            };
          }
          find(n) {
            const r = this.factories.find((i) => i.supports(n));
            if (null != r) return r;
            throw new $(901, "");
          }
        }
        return (e.ɵprov = R({ token: e, providedIn: "root", factory: Yy })), e;
      })();
      const mT = Ly(null, "core", [
        { provide: Ts, useValue: "unknown" },
        { provide: By, deps: [ke] },
        { provide: Py, deps: [] },
        { provide: Ny, deps: [] },
      ]);
      let yT = (() => {
          class e {
            constructor(n) {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(b(cc));
            }),
            (e.ɵmod = dt({ type: e })),
            (e.ɵinj = Xe({})),
            e
          );
        })(),
        Os = null;
      function Zt() {
        return Os;
      }
      const at = new L("DocumentToken");
      let Kn = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return (function CT() {
                return b(ev);
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const wT = new L("Location Initialized");
      let ev = (() => {
        class e extends Kn {
          constructor(n) {
            super(), (this._doc = n), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Zt().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = Zt().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = Zt().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(n) {
            this.location.pathname = n;
          }
          pushState(n, r, i) {
            tv() ? this._history.pushState(n, r, i) : (this.location.hash = i);
          }
          replaceState(n, r, i) {
            tv()
              ? this._history.replaceState(n, r, i)
              : (this.location.hash = i);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(at));
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return (function ET() {
                return new ev(b(at));
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function tv() {
        return !!window.history.pushState;
      }
      function mc(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++,
          t.startsWith("/") && n++,
          2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function nv(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function hn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let Qr = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return (function bT(e) {
                const t = b(at).location;
                return new rv(b(Kn), (t && t.origin) || "");
              })();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const yc = new L("appBaseHref");
      let rv = (() => {
          class e extends Qr {
            constructor(n, r) {
              if (
                (super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                null == r && (r = this._platformLocation.getBaseHrefFromDOM()),
                null == r)
              )
                throw new Error(
                  "No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document."
                );
              this._baseHref = r;
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return mc(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  hn(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && n ? `${r}${i}` : r;
            }
            pushState(n, r, i, o) {
              const s = this.prepareExternalUrl(i + hn(o));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, i, o) {
              const s = this.prepareExternalUrl(i + hn(o));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            historyGo(n = 0) {
              var r, i;
              null === (i = (r = this._platformLocation).historyGo) ||
                void 0 === i ||
                i.call(r, n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(b(Kn), b(yc, 8));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        MT = (() => {
          class e extends Qr {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = mc(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, i, o) {
              let s = this.prepareExternalUrl(i + hn(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, i, o) {
              let s = this.prepareExternalUrl(i + hn(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            historyGo(n = 0) {
              var r, i;
              null === (i = (r = this._platformLocation).historyGo) ||
                void 0 === i ||
                i.call(r, n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(b(Kn), b(yc, 8));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        vc = (() => {
          class e {
            constructor(n, r) {
              (this._subject = new fe()),
                (this._urlChangeListeners = []),
                (this._platformStrategy = n);
              const i = this._platformStrategy.getBaseHref();
              (this._platformLocation = r),
                (this._baseHref = nv(iv(i))),
                this._platformStrategy.onPopState((o) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type,
                  });
                });
            }
            path(n = !1) {
              return this.normalize(this._platformStrategy.path(n));
            }
            getState() {
              return this._platformLocation.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + hn(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function ST(e, t) {
                  return e && t.startsWith(e) ? t.substring(e.length) : t;
                })(this._baseHref, iv(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._platformStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", i = null) {
              this._platformStrategy.pushState(i, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + hn(r)),
                  i
                );
            }
            replaceState(n, r = "", i = null) {
              this._platformStrategy.replaceState(i, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + hn(r)),
                  i
                );
            }
            forward() {
              this._platformStrategy.forward();
            }
            back() {
              this._platformStrategy.back();
            }
            historyGo(n = 0) {
              var r, i;
              null === (i = (r = this._platformStrategy).historyGo) ||
                void 0 === i ||
                i.call(r, n);
            }
            onUrlChange(n) {
              this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  }));
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((i) => i(n, r));
            }
            subscribe(n, r, i) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: i,
              });
            }
          }
          return (
            (e.normalizeQueryParams = hn),
            (e.joinWithSlash = mc),
            (e.stripTrailingSlash = nv),
            (e.ɵfac = function (n) {
              return new (n || e)(b(Qr), b(Kn));
            }),
            (e.ɵprov = R({
              token: e,
              factory: function () {
                return (function AT() {
                  return new vc(b(Qr), b(Kn));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function iv(e) {
        return e.replace(/\/index.html$/, "");
      }
      const ov = {
        ADP: [void 0, void 0, 0],
        AFN: [void 0, "\u060b", 0],
        ALL: [void 0, void 0, 0],
        AMD: [void 0, "\u058f", 2],
        AOA: [void 0, "Kz"],
        ARS: [void 0, "$"],
        AUD: ["A$", "$"],
        AZN: [void 0, "\u20bc"],
        BAM: [void 0, "KM"],
        BBD: [void 0, "$"],
        BDT: [void 0, "\u09f3"],
        BHD: [void 0, void 0, 3],
        BIF: [void 0, void 0, 0],
        BMD: [void 0, "$"],
        BND: [void 0, "$"],
        BOB: [void 0, "Bs"],
        BRL: ["R$"],
        BSD: [void 0, "$"],
        BWP: [void 0, "P"],
        BYN: [void 0, "\u0440.", 2],
        BYR: [void 0, void 0, 0],
        BZD: [void 0, "$"],
        CAD: ["CA$", "$", 2],
        CHF: [void 0, void 0, 2],
        CLF: [void 0, void 0, 4],
        CLP: [void 0, "$", 0],
        CNY: ["CN\xa5", "\xa5"],
        COP: [void 0, "$", 2],
        CRC: [void 0, "\u20a1", 2],
        CUC: [void 0, "$"],
        CUP: [void 0, "$"],
        CZK: [void 0, "K\u010d", 2],
        DJF: [void 0, void 0, 0],
        DKK: [void 0, "kr", 2],
        DOP: [void 0, "$"],
        EGP: [void 0, "E\xa3"],
        ESP: [void 0, "\u20a7", 0],
        EUR: ["\u20ac"],
        FJD: [void 0, "$"],
        FKP: [void 0, "\xa3"],
        GBP: ["\xa3"],
        GEL: [void 0, "\u20be"],
        GHS: [void 0, "GH\u20b5"],
        GIP: [void 0, "\xa3"],
        GNF: [void 0, "FG", 0],
        GTQ: [void 0, "Q"],
        GYD: [void 0, "$", 2],
        HKD: ["HK$", "$"],
        HNL: [void 0, "L"],
        HRK: [void 0, "kn"],
        HUF: [void 0, "Ft", 2],
        IDR: [void 0, "Rp", 2],
        ILS: ["\u20aa"],
        INR: ["\u20b9"],
        IQD: [void 0, void 0, 0],
        IRR: [void 0, void 0, 0],
        ISK: [void 0, "kr", 0],
        ITL: [void 0, void 0, 0],
        JMD: [void 0, "$"],
        JOD: [void 0, void 0, 3],
        JPY: ["\xa5", void 0, 0],
        KHR: [void 0, "\u17db"],
        KMF: [void 0, "CF", 0],
        KPW: [void 0, "\u20a9", 0],
        KRW: ["\u20a9", void 0, 0],
        KWD: [void 0, void 0, 3],
        KYD: [void 0, "$"],
        KZT: [void 0, "\u20b8"],
        LAK: [void 0, "\u20ad", 0],
        LBP: [void 0, "L\xa3", 0],
        LKR: [void 0, "Rs"],
        LRD: [void 0, "$"],
        LTL: [void 0, "Lt"],
        LUF: [void 0, void 0, 0],
        LVL: [void 0, "Ls"],
        LYD: [void 0, void 0, 3],
        MGA: [void 0, "Ar", 0],
        MGF: [void 0, void 0, 0],
        MMK: [void 0, "K", 0],
        MNT: [void 0, "\u20ae", 2],
        MRO: [void 0, void 0, 0],
        MUR: [void 0, "Rs", 2],
        MXN: ["MX$", "$"],
        MYR: [void 0, "RM"],
        NAD: [void 0, "$"],
        NGN: [void 0, "\u20a6"],
        NIO: [void 0, "C$"],
        NOK: [void 0, "kr", 2],
        NPR: [void 0, "Rs"],
        NZD: ["NZ$", "$"],
        OMR: [void 0, void 0, 3],
        PHP: ["\u20b1"],
        PKR: [void 0, "Rs", 2],
        PLN: [void 0, "z\u0142"],
        PYG: [void 0, "\u20b2", 0],
        RON: [void 0, "lei"],
        RSD: [void 0, void 0, 0],
        RUB: [void 0, "\u20bd"],
        RUR: [void 0, "\u0440."],
        RWF: [void 0, "RF", 0],
        SBD: [void 0, "$"],
        SEK: [void 0, "kr", 2],
        SGD: [void 0, "$"],
        SHP: [void 0, "\xa3"],
        SLL: [void 0, void 0, 0],
        SOS: [void 0, void 0, 0],
        SRD: [void 0, "$"],
        SSP: [void 0, "\xa3"],
        STD: [void 0, void 0, 0],
        STN: [void 0, "Db"],
        SYP: [void 0, "\xa3", 0],
        THB: [void 0, "\u0e3f"],
        TMM: [void 0, void 0, 0],
        TND: [void 0, void 0, 3],
        TOP: [void 0, "T$"],
        TRL: [void 0, void 0, 0],
        TRY: [void 0, "\u20ba"],
        TTD: [void 0, "$"],
        TWD: ["NT$", "$", 2],
        TZS: [void 0, void 0, 2],
        UAH: [void 0, "\u20b4"],
        UGX: [void 0, void 0, 0],
        USD: ["$"],
        UYI: [void 0, void 0, 0],
        UYU: [void 0, "$"],
        UYW: [void 0, void 0, 4],
        UZS: [void 0, void 0, 2],
        VEF: [void 0, "Bs", 2],
        VND: ["\u20ab", void 0, 0],
        VUV: [void 0, void 0, 0],
        XAF: ["FCFA", void 0, 0],
        XCD: ["EC$", "$"],
        XOF: ["F\u202fCFA", void 0, 0],
        XPF: ["CFPF", void 0, 0],
        XXX: ["\xa4"],
        YER: [void 0, void 0, 0],
        ZAR: [void 0, "R"],
        ZMK: [void 0, void 0, 0],
        ZMW: [void 0, "ZK"],
        ZWD: [void 0, void 0, 0],
      };
      var Ke = (() => (
          ((Ke = Ke || {})[(Ke.Decimal = 0)] = "Decimal"),
          (Ke[(Ke.Percent = 1)] = "Percent"),
          (Ke[(Ke.Currency = 2)] = "Currency"),
          (Ke[(Ke.Scientific = 3)] = "Scientific"),
          Ke
        ))(),
        M = (() => (
          ((M = M || {})[(M.Decimal = 0)] = "Decimal"),
          (M[(M.Group = 1)] = "Group"),
          (M[(M.List = 2)] = "List"),
          (M[(M.PercentSign = 3)] = "PercentSign"),
          (M[(M.PlusSign = 4)] = "PlusSign"),
          (M[(M.MinusSign = 5)] = "MinusSign"),
          (M[(M.Exponential = 6)] = "Exponential"),
          (M[(M.SuperscriptingExponent = 7)] = "SuperscriptingExponent"),
          (M[(M.PerMille = 8)] = "PerMille"),
          (M[(M.Infinity = 9)] = "Infinity"),
          (M[(M.NaN = 10)] = "NaN"),
          (M[(M.TimeSeparator = 11)] = "TimeSeparator"),
          (M[(M.CurrencyDecimal = 12)] = "CurrencyDecimal"),
          (M[(M.CurrencyGroup = 13)] = "CurrencyGroup"),
          M
        ))();
      function _t(e, t) {
        const n = Ge(e),
          r = n[w.NumberSymbols][t];
        if (void 0 === r) {
          if (t === M.CurrencyDecimal) return n[w.NumberSymbols][M.Decimal];
          if (t === M.CurrencyGroup) return n[w.NumberSymbols][M.Group];
        }
        return r;
      }
      const XT = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
      function rx(e, t, n, r, i) {
        const s = (function Mc(e, t = "-") {
          const n = {
              minInt: 1,
              minFrac: 0,
              maxFrac: 0,
              posPre: "",
              posSuf: "",
              negPre: "",
              negSuf: "",
              gSize: 0,
              lgSize: 0,
            },
            r = e.split(";"),
            i = r[0],
            o = r[1],
            s =
              -1 !== i.indexOf(".")
                ? i.split(".")
                : [
                    i.substring(0, i.lastIndexOf("0") + 1),
                    i.substring(i.lastIndexOf("0") + 1),
                  ],
            a = s[0],
            u = s[1] || "";
          n.posPre = a.substr(0, a.indexOf("#"));
          for (let c = 0; c < u.length; c++) {
            const d = u.charAt(c);
            "0" === d
              ? (n.minFrac = n.maxFrac = c + 1)
              : "#" === d
              ? (n.maxFrac = c + 1)
              : (n.posSuf += d);
          }
          const l = a.split(",");
          if (
            ((n.gSize = l[1] ? l[1].length : 0),
            (n.lgSize = l[2] || l[1] ? (l[2] || l[1]).length : 0),
            o)
          ) {
            const c = i.length - n.posPre.length - n.posSuf.length,
              d = o.indexOf("#");
            (n.negPre = o.substr(0, d).replace(/'/g, "")),
              (n.negSuf = o.substr(d + c).replace(/'/g, ""));
          } else (n.negPre = t + n.posPre), (n.negSuf = n.posSuf);
          return n;
        })(
          (function _c(e, t) {
            return Ge(e)[w.NumberFormats][t];
          })(t, Ke.Currency),
          _t(t, M.MinusSign)
        );
        return (
          (s.minFrac = (function jT(e) {
            let t;
            const n = ov[e];
            return n && (t = n[2]), "number" == typeof t ? t : 2;
          })(r)),
          (s.maxFrac = s.minFrac),
          (function bc(e, t, n, r, i, o, s = !1) {
            let a = "",
              u = !1;
            if (isFinite(e)) {
              let l = (function ax(e) {
                let r,
                  i,
                  o,
                  s,
                  a,
                  t = Math.abs(e) + "",
                  n = 0;
                for (
                  (i = t.indexOf(".")) > -1 && (t = t.replace(".", "")),
                    (o = t.search(/e/i)) > 0
                      ? (i < 0 && (i = o),
                        (i += +t.slice(o + 1)),
                        (t = t.substring(0, o)))
                      : i < 0 && (i = t.length),
                    o = 0;
                  "0" === t.charAt(o);
                  o++
                );
                if (o === (a = t.length)) (r = [0]), (i = 1);
                else {
                  for (a--; "0" === t.charAt(a); ) a--;
                  for (i -= o, r = [], s = 0; o <= a; o++, s++)
                    r[s] = Number(t.charAt(o));
                }
                return (
                  i > 22 && ((r = r.splice(0, 21)), (n = i - 1), (i = 1)),
                  { digits: r, exponent: n, integerLen: i }
                );
              })(e);
              s &&
                (l = (function sx(e) {
                  if (0 === e.digits[0]) return e;
                  const t = e.digits.length - e.integerLen;
                  return (
                    e.exponent
                      ? (e.exponent += 2)
                      : (0 === t
                          ? e.digits.push(0, 0)
                          : 1 === t && e.digits.push(0),
                        (e.integerLen += 2)),
                    e
                  );
                })(l));
              let c = t.minInt,
                d = t.minFrac,
                f = t.maxFrac;
              if (o) {
                const g = o.match(XT);
                if (null === g)
                  throw new Error(`${o} is not a valid digit info`);
                const E = g[1],
                  F = g[3],
                  q = g[5];
                null != E && (c = Ac(E)),
                  null != F && (d = Ac(F)),
                  null != q ? (f = Ac(q)) : null != F && d > f && (f = d);
              }
              !(function ux(e, t, n) {
                if (t > n)
                  throw new Error(
                    `The minimum number of digits after fraction (${t}) is higher than the maximum (${n}).`
                  );
                let r = e.digits,
                  i = r.length - e.integerLen;
                const o = Math.min(Math.max(t, i), n);
                let s = o + e.integerLen,
                  a = r[s];
                if (s > 0) {
                  r.splice(Math.max(e.integerLen, s));
                  for (let d = s; d < r.length; d++) r[d] = 0;
                } else {
                  (i = Math.max(0, i)),
                    (e.integerLen = 1),
                    (r.length = Math.max(1, (s = o + 1))),
                    (r[0] = 0);
                  for (let d = 1; d < s; d++) r[d] = 0;
                }
                if (a >= 5)
                  if (s - 1 < 0) {
                    for (let d = 0; d > s; d--) r.unshift(0), e.integerLen++;
                    r.unshift(1), e.integerLen++;
                  } else r[s - 1]++;
                for (; i < Math.max(0, o); i++) r.push(0);
                let u = 0 !== o;
                const l = t + e.integerLen,
                  c = r.reduceRight(function (d, f, h, p) {
                    return (
                      (p[h] = (f += d) < 10 ? f : f - 10),
                      u && (0 === p[h] && h >= l ? p.pop() : (u = !1)),
                      f >= 10 ? 1 : 0
                    );
                  }, 0);
                c && (r.unshift(c), e.integerLen++);
              })(l, d, f);
              let h = l.digits,
                p = l.integerLen;
              const m = l.exponent;
              let D = [];
              for (u = h.every((g) => !g); p < c; p++) h.unshift(0);
              for (; p < 0; p++) h.unshift(0);
              p > 0 ? (D = h.splice(p, h.length)) : ((D = h), (h = [0]));
              const _ = [];
              for (
                h.length >= t.lgSize &&
                _.unshift(h.splice(-t.lgSize, h.length).join(""));
                h.length > t.gSize;

              )
                _.unshift(h.splice(-t.gSize, h.length).join(""));
              h.length && _.unshift(h.join("")),
                (a = _.join(_t(n, r))),
                D.length && (a += _t(n, i) + D.join("")),
                m && (a += _t(n, M.Exponential) + "+" + m);
            } else a = _t(n, M.Infinity);
            return (
              (a =
                e < 0 && !u
                  ? t.negPre + a + t.negSuf
                  : t.posPre + a + t.posSuf),
              a
            );
          })(e, s, t, M.CurrencyGroup, M.CurrencyDecimal, i)
            .replace("\xa4", n)
            .replace("\xa4", "")
            .trim()
        );
      }
      function Ac(e) {
        const t = parseInt(e);
        if (isNaN(t))
          throw new Error("Invalid integer literal when parsing " + e);
        return t;
      }
      function hv(e, t) {
        t = encodeURIComponent(t);
        for (const n of e.split(";")) {
          const r = n.indexOf("="),
            [i, o] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (i.trim() === t) return decodeURIComponent(o);
        }
        return null;
      }
      class fx {
        constructor(t, n, r, i) {
          (this.$implicit = t),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = i);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let pv = (() => {
        class e {
          constructor(n, r, i) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = i),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((i, o, s) => {
              if (null == i.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new fx(i.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === o ? void 0 : o);
              else if (null !== o) {
                const a = r.get(o);
                r.move(a, s), gv(a, i);
              }
            });
            for (let i = 0, o = r.length; i < o; i++) {
              const a = r.get(i).context;
              (a.index = i), (a.count = o), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((i) => {
              gv(r.get(i.currentIndex), i);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(Rt), v(fn), v(Fs));
          }),
          (e.ɵdir = S({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
          })),
          e
        );
      })();
      function gv(e, t) {
        e.context.$implicit = t.item;
      }
      let mv = (() => {
        class e {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new hx()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            yv("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            yv("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(Rt), v(fn));
          }),
          (e.ɵdir = S({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
          })),
          e
        );
      })();
      class hx {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function yv(e, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${Z(t)}'.`
          );
      }
      function Pt(e, t) {
        return new $(2100, "");
      }
      const Mx =
        /(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])\S*/g;
      let _v = (() => {
          class e {
            transform(n) {
              if (null == n) return null;
              if ("string" != typeof n) throw Pt();
              return n.replace(
                Mx,
                (r) => r[0].toUpperCase() + r.substr(1).toLowerCase()
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵpipe = Qe({ name: "titlecase", type: e, pure: !0 })),
            e
          );
        })(),
        Cv = (() => {
          class e {
            constructor(n, r = "USD") {
              (this._locale = n), (this._defaultCurrencyCode = r);
            }
            transform(n, r = this._defaultCurrencyCode, i = "symbol", o, s) {
              if (
                !(function xc(e) {
                  return !(null == e || "" === e || e != e);
                })(n)
              )
                return null;
              (s = s || this._locale),
                "boolean" == typeof i && (i = i ? "symbol" : "code");
              let a = r || this._defaultCurrencyCode;
              "code" !== i &&
                (a =
                  "symbol" === i || "symbol-narrow" === i
                    ? (function VT(e, t, n = "en") {
                        const r =
                            (function FT(e) {
                              return Ge(e)[w.Currencies];
                            })(n)[e] ||
                            ov[e] ||
                            [],
                          i = r[1];
                        return "narrow" === t && "string" == typeof i
                          ? i
                          : r[0] || e;
                      })(a, "symbol" === i ? "wide" : "narrow", s)
                    : i);
              try {
                return rx(
                  (function Nc(e) {
                    if (
                      "string" == typeof e &&
                      !isNaN(Number(e) - parseFloat(e))
                    )
                      return Number(e);
                    if ("number" != typeof e)
                      throw new Error(`${e} is not a number`);
                    return e;
                  })(n),
                  s,
                  a,
                  r,
                  o
                );
              } catch (u) {
                throw Pt();
              }
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(In, 16), v(VI, 16));
            }),
            (e.ɵpipe = Qe({ name: "currency", type: e, pure: !0 })),
            e
          );
        })();
      let Lx = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = dt({ type: e })),
          (e.ɵinj = Xe({})),
          e
        );
      })();
      let Ux = (() => {
        class e {}
        return (
          (e.ɵprov = R({
            token: e,
            providedIn: "root",
            factory: () => new $x(b(at), window),
          })),
          e
        );
      })();
      class $x {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function Gx(e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              (e.body.createShadowRoot || e.body.attachShadow)
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i; ) {
                const o = i.shadowRoot;
                if (o) {
                  const s =
                    o.getElementById(t) || o.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                i = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            i = n.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(r - o[0], i - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              Ev(this.window.history) ||
              Ev(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch (t) {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch (t) {
            return !1;
          }
        }
      }
      function Ev(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class bv {}
      class Rc extends class zx extends class DT {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function _T(e) {
            Os || (Os = e);
          })(new Rc());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function qx() {
            return (
              (no = no || document.querySelector("base")),
              no ? no.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function Wx(e) {
                (Gs = Gs || document.createElement("a")),
                  Gs.setAttribute("href", e);
                const t = Gs.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          no = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return hv(document.cookie, t);
        }
      }
      let Gs,
        no = null;
      const Mv = new L("TRANSITION_ID"),
        Zx = [
          {
            provide: nc,
            useFactory: function Qx(e, t, n) {
              return () => {
                n.get(rc).donePromise.then(() => {
                  const r = Zt(),
                    i = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let o = 0; o < i.length; o++) r.remove(i[o]);
                });
              };
            },
            deps: [Mv, at, ke],
            multi: !0,
          },
        ];
      class Fc {
        static init() {
          !(function WI(e) {
            lc = e;
          })(new Fc());
        }
        addToWindow(t) {
          (J.getAngularTestability = (r, i = !0) => {
            const o = t.findTestabilityInTree(r, i);
            if (null == o)
              throw new Error("Could not find testability for element.");
            return o;
          }),
            (J.getAllAngularTestabilities = () => t.getAllTestabilities()),
            (J.getAllAngularRootElements = () => t.getAllRootElements()),
            J.frameworkStabilizers || (J.frameworkStabilizers = []),
            J.frameworkStabilizers.push((r) => {
              const i = J.getAllAngularTestabilities();
              let o = i.length,
                s = !1;
              const a = function (u) {
                (s = s || u), o--, 0 == o && r(s);
              };
              i.forEach(function (u) {
                u.whenStable(a);
              });
            });
        }
        findTestabilityInTree(t, n, r) {
          if (null == n) return null;
          const i = t.getTestability(n);
          return null != i
            ? i
            : r
            ? Zt().isShadowRoot(n)
              ? this.findTestabilityInTree(t, n.host, !0)
              : this.findTestabilityInTree(t, n.parentElement, !0)
            : null;
        }
      }
      let Kx = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const zs = new L("EventManagerPlugins");
      let qs = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((i) => (i.manager = this)),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, i) {
            return this._findPluginFor(r).addEventListener(n, r, i);
          }
          addGlobalEventListener(n, r, i) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, i);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const i = this._plugins;
            for (let o = 0; o < i.length; o++) {
              const s = i[o];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(zs), b(xe));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Av {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const i = Zt().getGlobalEventTarget(this._doc, t);
          if (!i)
            throw new Error(`Unsupported event target ${i} for event ${n}`);
          return this.addEventListener(i, n, r);
        }
      }
      let Sv = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(n) {
              const r = new Set();
              n.forEach((i) => {
                this._stylesSet.has(i) || (this._stylesSet.add(i), r.add(i));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(n) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        ro = (() => {
          class e extends Sv {
            constructor(n) {
              super(),
                (this._doc = n),
                (this._hostNodes = new Map()),
                this._hostNodes.set(n.head, []);
            }
            _addStylesToHost(n, r, i) {
              n.forEach((o) => {
                const s = this._doc.createElement("style");
                (s.textContent = o), i.push(r.appendChild(s));
              });
            }
            addHost(n) {
              const r = [];
              this._addStylesToHost(this._stylesSet, n, r),
                this._hostNodes.set(n, r);
            }
            removeHost(n) {
              const r = this._hostNodes.get(n);
              r && r.forEach(Iv), this._hostNodes.delete(n);
            }
            onStylesAdded(n) {
              this._hostNodes.forEach((r, i) => {
                this._addStylesToHost(n, i, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((n) => n.forEach(Iv));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(b(at));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function Iv(e) {
        Zt().remove(e);
      }
      const Oc = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Pc = /%COMP%/g;
      function Ws(e, t, n) {
        for (let r = 0; r < t.length; r++) {
          let i = t[r];
          Array.isArray(i) ? Ws(e, i, n) : ((i = i.replace(Pc, e)), n.push(i));
        }
        return n;
      }
      function Nv(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let kc = (() => {
        class e {
          constructor(n, r, i) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = i),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Vc(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case Lt.Emulated: {
                let i = this.rendererByCompId.get(r.id);
                return (
                  i ||
                    ((i = new nN(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId
                    )),
                    this.rendererByCompId.set(r.id, i)),
                  i.applyToHost(n),
                  i
                );
              }
              case 1:
              case Lt.ShadowDom:
                return new rN(this.eventManager, this.sharedStylesHost, n, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const i = Ws(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(i),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(qs), b(ro), b(Yi));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Vc {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? document.createElementNS(Oc[n] || n, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          t.appendChild(n);
        }
        insertBefore(t, n, r) {
          t && t.insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, i) {
          if (i) {
            n = i + ":" + n;
            const o = Oc[i];
            o ? t.setAttributeNS(o, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const i = Oc[r];
            i ? t.removeAttributeNS(i, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, i) {
          i & (rt.DashCase | rt.Important)
            ? t.style.setProperty(n, r, i & rt.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & rt.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, n, Nv(r))
            : this.eventManager.addEventListener(t, n, Nv(r));
        }
      }
      class nN extends Vc {
        constructor(t, n, r, i) {
          super(t), (this.component = r);
          const o = Ws(i + "-" + r.id, r.styles, []);
          n.addStyles(o),
            (this.contentAttr = (function Xx(e) {
              return "_ngcontent-%COMP%".replace(Pc, e);
            })(i + "-" + r.id)),
            (this.hostAttr = (function eN(e) {
              return "_nghost-%COMP%".replace(Pc, e);
            })(i + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class rN extends Vc {
        constructor(t, n, r, i) {
          super(t),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const o = Ws(i.id, i.styles, []);
          for (let s = 0; s < o.length; s++) {
            const a = document.createElement("style");
            (a.textContent = o[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
      }
      let iN = (() => {
        class e extends Av {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, i) {
            return (
              n.addEventListener(r, i, !1),
              () => this.removeEventListener(n, r, i)
            );
          }
          removeEventListener(n, r, i) {
            return n.removeEventListener(r, i);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(at));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Fv = ["alt", "control", "meta", "shift"],
        sN = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        Ov = {
          A: "1",
          B: "2",
          C: "3",
          D: "4",
          E: "5",
          F: "6",
          G: "7",
          H: "8",
          I: "9",
          J: "*",
          K: "+",
          M: "-",
          N: ".",
          O: "/",
          "`": "0",
          "\x90": "NumLock",
        },
        aN = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let uN = (() => {
        class e extends Av {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, i) {
            const o = e.parseEventName(r),
              s = e.eventCallback(o.fullKey, i, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Zt().onAndCancel(n, o.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              i = r.shift();
            if (0 === r.length || ("keydown" !== i && "keyup" !== i))
              return null;
            const o = e._normalizeKey(r.pop());
            let s = "";
            if (
              (Fv.forEach((u) => {
                const l = r.indexOf(u);
                l > -1 && (r.splice(l, 1), (s += u + "."));
              }),
              (s += o),
              0 != r.length || 0 === o.length)
            )
              return null;
            const a = {};
            return (a.domEventName = i), (a.fullKey = s), a;
          }
          static getEventFullKey(n) {
            let r = "",
              i = (function lN(e) {
                let t = e.key;
                if (null == t) {
                  if (((t = e.keyIdentifier), null == t)) return "Unidentified";
                  t.startsWith("U+") &&
                    ((t = String.fromCharCode(parseInt(t.substring(2), 16))),
                    3 === e.location && Ov.hasOwnProperty(t) && (t = Ov[t]));
                }
                return sN[t] || t;
              })(n);
            return (
              (i = i.toLowerCase()),
              " " === i ? (i = "space") : "." === i && (i = "dot"),
              Fv.forEach((o) => {
                o != i && aN[o](n) && (r += o + ".");
              }),
              (r += i),
              r
            );
          }
          static eventCallback(n, r, i) {
            return (o) => {
              e.getEventFullKey(o) === n && i.runGuarded(() => r(o));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(at));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const hN = Ly(mT, "browser", [
          { provide: Ts, useValue: "browser" },
          {
            provide: Ty,
            useValue: function cN() {
              Rc.makeCurrent(), Fc.init();
            },
            multi: !0,
          },
          {
            provide: at,
            useFactory: function fN() {
              return (
                (function Mw(e) {
                  Za = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        pN = [
          { provide: cl, useValue: "root" },
          {
            provide: Ti,
            useFactory: function dN() {
              return new Ti();
            },
            deps: [],
          },
          { provide: zs, useClass: iN, multi: !0, deps: [at, xe, Ts] },
          { provide: zs, useClass: uN, multi: !0, deps: [at] },
          { provide: kc, useClass: kc, deps: [qs, ro, Yi] },
          { provide: zm, useExisting: kc },
          { provide: Sv, useExisting: ro },
          { provide: ro, useClass: ro, deps: [at] },
          { provide: uc, useClass: uc, deps: [xe] },
          { provide: qs, useClass: qs, deps: [zs, xe] },
          { provide: bv, useClass: Kx, deps: [] },
        ];
      let gN = (() => {
        class e {
          constructor(n) {
            if (n)
              throw new Error(
                "BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead."
              );
          }
          static withServerTransition(n) {
            return {
              ngModule: e,
              providers: [
                { provide: Yi, useValue: n.appId },
                { provide: Mv, useExisting: Yi },
                Zx,
              ],
            };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(e, 12));
          }),
          (e.ɵmod = dt({ type: e })),
          (e.ɵinj = Xe({ providers: pN, imports: [Lx, yT] })),
          e
        );
      })();
      function O(...e) {
        return Se(e, si(e));
      }
      function Zr(e, t) {
        return ee(t) ? Ae(e, t, 1) : Ae(e, 1);
      }
      function Jn(e, t) {
        return Te((n, r) => {
          let i = 0;
          n.subscribe(Me(r, (o) => e.call(t, o, i++) && r.next(o)));
        });
      }
      "undefined" != typeof window && window;
      class Vv {}
      class Lv {}
      class gn {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? (this.lazyInit =
                  "string" == typeof t
                    ? () => {
                        (this.headers = new Map()),
                          t.split("\n").forEach((n) => {
                            const r = n.indexOf(":");
                            if (r > 0) {
                              const i = n.slice(0, r),
                                o = i.toLowerCase(),
                                s = n.slice(r + 1).trim();
                              this.maybeSetNormalizedName(i, o),
                                this.headers.has(o)
                                  ? this.headers.get(o).push(s)
                                  : this.headers.set(o, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(t).forEach((n) => {
                            let r = t[n];
                            const i = n.toLowerCase();
                            "string" == typeof r && (r = [r]),
                              r.length > 0 &&
                                (this.headers.set(i, r),
                                this.maybeSetNormalizedName(n, i));
                          });
                      })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const n = this.headers.get(t.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, n) {
          return this.clone({ name: t, value: n, op: "a" });
        }
        set(t, n) {
          return this.clone({ name: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ name: t, value: n, op: "d" });
        }
        maybeSetNormalizedName(t, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof gn
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
              (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach((n) => {
              this.headers.set(n, t.headers.get(n)),
                this.normalizedNames.set(n, t.normalizedNames.get(n));
            });
        }
        clone(t) {
          const n = new gn();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof gn
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            n
          );
        }
        applyUpdate(t) {
          const n = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let r = t.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(t.name, n);
              const i = ("a" === t.op ? this.headers.get(n) : void 0) || [];
              i.push(...r), this.headers.set(n, i);
              break;
            case "d":
              const o = t.value;
              if (o) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === o.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              t(this.normalizedNames.get(n), this.headers.get(n))
            );
        }
      }
      class AN {
        encodeKey(t) {
          return jv(t);
        }
        encodeValue(t) {
          return jv(t);
        }
        decodeKey(t) {
          return decodeURIComponent(t);
        }
        decodeValue(t) {
          return decodeURIComponent(t);
        }
      }
      const IN = /%(\d[a-f0-9])/gi,
        TN = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "2B": "+",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function jv(e) {
        return encodeURIComponent(e).replace(IN, (t, n) => {
          var r;
          return null !== (r = TN[n]) && void 0 !== r ? r : t;
        });
      }
      function Bv(e) {
        return `${e}`;
      }
      class xn {
        constructor(t = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new AN()),
            t.fromString)
          ) {
            if (t.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function SN(e, t) {
              const n = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((i) => {
                      const o = i.indexOf("="),
                        [s, a] =
                          -1 == o
                            ? [t.decodeKey(i), ""]
                            : [
                                t.decodeKey(i.slice(0, o)),
                                t.decodeValue(i.slice(o + 1)),
                              ],
                        u = n.get(s) || [];
                      u.push(a), n.set(s, u);
                    }),
                n
              );
            })(t.fromString, this.encoder);
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach((n) => {
                  const r = t.fromObject[n];
                  this.map.set(n, Array.isArray(r) ? r : [r]);
                }))
              : (this.map = null);
        }
        has(t) {
          return this.init(), this.map.has(t);
        }
        get(t) {
          this.init();
          const n = this.map.get(t);
          return n ? n[0] : null;
        }
        getAll(t) {
          return this.init(), this.map.get(t) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(t, n) {
          return this.clone({ param: t, value: n, op: "a" });
        }
        appendAll(t) {
          const n = [];
          return (
            Object.keys(t).forEach((r) => {
              const i = t[r];
              Array.isArray(i)
                ? i.forEach((o) => {
                    n.push({ param: r, value: o, op: "a" });
                  })
                : n.push({ param: r, value: i, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(t, n) {
          return this.clone({ param: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ param: t, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((t) => {
                const n = this.encoder.encodeKey(t);
                return this.map
                  .get(t)
                  .map((r) => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((t) => "" !== t)
              .join("&")
          );
        }
        clone(t) {
          const n = new xn({ encoder: this.encoder });
          return (
            (n.cloneFrom = this.cloneFrom || this),
            (n.updates = (this.updates || []).concat(t)),
            n
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach((t) => {
                switch (t.op) {
                  case "a":
                  case "s":
                    const n =
                      ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                    n.push(Bv(t.value)), this.map.set(t.param, n);
                    break;
                  case "d":
                    if (void 0 === t.value) {
                      this.map.delete(t.param);
                      break;
                    }
                    {
                      let r = this.map.get(t.param) || [];
                      const i = r.indexOf(Bv(t.value));
                      -1 !== i && r.splice(i, 1),
                        r.length > 0
                          ? this.map.set(t.param, r)
                          : this.map.delete(t.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class xN {
        constructor() {
          this.map = new Map();
        }
        set(t, n) {
          return this.map.set(t, n), this;
        }
        get(t) {
          return (
            this.map.has(t) || this.map.set(t, t.defaultValue()),
            this.map.get(t)
          );
        }
        delete(t) {
          return this.map.delete(t), this;
        }
        has(t) {
          return this.map.has(t);
        }
        keys() {
          return this.map.keys();
        }
      }
      function Hv(e) {
        return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer;
      }
      function Uv(e) {
        return "undefined" != typeof Blob && e instanceof Blob;
      }
      function $v(e) {
        return "undefined" != typeof FormData && e instanceof FormData;
      }
      class io {
        constructor(t, n, r, i) {
          let o;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = t.toUpperCase()),
            (function NN(e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || i
              ? ((this.body = void 0 !== r ? r : null), (o = i))
              : (o = r),
            o &&
              ((this.reportProgress = !!o.reportProgress),
              (this.withCredentials = !!o.withCredentials),
              o.responseType && (this.responseType = o.responseType),
              o.headers && (this.headers = o.headers),
              o.context && (this.context = o.context),
              o.params && (this.params = o.params)),
            this.headers || (this.headers = new gn()),
            this.context || (this.context = new xN()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams =
                n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new xn()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : Hv(this.body) ||
              Uv(this.body) ||
              $v(this.body) ||
              (function RN(e) {
                return (
                  "undefined" != typeof URLSearchParams &&
                  e instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof xn
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || $v(this.body)
            ? null
            : Uv(this.body)
            ? this.body.type || null
            : Hv(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof xn
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(t = {}) {
          var n;
          const r = t.method || this.method,
            i = t.url || this.url,
            o = t.responseType || this.responseType,
            s = void 0 !== t.body ? t.body : this.body,
            a =
              void 0 !== t.withCredentials
                ? t.withCredentials
                : this.withCredentials,
            u =
              void 0 !== t.reportProgress
                ? t.reportProgress
                : this.reportProgress;
          let l = t.headers || this.headers,
            c = t.params || this.params;
          const d = null !== (n = t.context) && void 0 !== n ? n : this.context;
          return (
            void 0 !== t.setHeaders &&
              (l = Object.keys(t.setHeaders).reduce(
                (f, h) => f.set(h, t.setHeaders[h]),
                l
              )),
            t.setParams &&
              (c = Object.keys(t.setParams).reduce(
                (f, h) => f.set(h, t.setParams[h]),
                c
              )),
            new io(r, i, s, {
              params: c,
              headers: l,
              context: d,
              reportProgress: u,
              responseType: o,
              withCredentials: a,
            })
          );
        }
      }
      var De = (() => (
        ((De = De || {})[(De.Sent = 0)] = "Sent"),
        (De[(De.UploadProgress = 1)] = "UploadProgress"),
        (De[(De.ResponseHeader = 2)] = "ResponseHeader"),
        (De[(De.DownloadProgress = 3)] = "DownloadProgress"),
        (De[(De.Response = 4)] = "Response"),
        (De[(De.User = 5)] = "User"),
        De
      ))();
      class jc {
        constructor(t, n = 200, r = "OK") {
          (this.headers = t.headers || new gn()),
            (this.status = void 0 !== t.status ? t.status : n),
            (this.statusText = t.statusText || r),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class Bc extends jc {
        constructor(t = {}) {
          super(t), (this.type = De.ResponseHeader);
        }
        clone(t = {}) {
          return new Bc({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class Qs extends jc {
        constructor(t = {}) {
          super(t),
            (this.type = De.Response),
            (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new Qs({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class Gv extends jc {
        constructor(t) {
          super(t, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || "(unknown url)"}`
                : `Http failure response for ${t.url || "(unknown url)"}: ${
                    t.status
                  } ${t.statusText}`),
            (this.error = t.error || null);
        }
      }
      function Hc(e, t) {
        return {
          body: t,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let zv = (() => {
        class e {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, i = {}) {
            let o;
            if (n instanceof io) o = n;
            else {
              let u, l;
              (u = i.headers instanceof gn ? i.headers : new gn(i.headers)),
                i.params &&
                  (l =
                    i.params instanceof xn
                      ? i.params
                      : new xn({ fromObject: i.params })),
                (o = new io(n, r, void 0 !== i.body ? i.body : null, {
                  headers: u,
                  context: i.context,
                  params: l,
                  reportProgress: i.reportProgress,
                  responseType: i.responseType || "json",
                  withCredentials: i.withCredentials,
                }));
            }
            const s = O(o).pipe(Zr((u) => this.handler.handle(u)));
            if (n instanceof io || "events" === i.observe) return s;
            const a = s.pipe(Jn((u) => u instanceof Qs));
            switch (i.observe || "body") {
              case "body":
                switch (o.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      W((u) => {
                        if (null !== u.body && !(u.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return u.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      W((u) => {
                        if (null !== u.body && !(u.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return u.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      W((u) => {
                        if (null !== u.body && "string" != typeof u.body)
                          throw new Error("Response is not a string.");
                        return u.body;
                      })
                    );
                  default:
                    return a.pipe(W((u) => u.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${i.observe}}`
                );
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new xn().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, i = {}) {
            return this.request("PATCH", n, Hc(i, r));
          }
          post(n, r, i = {}) {
            return this.request("POST", n, Hc(i, r));
          }
          put(n, r, i = {}) {
            return this.request("PUT", n, Hc(i, r));
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(Vv));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class qv {
        constructor(t, n) {
          (this.next = t), (this.interceptor = n);
        }
        handle(t) {
          return this.interceptor.intercept(t, this.next);
        }
      }
      const Wv = new L("HTTP_INTERCEPTORS");
      let FN = (() => {
        class e {
          intercept(n, r) {
            return r.handle(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const ON = /^\)\]\}',?\n/;
      let Qv = (() => {
        class e {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method)
              throw new Error(
                "Attempted to construct Jsonp request without HttpClientJsonpModule installed."
              );
            return new he((r) => {
              const i = this.xhrFactory.build();
              if (
                (i.open(n.method, n.urlWithParams),
                n.withCredentials && (i.withCredentials = !0),
                n.headers.forEach((h, p) => i.setRequestHeader(h, p.join(","))),
                n.headers.has("Accept") ||
                  i.setRequestHeader(
                    "Accept",
                    "application/json, text/plain, */*"
                  ),
                !n.headers.has("Content-Type"))
              ) {
                const h = n.detectContentTypeHeader();
                null !== h && i.setRequestHeader("Content-Type", h);
              }
              if (n.responseType) {
                const h = n.responseType.toLowerCase();
                i.responseType = "json" !== h ? h : "text";
              }
              const o = n.serializeBody();
              let s = null;
              const a = () => {
                  if (null !== s) return s;
                  const h = i.statusText || "OK",
                    p = new gn(i.getAllResponseHeaders()),
                    m =
                      (function PN(e) {
                        return "responseURL" in e && e.responseURL
                          ? e.responseURL
                          : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
                          ? e.getResponseHeader("X-Request-URL")
                          : null;
                      })(i) || n.url;
                  return (
                    (s = new Bc({
                      headers: p,
                      status: i.status,
                      statusText: h,
                      url: m,
                    })),
                    s
                  );
                },
                u = () => {
                  let { headers: h, status: p, statusText: m, url: D } = a(),
                    _ = null;
                  204 !== p &&
                    (_ = void 0 === i.response ? i.responseText : i.response),
                    0 === p && (p = _ ? 200 : 0);
                  let g = p >= 200 && p < 300;
                  if ("json" === n.responseType && "string" == typeof _) {
                    const E = _;
                    _ = _.replace(ON, "");
                    try {
                      _ = "" !== _ ? JSON.parse(_) : null;
                    } catch (F) {
                      (_ = E), g && ((g = !1), (_ = { error: F, text: _ }));
                    }
                  }
                  g
                    ? (r.next(
                        new Qs({
                          body: _,
                          headers: h,
                          status: p,
                          statusText: m,
                          url: D || void 0,
                        })
                      ),
                      r.complete())
                    : r.error(
                        new Gv({
                          error: _,
                          headers: h,
                          status: p,
                          statusText: m,
                          url: D || void 0,
                        })
                      );
                },
                l = (h) => {
                  const { url: p } = a(),
                    m = new Gv({
                      error: h,
                      status: i.status || 0,
                      statusText: i.statusText || "Unknown Error",
                      url: p || void 0,
                    });
                  r.error(m);
                };
              let c = !1;
              const d = (h) => {
                  c || (r.next(a()), (c = !0));
                  let p = { type: De.DownloadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total),
                    "text" === n.responseType &&
                      !!i.responseText &&
                      (p.partialText = i.responseText),
                    r.next(p);
                },
                f = (h) => {
                  let p = { type: De.UploadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total), r.next(p);
                };
              return (
                i.addEventListener("load", u),
                i.addEventListener("error", l),
                i.addEventListener("timeout", l),
                i.addEventListener("abort", l),
                n.reportProgress &&
                  (i.addEventListener("progress", d),
                  null !== o &&
                    i.upload &&
                    i.upload.addEventListener("progress", f)),
                i.send(o),
                r.next({ type: De.Sent }),
                () => {
                  i.removeEventListener("error", l),
                    i.removeEventListener("abort", l),
                    i.removeEventListener("load", u),
                    i.removeEventListener("timeout", l),
                    n.reportProgress &&
                      (i.removeEventListener("progress", d),
                      null !== o &&
                        i.upload &&
                        i.upload.removeEventListener("progress", f)),
                    i.readyState !== i.DONE && i.abort();
                }
              );
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(bv));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Uc = new L("XSRF_COOKIE_NAME"),
        $c = new L("XSRF_HEADER_NAME");
      class Zv {}
      let kN = (() => {
          class e {
            constructor(n, r, i) {
              (this.doc = n),
                (this.platform = r),
                (this.cookieName = i),
                (this.lastCookieString = ""),
                (this.lastToken = null),
                (this.parseCount = 0);
            }
            getToken() {
              if ("server" === this.platform) return null;
              const n = this.doc.cookie || "";
              return (
                n !== this.lastCookieString &&
                  (this.parseCount++,
                  (this.lastToken = hv(n, this.cookieName)),
                  (this.lastCookieString = n)),
                this.lastToken
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(b(at), b(Ts), b(Uc));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Gc = (() => {
          class e {
            constructor(n, r) {
              (this.tokenService = n), (this.headerName = r);
            }
            intercept(n, r) {
              const i = n.url.toLowerCase();
              if (
                "GET" === n.method ||
                "HEAD" === n.method ||
                i.startsWith("http://") ||
                i.startsWith("https://")
              )
                return r.handle(n);
              const o = this.tokenService.getToken();
              return (
                null !== o &&
                  !n.headers.has(this.headerName) &&
                  (n = n.clone({ headers: n.headers.set(this.headerName, o) })),
                r.handle(n)
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(b(Zv), b($c));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        VN = (() => {
          class e {
            constructor(n, r) {
              (this.backend = n), (this.injector = r), (this.chain = null);
            }
            handle(n) {
              if (null === this.chain) {
                const r = this.injector.get(Wv, []);
                this.chain = r.reduceRight(
                  (i, o) => new qv(i, o),
                  this.backend
                );
              }
              return this.chain.handle(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(b(Lv), b(ke));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        LN = (() => {
          class e {
            static disable() {
              return {
                ngModule: e,
                providers: [{ provide: Gc, useClass: FN }],
              };
            }
            static withOptions(n = {}) {
              return {
                ngModule: e,
                providers: [
                  n.cookieName ? { provide: Uc, useValue: n.cookieName } : [],
                  n.headerName ? { provide: $c, useValue: n.headerName } : [],
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = dt({ type: e })),
            (e.ɵinj = Xe({
              providers: [
                Gc,
                { provide: Wv, useExisting: Gc, multi: !0 },
                { provide: Zv, useClass: kN },
                { provide: Uc, useValue: "XSRF-TOKEN" },
                { provide: $c, useValue: "X-XSRF-TOKEN" },
              ],
            })),
            e
          );
        })(),
        jN = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = dt({ type: e })),
            (e.ɵinj = Xe({
              providers: [
                zv,
                { provide: Vv, useClass: VN },
                Qv,
                { provide: Lv, useExisting: Qv },
              ],
              imports: [
                [
                  LN.withOptions({
                    cookieName: "XSRF-TOKEN",
                    headerName: "X-XSRF-TOKEN",
                  }),
                ],
              ],
            })),
            e
          );
        })();
      const { isArray: BN } = Array,
        { getPrototypeOf: HN, prototype: UN, keys: $N } = Object;
      function Kv(e) {
        if (1 === e.length) {
          const t = e[0];
          if (BN(t)) return { args: t, keys: null };
          if (
            (function GN(e) {
              return e && "object" == typeof e && HN(e) === UN;
            })(t)
          ) {
            const n = $N(t);
            return { args: n.map((r) => t[r]), keys: n };
          }
        }
        return { args: e, keys: null };
      }
      const { isArray: zN } = Array;
      function Jv(e) {
        return W((t) =>
          (function qN(e, t) {
            return zN(t) ? e(...t) : e(t);
          })(e, t)
        );
      }
      function Yv(e, t) {
        return e.reduce((n, r, i) => ((n[r] = t[i]), n), {});
      }
      let Xv = (() => {
          class e {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (i) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(cn), v(st));
            }),
            (e.ɵdir = S({ type: e })),
            e
          );
        })(),
        Yn = (() => {
          class e extends Xv {}
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = Oe(e)))(r || e);
              };
            })()),
            (e.ɵdir = S({ type: e, features: [K] })),
            e
          );
        })();
      const Kt = new L("NgValueAccessor"),
        ZN = { provide: Kt, useExisting: te(() => Zs), multi: !0 },
        JN = new L("CompositionEventMode");
      let Zs = (() => {
        class e extends Xv {
          constructor(n, r, i) {
            super(n, r),
              (this._compositionMode = i),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function KN() {
                  const e = Zt() ? Zt().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", null == n ? "" : n);
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(cn), v(st), v(JN, 8));
          }),
          (e.ɵdir = S({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                Le("input", function (o) {
                  return r._handleInput(o.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (o) {
                  return r._compositionEnd(o.target.value);
                });
            },
            features: [se([ZN]), K],
          })),
          e
        );
      })();
      function Nn(e) {
        return null == e || 0 === e.length;
      }
      function t_(e) {
        return null != e && "number" == typeof e.length;
      }
      const je = new L("NgValidators"),
        Rn = new L("NgAsyncValidators"),
        YN =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class Fn {
        static min(t) {
          return n_(t);
        }
        static max(t) {
          return (function r_(e) {
            return (t) => {
              if (Nn(t.value) || Nn(e)) return null;
              const n = parseFloat(t.value);
              return !isNaN(n) && n > e
                ? { max: { max: e, actual: t.value } }
                : null;
            };
          })(t);
        }
        static required(t) {
          return (function i_(e) {
            return Nn(e.value) ? { required: !0 } : null;
          })(t);
        }
        static requiredTrue(t) {
          return (function o_(e) {
            return !0 === e.value ? null : { required: !0 };
          })(t);
        }
        static email(t) {
          return (function s_(e) {
            return Nn(e.value) || YN.test(e.value) ? null : { email: !0 };
          })(t);
        }
        static minLength(t) {
          return (function a_(e) {
            return (t) =>
              Nn(t.value) || !t_(t.value)
                ? null
                : t.value.length < e
                ? {
                    minlength: {
                      requiredLength: e,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static maxLength(t) {
          return (function u_(e) {
            return (t) =>
              t_(t.value) && t.value.length > e
                ? {
                    maxlength: {
                      requiredLength: e,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static pattern(t) {
          return (function l_(e) {
            if (!e) return Ks;
            let t, n;
            return (
              "string" == typeof e
                ? ((n = ""),
                  "^" !== e.charAt(0) && (n += "^"),
                  (n += e),
                  "$" !== e.charAt(e.length - 1) && (n += "$"),
                  (t = new RegExp(n)))
                : ((n = e.toString()), (t = e)),
              (r) => {
                if (Nn(r.value)) return null;
                const i = r.value;
                return t.test(i)
                  ? null
                  : { pattern: { requiredPattern: n, actualValue: i } };
              }
            );
          })(t);
        }
        static nullValidator(t) {
          return null;
        }
        static compose(t) {
          return g_(t);
        }
        static composeAsync(t) {
          return m_(t);
        }
      }
      function n_(e) {
        return (t) => {
          if (Nn(t.value) || Nn(e)) return null;
          const n = parseFloat(t.value);
          return !isNaN(n) && n < e
            ? { min: { min: e, actual: t.value } }
            : null;
        };
      }
      function Ks(e) {
        return null;
      }
      function c_(e) {
        return null != e;
      }
      function d_(e) {
        const t = Li(e) ? Se(e) : e;
        return Ml(t), t;
      }
      function f_(e) {
        let t = {};
        return (
          e.forEach((n) => {
            t = null != n ? Object.assign(Object.assign({}, t), n) : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function h_(e, t) {
        return t.map((n) => n(e));
      }
      function p_(e) {
        return e.map((t) =>
          (function XN(e) {
            return !e.validate;
          })(t)
            ? t
            : (n) => t.validate(n)
        );
      }
      function g_(e) {
        if (!e) return null;
        const t = e.filter(c_);
        return 0 == t.length
          ? null
          : function (n) {
              return f_(h_(n, t));
            };
      }
      function zc(e) {
        return null != e ? g_(p_(e)) : null;
      }
      function m_(e) {
        if (!e) return null;
        const t = e.filter(c_);
        return 0 == t.length
          ? null
          : function (n) {
              return (function WN(...e) {
                const t = gf(e),
                  { args: n, keys: r } = Kv(e),
                  i = new he((o) => {
                    const { length: s } = n;
                    if (!s) return void o.complete();
                    const a = new Array(s);
                    let u = s,
                      l = s;
                    for (let c = 0; c < s; c++) {
                      let d = !1;
                      Vt(n[c]).subscribe(
                        Me(
                          o,
                          (f) => {
                            d || ((d = !0), l--), (a[c] = f);
                          },
                          () => u--,
                          void 0,
                          () => {
                            (!u || !d) &&
                              (l || o.next(r ? Yv(r, a) : a), o.complete());
                          }
                        )
                      );
                    }
                  });
                return t ? i.pipe(Jv(t)) : i;
              })(h_(n, t).map(d_)).pipe(W(f_));
            };
      }
      function qc(e) {
        return null != e ? m_(p_(e)) : null;
      }
      function y_(e, t) {
        return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
      }
      function v_(e) {
        return e._rawValidators;
      }
      function __(e) {
        return e._rawAsyncValidators;
      }
      function Wc(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function Js(e, t) {
        return Array.isArray(e) ? e.includes(t) : e === t;
      }
      function D_(e, t) {
        const n = Wc(t);
        return (
          Wc(e).forEach((i) => {
            Js(n, i) || n.push(i);
          }),
          n
        );
      }
      function C_(e, t) {
        return Wc(t).filter((n) => !Js(e, n));
      }
      class w_ {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = zc(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = qc(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t) {
          this.control && this.control.reset(t);
        }
        hasError(t, n) {
          return !!this.control && this.control.hasError(t, n);
        }
        getError(t, n) {
          return this.control ? this.control.getError(t, n) : null;
        }
      }
      class On extends w_ {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class qe extends w_ {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class E_ {
        constructor(t) {
          this._cd = t;
        }
        is(t) {
          var n, r, i;
          return "submitted" === t
            ? !!(null === (n = this._cd) || void 0 === n ? void 0 : n.submitted)
            : !!(null ===
                (i =
                  null === (r = this._cd) || void 0 === r
                    ? void 0
                    : r.control) || void 0 === i
                ? void 0
                : i[t]);
        }
      }
      let b_ = (() => {
          class e extends E_ {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(On, 2));
            }),
            (e.ɵdir = S({
              type: e,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (n, r) {
                2 & n &&
                  ys("ng-untouched", r.is("untouched"))(
                    "ng-touched",
                    r.is("touched")
                  )("ng-pristine", r.is("pristine"))("ng-dirty", r.is("dirty"))(
                    "ng-valid",
                    r.is("valid")
                  )("ng-invalid", r.is("invalid"))(
                    "ng-pending",
                    r.is("pending")
                  );
              },
              features: [K],
            })),
            e
          );
        })(),
        M_ = (() => {
          class e extends E_ {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(qe, 10));
            }),
            (e.ɵdir = S({
              type: e,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (n, r) {
                2 & n &&
                  ys("ng-untouched", r.is("untouched"))(
                    "ng-touched",
                    r.is("touched")
                  )("ng-pristine", r.is("pristine"))("ng-dirty", r.is("dirty"))(
                    "ng-valid",
                    r.is("valid")
                  )("ng-invalid", r.is("invalid"))(
                    "ng-pending",
                    r.is("pending")
                  )("ng-submitted", r.is("submitted"));
              },
              features: [K],
            })),
            e
          );
        })();
      function Xs(e, t) {
        return [...t.path, e];
      }
      function oo(e, t) {
        Kc(e, t),
          t.valueAccessor.writeValue(e.value),
          (function aR(e, t) {
            t.valueAccessor.registerOnChange((n) => {
              (e._pendingValue = n),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && S_(e, t);
            });
          })(e, t),
          (function lR(e, t) {
            const n = (r, i) => {
              t.valueAccessor.writeValue(r), i && t.viewToModelUpdate(r);
            };
            e.registerOnChange(n),
              t._registerOnDestroy(() => {
                e._unregisterOnChange(n);
              });
          })(e, t),
          (function uR(e, t) {
            t.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && S_(e, t),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, t),
          (function sR(e, t) {
            if (t.valueAccessor.setDisabledState) {
              const n = (r) => {
                t.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(n),
                t._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(n);
                });
            }
          })(e, t);
      }
      function ea(e, t, n = !0) {
        const r = () => {};
        t.valueAccessor &&
          (t.valueAccessor.registerOnChange(r),
          t.valueAccessor.registerOnTouched(r)),
          na(e, t),
          e &&
            (t._invokeOnDestroyCallbacks(),
            e._registerOnCollectionChange(() => {}));
      }
      function ta(e, t) {
        e.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(t);
        });
      }
      function Kc(e, t) {
        const n = v_(e);
        null !== t.validator
          ? e.setValidators(y_(n, t.validator))
          : "function" == typeof n && e.setValidators([n]);
        const r = __(e);
        null !== t.asyncValidator
          ? e.setAsyncValidators(y_(r, t.asyncValidator))
          : "function" == typeof r && e.setAsyncValidators([r]);
        const i = () => e.updateValueAndValidity();
        ta(t._rawValidators, i), ta(t._rawAsyncValidators, i);
      }
      function na(e, t) {
        let n = !1;
        if (null !== e) {
          if (null !== t.validator) {
            const i = v_(e);
            if (Array.isArray(i) && i.length > 0) {
              const o = i.filter((s) => s !== t.validator);
              o.length !== i.length && ((n = !0), e.setValidators(o));
            }
          }
          if (null !== t.asyncValidator) {
            const i = __(e);
            if (Array.isArray(i) && i.length > 0) {
              const o = i.filter((s) => s !== t.asyncValidator);
              o.length !== i.length && ((n = !0), e.setAsyncValidators(o));
            }
          }
        }
        const r = () => {};
        return ta(t._rawValidators, r), ta(t._rawAsyncValidators, r), n;
      }
      function S_(e, t) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function Xc(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      const so = "VALID",
        ra = "INVALID",
        Kr = "PENDING",
        ao = "DISABLED";
      function td(e) {
        return (ia(e) ? e.validators : e) || null;
      }
      function N_(e) {
        return Array.isArray(e) ? zc(e) : e || null;
      }
      function nd(e, t) {
        return (ia(t) ? t.asyncValidators : e) || null;
      }
      function R_(e) {
        return Array.isArray(e) ? qc(e) : e || null;
      }
      function ia(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      const rd = (e) => e instanceof od,
        oa = (e) => e instanceof sa,
        F_ = (e) => e instanceof V_;
      function O_(e) {
        return rd(e) ? e.value : e.getRawValue();
      }
      function P_(e, t) {
        const n = oa(e),
          r = e.controls;
        if (!(n ? Object.keys(r) : r).length) throw new $(1e3, "");
        if (!r[t]) throw new $(1001, "");
      }
      function k_(e, t) {
        oa(e),
          e._forEachChild((r, i) => {
            if (void 0 === t[i]) throw new $(1002, "");
          });
      }
      class id {
        constructor(t, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            (this._rawValidators = t),
            (this._rawAsyncValidators = n),
            (this._composedValidatorFn = N_(this._rawValidators)),
            (this._composedAsyncValidatorFn = R_(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === so;
        }
        get invalid() {
          return this.status === ra;
        }
        get pending() {
          return this.status == Kr;
        }
        get disabled() {
          return this.status === ao;
        }
        get enabled() {
          return this.status !== ao;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(t) {
          (this._rawValidators = t), (this._composedValidatorFn = N_(t));
        }
        setAsyncValidators(t) {
          (this._rawAsyncValidators = t),
            (this._composedAsyncValidatorFn = R_(t));
        }
        addValidators(t) {
          this.setValidators(D_(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(D_(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(C_(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(C_(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return Js(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return Js(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = Kr),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = ao),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable(Object.assign(Object.assign({}, t), { onlySelf: !0 }));
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors(
              Object.assign(Object.assign({}, t), { skipPristineCheck: n })
            ),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = so),
            this._forEachChild((r) => {
              r.enable(Object.assign(Object.assign({}, t), { onlySelf: !0 }));
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors(
              Object.assign(Object.assign({}, t), { skipPristineCheck: n })
            ),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === so || this.status === Kr) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? ao : so;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = Kr), (this._hasOwnPendingAsyncValidator = !0);
            const n = d_(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, n = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(t) {
          return (function hR(e, t, n) {
            if (
              null == t ||
              (Array.isArray(t) || (t = t.split(n)),
              Array.isArray(t) && 0 === t.length)
            )
              return null;
            let r = e;
            return (
              t.forEach((i) => {
                r = oa(r)
                  ? r.controls.hasOwnProperty(i)
                    ? r.controls[i]
                    : null
                  : (F_(r) && r.at(i)) || null;
              }),
              r
            );
          })(this, t, ".");
        }
        getError(t, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[t] : null;
        }
        hasError(t, n) {
          return !!this.getError(t, n);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new fe()), (this.statusChanges = new fe());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? ao
            : this.errors
            ? ra
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(Kr)
            ? Kr
            : this._anyControlsHaveStatus(ra)
            ? ra
            : so;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((n) => n.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _isBoxedValue(t) {
          return (
            "object" == typeof t &&
            null !== t &&
            2 === Object.keys(t).length &&
            "value" in t &&
            "disabled" in t
          );
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          ia(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
      }
      class od extends id {
        constructor(t = null, n, r) {
          super(td(n), nd(r, n)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(t),
            this._setUpdateStrategy(n),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            ia(n) &&
              n.initialValueIsDefault &&
              (this.defaultValue = this._isBoxedValue(t) ? t.value : t);
        }
        setValue(t, n = {}) {
          (this.value = this._pendingValue = t),
            this._onChange.length &&
              !1 !== n.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== n.emitViewToModelChange)
              ),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          this.setValue(t, n);
        }
        reset(t = this.defaultValue, n = {}) {
          this._applyFormState(t),
            this.markAsPristine(n),
            this.markAsUntouched(n),
            this.setValue(this.value, n),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(t) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(t) {
          this._onChange.push(t);
        }
        _unregisterOnChange(t) {
          Xc(this._onChange, t);
        }
        registerOnDisabledChange(t) {
          this._onDisabledChange.push(t);
        }
        _unregisterOnDisabledChange(t) {
          Xc(this._onDisabledChange, t);
        }
        _forEachChild(t) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(t) {
          this._isBoxedValue(t)
            ? ((this.value = this._pendingValue = t.value),
              t.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = t);
        }
      }
      class sa extends id {
        constructor(t, n, r) {
          super(td(n), nd(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(t, n) {
          return this.controls[t]
            ? this.controls[t]
            : ((this.controls[t] = n),
              n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange),
              n);
        }
        addControl(t, n, r = {}) {
          this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(t, n = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        setControl(t, n, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            n && this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(t) {
          return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
        }
        setValue(t, n = {}) {
          k_(this, t),
            Object.keys(t).forEach((r) => {
              P_(this, r),
                this.controls[r].setValue(t[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (Object.keys(t).forEach((r) => {
              this.controls[r] &&
                this.controls[r].patchValue(t[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = {}, n = {}) {
          this._forEachChild((r, i) => {
            r.reset(t[i], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this._reduceChildren({}, (t, n, r) => ((t[r] = O_(n)), t));
        }
        _syncPendingControls() {
          let t = this._reduceChildren(
            !1,
            (n, r) => !!r._syncPendingControls() || n
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          Object.keys(this.controls).forEach((n) => {
            const r = this.controls[n];
            r && t(r, n);
          });
        }
        _setUpControls() {
          this._forEachChild((t) => {
            t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(t) {
          for (const n of Object.keys(this.controls)) {
            const r = this.controls[n];
            if (this.contains(n) && t(r)) return !0;
          }
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (t, n, r) => ((n.enabled || this.disabled) && (t[r] = n.value), t)
          );
        }
        _reduceChildren(t, n) {
          let r = t;
          return (
            this._forEachChild((i, o) => {
              r = n(r, i, o);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const t of Object.keys(this.controls))
            if (this.controls[t].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
      }
      class V_ extends id {
        constructor(t, n, r) {
          super(td(n), nd(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(t) {
          return this.controls[t];
        }
        push(t, n = {}) {
          this.controls.push(t),
            this._registerControl(t),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        insert(t, n, r = {}) {
          this.controls.splice(t, 0, n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(t, n = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            this.controls.splice(t, 1),
            this.updateValueAndValidity({ emitEvent: n.emitEvent });
        }
        setControl(t, n, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            this.controls.splice(t, 1),
            n && (this.controls.splice(t, 0, n), this._registerControl(n)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(t, n = {}) {
          k_(this, t),
            t.forEach((r, i) => {
              P_(this, i),
                this.at(i).setValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (t.forEach((r, i) => {
              this.at(i) &&
                this.at(i).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = [], n = {}) {
          this._forEachChild((r, i) => {
            r.reset(t[i], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this.controls.map((t) => O_(t));
        }
        clear(t = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: t.emitEvent }));
        }
        _syncPendingControls() {
          let t = this.controls.reduce(
            (n, r) => !!r._syncPendingControls() || n,
            !1
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          this.controls.forEach((n, r) => {
            t(n, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((t) => t.enabled || this.disabled)
            .map((t) => t.value);
        }
        _anyControls(t) {
          return this.controls.some((n) => n.enabled && t(n));
        }
        _setUpControls() {
          this._forEachChild((t) => this._registerControl(t));
        }
        _allControlsDisabled() {
          for (const t of this.controls) if (t.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(t) {
          t.setParent(this),
            t._registerOnCollectionChange(this._onCollectionChange);
        }
      }
      let L_ = (() => {
          class e extends qe {
            ngOnInit() {
              this._checkParentType(), this.formDirective.addFormGroup(this);
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeFormGroup(this);
            }
            get control() {
              return this.formDirective.getFormGroup(this);
            }
            get path() {
              return Xs(
                null == this.name ? this.name : this.name.toString(),
                this._parent
              );
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            _checkParentType() {}
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = Oe(e)))(r || e);
              };
            })()),
            (e.ɵdir = S({ type: e, features: [K] })),
            e
          );
        })(),
        U_ = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵdir = S({
              type: e,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            e
          );
        })();
      const yR = { provide: Kt, useExisting: te(() => ad), multi: !0 };
      let ad = (() => {
          class e extends Yn {
            writeValue(n) {
              this.setProperty("value", null == n ? "" : n);
            }
            registerOnChange(n) {
              this.onChange = (r) => {
                n("" == r ? null : parseFloat(r));
              };
            }
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = Oe(e)))(r || e);
              };
            })()),
            (e.ɵdir = S({
              type: e,
              selectors: [
                ["input", "type", "number", "formControlName", ""],
                ["input", "type", "number", "formControl", ""],
                ["input", "type", "number", "ngModel", ""],
              ],
              hostBindings: function (n, r) {
                1 & n &&
                  Le("input", function (o) {
                    return r.onChange(o.target.value);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              features: [se([yR]), K],
            })),
            e
          );
        })(),
        $_ = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = dt({ type: e })),
            (e.ɵinj = Xe({})),
            e
          );
        })();
      const ud = new L("NgModelWithFormControlWarning"),
        wR = { provide: qe, useExisting: te(() => aa) };
      let aa = (() => {
        class e extends qe {
          constructor(n, r) {
            super(),
              (this.validators = n),
              (this.asyncValidators = r),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new fe()),
              this._setValidators(n),
              this._setAsyncValidators(r);
          }
          ngOnChanges(n) {
            this._checkFormPresent(),
              n.hasOwnProperty("form") &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations(),
                (this._oldForm = this.form));
          }
          ngOnDestroy() {
            this.form &&
              (na(this.form, this),
              this.form._onCollectionChange === this._onCollectionChange &&
                this.form._registerOnCollectionChange(() => {}));
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          addControl(n) {
            const r = this.form.get(n.path);
            return (
              oo(r, n),
              r.updateValueAndValidity({ emitEvent: !1 }),
              this.directives.push(n),
              r
            );
          }
          getControl(n) {
            return this.form.get(n.path);
          }
          removeControl(n) {
            ea(n.control || null, n, !1), Xc(this.directives, n);
          }
          addFormGroup(n) {
            this._setUpFormContainer(n);
          }
          removeFormGroup(n) {
            this._cleanUpFormContainer(n);
          }
          getFormGroup(n) {
            return this.form.get(n.path);
          }
          addFormArray(n) {
            this._setUpFormContainer(n);
          }
          removeFormArray(n) {
            this._cleanUpFormContainer(n);
          }
          getFormArray(n) {
            return this.form.get(n.path);
          }
          updateModel(n, r) {
            this.form.get(n.path).setValue(r);
          }
          onSubmit(n) {
            return (
              (this.submitted = !0),
              (function x_(e, t) {
                e._syncPendingControls(),
                  t.forEach((n) => {
                    const r = n.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (n.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this.directives),
              this.ngSubmit.emit(n),
              !1
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(n) {
            this.form.reset(n), (this.submitted = !1);
          }
          _updateDomValue() {
            this.directives.forEach((n) => {
              const r = n.control,
                i = this.form.get(n.path);
              r !== i &&
                (ea(r || null, n), rd(i) && (oo(i, n), (n.control = i)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(n) {
            const r = this.form.get(n.path);
            (function I_(e, t) {
              Kc(e, t);
            })(r, n),
              r.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(n) {
            if (this.form) {
              const r = this.form.get(n.path);
              r &&
                (function cR(e, t) {
                  return na(e, t);
                })(r, n) &&
                r.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm &&
                this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            Kc(this.form, this), this._oldForm && na(this._oldForm, this);
          }
          _checkFormPresent() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(je, 10), v(Rn, 10));
          }),
          (e.ɵdir = S({
            type: e,
            selectors: [["", "formGroup", ""]],
            hostBindings: function (n, r) {
              1 & n &&
                Le("submit", function (o) {
                  return r.onSubmit(o);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { form: ["formGroup", "form"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [se([wR]), K, pt],
          })),
          e
        );
      })();
      const ER = { provide: qe, useExisting: te(() => ld) };
      let ld = (() => {
        class e extends L_ {
          constructor(n, r, i) {
            super(),
              (this._parent = n),
              this._setValidators(r),
              this._setAsyncValidators(i);
          }
          _checkParentType() {
            W_(this._parent);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(qe, 13), v(je, 10), v(Rn, 10));
          }),
          (e.ɵdir = S({
            type: e,
            selectors: [["", "formGroupName", ""]],
            inputs: { name: ["formGroupName", "name"] },
            features: [se([ER]), K],
          })),
          e
        );
      })();
      const bR = { provide: qe, useExisting: te(() => ua) };
      let ua = (() => {
        class e extends qe {
          constructor(n, r, i) {
            super(),
              (this._parent = n),
              this._setValidators(r),
              this._setAsyncValidators(i);
          }
          ngOnInit() {
            this._checkParentType(), this.formDirective.addFormArray(this);
          }
          ngOnDestroy() {
            this.formDirective && this.formDirective.removeFormArray(this);
          }
          get control() {
            return this.formDirective.getFormArray(this);
          }
          get formDirective() {
            return this._parent ? this._parent.formDirective : null;
          }
          get path() {
            return Xs(
              null == this.name ? this.name : this.name.toString(),
              this._parent
            );
          }
          _checkParentType() {
            W_(this._parent);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(qe, 13), v(je, 10), v(Rn, 10));
          }),
          (e.ɵdir = S({
            type: e,
            selectors: [["", "formArrayName", ""]],
            inputs: { name: ["formArrayName", "name"] },
            features: [se([bR]), K],
          })),
          e
        );
      })();
      function W_(e) {
        return !(e instanceof ld || e instanceof aa || e instanceof ua);
      }
      const MR = { provide: On, useExisting: te(() => cd) };
      let cd = (() => {
        class e extends On {
          constructor(n, r, i, o, s) {
            super(),
              (this._ngModelWarningConfig = s),
              (this._added = !1),
              (this.update = new fe()),
              (this._ngModelWarningSent = !1),
              (this._parent = n),
              this._setValidators(r),
              this._setAsyncValidators(i),
              (this.valueAccessor = (function Yc(e, t) {
                if (!t) return null;
                let n, r, i;
                return (
                  Array.isArray(t),
                  t.forEach((o) => {
                    o.constructor === Zs
                      ? (n = o)
                      : (function fR(e) {
                          return Object.getPrototypeOf(e.constructor) === Yn;
                        })(o)
                      ? (r = o)
                      : (i = o);
                  }),
                  i || r || n || null
                );
              })(0, o));
          }
          set isDisabled(n) {}
          ngOnChanges(n) {
            this._added || this._setUpControl(),
              (function Jc(e, t) {
                if (!e.hasOwnProperty("model")) return !1;
                const n = e.model;
                return !!n.isFirstChange() || !Object.is(t, n.currentValue);
              })(n, this.viewModel) &&
                ((this.viewModel = this.model),
                this.formDirective.updateModel(this, this.model));
          }
          ngOnDestroy() {
            this.formDirective && this.formDirective.removeControl(this);
          }
          viewToModelUpdate(n) {
            (this.viewModel = n), this.update.emit(n);
          }
          get path() {
            return Xs(
              null == this.name ? this.name : this.name.toString(),
              this._parent
            );
          }
          get formDirective() {
            return this._parent ? this._parent.formDirective : null;
          }
          _checkParentType() {}
          _setUpControl() {
            this._checkParentType(),
              (this.control = this.formDirective.addControl(this)),
              this.control.disabled &&
                this.valueAccessor.setDisabledState &&
                this.valueAccessor.setDisabledState(!0),
              (this._added = !0);
          }
        }
        return (
          (e._ngModelWarningSentOnce = !1),
          (e.ɵfac = function (n) {
            return new (n || e)(
              v(qe, 13),
              v(je, 10),
              v(Rn, 10),
              v(Kt, 10),
              v(ud, 8)
            );
          }),
          (e.ɵdir = S({
            type: e,
            selectors: [["", "formControlName", ""]],
            inputs: {
              name: ["formControlName", "name"],
              isDisabled: ["disabled", "isDisabled"],
              model: ["ngModel", "model"],
            },
            outputs: { update: "ngModelChange" },
            features: [se([MR]), K, pt],
          })),
          e
        );
      })();
      const AR = { provide: Kt, useExisting: te(() => la), multi: !0 };
      function Q_(e, t) {
        return null == e
          ? `${t}`
          : (t && "object" == typeof t && (t = "Object"),
            `${e}: ${t}`.slice(0, 50));
      }
      let la = (() => {
          class e extends Yn {
            constructor() {
              super(...arguments),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this._compareWith = Object.is);
            }
            set compareWith(n) {
              this._compareWith = n;
            }
            writeValue(n) {
              this.value = n;
              const i = Q_(this._getOptionId(n), n);
              this.setProperty("value", i);
            }
            registerOnChange(n) {
              this.onChange = (r) => {
                (this.value = this._getOptionValue(r)), n(this.value);
              };
            }
            _registerOption() {
              return (this._idCounter++).toString();
            }
            _getOptionId(n) {
              for (const r of Array.from(this._optionMap.keys()))
                if (this._compareWith(this._optionMap.get(r), n)) return r;
              return null;
            }
            _getOptionValue(n) {
              const r = (function SR(e) {
                return e.split(":")[0];
              })(n);
              return this._optionMap.has(r) ? this._optionMap.get(r) : n;
            }
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = Oe(e)))(r || e);
              };
            })()),
            (e.ɵdir = S({
              type: e,
              selectors: [
                ["select", "formControlName", "", 3, "multiple", ""],
                ["select", "formControl", "", 3, "multiple", ""],
                ["select", "ngModel", "", 3, "multiple", ""],
              ],
              hostBindings: function (n, r) {
                1 & n &&
                  Le("change", function (o) {
                    return r.onChange(o.target.value);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [se([AR]), K],
            })),
            e
          );
        })(),
        Z_ = (() => {
          class e {
            constructor(n, r, i) {
              (this._element = n),
                (this._renderer = r),
                (this._select = i),
                this._select && (this.id = this._select._registerOption());
            }
            set ngValue(n) {
              null != this._select &&
                (this._select._optionMap.set(this.id, n),
                this._setElementValue(Q_(this.id, n)),
                this._select.writeValue(this._select.value));
            }
            set value(n) {
              this._setElementValue(n),
                this._select && this._select.writeValue(this._select.value);
            }
            _setElementValue(n) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "value",
                n
              );
            }
            ngOnDestroy() {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(st), v(cn), v(la, 9));
            }),
            (e.ɵdir = S({
              type: e,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            })),
            e
          );
        })();
      const IR = { provide: Kt, useExisting: te(() => dd), multi: !0 };
      function K_(e, t) {
        return null == e
          ? `${t}`
          : ("string" == typeof t && (t = `'${t}'`),
            t && "object" == typeof t && (t = "Object"),
            `${e}: ${t}`.slice(0, 50));
      }
      let dd = (() => {
          class e extends Yn {
            constructor() {
              super(...arguments),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this._compareWith = Object.is);
            }
            set compareWith(n) {
              this._compareWith = n;
            }
            writeValue(n) {
              let r;
              if (((this.value = n), Array.isArray(n))) {
                const i = n.map((o) => this._getOptionId(o));
                r = (o, s) => {
                  o._setSelected(i.indexOf(s.toString()) > -1);
                };
              } else
                r = (i, o) => {
                  i._setSelected(!1);
                };
              this._optionMap.forEach(r);
            }
            registerOnChange(n) {
              this.onChange = (r) => {
                const i = [],
                  o = r.selectedOptions;
                if (void 0 !== o) {
                  const s = o;
                  for (let a = 0; a < s.length; a++) {
                    const l = this._getOptionValue(s[a].value);
                    i.push(l);
                  }
                } else {
                  const s = r.options;
                  for (let a = 0; a < s.length; a++) {
                    const u = s[a];
                    if (u.selected) {
                      const l = this._getOptionValue(u.value);
                      i.push(l);
                    }
                  }
                }
                (this.value = i), n(i);
              };
            }
            _registerOption(n) {
              const r = (this._idCounter++).toString();
              return this._optionMap.set(r, n), r;
            }
            _getOptionId(n) {
              for (const r of Array.from(this._optionMap.keys()))
                if (this._compareWith(this._optionMap.get(r)._value, n))
                  return r;
              return null;
            }
            _getOptionValue(n) {
              const r = (function TR(e) {
                return e.split(":")[0];
              })(n);
              return this._optionMap.has(r) ? this._optionMap.get(r)._value : n;
            }
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = Oe(e)))(r || e);
              };
            })()),
            (e.ɵdir = S({
              type: e,
              selectors: [
                ["select", "multiple", "", "formControlName", ""],
                ["select", "multiple", "", "formControl", ""],
                ["select", "multiple", "", "ngModel", ""],
              ],
              hostBindings: function (n, r) {
                1 & n &&
                  Le("change", function (o) {
                    return r.onChange(o.target);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [se([IR]), K],
            })),
            e
          );
        })(),
        J_ = (() => {
          class e {
            constructor(n, r, i) {
              (this._element = n),
                (this._renderer = r),
                (this._select = i),
                this._select && (this.id = this._select._registerOption(this));
            }
            set ngValue(n) {
              null != this._select &&
                ((this._value = n),
                this._setElementValue(K_(this.id, n)),
                this._select.writeValue(this._select.value));
            }
            set value(n) {
              this._select
                ? ((this._value = n),
                  this._setElementValue(K_(this.id, n)),
                  this._select.writeValue(this._select.value))
                : this._setElementValue(n);
            }
            _setElementValue(n) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "value",
                n
              );
            }
            _setSelected(n) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "selected",
                n
              );
            }
            ngOnDestroy() {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(st), v(cn), v(dd, 9));
            }),
            (e.ɵdir = S({
              type: e,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            })),
            e
          );
        })();
      let Xn = (() => {
        class e {
          constructor() {
            this._validator = Ks;
          }
          ngOnChanges(n) {
            if (this.inputName in n) {
              const r = this.normalizeInput(n[this.inputName].currentValue);
              (this._enabled = this.enabled(r)),
                (this._validator = this._enabled
                  ? this.createValidator(r)
                  : Ks),
                this._onChange && this._onChange();
            }
          }
          validate(n) {
            return this._validator(n);
          }
          registerOnValidatorChange(n) {
            this._onChange = n;
          }
          enabled(n) {
            return null != n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵdir = S({ type: e, features: [pt] })),
          e
        );
      })();
      const RR = { provide: je, useExisting: te(() => fd), multi: !0 };
      let fd = (() => {
          class e extends Xn {
            constructor() {
              super(...arguments),
                (this.inputName = "min"),
                (this.normalizeInput = (n) =>
                  (function X_(e) {
                    return "number" == typeof e ? e : parseFloat(e);
                  })(n)),
                (this.createValidator = (n) => n_(n));
            }
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = Oe(e)))(r || e);
              };
            })()),
            (e.ɵdir = S({
              type: e,
              selectors: [
                ["input", "type", "number", "min", "", "formControlName", ""],
                ["input", "type", "number", "min", "", "formControl", ""],
                ["input", "type", "number", "min", "", "ngModel", ""],
              ],
              hostVars: 1,
              hostBindings: function (n, r) {
                2 & n && qt("min", r._enabled ? r.min : null);
              },
              inputs: { min: "min" },
              features: [se([RR]), K],
            })),
            e
          );
        })(),
        sD = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = dt({ type: e })),
            (e.ɵinj = Xe({ imports: [[$_]] })),
            e
          );
        })(),
        jR = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = dt({ type: e })),
            (e.ɵinj = Xe({ imports: [sD] })),
            e
          );
        })(),
        aD = (() => {
          class e {
            static withConfig(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: ud, useValue: n.warnOnNgModelWithFormControl },
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = dt({ type: e })),
            (e.ɵinj = Xe({ imports: [sD] })),
            e
          );
        })(),
        HR = (() => {
          class e {
            group(n, r = null) {
              const i = this._reduceControls(n);
              let a,
                o = null,
                s = null;
              return (
                null != r &&
                  ((function BR(e) {
                    return (
                      void 0 !== e.asyncValidators ||
                      void 0 !== e.validators ||
                      void 0 !== e.updateOn
                    );
                  })(r)
                    ? ((o = null != r.validators ? r.validators : null),
                      (s =
                        null != r.asyncValidators ? r.asyncValidators : null),
                      (a = null != r.updateOn ? r.updateOn : void 0))
                    : ((o = null != r.validator ? r.validator : null),
                      (s =
                        null != r.asyncValidator ? r.asyncValidator : null))),
                new sa(i, { asyncValidators: s, updateOn: a, validators: o })
              );
            }
            control(n, r, i) {
              return new od(n, r, i);
            }
            array(n, r, i) {
              const o = n.map((s) => this._createControl(s));
              return new V_(o, r, i);
            }
            _reduceControls(n) {
              const r = {};
              return (
                Object.keys(n).forEach((i) => {
                  r[i] = this._createControl(n[i]);
                }),
                r
              );
            }
            _createControl(n) {
              return rd(n) || oa(n) || F_(n)
                ? n
                : Array.isArray(n)
                ? this.control(
                    n[0],
                    n.length > 1 ? n[1] : null,
                    n.length > 2 ? n[2] : null
                  )
                : this.control(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: aD })),
            e
          );
        })();
      class kt extends Xt {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      function uD(e, t, n) {
        e ? en(n, e, t) : t();
      }
      function ca(e, t) {
        const n = ee(e) ? e : () => e,
          r = (i) => i.error(n());
        return new he(t ? (i) => t.schedule(r, 0, i) : r);
      }
      const lo = ni(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function pd(...e) {
        return (function GR() {
          return oi(1);
        })()(Se(e, si(e)));
      }
      function lD(e) {
        return new he((t) => {
          Vt(e()).subscribe(t);
        });
      }
      function cD() {
        return Te((e, t) => {
          let n = null;
          e._refCount++;
          const r = Me(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (n = null);
            const i = e._connection,
              o = n;
            (n = null),
              i && (!o || i === o) && i.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class zR extends he {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            ef(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null),
            null == t || t.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new ct();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                Me(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              t.closed && ((this._connection = null), (t = ct.EMPTY));
          }
          return t;
        }
        refCount() {
          return cD()(this);
        }
      }
      function er(e, t) {
        return Te((n, r) => {
          let i = null,
            o = 0,
            s = !1;
          const a = () => s && !i && r.complete();
          n.subscribe(
            Me(
              r,
              (u) => {
                null == i || i.unsubscribe();
                let l = 0;
                const c = o++;
                Vt(e(u, c)).subscribe(
                  (i = Me(
                    r,
                    (d) => r.next(t ? t(u, d, c, l++) : d),
                    () => {
                      (i = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function WR(e, t, n, r, i) {
        return (o, s) => {
          let a = n,
            u = t,
            l = 0;
          o.subscribe(
            Me(
              s,
              (c) => {
                const d = l++;
                (u = a ? e(u, c, d) : ((a = !0), c)), r && s.next(u);
              },
              i &&
                (() => {
                  a && s.next(u), s.complete();
                })
            )
          );
        };
      }
      function dD(e, t) {
        return Te(WR(e, t, arguments.length >= 2, !0));
      }
      function Pn(e) {
        return Te((t, n) => {
          let o,
            r = null,
            i = !1;
          (r = t.subscribe(
            Me(n, void 0, void 0, (s) => {
              (o = Vt(e(s, Pn(e)(t)))),
                r ? (r.unsubscribe(), (r = null), o.subscribe(n)) : (i = !0);
            })
          )),
            i && (r.unsubscribe(), (r = null), o.subscribe(n));
        });
      }
      function gd(e) {
        return e <= 0
          ? () => tn
          : Te((t, n) => {
              let r = [];
              t.subscribe(
                Me(
                  n,
                  (i) => {
                    r.push(i), e < r.length && r.shift();
                  },
                  () => {
                    for (const i of r) n.next(i);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function fD(e = QR) {
        return Te((t, n) => {
          let r = !1;
          t.subscribe(
            Me(
              n,
              (i) => {
                (r = !0), n.next(i);
              },
              () => (r ? n.complete() : n.error(e()))
            )
          );
        });
      }
      function QR() {
        return new lo();
      }
      function hD(e) {
        return Te((t, n) => {
          let r = !1;
          t.subscribe(
            Me(
              n,
              (i) => {
                (r = !0), n.next(i);
              },
              () => {
                r || n.next(e), n.complete();
              }
            )
          );
        });
      }
      function Jr(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? Jn((i, o) => e(i, o, r)) : jn,
            Ao(1),
            n ? hD(t) : fD(() => new lo())
          );
      }
      function ut(e, t, n) {
        const r = ee(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? Te((i, o) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              i.subscribe(
                Me(
                  o,
                  (u) => {
                    var l;
                    null === (l = r.next) || void 0 === l || l.call(r, u),
                      o.next(u);
                  },
                  () => {
                    var u;
                    (a = !1),
                      null === (u = r.complete) || void 0 === u || u.call(r),
                      o.complete();
                  },
                  (u) => {
                    var l;
                    (a = !1),
                      null === (l = r.error) || void 0 === l || l.call(r, u),
                      o.error(u);
                  },
                  () => {
                    var u, l;
                    a &&
                      (null === (u = r.unsubscribe) ||
                        void 0 === u ||
                        u.call(r)),
                      null === (l = r.finalize) || void 0 === l || l.call(r);
                  }
                )
              );
            })
          : jn;
      }
      class mn {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class md extends mn {
        constructor(t, n, r = "imperative", i = null) {
          super(t, n), (this.navigationTrigger = r), (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class co extends mn {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class pD extends mn {
        constructor(t, n, r) {
          super(t, n), (this.reason = r);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class JR extends mn {
        constructor(t, n, r) {
          super(t, n), (this.error = r);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class YR extends mn {
        constructor(t, n, r, i) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = i);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class XR extends mn {
        constructor(t, n, r, i) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = i);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class eF extends mn {
        constructor(t, n, r, i, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.shouldActivate = o);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class tF extends mn {
        constructor(t, n, r, i) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = i);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class nF extends mn {
        constructor(t, n, r, i) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = i);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class gD {
        constructor(t) {
          this.route = t;
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class mD {
        constructor(t) {
          this.route = t;
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class rF {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class iF {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class oF {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class sF {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class yD {
        constructor(t, n, r) {
          (this.routerEvent = t), (this.position = n), (this.anchor = r);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      const B = "primary";
      class aF {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function Yr(e) {
        return new aF(e);
      }
      const vD = "ngNavigationCancelingError";
      function yd(e) {
        const t = Error("NavigationCancelingError: " + e);
        return (t[vD] = !0), t;
      }
      function lF(e, t, n) {
        const r = n.path.split("/");
        if (
          r.length > e.length ||
          ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))
        )
          return null;
        const i = {};
        for (let o = 0; o < r.length; o++) {
          const s = r[o],
            a = e[o];
          if (s.startsWith(":")) i[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: i };
      }
      function Jt(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let i;
        for (let o = 0; o < n.length; o++)
          if (((i = n[o]), !_D(e[i], t[i]))) return !1;
        return !0;
      }
      function _D(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((i, o) => r[o] === i);
        }
        return e === t;
      }
      function DD(e) {
        return Array.prototype.concat.apply([], e);
      }
      function CD(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function Ne(e, t) {
        for (const n in e) e.hasOwnProperty(n) && t(e[n], n);
      }
      function Yt(e) {
        return Ml(e) ? e : Li(e) ? Se(Promise.resolve(e)) : O(e);
      }
      const fF = {
          exact: function bD(e, t, n) {
            if (
              !nr(e.segments, t.segments) ||
              !da(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!e.children[r] || !bD(e.children[r], t.children[r], n))
                return !1;
            return !0;
          },
          subset: MD,
        },
        wD = {
          exact: function hF(e, t) {
            return Jt(e, t);
          },
          subset: function pF(e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((n) => _D(e[n], t[n]))
            );
          },
          ignored: () => !0,
        };
      function ED(e, t, n) {
        return (
          fF[n.paths](e.root, t.root, n.matrixParams) &&
          wD[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function MD(e, t, n) {
        return AD(e, t, t.segments, n);
      }
      function AD(e, t, n, r) {
        if (e.segments.length > n.length) {
          const i = e.segments.slice(0, n.length);
          return !(!nr(i, n) || t.hasChildren() || !da(i, n, r));
        }
        if (e.segments.length === n.length) {
          if (!nr(e.segments, n) || !da(e.segments, n, r)) return !1;
          for (const i in t.children)
            if (!e.children[i] || !MD(e.children[i], t.children[i], r))
              return !1;
          return !0;
        }
        {
          const i = n.slice(0, e.segments.length),
            o = n.slice(e.segments.length);
          return (
            !!(nr(e.segments, i) && da(e.segments, i, r) && e.children[B]) &&
            AD(e.children[B], t, o, r)
          );
        }
      }
      function da(e, t, n) {
        return t.every((r, i) => wD[n](e[i].parameters, r.parameters));
      }
      class tr {
        constructor(t, n, r) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Yr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return yF.serialize(this);
        }
      }
      class U {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            Ne(n, (r, i) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return fa(this);
        }
      }
      class fo {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = Yr(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return ND(this);
        }
      }
      function nr(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      class SD {}
      class ID {
        parse(t) {
          const n = new AF(t);
          return new tr(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(t) {
          const n = `/${ho(t.root, !0)}`,
            r = (function DF(e) {
              const t = Object.keys(e)
                .map((n) => {
                  const r = e[n];
                  return Array.isArray(r)
                    ? r.map((i) => `${ha(n)}=${ha(i)}`).join("&")
                    : `${ha(n)}=${ha(r)}`;
                })
                .filter((n) => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${(function vF(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const yF = new ID();
      function fa(e) {
        return e.segments.map((t) => ND(t)).join("/");
      }
      function ho(e, t) {
        if (!e.hasChildren()) return fa(e);
        if (t) {
          const n = e.children[B] ? ho(e.children[B], !1) : "",
            r = [];
          return (
            Ne(e.children, (i, o) => {
              o !== B && r.push(`${o}:${ho(i, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function mF(e, t) {
            let n = [];
            return (
              Ne(e.children, (r, i) => {
                i === B && (n = n.concat(t(r, i)));
              }),
              Ne(e.children, (r, i) => {
                i !== B && (n = n.concat(t(r, i)));
              }),
              n
            );
          })(e, (r, i) =>
            i === B ? [ho(e.children[B], !1)] : [`${i}:${ho(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[B]
            ? `${fa(e)}/${n[0]}`
            : `${fa(e)}/(${n.join("//")})`;
        }
      }
      function TD(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function ha(e) {
        return TD(e).replace(/%3B/gi, ";");
      }
      function vd(e) {
        return TD(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function pa(e) {
        return decodeURIComponent(e);
      }
      function xD(e) {
        return pa(e.replace(/\+/g, "%20"));
      }
      function ND(e) {
        return `${vd(e.path)}${(function _F(e) {
          return Object.keys(e)
            .map((t) => `;${vd(t)}=${vd(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const CF = /^[^\/()?;=#]+/;
      function ga(e) {
        const t = e.match(CF);
        return t ? t[0] : "";
      }
      const wF = /^[^=?&#]+/,
        bF = /^[^&#]+/;
      class AF {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new U([], {})
              : new U([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[B] = new U(t, n)),
            r
          );
        }
        parseSegment() {
          const t = ga(this.remaining);
          if ("" === t && this.peekStartsWith(";"))
            throw new Error(
              `Empty path url segment cannot have parameters: '${this.remaining}'.`
            );
          return this.capture(t), new fo(pa(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = ga(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const i = ga(this.remaining);
            i && ((r = i), this.capture(r));
          }
          t[pa(n)] = pa(r);
        }
        parseQueryParam(t) {
          const n = (function EF(e) {
            const t = e.match(wF);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function MF(e) {
              const t = e.match(bF);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const i = xD(n),
            o = xD(r);
          if (t.hasOwnProperty(i)) {
            let s = t[i];
            Array.isArray(s) || ((s = [s]), (t[i] = s)), s.push(o);
          } else t[i] = o;
        }
        parseParens(t) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = ga(this.remaining),
              i = this.remaining[r.length];
            if ("/" !== i && ")" !== i && ";" !== i)
              throw new Error(`Cannot parse url '${this.url}'`);
            let o;
            r.indexOf(":") > -1
              ? ((o = r.substr(0, r.indexOf(":"))),
                this.capture(o),
                this.capture(":"))
              : t && (o = B);
            const s = this.parseChildren();
            (n[o] = 1 === Object.keys(s).length ? s[B] : new U([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new Error(`Expected "${t}".`);
        }
      }
      class RD {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = _d(t, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const n = _d(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = Dd(t, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((i) => i.value)
                .filter((i) => i !== t);
        }
        pathFromRoot(t) {
          return Dd(t, this._root).map((n) => n.value);
        }
      }
      function _d(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = _d(e, n);
          if (r) return r;
        }
        return null;
      }
      function Dd(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = Dd(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class yn {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function Xr(e) {
        const t = {};
        return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
      }
      class FD extends RD {
        constructor(t, n) {
          super(t), (this.snapshot = n), Cd(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function OD(e, t) {
        const n = (function SF(e, t) {
            const s = new ma([], {}, {}, "", {}, B, t, null, e.root, -1, {});
            return new kD("", new yn(s, []));
          })(e, t),
          r = new kt([new fo("", {})]),
          i = new kt({}),
          o = new kt({}),
          s = new kt({}),
          a = new kt(""),
          u = new ei(r, i, s, a, o, B, t, n.root);
        return (u.snapshot = n.root), new FD(new yn(u, []), n);
      }
      class ei {
        constructor(t, n, r, i, o, s, a, u) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = u);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(W((t) => Yr(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(W((t) => Yr(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function PD(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const i = n[r],
              o = n[r - 1];
            if (i.routeConfig && "" === i.routeConfig.path) r--;
            else {
              if (o.component) break;
              r--;
            }
          }
        return (function IF(e) {
          return e.reduce(
            (t, n) => ({
              params: Object.assign(Object.assign({}, t.params), n.params),
              data: Object.assign(Object.assign({}, t.data), n.data),
              resolve: Object.assign(
                Object.assign({}, t.resolve),
                n._resolvedData
              ),
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class ma {
        constructor(t, n, r, i, o, s, a, u, l, c, d) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = u),
            (this._urlSegment = l),
            (this._lastPathIndex = c),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = Yr(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Yr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class kD extends RD {
        constructor(t, n) {
          super(n), (this.url = t), Cd(this, n);
        }
        toString() {
          return VD(this._root);
        }
      }
      function Cd(e, t) {
        (t.value._routerState = e), t.children.forEach((n) => Cd(e, n));
      }
      function VD(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(VD).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function wd(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            Jt(t.queryParams, n.queryParams) ||
              e.queryParams.next(n.queryParams),
            t.fragment !== n.fragment && e.fragment.next(n.fragment),
            Jt(t.params, n.params) || e.params.next(n.params),
            (function cF(e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!Jt(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.url.next(n.url),
            Jt(t.data, n.data) || e.data.next(n.data);
        } else
          (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function Ed(e, t) {
        const n =
          Jt(e.params, t.params) &&
          (function gF(e, t) {
            return (
              nr(e, t) && e.every((n, r) => Jt(n.parameters, t[r].parameters))
            );
          })(e.url, t.url);
        return (
          n &&
          !(!e.parent != !t.parent) &&
          (!e.parent || Ed(e.parent, t.parent))
        );
      }
      function po(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const i = (function xF(e, t, n) {
            return t.children.map((r) => {
              for (const i of n.children)
                if (e.shouldReuseRoute(r.value, i.value.snapshot))
                  return po(e, r, i);
              return po(e, r);
            });
          })(e, t, n);
          return new yn(r, i);
        }
        {
          if (e.shouldAttach(t.value)) {
            const o = e.retrieve(t.value);
            if (null !== o) {
              const s = o.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => po(e, a))),
                s
              );
            }
          }
          const r = (function NF(e) {
              return new ei(
                new kt(e.url),
                new kt(e.params),
                new kt(e.queryParams),
                new kt(e.fragment),
                new kt(e.data),
                e.outlet,
                e.component,
                e
              );
            })(t.value),
            i = t.children.map((o) => po(e, o));
          return new yn(r, i);
        }
      }
      function ya(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function go(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function bd(e, t, n, r, i) {
        let o = {};
        if (
          (r &&
            Ne(r, (a, u) => {
              o[u] = Array.isArray(a) ? a.map((l) => `${l}`) : `${a}`;
            }),
          e === t)
        )
          return new tr(n, o, i);
        const s = LD(e, t, n);
        return new tr(s, o, i);
      }
      function LD(e, t, n) {
        const r = {};
        return (
          Ne(e.children, (i, o) => {
            r[o] = i === t ? n : LD(i, t, n);
          }),
          new U(e.segments, r)
        );
      }
      class jD {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && ya(r[0]))
          )
            throw new Error("Root segment cannot have matrix parameters");
          const i = r.find(go);
          if (i && i !== CD(r))
            throw new Error("{outlets:{}} has to be the last command");
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class Md {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function BD(e, t, n) {
        if (
          (e || (e = new U([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return va(e, t, n);
        const r = (function VF(e, t, n) {
            let r = 0,
              i = t;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < e.segments.length; ) {
              if (r >= n.length) return o;
              const s = e.segments[i],
                a = n[r];
              if (go(a)) break;
              const u = `${a}`,
                l = r < n.length - 1 ? n[r + 1] : null;
              if (i > 0 && void 0 === u) break;
              if (u && l && "object" == typeof l && void 0 === l.outlets) {
                if (!UD(u, l, s)) return o;
                r += 2;
              } else {
                if (!UD(u, {}, s)) return o;
                r++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: r };
          })(e, t, n),
          i = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const o = new U(e.segments.slice(0, r.pathIndex), {});
          return (
            (o.children[B] = new U(e.segments.slice(r.pathIndex), e.children)),
            va(o, 0, i)
          );
        }
        return r.match && 0 === i.length
          ? new U(e.segments, {})
          : r.match && !e.hasChildren()
          ? Ad(e, t, n)
          : r.match
          ? va(e, 0, i)
          : Ad(e, t, n);
      }
      function va(e, t, n) {
        if (0 === n.length) return new U(e.segments, {});
        {
          const r = (function kF(e) {
              return go(e[0]) ? e[0].outlets : { [B]: e };
            })(n),
            i = {};
          return (
            Ne(r, (o, s) => {
              "string" == typeof o && (o = [o]),
                null !== o && (i[s] = BD(e.children[s], t, o));
            }),
            Ne(e.children, (o, s) => {
              void 0 === r[s] && (i[s] = o);
            }),
            new U(e.segments, i)
          );
        }
      }
      function Ad(e, t, n) {
        const r = e.segments.slice(0, t);
        let i = 0;
        for (; i < n.length; ) {
          const o = n[i];
          if (go(o)) {
            const u = LF(o.outlets);
            return new U(r, u);
          }
          if (0 === i && ya(n[0])) {
            r.push(new fo(e.segments[t].path, HD(n[0]))), i++;
            continue;
          }
          const s = go(o) ? o.outlets[B] : `${o}`,
            a = i < n.length - 1 ? n[i + 1] : null;
          s && a && ya(a)
            ? (r.push(new fo(s, HD(a))), (i += 2))
            : (r.push(new fo(s, {})), i++);
        }
        return new U(r, {});
      }
      function LF(e) {
        const t = {};
        return (
          Ne(e, (n, r) => {
            "string" == typeof n && (n = [n]),
              null !== n && (t[r] = Ad(new U([], {}), 0, n));
          }),
          t
        );
      }
      function HD(e) {
        const t = {};
        return Ne(e, (n, r) => (t[r] = `${n}`)), t;
      }
      function UD(e, t, n) {
        return e == n.path && Jt(t, n.parameters);
      }
      class BF {
        constructor(t, n, r, i) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = i);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t),
            wd(this.futureState.root),
            this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const i = Xr(n);
          t.children.forEach((o) => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, i[s], r), delete i[s];
          }),
            Ne(i, (o, s) => {
              this.deactivateRouteAndItsChildren(o, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const i = t.value,
            o = n ? n.value : null;
          if (i === o)
            if (i.component) {
              const s = r.getContext(i.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else o && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : n,
            o = Xr(t);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : n,
            o = Xr(t);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const i = Xr(n);
          t.children.forEach((o) => {
            this.activateRoutes(o, i[o.value.outlet], r),
              this.forwardEvent(new sF(o.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new iF(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const i = t.value,
            o = n ? n.value : null;
          if ((wd(i), i === o))
            if (i.component) {
              const s = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (i.component) {
            const s = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                wd(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = (function HF(e) {
                  for (let t = e.parent; t; t = t.parent) {
                    const n = t.routeConfig;
                    if (n && n._loadedConfig) return n._loadedConfig;
                    if (n && n.component) return null;
                  }
                  return null;
                })(i.snapshot),
                u = a ? a.module.componentFactoryResolver : null;
              (s.attachRef = null),
                (s.route = i),
                (s.resolver = u),
                s.outlet && s.outlet.activateWith(i, u),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class Sd {
        constructor(t, n) {
          (this.routes = t), (this.module = n);
        }
      }
      function kn(e) {
        return "function" == typeof e;
      }
      function rr(e) {
        return e instanceof tr;
      }
      const mo = Symbol("INITIAL_VALUE");
      function yo() {
        return er((e) =>
          (function UR(...e) {
            const t = si(e),
              n = gf(e),
              { args: r, keys: i } = Kv(e);
            if (0 === r.length) return Se([], t);
            const o = new he(
              (function $R(e, t, n = jn) {
                return (r) => {
                  uD(
                    t,
                    () => {
                      const { length: i } = e,
                        o = new Array(i);
                      let s = i,
                        a = i;
                      for (let u = 0; u < i; u++)
                        uD(
                          t,
                          () => {
                            const l = Se(e[u], t);
                            let c = !1;
                            l.subscribe(
                              Me(
                                r,
                                (d) => {
                                  (o[u] = d),
                                    c || ((c = !0), a--),
                                    a || r.next(n(o.slice()));
                                },
                                () => {
                                  --s || r.complete();
                                }
                              )
                            );
                          },
                          r
                        );
                    },
                    r
                  );
                };
              })(r, t, i ? (s) => Yv(i, s) : jn)
            );
            return n ? o.pipe(Jv(n)) : o;
          })(
            e.map((t) =>
              t.pipe(
                Ao(1),
                (function qR(...e) {
                  const t = si(e);
                  return Te((n, r) => {
                    (t ? pd(e, n, t) : pd(e, n)).subscribe(r);
                  });
                })(mo)
              )
            )
          ).pipe(
            dD((t, n) => {
              let r = !1;
              return n.reduce(
                (i, o, s) =>
                  i !== mo
                    ? i
                    : (o === mo && (r = !0),
                      r || (!1 !== o && s !== n.length - 1 && !rr(o)) ? i : o),
                t
              );
            }, mo),
            Jn((t) => t !== mo),
            W((t) => (rr(t) ? t : !0 === t)),
            Ao(1)
          )
        );
      }
      class WF {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.children = new vo()),
            (this.attachRef = null);
        }
      }
      class vo {
        constructor() {
          this.contexts = new Map();
        }
        onChildOutletCreated(t, n) {
          const r = this.getOrCreateContext(t);
          (r.outlet = n), this.contexts.set(t, r);
        }
        onChildOutletDestroyed(t) {
          const n = this.getContext(t);
          n && ((n.outlet = null), (n.attachRef = null));
        }
        onOutletDeactivated() {
          const t = this.contexts;
          return (this.contexts = new Map()), t;
        }
        onOutletReAttached(t) {
          this.contexts = t;
        }
        getOrCreateContext(t) {
          let n = this.getContext(t);
          return n || ((n = new WF()), this.contexts.set(t, n)), n;
        }
        getContext(t) {
          return this.contexts.get(t) || null;
        }
      }
      let Id = (() => {
        class e {
          constructor(n, r, i, o, s) {
            (this.parentContexts = n),
              (this.location = r),
              (this.resolver = i),
              (this.changeDetector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new fe()),
              (this.deactivateEvents = new fe()),
              (this.attachEvents = new fe()),
              (this.detachEvents = new fe()),
              (this.name = o || B),
              n.onChildOutletCreated(this.name, this);
          }
          ngOnDestroy() {
            this.parentContexts.onChildOutletDestroyed(this.name);
          }
          ngOnInit() {
            if (!this.activated) {
              const n = this.parentContexts.getContext(this.name);
              n &&
                n.route &&
                (n.attachRef
                  ? this.attach(n.attachRef, n.route)
                  : this.activateWith(n.route, n.resolver || null));
            }
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new Error("Outlet is not activated");
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated)
              throw new Error("Cannot activate an already activated outlet");
            this._activatedRoute = n;
            const s = (r = r || this.resolver).resolveComponentFactory(
                n._futureSnapshot.routeConfig.component
              ),
              a = this.parentContexts.getOrCreateContext(this.name).children,
              u = new QF(n, a, this.location.injector);
            (this.activated = this.location.createComponent(
              s,
              this.location.length,
              u
            )),
              this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(vo), v(Rt), v(qi), mi("name"), v(xs));
          }),
          (e.ɵdir = S({
            type: e,
            selectors: [["router-outlet"]],
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
          })),
          e
        );
      })();
      class QF {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === ei
            ? this.route
            : t === vo
            ? this.childContexts
            : this.parent.get(t, n);
        }
      }
      let $D = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = ar({
            type: e,
            selectors: [["ng-component"]],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && ln(0, "router-outlet");
            },
            directives: [Id],
            encapsulation: 2,
          })),
          e
        );
      })();
      function GD(e, t = "") {
        for (let n = 0; n < e.length; n++) {
          const r = e[n];
          ZF(r, KF(t, r));
        }
      }
      function ZF(e, t) {
        e.children && GD(e.children, t);
      }
      function KF(e, t) {
        return t
          ? e || t.path
            ? e && !t.path
              ? `${e}/`
              : !e && t.path
              ? t.path
              : `${e}/${t.path}`
            : ""
          : e;
      }
      function Td(e) {
        const t = e.children && e.children.map(Td),
          n = t
            ? Object.assign(Object.assign({}, e), { children: t })
            : Object.assign({}, e);
        return (
          !n.component &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== B &&
            (n.component = $D),
          n
        );
      }
      function Ct(e) {
        return e.outlet || B;
      }
      function zD(e, t) {
        const n = e.filter((r) => Ct(r) === t);
        return n.push(...e.filter((r) => Ct(r) !== t)), n;
      }
      const qD = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function _a(e, t, n) {
        var r;
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? Object.assign({}, qD)
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const o = (t.matcher || lF)(n, e, t);
        if (!o) return Object.assign({}, qD);
        const s = {};
        Ne(o.posParams, (u, l) => {
          s[l] = u.path;
        });
        const a =
          o.consumed.length > 0
            ? Object.assign(
                Object.assign({}, s),
                o.consumed[o.consumed.length - 1].parameters
              )
            : s;
        return {
          matched: !0,
          consumedSegments: o.consumed,
          remainingSegments: n.slice(o.consumed.length),
          parameters: a,
          positionalParamSegments:
            null !== (r = o.posParams) && void 0 !== r ? r : {},
        };
      }
      function Da(e, t, n, r, i = "corrected") {
        if (
          n.length > 0 &&
          (function XF(e, t, n) {
            return n.some((r) => Ca(e, t, r) && Ct(r) !== B);
          })(e, n, r)
        ) {
          const s = new U(
            t,
            (function YF(e, t, n, r) {
              const i = {};
              (i[B] = r),
                (r._sourceSegment = e),
                (r._segmentIndexShift = t.length);
              for (const o of n)
                if ("" === o.path && Ct(o) !== B) {
                  const s = new U([], {});
                  (s._sourceSegment = e),
                    (s._segmentIndexShift = t.length),
                    (i[Ct(o)] = s);
                }
              return i;
            })(e, t, r, new U(n, e.children))
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: [] }
          );
        }
        if (
          0 === n.length &&
          (function eO(e, t, n) {
            return n.some((r) => Ca(e, t, r));
          })(e, n, r)
        ) {
          const s = new U(
            e.segments,
            (function JF(e, t, n, r, i, o) {
              const s = {};
              for (const a of r)
                if (Ca(e, n, a) && !i[Ct(a)]) {
                  const u = new U([], {});
                  (u._sourceSegment = e),
                    (u._segmentIndexShift =
                      "legacy" === o ? e.segments.length : t.length),
                    (s[Ct(a)] = u);
                }
              return Object.assign(Object.assign({}, i), s);
            })(e, t, n, r, e.children, i)
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: n }
          );
        }
        const o = new U(e.segments, e.children);
        return (
          (o._sourceSegment = e),
          (o._segmentIndexShift = t.length),
          { segmentGroup: o, slicedSegments: n }
        );
      }
      function Ca(e, t, n) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      function WD(e, t, n, r) {
        return (
          !!(Ct(e) === r || (r !== B && Ca(t, n, e))) &&
          ("**" === e.path || _a(t, e, n).matched)
        );
      }
      function QD(e, t, n) {
        return 0 === t.length && !e.children[n];
      }
      class wa {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class ZD {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function _o(e) {
        return ca(new wa(e));
      }
      function KD(e) {
        return ca(new ZD(e));
      }
      class iO {
        constructor(t, n, r, i, o) {
          (this.configLoader = n),
            (this.urlSerializer = r),
            (this.urlTree = i),
            (this.config = o),
            (this.allowRedirects = !0),
            (this.ngModule = t.get(dn));
        }
        apply() {
          const t = Da(this.urlTree.root, [], [], this.config).segmentGroup,
            n = new U(t.segments, t.children);
          return this.expandSegmentGroup(this.ngModule, this.config, n, B)
            .pipe(
              W((o) =>
                this.createUrlTree(
                  xd(o),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              Pn((o) => {
                if (o instanceof ZD)
                  return (this.allowRedirects = !1), this.match(o.urlTree);
                throw o instanceof wa ? this.noMatchError(o) : o;
              })
            );
        }
        match(t) {
          return this.expandSegmentGroup(this.ngModule, this.config, t.root, B)
            .pipe(
              W((i) => this.createUrlTree(xd(i), t.queryParams, t.fragment))
            )
            .pipe(
              Pn((i) => {
                throw i instanceof wa ? this.noMatchError(i) : i;
              })
            );
        }
        noMatchError(t) {
          return new Error(
            `Cannot match any routes. URL Segment: '${t.segmentGroup}'`
          );
        }
        createUrlTree(t, n, r) {
          const i = t.segments.length > 0 ? new U([], { [B]: t }) : t;
          return new tr(i, n, r);
        }
        expandSegmentGroup(t, n, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(t, n, r).pipe(W((o) => new U([], o)))
            : this.expandSegment(t, r, n, r.segments, i, !0);
        }
        expandChildren(t, n, r) {
          const i = [];
          for (const o of Object.keys(r.children))
            "primary" === o ? i.unshift(o) : i.push(o);
          return Se(i).pipe(
            Zr((o) => {
              const s = r.children[o],
                a = zD(n, o);
              return this.expandSegmentGroup(t, a, s, o).pipe(
                W((u) => ({ segment: u, outlet: o }))
              );
            }),
            dD((o, s) => ((o[s.outlet] = s.segment), o), {}),
            (function ZR(e, t) {
              const n = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  e ? Jn((i, o) => e(i, o, r)) : jn,
                  gd(1),
                  n ? hD(t) : fD(() => new lo())
                );
            })()
          );
        }
        expandSegment(t, n, r, i, o, s) {
          return Se(r).pipe(
            Zr((a) =>
              this.expandSegmentAgainstRoute(t, n, r, a, i, o, s).pipe(
                Pn((l) => {
                  if (l instanceof wa) return O(null);
                  throw l;
                })
              )
            ),
            Jr((a) => !!a),
            Pn((a, u) => {
              if (a instanceof lo || "EmptyError" === a.name)
                return QD(n, i, o) ? O(new U([], {})) : _o(n);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(t, n, r, i, o, s, a) {
          return WD(i, n, o, s)
            ? void 0 === i.redirectTo
              ? this.matchSegmentAgainstRoute(t, n, i, o, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s)
              : _o(n)
            : _o(n);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s) {
          return "**" === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, i, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                n,
                r,
                i,
                o,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, i) {
          const o = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? KD(o)
            : this.lineralizeSegments(r, o).pipe(
                Ae((s) => {
                  const a = new U(s, {});
                  return this.expandSegment(t, a, n, s, i, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s) {
          const {
            matched: a,
            consumedSegments: u,
            remainingSegments: l,
            positionalParamSegments: c,
          } = _a(n, i, o);
          if (!a) return _o(n);
          const d = this.applyRedirectCommands(u, i.redirectTo, c);
          return i.redirectTo.startsWith("/")
            ? KD(d)
            : this.lineralizeSegments(i, d).pipe(
                Ae((f) => this.expandSegment(t, n, r, f.concat(l), s, !1))
              );
        }
        matchSegmentAgainstRoute(t, n, r, i, o) {
          if ("**" === r.path)
            return r.loadChildren
              ? (r._loadedConfig
                  ? O(r._loadedConfig)
                  : this.configLoader.load(t.injector, r)
                ).pipe(W((d) => ((r._loadedConfig = d), new U(i, {}))))
              : O(new U(i, {}));
          const {
            matched: s,
            consumedSegments: a,
            remainingSegments: u,
          } = _a(n, r, i);
          return s
            ? this.getChildConfig(t, r, i).pipe(
                Ae((c) => {
                  const d = c.module,
                    f = c.routes,
                    { segmentGroup: h, slicedSegments: p } = Da(n, a, u, f),
                    m = new U(h.segments, h.children);
                  if (0 === p.length && m.hasChildren())
                    return this.expandChildren(d, f, m).pipe(
                      W((E) => new U(a, E))
                    );
                  if (0 === f.length && 0 === p.length) return O(new U(a, {}));
                  const D = Ct(r) === o;
                  return this.expandSegment(d, m, f, p, D ? B : o, !0).pipe(
                    W((g) => new U(a.concat(g.segments), g.children))
                  );
                })
              )
            : _o(n);
        }
        getChildConfig(t, n, r) {
          return n.children
            ? O(new Sd(n.children, t))
            : n.loadChildren
            ? void 0 !== n._loadedConfig
              ? O(n._loadedConfig)
              : this.runCanLoadGuards(t.injector, n, r).pipe(
                  Ae((i) =>
                    i
                      ? this.configLoader
                          .load(t.injector, n)
                          .pipe(W((o) => ((n._loadedConfig = o), o)))
                      : (function nO(e) {
                          return ca(
                            yd(
                              `Cannot load children because the guard of the route "path: '${e.path}'" returned false`
                            )
                          );
                        })(n)
                  )
                )
            : O(new Sd([], t));
        }
        runCanLoadGuards(t, n, r) {
          const i = n.canLoad;
          return i && 0 !== i.length
            ? O(
                i.map((s) => {
                  const a = t.get(s);
                  let u;
                  if (
                    (function $F(e) {
                      return e && kn(e.canLoad);
                    })(a)
                  )
                    u = a.canLoad(n, r);
                  else {
                    if (!kn(a)) throw new Error("Invalid CanLoad guard");
                    u = a(n, r);
                  }
                  return Yt(u);
                })
              ).pipe(
                yo(),
                ut((s) => {
                  if (!rr(s)) return;
                  const a = yd(
                    `Redirecting to "${this.urlSerializer.serialize(s)}"`
                  );
                  throw ((a.url = s), a);
                }),
                W((s) => !0 === s)
              )
            : O(!0);
        }
        lineralizeSegments(t, n) {
          let r = [],
            i = n.root;
          for (;;) {
            if (((r = r.concat(i.segments)), 0 === i.numberOfChildren))
              return O(r);
            if (i.numberOfChildren > 1 || !i.children[B])
              return ca(
                new Error(
                  `Only absolute redirects can have named outlets. redirectTo: '${t.redirectTo}'`
                )
              );
            i = i.children[B];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreatreUrlTree(
            n,
            this.urlSerializer.parse(n),
            t,
            r
          );
        }
        applyRedirectCreatreUrlTree(t, n, r, i) {
          const o = this.createSegmentGroup(t, n.root, r, i);
          return new tr(
            o,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            Ne(t, (i, o) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[o] = n[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, i) {
          const o = this.createSegments(t, n.segments, r, i);
          let s = {};
          return (
            Ne(n.children, (a, u) => {
              s[u] = this.createSegmentGroup(t, a, r, i);
            }),
            new U(o, s)
          );
        }
        createSegments(t, n, r, i) {
          return n.map((o) =>
            o.path.startsWith(":")
              ? this.findPosParam(t, o, i)
              : this.findOrReturn(o, r)
          );
        }
        findPosParam(t, n, r) {
          const i = r[n.path.substring(1)];
          if (!i)
            throw new Error(
              `Cannot redirect to '${t}'. Cannot find '${n.path}'.`
            );
          return i;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const i of n) {
            if (i.path === t.path) return n.splice(r), i;
            r++;
          }
          return t;
        }
      }
      function xd(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const o = xd(e.children[r]);
          (o.segments.length > 0 || o.hasChildren()) && (t[r] = o);
        }
        return (function oO(e) {
          if (1 === e.numberOfChildren && e.children[B]) {
            const t = e.children[B];
            return new U(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new U(e.segments, t));
      }
      class JD {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class Ea {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function aO(e, t, n) {
        const r = e._root;
        return Do(r, t ? t._root : null, n, [r.value]);
      }
      function ba(e, t, n) {
        const r = (function lO(e) {
          if (!e) return null;
          for (let t = e.parent; t; t = t.parent) {
            const n = t.routeConfig;
            if (n && n._loadedConfig) return n._loadedConfig;
          }
          return null;
        })(t);
        return (r ? r.module.injector : n).get(e);
      }
      function Do(
        e,
        t,
        n,
        r,
        i = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const o = Xr(t);
        return (
          e.children.forEach((s) => {
            (function cO(
              e,
              t,
              n,
              r,
              i = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const o = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const u = (function dO(e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !nr(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !nr(e.url, t.url) || !Jt(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !Ed(e, t) || !Jt(e.queryParams, t.queryParams);
                    default:
                      return !Ed(e, t);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                u
                  ? i.canActivateChecks.push(new JD(r))
                  : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  Do(e, t, o.component ? (a ? a.children : null) : n, r, i),
                  u &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new Ea(a.outlet.component, s));
              } else
                s && Co(t, a, i),
                  i.canActivateChecks.push(new JD(r)),
                  Do(e, null, o.component ? (a ? a.children : null) : n, r, i);
            })(s, o[s.value.outlet], n, r.concat([s.value]), i),
              delete o[s.value.outlet];
          }),
          Ne(o, (s, a) => Co(s, n.getContext(a), i)),
          i
        );
      }
      function Co(e, t, n) {
        const r = Xr(e),
          i = e.value;
        Ne(r, (o, s) => {
          Co(o, i.component ? (t ? t.children.getContext(s) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new Ea(
              i.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              i
            )
          );
      }
      class DO {}
      function YD(e) {
        return new he((t) => t.error(e));
      }
      class wO {
        constructor(t, n, r, i, o, s) {
          (this.rootComponentType = t),
            (this.config = n),
            (this.urlTree = r),
            (this.url = i),
            (this.paramsInheritanceStrategy = o),
            (this.relativeLinkResolution = s);
        }
        recognize() {
          const t = Da(
              this.urlTree.root,
              [],
              [],
              this.config.filter((s) => void 0 === s.redirectTo),
              this.relativeLinkResolution
            ).segmentGroup,
            n = this.processSegmentGroup(this.config, t, B);
          if (null === n) return null;
          const r = new ma(
              [],
              Object.freeze({}),
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              B,
              this.rootComponentType,
              null,
              this.urlTree.root,
              -1,
              {}
            ),
            i = new yn(r, n),
            o = new kD(this.url, i);
          return this.inheritParamsAndData(o._root), o;
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = PD(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach((i) => this.inheritParamsAndData(i));
        }
        processSegmentGroup(t, n, r) {
          return 0 === n.segments.length && n.hasChildren()
            ? this.processChildren(t, n)
            : this.processSegment(t, n, n.segments, r);
        }
        processChildren(t, n) {
          const r = [];
          for (const o of Object.keys(n.children)) {
            const s = n.children[o],
              a = zD(t, o),
              u = this.processSegmentGroup(a, s, o);
            if (null === u) return null;
            r.push(...u);
          }
          const i = XD(r);
          return (
            (function EO(e) {
              e.sort((t, n) =>
                t.value.outlet === B
                  ? -1
                  : n.value.outlet === B
                  ? 1
                  : t.value.outlet.localeCompare(n.value.outlet)
              );
            })(i),
            i
          );
        }
        processSegment(t, n, r, i) {
          for (const o of t) {
            const s = this.processSegmentAgainstRoute(o, n, r, i);
            if (null !== s) return s;
          }
          return QD(n, r, i) ? [] : null;
        }
        processSegmentAgainstRoute(t, n, r, i) {
          if (t.redirectTo || !WD(t, n, r, i)) return null;
          let o,
            s = [],
            a = [];
          if ("**" === t.path) {
            const h = r.length > 0 ? CD(r).parameters : {};
            o = new ma(
              r,
              h,
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              nC(t),
              Ct(t),
              t.component,
              t,
              eC(n),
              tC(n) + r.length,
              rC(t)
            );
          } else {
            const h = _a(n, t, r);
            if (!h.matched) return null;
            (s = h.consumedSegments),
              (a = h.remainingSegments),
              (o = new ma(
                s,
                h.parameters,
                Object.freeze(Object.assign({}, this.urlTree.queryParams)),
                this.urlTree.fragment,
                nC(t),
                Ct(t),
                t.component,
                t,
                eC(n),
                tC(n) + s.length,
                rC(t)
              ));
          }
          const u = (function bO(e) {
              return e.children
                ? e.children
                : e.loadChildren
                ? e._loadedConfig.routes
                : [];
            })(t),
            { segmentGroup: l, slicedSegments: c } = Da(
              n,
              s,
              a,
              u.filter((h) => void 0 === h.redirectTo),
              this.relativeLinkResolution
            );
          if (0 === c.length && l.hasChildren()) {
            const h = this.processChildren(u, l);
            return null === h ? null : [new yn(o, h)];
          }
          if (0 === u.length && 0 === c.length) return [new yn(o, [])];
          const d = Ct(t) === i,
            f = this.processSegment(u, l, c, d ? B : i);
          return null === f ? null : [new yn(o, f)];
        }
      }
      function MO(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path && void 0 === t.redirectTo;
      }
      function XD(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!MO(r)) {
            t.push(r);
            continue;
          }
          const i = t.find((o) => r.value.routeConfig === o.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), n.add(i)) : t.push(r);
        }
        for (const r of n) {
          const i = XD(r.children);
          t.push(new yn(r.value, i));
        }
        return t.filter((r) => !n.has(r));
      }
      function eC(e) {
        let t = e;
        for (; t._sourceSegment; ) t = t._sourceSegment;
        return t;
      }
      function tC(e) {
        let t = e,
          n = t._segmentIndexShift ? t._segmentIndexShift : 0;
        for (; t._sourceSegment; )
          (t = t._sourceSegment),
            (n += t._segmentIndexShift ? t._segmentIndexShift : 0);
        return n - 1;
      }
      function nC(e) {
        return e.data || {};
      }
      function rC(e) {
        return e.resolve || {};
      }
      function iC(e) {
        return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
      }
      function Nd(e) {
        return er((t) => {
          const n = e(t);
          return n ? Se(n).pipe(W(() => t)) : O(t);
        });
      }
      class FO extends class RO {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      } {}
      const Rd = new L("ROUTES");
      class oC {
        constructor(t, n, r, i) {
          (this.injector = t),
            (this.compiler = n),
            (this.onLoadStartListener = r),
            (this.onLoadEndListener = i);
        }
        load(t, n) {
          if (n._loader$) return n._loader$;
          this.onLoadStartListener && this.onLoadStartListener(n);
          const i = this.loadModuleFactory(n.loadChildren).pipe(
            W((o) => {
              this.onLoadEndListener && this.onLoadEndListener(n);
              const s = o.create(t);
              return new Sd(
                DD(s.injector.get(Rd, void 0, T.Self | T.Optional)).map(Td),
                s
              );
            }),
            Pn((o) => {
              throw ((n._loader$ = void 0), o);
            })
          );
          return (
            (n._loader$ = new zR(i, () => new Xt()).pipe(cD())), n._loader$
          );
        }
        loadModuleFactory(t) {
          return Yt(t()).pipe(
            Ae((n) =>
              n instanceof Qm ? O(n) : Se(this.compiler.compileModuleAsync(n))
            )
          );
        }
      }
      class PO {
        shouldProcessUrl(t) {
          return !0;
        }
        extract(t) {
          return t;
        }
        merge(t, n) {
          return t;
        }
      }
      function kO(e) {
        throw e;
      }
      function VO(e, t, n) {
        return t.parse("/");
      }
      function sC(e, t) {
        return O(null);
      }
      const LO = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        jO = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let We = (() => {
        class e {
          constructor(n, r, i, o, s, a, u) {
            (this.rootComponentType = n),
              (this.urlSerializer = r),
              (this.rootContexts = i),
              (this.location = o),
              (this.config = u),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new Xt()),
              (this.errorHandler = kO),
              (this.malformedUriErrorHandler = VO),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.hooks = {
                beforePreactivation: sC,
                afterPreactivation: sC,
              }),
              (this.urlHandlingStrategy = new PO()),
              (this.routeReuseStrategy = new FO()),
              (this.onSameUrlNavigation = "ignore"),
              (this.paramsInheritanceStrategy = "emptyOnly"),
              (this.urlUpdateStrategy = "deferred"),
              (this.relativeLinkResolution = "corrected"),
              (this.canceledNavigationResolution = "replace"),
              (this.ngModule = s.get(dn)),
              (this.console = s.get(Ny));
            const d = s.get(xe);
            (this.isNgZoneEnabled = d instanceof xe && xe.isInAngularZone()),
              this.resetConfig(u),
              (this.currentUrlTree = (function dF() {
                return new tr(new U([], {}), {}, null);
              })()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.configLoader = new oC(
                s,
                a,
                (f) => this.triggerEvent(new gD(f)),
                (f) => this.triggerEvent(new mD(f))
              )),
              (this.routerState = OD(
                this.currentUrlTree,
                this.rootComponentType
              )),
              (this.transitions = new kt({
                id: 0,
                targetPageId: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                urlAfterRedirects: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: "imperative",
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations();
          }
          get browserPageId() {
            var n;
            return null === (n = this.location.getState()) || void 0 === n
              ? void 0
              : n.ɵrouterPageId;
          }
          setupNavigations(n) {
            const r = this.events;
            return n.pipe(
              Jn((i) => 0 !== i.id),
              W((i) =>
                Object.assign(Object.assign({}, i), {
                  extractedUrl: this.urlHandlingStrategy.extract(i.rawUrl),
                })
              ),
              er((i) => {
                let o = !1,
                  s = !1;
                return O(i).pipe(
                  ut((a) => {
                    this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.currentRawUrl,
                      extractedUrl: a.extractedUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? Object.assign(
                            Object.assign({}, this.lastSuccessfulNavigation),
                            { previousNavigation: null }
                          )
                        : null,
                    };
                  }),
                  er((a) => {
                    const u = this.browserUrlTree.toString(),
                      l =
                        !this.navigated ||
                        a.extractedUrl.toString() !== u ||
                        u !== this.currentUrlTree.toString();
                    if (
                      ("reload" === this.onSameUrlNavigation || l) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        aC(a.source) && (this.browserUrlTree = a.extractedUrl),
                        O(a).pipe(
                          er((d) => {
                            const f = this.transitions.getValue();
                            return (
                              r.next(
                                new md(
                                  d.id,
                                  this.serializeUrl(d.extractedUrl),
                                  d.source,
                                  d.restoredState
                                )
                              ),
                              f !== this.transitions.getValue()
                                ? tn
                                : Promise.resolve(d)
                            );
                          }),
                          (function sO(e, t, n, r) {
                            return er((i) =>
                              (function rO(e, t, n, r, i) {
                                return new iO(e, t, n, r, i).apply();
                              })(e, t, n, i.extractedUrl, r).pipe(
                                W((o) =>
                                  Object.assign(Object.assign({}, i), {
                                    urlAfterRedirects: o,
                                  })
                                )
                              )
                            );
                          })(
                            this.ngModule.injector,
                            this.configLoader,
                            this.urlSerializer,
                            this.config
                          ),
                          ut((d) => {
                            this.currentNavigation = Object.assign(
                              Object.assign({}, this.currentNavigation),
                              { finalUrl: d.urlAfterRedirects }
                            );
                          }),
                          (function AO(e, t, n, r, i) {
                            return Ae((o) =>
                              (function CO(
                                e,
                                t,
                                n,
                                r,
                                i = "emptyOnly",
                                o = "legacy"
                              ) {
                                try {
                                  const s = new wO(
                                    e,
                                    t,
                                    n,
                                    r,
                                    i,
                                    o
                                  ).recognize();
                                  return null === s ? YD(new DO()) : O(s);
                                } catch (s) {
                                  return YD(s);
                                }
                              })(
                                e,
                                t,
                                o.urlAfterRedirects,
                                n(o.urlAfterRedirects),
                                r,
                                i
                              ).pipe(
                                W((s) =>
                                  Object.assign(Object.assign({}, o), {
                                    targetSnapshot: s,
                                  })
                                )
                              )
                            );
                          })(
                            this.rootComponentType,
                            this.config,
                            (d) => this.serializeUrl(d),
                            this.paramsInheritanceStrategy,
                            this.relativeLinkResolution
                          ),
                          ut((d) => {
                            if ("eager" === this.urlUpdateStrategy) {
                              if (!d.extras.skipLocationChange) {
                                const h = this.urlHandlingStrategy.merge(
                                  d.urlAfterRedirects,
                                  d.rawUrl
                                );
                                this.setBrowserUrl(h, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const f = new YR(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot
                            );
                            r.next(f);
                          })
                        )
                      );
                    if (
                      l &&
                      this.rawUrlTree &&
                      this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)
                    ) {
                      const {
                          id: f,
                          extractedUrl: h,
                          source: p,
                          restoredState: m,
                          extras: D,
                        } = a,
                        _ = new md(f, this.serializeUrl(h), p, m);
                      r.next(_);
                      const g = OD(h, this.rootComponentType).snapshot;
                      return O(
                        Object.assign(Object.assign({}, a), {
                          targetSnapshot: g,
                          urlAfterRedirects: h,
                          extras: Object.assign(Object.assign({}, D), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), tn;
                  }),
                  Nd((a) => {
                    const {
                      targetSnapshot: u,
                      id: l,
                      extractedUrl: c,
                      rawUrl: d,
                      extras: { skipLocationChange: f, replaceUrl: h },
                    } = a;
                    return this.hooks.beforePreactivation(u, {
                      navigationId: l,
                      appliedUrlTree: c,
                      rawUrlTree: d,
                      skipLocationChange: !!f,
                      replaceUrl: !!h,
                    });
                  }),
                  ut((a) => {
                    const u = new XR(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot
                    );
                    this.triggerEvent(u);
                  }),
                  W((a) =>
                    Object.assign(Object.assign({}, a), {
                      guards: aO(
                        a.targetSnapshot,
                        a.currentSnapshot,
                        this.rootContexts
                      ),
                    })
                  ),
                  (function fO(e, t) {
                    return Ae((n) => {
                      const {
                        targetSnapshot: r,
                        currentSnapshot: i,
                        guards: {
                          canActivateChecks: o,
                          canDeactivateChecks: s,
                        },
                      } = n;
                      return 0 === s.length && 0 === o.length
                        ? O(
                            Object.assign(Object.assign({}, n), {
                              guardsResult: !0,
                            })
                          )
                        : (function hO(e, t, n, r) {
                            return Se(e).pipe(
                              Ae((i) =>
                                (function _O(e, t, n, r, i) {
                                  const o =
                                    t && t.routeConfig
                                      ? t.routeConfig.canDeactivate
                                      : null;
                                  return o && 0 !== o.length
                                    ? O(
                                        o.map((a) => {
                                          const u = ba(a, t, i);
                                          let l;
                                          if (
                                            (function qF(e) {
                                              return e && kn(e.canDeactivate);
                                            })(u)
                                          )
                                            l = Yt(u.canDeactivate(e, t, n, r));
                                          else {
                                            if (!kn(u))
                                              throw new Error(
                                                "Invalid CanDeactivate guard"
                                              );
                                            l = Yt(u(e, t, n, r));
                                          }
                                          return l.pipe(Jr());
                                        })
                                      ).pipe(yo())
                                    : O(!0);
                                })(i.component, i.route, n, t, r)
                              ),
                              Jr((i) => !0 !== i, !0)
                            );
                          })(s, r, i, e).pipe(
                            Ae((a) =>
                              a &&
                              (function UF(e) {
                                return "boolean" == typeof e;
                              })(a)
                                ? (function pO(e, t, n, r) {
                                    return Se(t).pipe(
                                      Zr((i) =>
                                        pd(
                                          (function mO(e, t) {
                                            return (
                                              null !== e && t && t(new rF(e)),
                                              O(!0)
                                            );
                                          })(i.route.parent, r),
                                          (function gO(e, t) {
                                            return (
                                              null !== e && t && t(new oF(e)),
                                              O(!0)
                                            );
                                          })(i.route, r),
                                          (function vO(e, t, n) {
                                            const r = t[t.length - 1],
                                              o = t
                                                .slice(0, t.length - 1)
                                                .reverse()
                                                .map((s) =>
                                                  (function uO(e) {
                                                    const t = e.routeConfig
                                                      ? e.routeConfig
                                                          .canActivateChild
                                                      : null;
                                                    return t && 0 !== t.length
                                                      ? { node: e, guards: t }
                                                      : null;
                                                  })(s)
                                                )
                                                .filter((s) => null !== s)
                                                .map((s) =>
                                                  lD(() =>
                                                    O(
                                                      s.guards.map((u) => {
                                                        const l = ba(
                                                          u,
                                                          s.node,
                                                          n
                                                        );
                                                        let c;
                                                        if (
                                                          (function zF(e) {
                                                            return (
                                                              e &&
                                                              kn(
                                                                e.canActivateChild
                                                              )
                                                            );
                                                          })(l)
                                                        )
                                                          c = Yt(
                                                            l.canActivateChild(
                                                              r,
                                                              e
                                                            )
                                                          );
                                                        else {
                                                          if (!kn(l))
                                                            throw new Error(
                                                              "Invalid CanActivateChild guard"
                                                            );
                                                          c = Yt(l(r, e));
                                                        }
                                                        return c.pipe(Jr());
                                                      })
                                                    ).pipe(yo())
                                                  )
                                                );
                                            return O(o).pipe(yo());
                                          })(e, i.path, n),
                                          (function yO(e, t, n) {
                                            const r = t.routeConfig
                                              ? t.routeConfig.canActivate
                                              : null;
                                            if (!r || 0 === r.length)
                                              return O(!0);
                                            const i = r.map((o) =>
                                              lD(() => {
                                                const s = ba(o, t, n);
                                                let a;
                                                if (
                                                  (function GF(e) {
                                                    return (
                                                      e && kn(e.canActivate)
                                                    );
                                                  })(s)
                                                )
                                                  a = Yt(s.canActivate(t, e));
                                                else {
                                                  if (!kn(s))
                                                    throw new Error(
                                                      "Invalid CanActivate guard"
                                                    );
                                                  a = Yt(s(t, e));
                                                }
                                                return a.pipe(Jr());
                                              })
                                            );
                                            return O(i).pipe(yo());
                                          })(e, i.route, n)
                                        )
                                      ),
                                      Jr((i) => !0 !== i, !0)
                                    );
                                  })(r, o, e, t)
                                : O(a)
                            ),
                            W((a) =>
                              Object.assign(Object.assign({}, n), {
                                guardsResult: a,
                              })
                            )
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  ut((a) => {
                    if (rr(a.guardsResult)) {
                      const l = yd(
                        `Redirecting to "${this.serializeUrl(a.guardsResult)}"`
                      );
                      throw ((l.url = a.guardsResult), l);
                    }
                    const u = new eF(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult
                    );
                    this.triggerEvent(u);
                  }),
                  Jn(
                    (a) =>
                      !!a.guardsResult ||
                      (this.restoreHistory(a),
                      this.cancelNavigationTransition(a, ""),
                      !1)
                  ),
                  Nd((a) => {
                    if (a.guards.canActivateChecks.length)
                      return O(a).pipe(
                        ut((u) => {
                          const l = new tF(
                            u.id,
                            this.serializeUrl(u.extractedUrl),
                            this.serializeUrl(u.urlAfterRedirects),
                            u.targetSnapshot
                          );
                          this.triggerEvent(l);
                        }),
                        er((u) => {
                          let l = !1;
                          return O(u).pipe(
                            (function SO(e, t) {
                              return Ae((n) => {
                                const {
                                  targetSnapshot: r,
                                  guards: { canActivateChecks: i },
                                } = n;
                                if (!i.length) return O(n);
                                let o = 0;
                                return Se(i).pipe(
                                  Zr((s) =>
                                    (function IO(e, t, n, r) {
                                      return (function TO(e, t, n, r) {
                                        const i = iC(e);
                                        if (0 === i.length) return O({});
                                        const o = {};
                                        return Se(i).pipe(
                                          Ae((s) =>
                                            (function xO(e, t, n, r) {
                                              const i = ba(e, t, r);
                                              return Yt(
                                                i.resolve
                                                  ? i.resolve(t, n)
                                                  : i(t, n)
                                              );
                                            })(e[s], t, n, r).pipe(
                                              ut((a) => {
                                                o[s] = a;
                                              })
                                            )
                                          ),
                                          gd(1),
                                          Ae(() =>
                                            iC(o).length === i.length
                                              ? O(o)
                                              : tn
                                          )
                                        );
                                      })(e._resolve, e, t, r).pipe(
                                        W(
                                          (o) => (
                                            (e._resolvedData = o),
                                            (e.data = Object.assign(
                                              Object.assign({}, e.data),
                                              PD(e, n).resolve
                                            )),
                                            null
                                          )
                                        )
                                      );
                                    })(s.route, r, e, t)
                                  ),
                                  ut(() => o++),
                                  gd(1),
                                  Ae((s) => (o === i.length ? O(n) : tn))
                                );
                              });
                            })(
                              this.paramsInheritanceStrategy,
                              this.ngModule.injector
                            ),
                            ut({
                              next: () => (l = !0),
                              complete: () => {
                                l ||
                                  (this.restoreHistory(u),
                                  this.cancelNavigationTransition(
                                    u,
                                    "At least one route resolver didn't emit any value."
                                  ));
                              },
                            })
                          );
                        }),
                        ut((u) => {
                          const l = new nF(
                            u.id,
                            this.serializeUrl(u.extractedUrl),
                            this.serializeUrl(u.urlAfterRedirects),
                            u.targetSnapshot
                          );
                          this.triggerEvent(l);
                        })
                      );
                  }),
                  Nd((a) => {
                    const {
                      targetSnapshot: u,
                      id: l,
                      extractedUrl: c,
                      rawUrl: d,
                      extras: { skipLocationChange: f, replaceUrl: h },
                    } = a;
                    return this.hooks.afterPreactivation(u, {
                      navigationId: l,
                      appliedUrlTree: c,
                      rawUrlTree: d,
                      skipLocationChange: !!f,
                      replaceUrl: !!h,
                    });
                  }),
                  W((a) => {
                    const u = (function TF(e, t, n) {
                      const r = po(e, t._root, n ? n._root : void 0);
                      return new FD(r, t);
                    })(
                      this.routeReuseStrategy,
                      a.targetSnapshot,
                      a.currentRouterState
                    );
                    return Object.assign(Object.assign({}, a), {
                      targetRouterState: u,
                    });
                  }),
                  ut((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        a.urlAfterRedirects,
                        a.rawUrl
                      )),
                      (this.routerState = a.targetRouterState),
                      "deferred" === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange ||
                          this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((e, t, n) =>
                    W(
                      (r) => (
                        new BF(
                          t,
                          r.targetRouterState,
                          r.currentRouterState,
                          n
                        ).activate(e),
                        r
                      )
                    ))(this.rootContexts, this.routeReuseStrategy, (a) =>
                    this.triggerEvent(a)
                  ),
                  ut({
                    next() {
                      o = !0;
                    },
                    complete() {
                      o = !0;
                    },
                  }),
                  (function KR(e) {
                    return Te((t, n) => {
                      try {
                        t.subscribe(n);
                      } finally {
                        n.add(e);
                      }
                    });
                  })(() => {
                    var a;
                    o ||
                      s ||
                      this.cancelNavigationTransition(
                        i,
                        `Navigation ID ${i.id} is not equal to the current navigation id ${this.navigationId}`
                      ),
                      (null === (a = this.currentNavigation) || void 0 === a
                        ? void 0
                        : a.id) === i.id && (this.currentNavigation = null);
                  }),
                  Pn((a) => {
                    if (
                      ((s = !0),
                      (function uF(e) {
                        return e && e[vD];
                      })(a))
                    ) {
                      const u = rr(a.url);
                      u || ((this.navigated = !0), this.restoreHistory(i, !0));
                      const l = new pD(
                        i.id,
                        this.serializeUrl(i.extractedUrl),
                        a.message
                      );
                      r.next(l),
                        u
                          ? setTimeout(() => {
                              const c = this.urlHandlingStrategy.merge(
                                  a.url,
                                  this.rawUrlTree
                                ),
                                d = {
                                  skipLocationChange:
                                    i.extras.skipLocationChange,
                                  replaceUrl:
                                    "eager" === this.urlUpdateStrategy ||
                                    aC(i.source),
                                };
                              this.scheduleNavigation(
                                c,
                                "imperative",
                                null,
                                d,
                                {
                                  resolve: i.resolve,
                                  reject: i.reject,
                                  promise: i.promise,
                                }
                              );
                            }, 0)
                          : i.resolve(!1);
                    } else {
                      this.restoreHistory(i, !0);
                      const u = new JR(
                        i.id,
                        this.serializeUrl(i.extractedUrl),
                        a
                      );
                      r.next(u);
                      try {
                        i.resolve(this.errorHandler(a));
                      } catch (l) {
                        i.reject(l);
                      }
                    }
                    return tn;
                  })
                );
              })
            );
          }
          resetRootComponentType(n) {
            (this.rootComponentType = n),
              (this.routerState.root.component = this.rootComponentType);
          }
          setTransition(n) {
            this.transitions.next(
              Object.assign(Object.assign({}, this.transitions.value), n)
            );
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              0 === this.navigationId &&
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    var i;
                    const o = { replaceUrl: !0 },
                      s = (
                        null === (i = n.state) || void 0 === i
                          ? void 0
                          : i.navigationId
                      )
                        ? n.state
                        : null;
                    if (s) {
                      const u = Object.assign({}, s);
                      delete u.navigationId,
                        delete u.ɵrouterPageId,
                        0 !== Object.keys(u).length && (o.state = u);
                    }
                    const a = this.parseUrl(n.url);
                    this.scheduleNavigation(a, r, s, o);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.currentNavigation;
          }
          triggerEvent(n) {
            this.events.next(n);
          }
          resetConfig(n) {
            GD(n),
              (this.config = n.map(Td)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.transitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(n, r = {}) {
            const {
                relativeTo: i,
                queryParams: o,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: u,
              } = r,
              l = i || this.routerState.root,
              c = u ? this.currentUrlTree.fragment : s;
            let d = null;
            switch (a) {
              case "merge":
                d = Object.assign(
                  Object.assign({}, this.currentUrlTree.queryParams),
                  o
                );
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = o || null;
            }
            return (
              null !== d && (d = this.removeEmptyProps(d)),
              (function RF(e, t, n, r, i) {
                if (0 === n.length) return bd(t.root, t.root, t.root, r, i);
                const o = (function FF(e) {
                  if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
                    return new jD(!0, 0, e);
                  let t = 0,
                    n = !1;
                  const r = e.reduce((i, o, s) => {
                    if ("object" == typeof o && null != o) {
                      if (o.outlets) {
                        const a = {};
                        return (
                          Ne(o.outlets, (u, l) => {
                            a[l] = "string" == typeof u ? u.split("/") : u;
                          }),
                          [...i, { outlets: a }]
                        );
                      }
                      if (o.segmentPath) return [...i, o.segmentPath];
                    }
                    return "string" != typeof o
                      ? [...i, o]
                      : 0 === s
                      ? (o.split("/").forEach((a, u) => {
                          (0 == u && "." === a) ||
                            (0 == u && "" === a
                              ? (n = !0)
                              : ".." === a
                              ? t++
                              : "" != a && i.push(a));
                        }),
                        i)
                      : [...i, o];
                  }, []);
                  return new jD(n, t, r);
                })(n);
                if (o.toRoot()) return bd(t.root, t.root, new U([], {}), r, i);
                const s = (function OF(e, t, n) {
                    if (e.isAbsolute) return new Md(t.root, !0, 0);
                    if (-1 === n.snapshot._lastPathIndex) {
                      const o = n.snapshot._urlSegment;
                      return new Md(o, o === t.root, 0);
                    }
                    const r = ya(e.commands[0]) ? 0 : 1;
                    return (function PF(e, t, n) {
                      let r = e,
                        i = t,
                        o = n;
                      for (; o > i; ) {
                        if (((o -= i), (r = r.parent), !r))
                          throw new Error("Invalid number of '../'");
                        i = r.segments.length;
                      }
                      return new Md(r, !1, i - o);
                    })(
                      n.snapshot._urlSegment,
                      n.snapshot._lastPathIndex + r,
                      e.numberOfDoubleDots
                    );
                  })(o, t, e),
                  a = s.processChildren
                    ? va(s.segmentGroup, s.index, o.commands)
                    : BD(s.segmentGroup, s.index, o.commands);
                return bd(t.root, s.segmentGroup, a, r, i);
              })(l, this.currentUrlTree, n, d, null != c ? c : null)
            );
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const i = rr(n) ? n : this.parseUrl(n),
              o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
            return this.scheduleNavigation(o, "imperative", null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function BO(e) {
                for (let t = 0; t < e.length; t++) {
                  const n = e[t];
                  if (null == n)
                    throw new Error(
                      `The requested path contains ${n} segment at index ${t}`
                    );
                }
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (i) {
              r = this.malformedUriErrorHandler(i, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let i;
            if (
              ((i =
                !0 === r
                  ? Object.assign({}, LO)
                  : !1 === r
                  ? Object.assign({}, jO)
                  : r),
              rr(n))
            )
              return ED(this.currentUrlTree, n, i);
            const o = this.parseUrl(n);
            return ED(this.currentUrlTree, o, i);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, i) => {
              const o = n[i];
              return null != o && (r[i] = o), r;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (n) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = n.id),
                  (this.currentPageId = n.targetPageId),
                  this.events.next(
                    new co(
                      n.id,
                      this.serializeUrl(n.extractedUrl),
                      this.serializeUrl(this.currentUrlTree)
                    )
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  n.resolve(!0);
              },
              (n) => {
                this.console.warn(`Unhandled Navigation Error: ${n}`);
              }
            );
          }
          scheduleNavigation(n, r, i, o, s) {
            var a, u;
            if (this.disposed) return Promise.resolve(!1);
            let l, c, d;
            s
              ? ((l = s.resolve), (c = s.reject), (d = s.promise))
              : (d = new Promise((p, m) => {
                  (l = p), (c = m);
                }));
            const f = ++this.navigationId;
            let h;
            return (
              "computed" === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (i = this.location.getState()),
                  (h =
                    i && i.ɵrouterPageId
                      ? i.ɵrouterPageId
                      : o.replaceUrl || o.skipLocationChange
                      ? null !== (a = this.browserPageId) && void 0 !== a
                        ? a
                        : 0
                      : (null !== (u = this.browserPageId) && void 0 !== u
                          ? u
                          : 0) + 1))
                : (h = 0),
              this.setTransition({
                id: f,
                targetPageId: h,
                source: r,
                restoredState: i,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: n,
                extras: o,
                resolve: l,
                reject: c,
                promise: d,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              d.catch((p) => Promise.reject(p))
            );
          }
          setBrowserUrl(n, r) {
            const i = this.urlSerializer.serialize(n),
              o = Object.assign(
                Object.assign({}, r.extras.state),
                this.generateNgRouterState(r.id, r.targetPageId)
              );
            this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl
              ? this.location.replaceState(i, "", o)
              : this.location.go(i, "", o);
          }
          restoreHistory(n, r = !1) {
            var i, o;
            if ("computed" === this.canceledNavigationResolution) {
              const s = this.currentPageId - n.targetPageId;
              ("popstate" !== n.source &&
                "eager" !== this.urlUpdateStrategy &&
                this.currentUrlTree !==
                  (null === (i = this.currentNavigation) || void 0 === i
                    ? void 0
                    : i.finalUrl)) ||
              0 === s
                ? this.currentUrlTree ===
                    (null === (o = this.currentNavigation) || void 0 === o
                      ? void 0
                      : o.finalUrl) &&
                  0 === s &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(s);
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          cancelNavigationTransition(n, r) {
            const i = new pD(n.id, this.serializeUrl(n.extractedUrl), r);
            this.triggerEvent(i), n.resolve(!1);
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: r }
              : { navigationId: n };
          }
        }
        return (
          (e.ɵfac = function (n) {
            Cl();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function aC(e) {
        return "imperative" !== e;
      }
      let Ma = (() => {
        class e {
          constructor(n, r, i, o, s) {
            (this.router = n),
              (this.route = r),
              (this.tabIndexAttribute = i),
              (this.renderer = o),
              (this.el = s),
              (this.commands = null),
              (this.onChanges = new Xt()),
              this.setTabIndexIfNotOnNativeEl("0");
          }
          setTabIndexIfNotOnNativeEl(n) {
            if (null != this.tabIndexAttribute) return;
            const r = this.renderer,
              i = this.el.nativeElement;
            null !== n
              ? r.setAttribute(i, "tabindex", n)
              : r.removeAttribute(i, "tabindex");
          }
          ngOnChanges(n) {
            this.onChanges.next(this);
          }
          set routerLink(n) {
            null != n
              ? ((this.commands = Array.isArray(n) ? n : [n]),
                this.setTabIndexIfNotOnNativeEl("0"))
              : ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null));
          }
          onClick() {
            if (null === this.urlTree) return !0;
            const n = {
              skipLocationChange: ti(this.skipLocationChange),
              replaceUrl: ti(this.replaceUrl),
              state: this.state,
            };
            return this.router.navigateByUrl(this.urlTree, n), !0;
          }
          get urlTree() {
            return null === this.commands
              ? null
              : this.router.createUrlTree(this.commands, {
                  relativeTo:
                    void 0 !== this.relativeTo ? this.relativeTo : this.route,
                  queryParams: this.queryParams,
                  fragment: this.fragment,
                  queryParamsHandling: this.queryParamsHandling,
                  preserveFragment: ti(this.preserveFragment),
                });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(We), v(ei), mi("tabindex"), v(cn), v(st));
          }),
          (e.ɵdir = S({
            type: e,
            selectors: [["", "routerLink", "", 5, "a", 5, "area"]],
            hostBindings: function (n, r) {
              1 & n &&
                Le("click", function () {
                  return r.onClick();
                });
            },
            inputs: {
              queryParams: "queryParams",
              fragment: "fragment",
              queryParamsHandling: "queryParamsHandling",
              preserveFragment: "preserveFragment",
              skipLocationChange: "skipLocationChange",
              replaceUrl: "replaceUrl",
              state: "state",
              relativeTo: "relativeTo",
              routerLink: "routerLink",
            },
            features: [pt],
          })),
          e
        );
      })();
      function ti(e) {
        return "" === e || !!e;
      }
      class uC {}
      class lC {
        preload(t, n) {
          return O(null);
        }
      }
      let cC = (() => {
          class e {
            constructor(n, r, i, o) {
              (this.router = n),
                (this.injector = i),
                (this.preloadingStrategy = o),
                (this.loader = new oC(
                  i,
                  r,
                  (u) => n.triggerEvent(new gD(u)),
                  (u) => n.triggerEvent(new mD(u))
                ));
            }
            setUpPreloading() {
              this.subscription = this.router.events
                .pipe(
                  Jn((n) => n instanceof co),
                  Zr(() => this.preload())
                )
                .subscribe(() => {});
            }
            preload() {
              const n = this.injector.get(dn);
              return this.processRoutes(n, this.router.config);
            }
            ngOnDestroy() {
              this.subscription && this.subscription.unsubscribe();
            }
            processRoutes(n, r) {
              const i = [];
              for (const o of r)
                if (o.loadChildren && !o.canLoad && o._loadedConfig) {
                  const s = o._loadedConfig;
                  i.push(this.processRoutes(s.module, s.routes));
                } else
                  o.loadChildren && !o.canLoad
                    ? i.push(this.preloadConfig(n, o))
                    : o.children && i.push(this.processRoutes(n, o.children));
              return Se(i).pipe(
                oi(),
                W((o) => {})
              );
            }
            preloadConfig(n, r) {
              return this.preloadingStrategy.preload(r, () =>
                (r._loadedConfig
                  ? O(r._loadedConfig)
                  : this.loader.load(n.injector, r)
                ).pipe(
                  Ae(
                    (o) => (
                      (r._loadedConfig = o),
                      this.processRoutes(o.module, o.routes)
                    )
                  )
                )
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(b(We), b(Ry), b(ke), b(uC));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Od = (() => {
          class e {
            constructor(n, r, i = {}) {
              (this.router = n),
                (this.viewportScroller = r),
                (this.options = i),
                (this.lastId = 0),
                (this.lastSource = "imperative"),
                (this.restoredId = 0),
                (this.store = {}),
                (i.scrollPositionRestoration =
                  i.scrollPositionRestoration || "disabled"),
                (i.anchorScrolling = i.anchorScrolling || "disabled");
            }
            init() {
              "disabled" !== this.options.scrollPositionRestoration &&
                this.viewportScroller.setHistoryScrollRestoration("manual"),
                (this.routerEventsSubscription = this.createScrollEvents()),
                (this.scrollEventsSubscription = this.consumeScrollEvents());
            }
            createScrollEvents() {
              return this.router.events.subscribe((n) => {
                n instanceof md
                  ? ((this.store[this.lastId] =
                      this.viewportScroller.getScrollPosition()),
                    (this.lastSource = n.navigationTrigger),
                    (this.restoredId = n.restoredState
                      ? n.restoredState.navigationId
                      : 0))
                  : n instanceof co &&
                    ((this.lastId = n.id),
                    this.scheduleScrollEvent(
                      n,
                      this.router.parseUrl(n.urlAfterRedirects).fragment
                    ));
              });
            }
            consumeScrollEvents() {
              return this.router.events.subscribe((n) => {
                n instanceof yD &&
                  (n.position
                    ? "top" === this.options.scrollPositionRestoration
                      ? this.viewportScroller.scrollToPosition([0, 0])
                      : "enabled" === this.options.scrollPositionRestoration &&
                        this.viewportScroller.scrollToPosition(n.position)
                    : n.anchor && "enabled" === this.options.anchorScrolling
                    ? this.viewportScroller.scrollToAnchor(n.anchor)
                    : "disabled" !== this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition([0, 0]));
              });
            }
            scheduleScrollEvent(n, r) {
              this.router.triggerEvent(
                new yD(
                  n,
                  "popstate" === this.lastSource
                    ? this.store[this.restoredId]
                    : null,
                  r
                )
              );
            }
            ngOnDestroy() {
              this.routerEventsSubscription &&
                this.routerEventsSubscription.unsubscribe(),
                this.scrollEventsSubscription &&
                  this.scrollEventsSubscription.unsubscribe();
            }
          }
          return (
            (e.ɵfac = function (n) {
              Cl();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const ir = new L("ROUTER_CONFIGURATION"),
        dC = new L("ROUTER_FORROOT_GUARD"),
        GO = [
          vc,
          { provide: SD, useClass: ID },
          {
            provide: We,
            useFactory: function KO(e, t, n, r, i, o, s = {}, a, u) {
              const l = new We(null, e, t, n, r, i, DD(o));
              return (
                a && (l.urlHandlingStrategy = a),
                u && (l.routeReuseStrategy = u),
                (function JO(e, t) {
                  e.errorHandler && (t.errorHandler = e.errorHandler),
                    e.malformedUriErrorHandler &&
                      (t.malformedUriErrorHandler = e.malformedUriErrorHandler),
                    e.onSameUrlNavigation &&
                      (t.onSameUrlNavigation = e.onSameUrlNavigation),
                    e.paramsInheritanceStrategy &&
                      (t.paramsInheritanceStrategy =
                        e.paramsInheritanceStrategy),
                    e.relativeLinkResolution &&
                      (t.relativeLinkResolution = e.relativeLinkResolution),
                    e.urlUpdateStrategy &&
                      (t.urlUpdateStrategy = e.urlUpdateStrategy),
                    e.canceledNavigationResolution &&
                      (t.canceledNavigationResolution =
                        e.canceledNavigationResolution);
                })(s, l),
                s.enableTracing &&
                  l.events.subscribe((c) => {
                    var d, f;
                    null === (d = console.group) ||
                      void 0 === d ||
                      d.call(console, `Router Event: ${c.constructor.name}`),
                      console.log(c.toString()),
                      console.log(c),
                      null === (f = console.groupEnd) ||
                        void 0 === f ||
                        f.call(console);
                  }),
                l
              );
            },
            deps: [
              SD,
              vo,
              vc,
              ke,
              Ry,
              Rd,
              ir,
              [class OO {}, new bn()],
              [class NO {}, new bn()],
            ],
          },
          vo,
          {
            provide: ei,
            useFactory: function YO(e) {
              return e.routerState.root;
            },
            deps: [We],
          },
          cC,
          lC,
          class $O {
            preload(t, n) {
              return n().pipe(Pn(() => O(null)));
            }
          },
          { provide: ir, useValue: { enableTracing: !1 } },
        ];
      function zO() {
        return new Vy("Router", We);
      }
      let qO = (() => {
        class e {
          constructor(n, r) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                GO,
                fC(n),
                {
                  provide: dC,
                  useFactory: ZO,
                  deps: [[We, new bn(), new Ei()]],
                },
                { provide: ir, useValue: r || {} },
                {
                  provide: Qr,
                  useFactory: QO,
                  deps: [Kn, [new Yo(yc), new bn()], ir],
                },
                { provide: Od, useFactory: WO, deps: [We, Ux, ir] },
                {
                  provide: uC,
                  useExisting:
                    r && r.preloadingStrategy ? r.preloadingStrategy : lC,
                },
                { provide: Vy, multi: !0, useFactory: zO },
                [
                  Pd,
                  { provide: nc, multi: !0, useFactory: XO, deps: [Pd] },
                  { provide: hC, useFactory: eP, deps: [Pd] },
                  { provide: xy, multi: !0, useExisting: hC },
                ],
              ],
            };
          }
          static forChild(n) {
            return { ngModule: e, providers: [fC(n)] };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(dC, 8), b(We, 8));
          }),
          (e.ɵmod = dt({ type: e })),
          (e.ɵinj = Xe({})),
          e
        );
      })();
      function WO(e, t, n) {
        return n.scrollOffset && t.setOffset(n.scrollOffset), new Od(e, t, n);
      }
      function QO(e, t, n = {}) {
        return n.useHash ? new MT(e, t) : new rv(e, t);
      }
      function ZO(e) {
        return "guarded";
      }
      function fC(e) {
        return [
          { provide: aE, multi: !0, useValue: e },
          { provide: Rd, multi: !0, useValue: e },
        ];
      }
      let Pd = (() => {
        class e {
          constructor(n) {
            (this.injector = n),
              (this.initNavigation = !1),
              (this.destroyed = !1),
              (this.resultOfPreactivationDone = new Xt());
          }
          appInitializer() {
            return this.injector.get(wT, Promise.resolve(null)).then(() => {
              if (this.destroyed) return Promise.resolve(!0);
              let r = null;
              const i = new Promise((a) => (r = a)),
                o = this.injector.get(We),
                s = this.injector.get(ir);
              return (
                "disabled" === s.initialNavigation
                  ? (o.setUpLocationChangeListener(), r(!0))
                  : "enabled" === s.initialNavigation ||
                    "enabledBlocking" === s.initialNavigation
                  ? ((o.hooks.afterPreactivation = () =>
                      this.initNavigation
                        ? O(null)
                        : ((this.initNavigation = !0),
                          r(!0),
                          this.resultOfPreactivationDone)),
                    o.initialNavigation())
                  : r(!0),
                i
              );
            });
          }
          bootstrapListener(n) {
            const r = this.injector.get(ir),
              i = this.injector.get(cC),
              o = this.injector.get(Od),
              s = this.injector.get(We),
              a = this.injector.get(cc);
            n === a.components[0] &&
              (("enabledNonBlocking" === r.initialNavigation ||
                void 0 === r.initialNavigation) &&
                s.initialNavigation(),
              i.setUpPreloading(),
              o.init(),
              s.resetRootComponentType(a.componentTypes[0]),
              this.resultOfPreactivationDone.next(null),
              this.resultOfPreactivationDone.complete());
          }
          ngOnDestroy() {
            this.destroyed = !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(ke));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function XO(e) {
        return e.appInitializer.bind(e);
      }
      function eP(e) {
        return e.bootstrapListener.bind(e);
      }
      const hC = new L("Router Initializer");
      let nP = (() => {
        class e {
          constructor() {
            this.title = "client";
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = ar({
            type: e,
            selectors: [["app-root"]],
            decls: 2,
            vars: 0,
            consts: [[1, "container"]],
            template: function (n, r) {
              1 & n && (Q(0, "div", 0), ln(1, "router-outlet"), z());
            },
            directives: [Id],
            styles: [""],
          })),
          e
        );
      })();
      const rP = ["apple", "durian", "grapes", "orange", "pear"];
      let kd = (() => {
        class e {
          constructor(n) {
            this.http = n;
          }
          placeOrder(n) {
            return (function iP(e, t) {
              const n = "object" == typeof t;
              return new Promise((r, i) => {
                const o = new ii({
                  next: (s) => {
                    r(s), o.unsubscribe();
                  },
                  error: i,
                  complete: () => {
                    n ? r(t.defaultValue) : i(new lo());
                  },
                });
                e.subscribe(o);
              });
            })(this.http.post("/api/po", n));
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(b(zv));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function oP(e, t) {
        1 & e &&
          (Q(0, "div", 0)(1, "h2"),
          ae(2, "You have no items in your order"),
          z()());
      }
      function sP(e, t) {
        if ((1 & e && (Q(0, "option", 27), ae(1), z()), 2 & e)) {
          const n = t.$implicit;
          Tt("value", n), it(1), Bi(n);
        }
      }
      function aP(e, t) {
        if (1 & e) {
          const n = (function Eg() {
            return y();
          })();
          Q(0, "tr", 21)(1, "th", 22),
            ae(2),
            z(),
            Q(3, "td")(4, "select", 23),
            Vi(5, sP, 2, 2, "option", 24),
            z()(),
            Q(6, "td"),
            ln(7, "input", 25),
            z(),
            Q(8, "td")(9, "button", 26),
            Le("click", function () {
              const o = (function Vf(e) {
                return (I.lFrame.contextLView = e), e[8];
              })(n).index;
              return ms(2).removeLineItem(o);
            }),
            ae(10, " Remove "),
            z()()();
        }
        if (2 & e) {
          const n = t.$implicit,
            r = t.index,
            i = ms(2);
          Tt("formGroup", n), it(2), Bi(r), it(3), Tt("ngForOf", i.items);
        }
      }
      function uP(e, t) {
        if (
          (1 & e &&
            (Q(0, "div")(1, "table", 16)(2, "thead")(3, "tr")(4, "th", 17),
            ae(5, "#"),
            z(),
            Q(6, "th", 17),
            ae(7, "Item"),
            z(),
            Q(8, "th", 17),
            ae(9, "Quantity"),
            z(),
            ln(10, "th"),
            z()(),
            Q(11, "tbody", 18),
            Vi(12, aP, 11, 3, "tr", 19),
            z()(),
            Q(13, "div", 20),
            ae(14, "Do not add duplicate items"),
            z()()),
          2 & e)
        ) {
          const n = ms();
          it(12), Tt("ngForOf", n.lineItems.controls);
        }
      }
      const cP = function () {
          return ["/"];
        },
        dP = [
          {
            path: "",
            component: (() => {
              class e {
                constructor(n, r, i) {
                  (this.fb = n), (this.router = r), (this.poSvc = i);
                }
                get items() {
                  return rP;
                }
                ngOnInit() {
                  this.form = this.createPO();
                }
                addLineItem() {
                  this.lineItems.push(this.createLineItem());
                }
                removeLineItem(n) {
                  this.lineItems.removeAt(n);
                }
                placeOrder() {
                  const n = this.form.value,
                    r = {
                      name: n.name,
                      address: n.address,
                      email: n.email,
                      lineItems: n.lineItems.map((i) => ({
                        item: i.item,
                        quantity: parseInt(i.quantity),
                      })),
                    };
                  this.router.navigate(["/invoice"], { state: r });
                }
                createPO() {
                  return (
                    (this.lineItems = this.fb.array([], [Fn.required])),
                    this.fb.group({
                      name: this.fb.control("", [Fn.required]),
                      address: this.fb.control("", [Fn.required]),
                      email: this.fb.control("", [Fn.required, Fn.email]),
                      lineItems: this.lineItems,
                    })
                  );
                }
                createLineItem() {
                  return this.fb.group({
                    item: this.fb.control("", [Fn.required]),
                    quantity: this.fb.control("1", [Fn.required, Fn.min(1)]),
                  });
                }
              }
              return (
                (e.ɵfac = function (n) {
                  return new (n || e)(v(HR), v(We), v(kd));
                }),
                (e.ɵcmp = ar({
                  type: e,
                  selectors: [["app-home"]],
                  decls: 25,
                  vars: 4,
                  consts: [
                    [1, "mt-4"],
                    [1, "row"],
                    [1, "col"],
                    [3, "formGroup", "ngSubmit"],
                    [1, "mt-3"],
                    ["for", "name", 1, "form-label"],
                    [
                      "id",
                      "name",
                      "type",
                      "text",
                      "formControlName",
                      "name",
                      1,
                      "form-control",
                    ],
                    ["for", "address", 1, "form-label"],
                    [
                      "id",
                      "address",
                      "type",
                      "text",
                      "formControlName",
                      "address",
                      1,
                      "form-control",
                    ],
                    ["for", "email", 1, "form-label"],
                    [
                      "id",
                      "email",
                      "type",
                      "text",
                      "formControlName",
                      "email",
                      1,
                      "form-control",
                    ],
                    [1, "mt-3", "d-flex", "justify-content-between"],
                    ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
                    ["type", "button", 1, "btn", "btn-warning", 3, "click"],
                    ["class", "mt-4", 4, "ngIf"],
                    [4, "ngIf"],
                    [1, "table", "mt-4"],
                    ["scope", "col"],
                    ["formArrayName", "lineItems"],
                    [3, "formGroup", 4, "ngFor", "ngForOf"],
                    [1, "mt-2", "text-end", "fs-6", "text-danger"],
                    [3, "formGroup"],
                    ["scope", "row"],
                    ["formControlName", "item", 1, "form-select"],
                    [3, "value", 4, "ngFor", "ngForOf"],
                    [
                      "type",
                      "number",
                      "min",
                      "1",
                      "formControlName",
                      "quantity",
                      1,
                      "form-control",
                    ],
                    ["type", "button", 1, "btn", "btn-danger", 3, "click"],
                    [3, "value"],
                  ],
                  template: function (n, r) {
                    1 & n &&
                      (Q(0, "div", 0)(1, "h1"),
                      ae(2, "Place Your Order"),
                      z()(),
                      Q(3, "div", 1)(4, "div", 2)(5, "form", 3),
                      Le("ngSubmit", function () {
                        return r.placeOrder();
                      }),
                      Q(6, "div", 4)(7, "label", 5),
                      ae(8, "Name:"),
                      z(),
                      ln(9, "input", 6),
                      z(),
                      Q(10, "div", 4)(11, "label", 7),
                      ae(12, "Address:"),
                      z(),
                      ln(13, "input", 8),
                      z(),
                      Q(14, "div", 4)(15, "label", 9),
                      ae(16, "Email:"),
                      z(),
                      ln(17, "input", 10),
                      z(),
                      Q(18, "div", 11)(19, "button", 12),
                      ae(20, " Place Order "),
                      z(),
                      Q(21, "button", 13),
                      Le("click", function () {
                        return r.addLineItem();
                      }),
                      ae(22, " Add Item "),
                      z()(),
                      Vi(23, oP, 3, 0, "div", 14),
                      Vi(24, uP, 15, 1, "div", 15),
                      z()()()),
                      2 & n &&
                        (it(5),
                        Tt("formGroup", r.form),
                        it(14),
                        Tt("disabled", r.form.invalid),
                        it(4),
                        Tt("ngIf", r.lineItems.length <= 0),
                        it(1),
                        Tt("ngIf", r.lineItems.length > 0));
                  },
                  directives: [
                    U_,
                    M_,
                    aa,
                    Zs,
                    b_,
                    cd,
                    mv,
                    ua,
                    pv,
                    la,
                    Z_,
                    J_,
                    fd,
                    ad,
                  ],
                  styles: [""],
                })),
                e
              );
            })(),
          },
          {
            path: "invoice",
            component: (() => {
              class e {
                constructor(n, r) {
                  (this.router = n), (this.poSvc = r);
                }
                ngOnInit() {
                  if (!(null == history ? void 0 : history.state))
                    return void this.home();
                  const n = history.state;
                  "lineItems" in n
                    ? this.poSvc
                        .placeOrder(n)
                        .then((r) => {
                          this.validateInvoice(r)
                            ? (this.invoice = r)
                            : alert("invalid response: " + JSON.stringify(r));
                        })
                        .catch((r) => {
                          alert("error: " + JSON.stringify(r));
                        })
                    : this.home();
                }
                home() {
                  this.router.navigate(["/"]);
                }
                validateInvoice(n) {
                  const r = ["name", "total", "invoiceId"];
                  for (const i of r) if (!(i in n)) return !1;
                  return !0;
                }
              }
              return (
                (e.ɵfac = function (n) {
                  return new (n || e)(v(We), v(kd));
                }),
                (e.ɵcmp = ar({
                  type: e,
                  selectors: [["app-invoice"]],
                  decls: 27,
                  vars: 9,
                  consts: [
                    [1, "mt-4"],
                    [1, "table", "table-hover", "mt-4"],
                    ["scope", "row"],
                    [1, "row"],
                    [1, "col", "d-flex", "justify-content-end"],
                    [
                      "type",
                      "button",
                      1,
                      "btn",
                      "btn-warning",
                      3,
                      "routerLink",
                    ],
                  ],
                  template: function (n, r) {
                    1 & n &&
                      (Q(0, "div", 0)(1, "h1"),
                      ae(2, "Your Invoice"),
                      z()(),
                      Q(3, "table", 1)(4, "tbody")(5, "tr")(6, "th", 2),
                      ae(7, "Invoice Id"),
                      z(),
                      Q(8, "td")(9, "code"),
                      ae(10),
                      z()()(),
                      Q(11, "tr")(12, "th", 2),
                      ae(13, "Name"),
                      z(),
                      Q(14, "td"),
                      ae(15),
                      Ll(16, "titlecase"),
                      z()(),
                      Q(17, "tr")(18, "th", 2),
                      ae(19, "Total"),
                      z(),
                      Q(20, "td"),
                      ae(21),
                      Ll(22, "currency"),
                      z()()()(),
                      Q(23, "div", 3)(24, "div", 4)(25, "button", 5),
                      ae(26, " Back "),
                      z()()()),
                      2 & n &&
                        (it(10),
                        Bi(null == r.invoice ? null : r.invoice.invoiceId),
                        it(5),
                        Hi(
                          " ",
                          jl(16, 4, null == r.invoice ? null : r.invoice.name),
                          ""
                        ),
                        it(6),
                        Hi(
                          " ",
                          jl(22, 6, null == r.invoice ? null : r.invoice.total),
                          ""
                        ),
                        it(4),
                        Tt(
                          "routerLink",
                          (function Ym(e, t, n) {
                            const r = He() + e,
                              i = y();
                            return i[r] === N
                              ? zt(i, r, n ? t.call(n) : t())
                              : (function ki(e, t) {
                                  return e[t];
                                })(i, r);
                          })(8, cP)
                        ));
                  },
                  directives: [Ma],
                  pipes: [_v, Cv],
                  styles: [""],
                })),
                e
              );
            })(),
          },
          { path: "**", redirectTo: "/", pathMatch: "full" },
        ];
      let fP = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = dt({ type: e, bootstrap: [nP] })),
          (e.ɵinj = Xe({
            providers: [kd],
            imports: [[gN, jN, jR, aD, qO.forRoot(dP, { useHash: !0 })]],
          })),
          e
        );
      })();
      (function tT() {
        $y = !1;
      })(),
        hN()
          .bootstrapModule(fP)
          .catch((e) => console.error(e));
    },
  },
  (ee) => {
    ee((ee.s = 338));
  },
]);
