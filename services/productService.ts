const API_URL = 'http://localhost:3000';

const productService = {
  getProductsByStore: async (storeId: number) => {
    const res = await fetch(`${API_URL}/products/by-store/${storeId}`);
    return res.json();
  },

  updateProduct: async (id: number, data: any, token: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export default productService;
