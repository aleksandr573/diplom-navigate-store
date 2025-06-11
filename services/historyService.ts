const API_URL = 'http://localhost:3000';

const historyService = {
  getHistory: async (token: string) => {
    const res = await fetch(`${API_URL}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  saveRoute: async (storeName: string, productIds: number[], token: string) => {
    const res = await fetch(`${API_URL}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ storeName, productIds }),
    });
    return res.json();
  },
};

export default historyService;
