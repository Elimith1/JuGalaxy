import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import StartGameView from '../views/HomeView.vue';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe('StartGameView.vue', () => {
  it('monte correctement et affiche le titre', () => {
    const wrapper = mount(StartGameView, {
      props: { isGameActive: false },
    });

    expect(wrapper.text()).toContain('Bienvenue dans JuGalaxy');
    expect(wrapper.find('input#playerName').exists()).toBe(true);
    expect(wrapper.find('select#shipSelect').exists()).toBe(true);
    expect(wrapper.find('button.btn-primary').exists()).toBe(true);
  });

  it('affiche des erreurs si le formulaire est vide', async () => {
    const wrapper = mount(StartGameView, {
      props: { isGameActive: false },
    });

    await wrapper.find('button').trigger('click');

    expect(wrapper.text()).toContain('Veuillez entrer un nom de personnage');
    expect(wrapper.text()).toContain('Veuillez sélectionner un vaisseau');
  });

  it('ne montre aucune erreur si le formulaire est rempli', async () => {
    const wrapper = mount(StartGameView, {
      props: { isGameActive: false },
    });

    await wrapper.find('input#playerName').setValue('Samuel');
    await wrapper.find('select#shipSelect').setValue('20');

    await wrapper.find('button').trigger('click');

    expect(wrapper.find('.alert-danger').exists()).toBe(false);
  });
});
