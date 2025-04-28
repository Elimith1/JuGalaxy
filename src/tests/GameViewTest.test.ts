import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import GameView from '../views/GameView.vue';

vi.mock('../services/api', () => ({
  addPlayerToRanking: vi.fn()
}));

describe('GameView.vue', () => {
  it('monte sans erreur et affiche les infos de base', () => {
    const wrapper = mount(GameView, {
      props: { isGameActive: true },
    });

    expect(wrapper.text()).toContain('Votre personnage');
    expect(wrapper.text()).toContain('Zone de combat');
    expect(wrapper.find('button.btn-danger').exists()).toBe(true);
    expect(wrapper.find('button.btn-warning').exists()).toBe(true);
  });

  it('émet setGameActive au montage', () => {
    const wrapper = mount(GameView, {
      props: { isGameActive: false },
    });

    expect(wrapper.emitted('setGameActive')).toBeTruthy();
    expect(wrapper.emitted('setGameActive')![0]).toEqual([true]);
  });

  it('ouvre le modal de confirmation quand on clique sur quitter', async () => {
    const wrapper = mount(GameView, {
      props: { isGameActive: true },
    });

    await wrapper.find('button.btn-danger.btn-lg').trigger('click');
    expect(wrapper.text()).toContain('Êtes-vous sûr de vouloir continuer ?');
  });
});
