import React, { forwardRef, useEffect } from 'react';

const ReceiptPrint = forwardRef(({ receiptInfo, onLoad, onError }, ref) => {
      useEffect(() => {
        try {
            // Validate receipt info
            if (!receiptInfo || !receiptInfo.storeinvoiceNumber) {
                throw new Error('Invalid receipt data');
            }
            if (onLoad) onLoad();
        } catch (error) {
            console.error('Receipt print error:', error);
            if (onError) onError();
        }
    }, [receiptInfo, onLoad, onError]);
    

    return(

    <div ref={ref} className="p-4">
        <div className="max-w-xs mx-auto">
            <h2 className="text-xl font-bold text-center mb-2">Receipt Invoice</h2>
            <p className="text-center text-gray-600 mb-4">Thank you for your order</p>
            
            <div className="border-t border-b border-gray-300 py-2 mb-4">
                <p className="text-xs font-semibold text-sky-600 mb-1">
                    Date: {receiptInfo?.invoiceDate ? new Date(receiptInfo.invoiceDate).toLocaleDateString('en-GB') : ''}
                </p>
                <p className="text-xs font-semibold">
                    Invoice #: {receiptInfo?.storeinvoiceNumber || ''}
                </p>
            </div>
            
            <div className="mb-4">
                <p className="font-semibold">Supplier Information:</p>
                <p>Name: {receiptInfo?.supplierName || ''}</p>
                <p>Phone: {receiptInfo?.supplierDetails?.phone || ''}</p>
            </div>
            
            <div className="border-t border-gray-300 pt-2">
                <p className="font-semibold">Items:</p>
                {receiptInfo?.items?.map((item, index) => (
                    <div key={index} className="flex justify-between">
                        <span>{item.name || 'Item'} x {item.qty}</span>
                        <span>{item.price ? (item.price * item.qty).toFixed(2) : '0.00'} AED</span>
                    </div>
                ))}
            </div>
            
            <div className="border-t border-gray-300 mt-4 pt-2">
                <div className="flex justify-between font-semibold">
                    <span>Subtotal:</span>
                    <span>{receiptInfo?.bills?.total?.toFixed(2) || '0.00'} AED</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax ({receiptInfo?.bills?.tax || '0'}%):</span>
                    <span>{receiptInfo?.bills?.taxAmount?.toFixed(2) || '0.00'} AED</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total:</span>
                    <span>{receiptInfo?.bills?.totalWithTax?.toFixed(2) || '0.00'} AED</span>
                </div>
            </div>
            
            <p className="text-center text-xs mt-6">Thank you for your business!</p>
        </div>
    </div>
    );
});

ReceiptPrint.displayName = 'ReceiptPrint';

export default ReceiptPrint;