<template>
  <el-container>
    <el-main>
      <!-- map with markers showing locations where flights are -->
      <mapbox-map
        :accessToken="apiKey"
        :mapStyle="mapStyle"
        :center="mapCenter"
        :zoom="mapZoom"
        @loaded="mapLoaded"
        @update:center="mapAreaChanged"
        @update:zoom="zoomUpdated"
      >
        <!-- markers -->
        <mapbox-marker
          v-for="(missions, key) in missionsByLocation"
          :lngLat="mapboxLongLat(calculateMissionsCenter(missions))"
          :key="key"
          :id="key"
          @click="flyToMarker(key)"
        >
          <template v-slot:icon>
            <img class="marker-img" :src="markerImage" />
            <span class="marker-number">{{ missions.length }}</span>
          </template>
        </mapbox-marker>

        <!-- zoom option buttons -->
        <mapbox-navigation-control position="bottom-left" />
      </mapbox-map>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
  MapboxMap,
  MapboxMarker,
  MapboxNavigationControl,
  MapboxPopup,
} from 'vue-mapbox-ts';
import { Map as MapboxMapObject } from 'mapbox-gl';
import { computed, ref } from 'vue';
import axios from 'axios';
import { mapboxLongLat } from '@/utils/helper';

import { Mission } from '@/types/api/Mission';
// import { Flight } from '@/types/api/Flight';

@Options({
  components: {
    MapboxMap,
    MapboxMarker,
    MapboxNavigationControl,
    MapboxPopup,
  },
})
/* eslint-disable @typescript-eslint/no-explicit-any*/
export default class OverviewMapView extends Vue {
  // collapse elements that are active are stored in here
  activeNames = ref(['1']);

  // map related variables
  // mapbox API Key, TODO should be stored in .env file
  apiKey = process.env.VUE_APP_MAPBOX_KEY;
  map: MapboxMapObject | null = null;

  // map settings
  mapCenter = JSON.parse(localStorage.getItem('mapCenter') || 'null') || [
    14.12456, 47.59397,
  ];

  mapZoom = JSON.parse(localStorage.getItem('mapZoom') || 'null') || 6;
  mapStyle = 'streets-v11';

  markerImage = 'images/marker/mapbox-marker-icon-red.svg';

  // missions
  missions: Mission[] = [];
  missionsByLocation: { [key: string]: Mission[] } = {};
  visibleMissions: { [key: string]: Mission[] } = {};
  // flightIsFinished: boolean[] = [];
  // flightHasLabels: boolean[] = [];
  // flightIsApproved: boolean[] = [];

  // filtering
  allInformationLoaded = false;

  storedOnlyShowVisible = localStorage.getItem('onlyShowVisible');
  onlyShowVisible = this.storedOnlyShowVisible
    ? JSON.parse(this.storedOnlyShowVisible)
    : false;

  onlyShowUnlabeled = false;

  storedDateRange = localStorage.getItem('dateRangeFilter');
  dateRangeFilter = this.storedDateRange
    ? JSON.parse(this.storedDateRange)
    : [];

  shortcuts = [
    {
      text: 'Last week',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      },
    },
    {
      text: 'Last month',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      },
    },
    {
      text: 'Last 3 months',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      },
    },
  ];

  storedLocations = localStorage.getItem('locations');
  locations = this.storedLocations ? JSON.parse(this.storedLocations) : [];

  locationNames: { [key: string]: string } = {};

  storedSelectedFlightStatus = localStorage.getItem('selectedFlightStatus');
  selectedFlightStatus = this.storedSelectedFlightStatus
    ? JSON.parse(this.storedSelectedFlightStatus)
    : [0, 1, 2, 3];

  flightStatusOptions = [
    {
      value: 0,
      label: 'without labels',
    },
    {
      value: 1,
      label: 'with labels',
    },
    {
      value: 2,
      label: 'marked as labeled',
    },
    {
      value: 3,
      label: 'approved',
    },
  ];

  async mounted() {
    this.getAllMissions();
  }

  /**
   * map related functions
   */
  mapLoaded(map: MapboxMapObject): void {
    this.map = map;
    this.getMarkersCurrentlyVisible();
  }

  mapAreaChanged(coor: [number, number]) {
    console.log('mapCenter changed' + coor);
    // this.mapCenter = coor;
    // localStorage.setItem('mapCenter', JSON.stringify(this.mapCenter));
    // this.getMarkersCurrentlyVisible();
  }

  previousZoomLevel = 6;
  zoomUpdated(zoomLevel: number) {
    console.log('mapZoom changed' + zoomLevel);
    // this.mapZoom = zoomLevel;
    // localStorage.setItem('mapZoom', JSON.stringify(this.mapZoom));
    // if (zoomLevel > 14 && this.previousZoomLevel < 14) {
    //   this.getMissionsByLocation(4);
    // } else if (
    //   (zoomLevel > 11 && this.previousZoomLevel < 11) ||
    //   (zoomLevel <= 14 && this.previousZoomLevel > 14)
    // ) {
    //   this.getMissionsByLocation(2);
    // } else if (zoomLevel <= 11 && this.previousZoomLevel > 11) {
    //   this.getMissionsByLocation(1);
    // }

    // this.getLocationOptions();
    // this.previousZoomLevel = zoomLevel;
  }

  flyToMarker(key: string): void {
    console.log('fly to marker' + key);
    // if (this.map) {
    //   this.map.flyTo({
    //     center: mapboxLongLat(key),
    //     zoom: 11.5,
    //   });
    // }
  }

  getMarkersCurrentlyVisible(): void {
    console.log('get markers currently visible');
    // this.visibleMissions = {};
    // Object.entries(this.missionsByLocation).forEach(([key, value]) => {
    //   if (this.map?.getBounds().contains(mapboxLongLat(key))) {
    //     this.visibleMissions[key] = value;
    //   }
    // });
  }

  /**
   * missions related functions
   */

  async fetchAllMissions() {
    const response = await fetch(
      'https://bambi-test.projekte.fh-hagenberg.at/backend/mission/?session=test'
    );
    const missions = await response.json();
    return missions.map((mission: Mission) => ({
      ...mission,
      // Parse any additional properties here
    }));
  }

  getAllMissions(): void {
    this.fetchAllMissions().then((result) => {
      this.missions = result;
      // this.missions.forEach((mission) => {
      // mission.flights.forEach((flightId) => {
      // getFlight(flightId).then((flight) => {
      //   this.setIsFinished(flight);
      //   this.setFlightHasLabels(flight);
      //   this.setIsApproved(flight);
      // });
      // });
      // });
      this.getMissionsByLocation(1);
      this.getLocationOptions();
      this.allInformationLoaded = true;
    });
  }

  getMissionsByLocation(locationAccuracy: number): void {
    this.missionsByLocation = this.missions.reduce(
      (groups: { [key: string]: any }, mission) => {
        const coords = mission.location.split(',');
        coords.forEach((element, index) => {
          coords[index] = parseFloat(element).toFixed(locationAccuracy); // 2 decimal places -> deviation of 1.1 km (https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude/8674#8674)
        });
        const key = coords[0] + ',' + coords[1];

        const group = groups[key] || [];
        group.push(mission);
        groups[key] = group;

        return groups;
      },
      {}
    );
  }

  calculateMissionsCenter(missions: Mission[]): string {
    let sumLatitude = 0;
    let sumLongitude = 0;

    // Loop through the data array to calculate the sum of latitude and longitude values
    missions.forEach((mission) => {
      const [latitude, longitude] = mission.location.split(',').map(parseFloat);
      sumLatitude += latitude;
      sumLongitude += longitude;
    });

    // Calculate the average latitude and longitude
    const averageLatitude = sumLatitude / missions.length;
    const averageLongitude = sumLongitude / missions.length;

    return averageLatitude.toString() + ',' + averageLongitude.toString();
  }

  /**
   * sidebar
   */
  // uses the mapbox api to get the location name for the given coordinates
  async getLocation(longLat: string) {
    try {
      const longLatNumbers = mapboxLongLat(longLat);
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longLatNumbers[0]},${longLatNumbers[1]}.json?access_token=${this.apiKey}`
      );
      this.locationNames[longLat] = response.data.features[0].place_name;
    } catch (err) {
      console.log(err);
      if (!this.locationNames[longLat]) {
        this.locationNames[longLat] =
          this.missionsByLocation[longLat][0].mission_name;
      }
    }
  }

  // get the location names for all locations
  getLocationOptions() {
    if (Object.keys(this.missionsByLocation).length > 0) {
      Object.entries(this.missionsByLocation).forEach(([key]) => {
        this.getLocation(key);
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(date);
  }

  // async setIsFinished(flight: Flight): Promise<void> {
  //   if (flight?.labeled_by != null && flight?.approved_by == null)
  //     this.flightIsFinished[flight.identifier] = true;
  //   else this.flightIsFinished[flight.identifier] = false;
  // }

  // async setIsApproved(flight: Flight): Promise<void> {
  //   if (flight?.approved_by != null)
  //     this.flightIsApproved[flight.identifier] = true;
  //   else this.flightIsApproved[flight.identifier] = false;
  // }

  // async setFlightHasLabels(flight: Flight): Promise<void> {
  //   if (
  //     flight?.labels != null &&
  //     flight?.labels.length > 0 &&
  //     flight?.labeled_by == null &&
  //     flight?.approved_by == null
  //   )
  //     this.flightHasLabels[flight.identifier] = true;
  //   else this.flightHasLabels[flight.identifier] = false;
  // }

  /**
   * helpers
   */
  // this exists in the helpers file aswell, have to keep this, otherwhise markers are not displayed correctly... idk why
  mapboxLongLat(longLat: string) {
    const coordsStr = longLat.split(',');
    const coordsNum: number[] = [];
    coordsStr.forEach((element, index) => {
      coordsNum[index] = parseFloat(element);
    });
    return [coordsNum[0], coordsNum[1]];
  }
}
</script>

<style lang="scss">
.el-main {
  margin: 0;
  padding: 0;
  color: white;
  text-align: left;
  overflow: hidden;
  height: 100vh;
}

.el-aside {
  padding: 1rem;
  max-height: 100vh;
  overflow: auto;

  text-align: left;

  .location {
    margin-bottom: 1.2rem;
  }
}

.filtering-options .el-checkbox:last-of-type {
  margin-bottom: 0.7rem;
}

.marker-img {
  width: 40px;
  height: 40px;
}

.marker-number {
  position: absolute;
  left: 42%;
  top: 5%;
  font-weight: 700;
  color: black;
}

.mapboxgl-popup {
  color: black;
}

.heading-location {
  text-align: left;
  color: #c72727;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;

  // reset button styling
  background-color: transparent;
  border-width: 0;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  line-height: inherit;
  padding: 0;

  &::after {
    content: '';
    display: block;
    width: 100%;
    border-bottom: 1px solid #c72727;
    margin: 2px auto 0.8rem;
  }
}

.filtering-options {
  border-bottom: 2px solid rgb(184, 184, 184);
}

.mission-dates {
  font-weight: 600;
}

.status-icon {
  float: right;
  margin-right: 0.5rem;
}

.finished-icon {
  color: green;
}

.in-progress-icon {
  color: orange;
}
</style>
