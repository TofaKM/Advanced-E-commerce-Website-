import { useEffect, useState } from 'react';
import { Modal, Button, ProgressBar, Alert } from 'react-bootstrap';
import ProductDetailsStep from './productDetails';
import VariantsStep from './variantDetails';
import ReviewStep from './reviewStep';
import { useAuth } from '../../context/AuthProvider';
import { useCategory } from '../../context/CategoryProvider';
import { useProduct } from '../../context/ProductProvider';

export default function AddModal({ modal, closeModal }) {
  const { id, user, role, loading, error: authError } = useAuth();
  const { add, vendors, loading: productLoading } = useProduct();
  const { categories } = useCategory();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    category_id: '',
    availability: 'available',
    image: null,
    variants: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('AuthContext values:', { id, user, role, loading, authError });
    if (loading) return;

    if (!user || role !== 'vendor' || !id) {
      console.log('Closing modal due to invalid auth:', { user, role, id });
      setErrors({ general: 'Unauthorized: Vendor access required' });
      closeModal();
      if (!user) {
        console.log('No user, redirecting to login');
      }
    }
  }, [user, role, id, loading, closeModal]);

  useEffect(() => {
    if (authError) {
      setErrors({ general: authError.message || 'Authentication Error' });
      closeModal();
    }
  }, [authError, closeModal]);

  useEffect(() => {
    console.log('formData updated:', formData); // Debug
  }, [formData]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim() === '' || formData.name.length > 255) {
      newErrors.name = 'Product name is required, max 255 characters';
    }
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Description is required';
    }
    if (!formData.base_price || isNaN(formData.base_price) || formData.base_price < 0) {
      newErrors.base_price = 'Base price must be non-negative';
    }
    if (!formData.category_id || isNaN(formData.category_id) || formData.category_id <= 0) {
      newErrors.category_id = 'Please select a valid category';
    }
    setErrors(newErrors);
    console.log('validateStep1 errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.variants || !Array.isArray(formData.variants) || formData.variants.length === 0) {
      newErrors.variants = 'At least one variant is required';
    } else {
      const colors = new Set();
      formData.variants.forEach((v, index) => {
        if (!v.color || v.color.trim() === '' || v.color.length > 50) {
          newErrors[`variant_${index}_color`] = `Variant ${index + 1}: Color is required, max 50 characters`;
        } else if (colors.has(v.color.toLowerCase())) {
          newErrors[`variant_${index}_color`] = `Variant ${index + 1}: Duplicate color`;
        } else {
          colors.add(v.color.toLowerCase());
        }
        const quantity = parseInt(v.quantity);
        const price = parseFloat(v.price);
        if (isNaN(quantity) || quantity < 0) {
          newErrors[`variant_${index}_quantity`] = `Variant ${index + 1}: Quantity must be non-negative`;
        }
        if (isNaN(price) || price < 0) {
          newErrors[`variant_${index}_price`] = `Variant ${index + 1}: Price must be non-negative`;
        }
        formData.variants[index].quantity = isNaN(quantity) ? 0 : quantity;
        formData.variants[index].price = isNaN(price) ? 0 : price;
      });
    }
    setErrors(newErrors);
    console.log('validateStep2 errors:', newErrors, 'variants:', formData.variants);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      console.log('Step 1 validated, moving to step 2:', formData);
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      console.log('Step 2 validated, moving to step 3:', formData);
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Submitting product as vendor:', { id, role, formData });
      console.log('Variants before stringify:', formData.variants);
      const validationErrors = {};
      if (!formData.name || formData.name.trim() === '' || formData.name.length > 255) {
        validationErrors.name = 'Product name is required, max 255 characters';
      }
      if (!formData.description || formData.description.trim() === '') {
        validationErrors.description = 'Description is required';
      }
      if (!formData.base_price || isNaN(formData.base_price) || formData.base_price < 0) {
        validationErrors.base_price = 'Base price must be non-negative';
      }
      if (!formData.category_id || isNaN(formData.category_id) || formData.category_id <= 0) {
        validationErrors.category_id = 'Please select a valid category';
      }
      if (!formData.variants || !Array.isArray(formData.variants) || formData.variants.length === 0) {
        validationErrors.variants = 'At least one valid variant is required';
      }
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        console.log('Submission validation errors:', validationErrors);
        setIsSubmitting(false);
        return;
      }

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('base_price', parseFloat(formData.base_price));
      data.append('category_id', parseInt(formData.category_id));
      data.append('availability', formData.variants.some(v => v.quantity > 0) ? 'available' : 'sold out');
      data.append('variants', JSON.stringify(formData.variants));
      if (formData.image) data.append('image', formData.image);

      console.log('handleSubmit sending FormData:', Object.fromEntries(data)); // Debug
      const response = await add(data);
      console.log('handleSubmit response:', response);
      if (response.success) {
        await vendors();
        closeModal();
      } else {
        setErrors({ general: response.error || 'Failed to upload product' });
      }
    } catch (error) {
      console.error('Submit error:', error.message, error);
      setErrors({ general: error.message || 'Failed to upload product' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <Modal size="lg" centered show={modal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>ADD PRODUCT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mb-4" />
        {errors.general && <Alert variant="danger">{errors.general}</Alert>}
        {step === 1 && (
          <ProductDetailsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            categories={categories}
          />
        )}
        {step === 2 && (
          <VariantsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
        {step === 3 && (
          <ReviewStep
            formData={formData}
            categories={categories}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        {step > 1 && (
          <Button variant="secondary" onClick={handleBack}>Back</Button>
        )}
        {step < 3 && (
          <Button variant="primary" onClick={handleNext}>Next</Button>
        )}
        {step === 3 && (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || loading || productLoading}
          >
            {isSubmitting || loading || productLoading ? 'Submitting...' : 'Submit'}
          </Button>
        )}
        <Button variant="dark" onClick={closeModal}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}