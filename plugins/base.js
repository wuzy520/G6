const deepMix = require('@antv/util/lib/deep-mix');
const each = require('@antv/util/lib/each');
const wrapBehavior = require('@antv/util/lib/event/wrap-behavior');

class PluginBase {
  constructor(cfgs) {
    this._cfgs = deepMix(this.getDefaultCfg(), cfgs);
  }
  getDefaultCfg() {
    return {};
  }
  init(graph) {
    const self = this;
    self.set('graph', graph);
    const events = self.getEvents();
    const bindEvents = [];
    each(events, (v, k) => {
      const event = wrapBehavior(self, v);
      bindEvents[k] = event;
      graph.on(k, event);
    });
    this._events = bindEvents;
  }
  getEvents() {
    return {};
  }
  get(key) {
    return this._cfgs[key];
  }
  set(key, val) {
    this._cfgs[key] = val;
  }
  destroy() {
    const graph = this.get('graph');
    each(this._events, (v, k) => {
      graph.off(k, v);
    });
    this._events = null;
    this._cfgs = null;
    this.destroyed = true;
  }
}

module.exports = PluginBase;
