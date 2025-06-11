const API_URL = 'http://localhost:3000';

const storeService = {
  getStores: async () => {
    const res = await fetch(`${API_URL}/stores`);
    return res.json();
  },
};

export default storeService;
