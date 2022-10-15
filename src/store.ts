import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import produce from 'immer';

const store = (set, get) => ({
  setLists: (data) => set({ lists: data }),
  tab: 'toWatch',
  setTab: (input) => set({ tab: input }),
  searchQuery: '',
  setSearchQuery: (data) => set({ searchQuery: data }),
  searchResults: [],
  setSearchResults: (data) => set({ searchResults: data }),
  providers: [
    { name: 'Netflix', active: true },
    { name: 'Amazon Prime Video', active: true },
    { name: 'Disney Plus', active: true },
    { name: 'HBO Max', active: false },
    { name: 'Apple TV Plus', active: false },
    { name: 'Hulu', active: false },
    { name: 'Paramount Plus', active: false },
    { name: 'Plex', active: false },
    { name: 'Starz', active: false },
  ],
  setProviders: (i, name, active) =>
    set(
      produce((draft) => {
        draft.providers[i] = { name, active }; //!draft.providers[i];
      })
    ),
});

const useStore = create(devtools(persist(store, { name: 'zustand_data' })));

export default useStore;
