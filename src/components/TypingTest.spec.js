import { mount } from '@vue/test-utils';
import TypingTest from './TypingTest.vue';

jest.mock('../data/prompts.js', () => ({
  __esModule: true,
  default: ['abc'],
}));

function typeText(wrapper, text) {
  const input = wrapper.find('.hidden-input');
  input.element.value = text;
  return input.trigger('input');
}

describe('TypingTest', () => {
  it('renders the prompt characters as pending, with the first marked current', () => {
    const wrapper = mount(TypingTest);
    const chars = wrapper.findAll('.prompt span');
    expect(chars).toHaveLength(3);
    expect(chars[0].classes()).toContain('current');
    expect(chars[1].classes()).toContain('pending');
    expect(chars[2].classes()).toContain('pending');
  });

  it('marks correct and incorrect characters as typed', async () => {
    const wrapper = mount(TypingTest);
    await typeText(wrapper, 'ax');
    const chars = wrapper.findAll('.prompt span');
    expect(chars[0].classes()).toContain('correct');
    expect(chars[1].classes()).toContain('incorrect');
    expect(chars[2].classes()).toContain('current');
  });

  it('finishes with 100% accuracy when typed correctly', async () => {
    const wrapper = mount(TypingTest);
    await typeText(wrapper, 'abc');
    const result = wrapper.find('.result');
    expect(result.exists()).toBe(true);
    expect(result.text()).toContain('100% accuracy');
  });

  it('restart clears the typed text and returns to the idle hint', async () => {
    const wrapper = mount(TypingTest);
    await typeText(wrapper, 'abc');
    await wrapper.find('.restart').trigger('click');
    expect(wrapper.find('.hint').exists()).toBe(true);
    expect(wrapper.find('.hidden-input').element.value).toBe('');
  });
});
