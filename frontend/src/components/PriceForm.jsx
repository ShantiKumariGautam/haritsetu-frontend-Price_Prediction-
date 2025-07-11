import { useState } from 'react';
import axios from 'axios';

const stateDistricts = {
  Bihar: ['Patna', 'Bhagalpur', 'Muzaffarpur', 'Gaya'],
  Haryana: ['Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Baghpat', 'Meerut'],
  'Himachal Pradesh': ['Kullu', 'Kangra', 'Mandi', 'Shimla'],
  Punjab: ['Ludhiana', 'Sangrur', 'Amritsar', 'Bathinda', 'Rohtak', 'Karnal'],
  Rajasthan: ['Kota', 'Udaipur', 'Bikaner', 'Jaipur'],
  'Uttar Pradesh': [
    'Baghpat',
    'Meerut',
    'Rohtak',
    'Karnal',
    'Amritsar',
    'Bathinda',
  ],
  Uttarakhand: ['Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar'],
};

const cropTypes = [
  'Rice',
  'Maize',
  'Wheat',
  'Sugarcane',
  'Mustard',
  'Banana',
  'Cotton',
  'Groundnut',
  'Paddy',
  'Corn',
];

const residueTypes = [
  'Husk',
  'Straw',
  'Stover',
  'Stubble',
  'Leaves',
  'Bagasse',
  'Pseudo-stem',
  'Stalk',
  'Shell',
];

const PriceForm = () => {
  const [formData, setFormData] = useState({
    crop_type: '',
    residue_type: '',
    state: '',
    district: '',
    month: '',
    quantity_kg: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const payload = {
      ...formData,
      month: parseInt(formData.month),
      quantity_kg: parseInt(formData.quantity_kg),
    };

    try {
      const response = await axios.post(
        'https://haritsetu-backend-1.onrender.com/predict_price',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setResult(response.data.predicted_price_per_kg);
    } catch (err) {
      setError('Failed to fetch price. Please check inputs or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-green-50 via-green-100 to-green-50 p-8 rounded-3xl shadow-xl border border-green-300">
      <h1 className="text-3xl font-extrabold text-green-900 mb-1 text-center font-serif">
        Welcome to HaritSetu 🌾
      </h1>
      <p className="text-green-600 text-center mb-6">
        AI Price Prediction for Crop Residue
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-green-700">Crop Type</label>
          <select
            name="crop_type"
            className="input-style"
            value={formData.crop_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Crop</option>
            {cropTypes.map((crop) => (
              <option
                key={crop}
                value={crop}
              >
                {crop}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-green-700">
            Residue Type
          </label>
          <select
            name="residue_type"
            className="input-style"
            value={formData.residue_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Residue</option>
            {residueTypes.map((residue) => (
              <option
                key={residue}
                value={residue}
              >
                {residue}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-green-700">State</label>
          <select
            name="state"
            className="input-style"
            value={formData.state}
            onChange={(e) => {
              setFormData({ ...formData, state: e.target.value, district: '' });
            }}
            required
          >
            <option value="">Select State</option>
            {Object.keys(stateDistricts).map((state) => (
              <option
                key={state}
                value={state}
              >
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-green-700">District</label>
          <select
            name="district"
            className="input-style"
            value={formData.district}
            onChange={handleChange}
            required
            disabled={!formData.state}
          >
            <option value="">Select District</option>
            {formData.state &&
              stateDistricts[formData.state].map((district) => (
                <option
                  key={district}
                  value={district}
                >
                  {district}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-green-700">Month</label>
          <input
            type="number"
            min="1"
            max="12"
            name="month"
            className="input-style"
            placeholder="e.g., 4 for April"
            value={formData.month}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-green-700">
            Quantity (kg)
          </label>
          <input
            type="number"
            name="quantity_kg"
            className="input-style"
            placeholder="e.g., 500"
            value={formData.quantity_kg}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-xl shadow hover:scale-105 transition-transform duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Predicting...' : '🌾 Predict Price'}
        </button>
      </form>

      {/* Status Display */}
      {isLoading && (
        <div className="mt-5 p-4 bg-blue-50 text-blue-800 rounded-lg text-center font-medium flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Analyzing data... Please wait.
        </div>
      )}

      {result && (
        <div className="mt-5 p-5 bg-green-100 border border-green-300 rounded-xl text-center">
          <p className="text-lg text-green-700 mb-1">Estimated Price per kg:</p>
          <p className="text-4xl font-bold text-green-800">₹{result}</p>
        </div>
      )}

      {error && (
        <div className="mt-5 p-4 bg-red-100 text-red-800 font-medium rounded-xl text-center">
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default PriceForm;

