import produce from 'immer';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Provider } from './models/Provider';

const providers: Provider[] = [
  { name: 'Netflix', active: true },
  { name: 'Amazon Prime Video', active: true },
  { name: 'Disney Plus', active: true },
  { name: 'HBO Max', active: false },
  { name: 'Apple TV Plus', active: false },
  { name: 'Hulu', active: false },
  { name: 'Paramount Plus', active: false },
  { name: 'Plex', active: false },
  { name: 'Starz', active: false },
];

const store = (set: any, get: any) => ({
  tab: 'toWatch',
  setTab: (input: 'toWatch' | 'watched' | 'search') => set({ tab: input }),
  searchQuery: '',
  setSearchQuery: (data: string) => set({ searchQuery: data }),
  providers: providers,
  setProviders: (i: number, name: string, active: boolean) =>
    set(
      produce((draft: any) => {
        draft.providers[i] = { name, active };
      })
    ),
});

const useStore = create(devtools(persist(store, { name: 'zustand_data' })));

export default useStore;
