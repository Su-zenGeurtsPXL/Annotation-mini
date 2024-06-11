import Vue from 'vue';
import { mount } from '@vue/test-utils';
// import OverviewMapView from '@/views/OverviewMapView.vue';


describe('OverviewMapView', () => {
  test('should render correctly', () => {
    const wrapper = mount(OverviewMapView);
    expect(wrapper.exists()).toBe(true);
  });
});
