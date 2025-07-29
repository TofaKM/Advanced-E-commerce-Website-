import { AllCategory, OneCategory } from '../APIs/categoryAPIs';
import { createContext, useContext, useState, useEffect } from 'react';

export const CategoryContext = createContext();
export const useCategory = () => useContext(CategoryContext);

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      try {
        const response = await AllCategory();
        console.log('AllCategory response:', response.data); // Debug
        setCategories(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error in CategoryProvider:', err.response?.data || err.message); // Debug
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchAllCategories();
  }, []);

  const fetchOneCategory = async (category_id) => {
    setLoading(true);
    try {
      const response = await OneCategory({ category_id });
      console.log('OneCategory response:', response.data); // Debug
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error fetching category:', err.message);
      setError(err.message || 'Failed to fetch category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  console.log('CategoryProvider state:', { categories, loading, error }); // Debug

  return (
    <CategoryContext.Provider value={{
      categories,
      loading,
      error,
      fetchOneCategory,
    }}>
      {children}
    </CategoryContext.Provider>
  );
}