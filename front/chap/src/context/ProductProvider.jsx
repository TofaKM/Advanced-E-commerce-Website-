import {productAll,productOne,fetchAll,fetchOne,addProduct,updateProduct,deleteProduct} from '../APIs/prodAPIs'
import { createContext,useContext,useState,useEffect,useCallback } from 'react'

export const ProductContext = createContext()

export const useProduct = () => useContext(ProductContext)

export function ProductProvider({children}){
    const [product, setProduct] = useState([]);          
    const [vproduct, setvProduct] = useState([]);         
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [selectedVProduct, setSelectedVProduct] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    //user
    //ALL
    const all = async () => {
        setLoading(true);
        try {
            const res = await productAll();
            console.log('productAll response:', res);
            setProduct(res.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    //one
    const one = useCallback(async (product_id) => {
    setLoading(true);
    try {
      console.log('ProductProvider one - Fetching product with id:', product_id);
      const res = await productOne(product_id);
      console.log('ProductProvider one - response:', res);
      if (!res.success) {
        throw new Error(res.error || 'Failed to fetch product');
      }
      setSelectedProduct(res.data);
      setError(null);
    } catch (err) {
      console.error('ProductProvider one - error:', {
        message: err.message,
        response: err.response?.data,
      });
      setError(err.message || 'Failed to fetch product');
      setSelectedProduct(null);
    } finally {
      setLoading(false);
    }
    }, []);
    //vendor
    //all
    const vendors = async () => {
        try {
            const res = await fetchAll()
            console.log('Vendors API response:', res)
            setvProduct(res.data || []);
        } catch (err) {
            console.error('Vendors error:', err)
            setError(err.message);
        }
    };
    //one
    const vendor = useCallback(async (product_id) => {
    setLoading(true);
    try {
      console.log('ProductProvider vendor - Fetching product with id:', product_id);
      const res = await fetchOne(product_id);
      console.log('ProductProvider vendor - response:', res);
      if (!res.success) {
        throw new Error(res.error || 'Failed to fetch vendor product');
      }
      setSelectedVProduct(res.data);
      setError(null);
    } catch (err) {
      console.error('ProductProvider vendor - error:', {
        message: err.message,
        response: err.response?.data,
      });
      setError(err.message || 'Failed to fetch vendor product');
      setSelectedVProduct(null);
    } finally {
      setLoading(false);
    }
    }, []);
    //add
    const add = async (formData) => {
  setLoading(true);
  try {
    console.log('ProductProvider add received formData:', Object.fromEntries(formData)); // Debug
    const res = await addProduct(formData);
    console.log('ProductProvider add response:', res);
    if (res.success) {
      setSuccess(true);
      await vendors();
    }
    return res;
  } catch (err) {
    console.error('Add error:', err.message);
    setError(err.message);
    return { success: false, error: err.message || 'Failed to add product' };
  } finally {
    setLoading(false);
  }
    };
    //update
    const update = async (product_id, formData) => {
    setLoading(true);
    try {
      console.log('ProductProvider update sending:', formData);
      const res = await updateProduct(product_id, formData);
      console.log('ProductProvider update response:', res);
      if (res.success) {
        setSuccess(true);
        await vendors();
        return res;
      } else {
        throw new Error(res.error || 'Failed to update product');
      }
    } catch (err) {
      console.error('Update error:', err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
    };
    //delete
    const remove = async (product_id) => {
    setLoading(true);
    try {
      const res = await deleteProduct(product_id);
      console.log('ProductProvider remove response:', res);
      if (res.success) {
        setSuccess(true);
        await vendors();
        return res;
      } else {
        throw new Error(res.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Remove error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
    };
    //useEffec
    useEffect(() => {
        all();
        vendors();
    }, [])

    return(
        <>
        <ProductContext.Provider value={{
            product,
            vproduct,
            selectedProduct,
            selectedVProduct,
            loading,
            error,
            success,
            all,
            one,
            vendors,
            vendor,
            add,
            update,
            remove,
        }}> 
            {children}
        </ProductContext.Provider>
        </>
    )
}

