import Vue from 'vue';
global.Vue = Vue;

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
global.Deferred = Deferred;

import mapboxgl from 'mapbox-gl';
global.mapboxgl = mapboxgl;

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
global.MapboxGeocoder = MapboxGeocoder;

class Deferred$1 {
  constructor() {
    this.promise = new Promise(function (resolve, reject) {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
global.Deferred$1 = Deferred$1;

// Define equal
global.equal = (a, b) => {
  expect(a).toEqual(b);
};

// Define MapboxGeocoderControl
class MapboxGeocoderControl extends MapboxGeocoder {
  constructor(props) {
    super({
      accessToken: props.accessToken,
      origin: props.origin,
      zoom: props.zoom,
      flyTo: props.flyTo,
      placeholder: props.placeholder,
      proximity: props.proximity,
      trackProximity: props.trackProximity,
      collapsed: props.collapsed,
      clearAndBlurOnEsc: props.clearAndBlurOnEsc,
      clearOnBlur: props.clearOnBlur,
      bbox: props.bbox,
      countries: props.countries,
      types: props.types,
      minLength: props.minLength,
      limit: props.limit,
      language: props.language,
      filter: props.filter,
      localGeocoder: props.localGeocoder,
      externalGeocoder: props.externalGeocoder,
      reverseGeocode: props.reverseGeocode,
      enableEventLogging: props.enableEventLogging,
      marker: props.marker,
      render: props.render,
      getItemValue: props.getItemValue,
      mode: props.mode,
      localGeocoderOnly: props.localGeocoderOnly,
    });
  }
}
global.MapboxGeocoderControl = MapboxGeocoderControl;

// Define MapboxMap
class MapboxMap {
  constructor(props) {
    this.map = new mapboxgl.Map(props);
  }

  addControl(control) {
    this.map.addControl(control);
  }

  removeControl(control) {
    this.map.removeControl(control);
  }

  on(event, callback) {
    this.map.on(event, callback);
  }

  getContainer() {
    return this.map.getContainer();
  }

  getBounds() {
    return this.map.getBounds();
  }

  getCenter() {
    return this.map.getCenter();
  }

  getZoom() {
    return this.map.getZoom();
  }

  getBearing() {
    return this.map.getBearing();
  }

  getPitch() {
    return this.map.getPitch();
  }

  getRenderWorldCopies() {
    return this.map.getRenderWorldCopies();
  }

  getMinZoom() {
    return this.map.getMinZoom();
  }

  getMaxZoom() {
    return this.map.getMaxZoom();
  }

  getBoundsOptions() {
    return this.map.getBoundsOptions();
  }

  getStyle() {
    return this.map.getStyle();
  }

  getCanvasContainer() {
    return this.map.getCanvasContainer();
  }

  getCanvas() {
    return this.map.getCanvas();
  }
}

global.MapboxMap = MapboxMap;

const MapboxDrawControl = {
  name: 'MapboxDrawControl',
  props: {
    accessToken: {
      type: String,
      default: '',
    },
    origin: String,
    zoom: Number,
    flyTo: {
      type: [Boolean, Object],
      default: () => ({}),
    },
    placeholder: String,
    proximity: Object,
    trackProximity: {
      type: Boolean,
      default: () => false,
    },
    collapsed: {
      type: Boolean,
      default: () => false,
    },
    clearAndBlurOnEsc: {
      type: Boolean,
      default: () => false,
    },
    clearOnBlur: {
      type: Boolean,
      default: () => false,
    },
    bbox: Array,
    countries: String,
    types: String,
    minLength: Number,
    limit: Number,
    language: String,
    filter: Function,
    localGeocoder: Function,
    externalGeocoder: Function,
    reverseGeocode: {
      type: Boolean,
      default: () => false,
    },
    enableEventLogging: {
      type: Boolean,
      default: () => false,
    },
    marker: {
      type: Boolean,
      default: () => false,
    },
    render: Function,
    getItemValue: Function,
    mode: String,
    localGeocoderOnly: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props) {
    const map = Vue.inject('vmb_map', null);
    const geocoder = new MapboxGeocoder({
      accessToken: props.accessToken || mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    // Your modifications go here

    const showOriginalGeocoder = Vue.ref(true);
    const geocoderState = Vue.reactive({
      result: {},
      results: {},
      error: null,
      loading: null,
    });

    Vue.onMounted(async () => {
      const instance = Vue.getCurrentInstance();
      if (instance) {
        const mapInstance = await instance.proxy.promise;
        const control = new MapboxGeocoderControl(props);
        if (mapInstance instanceof MapboxMap) {
          mapInstance.addControl(control);
        } else if (mapInstance.parent && control.addTo) {
          control.addTo(mapInstance.refs.geocoder);
        }
        if (mapInstance.refs['custom-input']) {
          w(mapInstance.refs['custom-input'], control, mapInstance);
        }

        control.on('result', (e) => {
          instance.emit('result', e.result);
          geocoderState.result = e.result;
        });

        control.on('results', (e) => {
          instance.emit('results', e);
          geocoderState.results = e;
        });

        control.on('error', (e) => {
          instance.emit('error', e);
          geocoderState.error = e;
        });

        control.on('loading', (e) => {
          instance.emit('loading', e);
          geocoderState.loading = e;
        });

        control.on('clear', () => {
          instance.emit('clear');
        });

        instance.proxy.geocoderState = geocoderState;
        instance.proxy.promise = Promise.resolve(control);
      }
    });

    Vue.onUnmounted(async () => {
      const control = await geocoder.promise;
      if (map) {
        const mapInstance = await map.promise;

        if (mapInstance && !mapInstance._removed) {
          mapInstance.removeControl(control);
        }
      }
    });

    Vue.watch(props, () => {
      if (geocoder) {
        geocoder.setOptions(props);
      }
    });

    return {
      showOriginalGeocoder,
      geocoderState,
    };
  },
};

global.MapboxDrawControl = MapboxDrawControl;
