// components/sales/QuantityCalculatorModal.jsx
import React, { useState, useEffect } from 'react';
import { FaCalculator, FaTimes, FaTrash, FaCheck } from 'react-icons/fa';

const QuantityCalculatorModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  service, 
  maxQuantity 
}) => {
  const [quantity, setQuantity] = useState('1');
  const [total, setTotal] = useState(0);

  // Calculate total when quantity or price changes
  useEffect(() => {
    if (service && service.price) {
      const qty = parseFloat(quantity) || 0;
      const price = parseFloat(service.price) || 0;
      setTotal(qty * price);
    }
  }, [quantity, service]);

  // Handle number input
  const handleNumberClick = (num) => {
    if (quantity === '0' || quantity === '') {
      setQuantity(num.toString());
    } else {
      setQuantity(prev => prev + num.toString());
    }
  };

  // Handle decimal point
  const handleDecimal = () => {
    if (!quantity.includes('.')) {
      setQuantity(prev => prev + '.');
    }
  };

  // Clear calculator
  const handleClear = () => {
    setQuantity('1');
  };

  // Backspace
  const handleBackspace = () => {
    if (quantity.length > 1) {
      setQuantity(prev => prev.slice(0, -1));
    } else {
      setQuantity('1');
    }
  };

  // Set specific quantity
  const handleQuickQuantity = (qty) => {
    setQuantity(qty.toString());
  };

  // Handle confirm
  const handleConfirm = () => {
    const qty = parseFloat(quantity);
    if (qty > 0 && qty <= maxQuantity) {
      onConfirm(qty);
      onClose();
    } else {
      alert(`Quantity must be between 1 and ${maxQuantity}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <FaCalculator className="w-6 h-6" />
              <h2 className="text-xl font-bold">Quantity Calculator</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          
          {/* Service Info */}
          {service && (
                      <div className="bg-white/20 p-1 rounded-lg">
                          <div className="grid grid-cols-3 gap-4 items-center">
                              {/* Service Name */}
                              <div className="col-span-1">
                                  <p className="font-medium truncate text-lg">{service.serviceName}</p>
                              </div>

                              {/* Price and Available */}
                              <div className="col-span-1">
                                  <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                          <span className="text-sm opacity-90">Price:</span>
                                          <span className="font-bold">{service.price} AED</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <span className="text-sm opacity-90">Available:</span>
                                          <span className="font-bold">{maxQuantity} {service.unit}</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Quantity */}
                              <div className="col-span-1 flex justify-between items-center bg-white/30 px-2 py-2 rounded-lg">
                                  <p className="text-3xl font-bold">{quantity}</p>
                                  <p className="text-sm opacity-90">{service.unit}</p>
                              </div>
                          </div>
                      </div>
          )}
        </div>

        {/* Calculator Display */}
        <div className="p-3">
          {/* Total Display */}
          <div className="mb-2">
            <div className="flex justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-blue-600">
                {total.toFixed(2)} <span className="text-lg">AED</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {quantity} × {service?.price || 0} AED
              </p>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Quantity
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and one decimal point
                  if (/^\d*\.?\d*$/.test(value)) {
                    setQuantity(value);
                  }
                }}
                className="flex-1 text-xl font-bold text-center border-2 border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                placeholder="0"
              />
              <button
                onClick={handleClear}
                className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <FaTrash className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Quantity Buttons */}
          {/* <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Select</p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 5, 10, 15, 20, 50].map((qty) => (
                <button
                  key={qty}
                  onClick={() => handleQuickQuantity(qty)}
                  className={`py-2 rounded-lg transition-colors ${
                    parseFloat(quantity) === qty
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div> */}

          {/* Calculator Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-bold rounded-lg transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleNumberClick(0)}
              className="py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-bold rounded-lg transition-colors"
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className="py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-bold rounded-lg transition-colors"
            >
              .
            </button>
            <button
              onClick={handleBackspace}
              className="py-4 bg-red-100 hover:bg-red-200 text-red-600 text-xl font-bold rounded-lg transition-colors flex items-center justify-center"
            >
              ⌫
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={parseFloat(quantity) > maxQuantity || parseFloat(quantity) <= 0}
              className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                parseFloat(quantity) > maxQuantity || parseFloat(quantity) <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
              }`}
            >
              <FaCheck className="w-5 h-5" />
              Add to Cart ({quantity})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantityCalculatorModal;