import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { getReceiptTotalPrice, removeAllReceipt } from '../../redux/slices/receiptSlice';
import { addStoreInvoice, api } from '../../https';
import { removeSupplierReceipt } from '../../redux/slices/supplierReceiptSlice';
import ReceiptInvoice from './ReceiptInvoice';
import ReceiptPrint from './ReceiptPrint';

const Bill = () => {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.user);
    const supplierData = useSelector((state) => state.supplierReceipt);
    const cartData = useSelector((state) => state.receipt);
    const total = useSelector(getReceiptTotalPrice);

    const taxRate = 0.00;
    const tax = (total * taxRate) / 100;
    const totalPriceWithTax = total + tax;

    const [showInvoice, setShowInvoice] = useState(false);
    const [receiptInfo, setReceiptInfo] = useState(null);
    const [isPrintReady, setIsPrintReady] = useState(false);

    const [printReady, setPrintReady] = useState(false);
    const printRef = useRef(null);

    // This ensures the ref is properly set before printing
    useEffect(() => {
        if (receiptInfo) {
            setPrintReady(true);
        }
    }, [receiptInfo]);

    const handlePrint = useReactToPrint({
        content: () => {
            if (!printRef.current) {
                enqueueSnackbar('Print content not ready', { variant: 'error' });
                return null;
            }
            return printRef.current;
        },
        documentTitle: `Receipt-${receiptInfo?.storeinvoiceNumber || Date.now()}`,
        onBeforeGetContent: () => {
            if (!printRef.current) {
                enqueueSnackbar('Preparing print content...', { variant: 'info' });
            }
        },
        onAfterPrint: () => console.log('Print completed successfully'),
        onPrintError: (error) => {
            console.error('Print error:', error);
            enqueueSnackbar('Failed to print receipt', { variant: 'error' });
        }
    });



    const handlePlaceOrder = async () => {
        if (!supplierData.supplierName) {
            enqueueSnackbar('Please select a supplier first', { variant: "warning" });
            return;
        }
        if (cartData.length === 0) {
            enqueueSnackbar('Please add items to the receipt', { variant: "warning" });
            return;
        }


        try {
            const updatedItems = cartData.map(item => ({
                id: item.id,
                qty: item.qty
            }));

            await api.post('/api/storesitems/update-receiptquantities', { items: updatedItems });

            const receiptData = {
                storeinvoiceNumber: `${Date.now()}`,
                storeinvoiceStatus: "Completed",
                storeinvoiceType: "receipt",
                supplier: supplierData.supplierId,
                supplierName: supplierData.supplierName,
                supplierDetails: {
                    name: supplierData.supplierName,
                    phone: supplierData.contactNo,
                },
                bills: {
                    subtotal: total,
                    tax: tax,
                    total: totalPriceWithTax,
                },
                
                receiptBills: {
                    subtotal: total,
                    tax: tax,
                    total: totalPriceWithTax,
                },

                items: cartData,
                user: userData._id,
                invoiceDate: new Date().toISOString()
            };

            receiptMutation.mutate(receiptData);
        } catch (error) {
            console.error('Order placement failed:', error);
            enqueueSnackbar('Failed to create invoice', { variant: "error" });
        }
    };

    const receiptMutation = useMutation({
        mutationFn: (reqData) => addStoreInvoice(reqData),
        onSuccess: (resData) => {
            const { data } = resData.data;
            setReceiptInfo(data);
            setIsPrintReady(true);
            toast.success('Invoice created successfully!');
            setShowInvoice(true);
           // dispatch(removeSupplierReceipt());
           // dispatch(removeAllReceipt());
        },
        onError: (error) => {
            console.error('Invoice creation error:', error);
            enqueueSnackbar('Invoice creation failed', { variant: "error" });
        }
    });

      const handlePrintClick = () => {
        if (!printReady || !receiptInfo) {
            enqueueSnackbar('Please create an invoice first', { 
                variant: "warning",
                autoHideDuration: 3000
            });
            return;
        }

        if (!printRef.current) {
            enqueueSnackbar('Print content not loaded yet', { variant: 'error' });
            return;
        }

        // Double check everything is ready
        setTimeout(() => {
            if (printRef.current) {
                handlePrint();
            } else {
                enqueueSnackbar('Failed to load print content', { variant: 'error' });
            }
        }, 300);
    };

    const handleCancel = () => {
        dispatch(removeSupplierReceipt());
           dispatch(removeAllReceipt());
    }

    const handleShowInvoice = () => {
        setShowInvoice(true);
    }

    return (
        <>
             <div className ='flex items-center justify-between'>
                <div className='flex flex-col gap-2 p-2 w-40'>
                    
                        <div className='shadow-lg/30 p-1'>
                            <p className='text-xs text-[#1f1f1f] font-medium mt-2'>Items :
                                <span className='text-sky-600 text-sm font-semibold'> {cartData.length}</span>
                            </p>

                        </div>
                        <div className='shadow-lg/30 p-1'>
                            <p>Total : </p>
                            <p className='ml-0  text-[#1f1f1f]'><span className='text-md font-semibold'>
                                {total.toFixed(2)}</span>
                                <span className='text-xs font-normal text-sky-600'> AED</span>
                            </p>

                        </div>
                    
                </div>

                <div className='flex flex-col gap-3 p-3'>
                    {/* <button
                        className='bg-sky-600 px-4 py-4 w-full rounded-sm cursor-pointer font-semibold text-white text-sm font-medium shadow-lg/30'
                        onClick={handlePrintClick}
                        disabled={!isPrintReady}
                    >
                        {isPrintReady ? 'Print Receipt' : 'Create Invoice First'}
                    </button> */}
                    <button
                        className='bg-[#0ea5e9] px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold text-sm font-medium shadow-lg/30'
                        onClick={handlePlaceOrder}
                    >
                        Confirm Receipt
                    </button>
                    <button
                        className='bg-green-600 px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold text-sm font-medium shadow-lg/30'
                        // onClick={handleShowInvoice}
                    >
                        Print Invoice
                    </button>
                    
                    <button className='bg-[#be3e3f]/80 px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold text-sm font-medium shadow-lg/30'
                        onClick={handleCancel}
                    >Cancel
                    </button>

                </div>

             </div>
           
           

            {showInvoice && (
                <ReceiptInvoice receiptInfo={receiptInfo} setShowInvoice={setShowInvoice} />
            )}

            {/* Hidden print component that only renders when receiptInfo exists */}
             {/* Print component - always rendered but hidden */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                {receiptInfo && (
                    <ReceiptPrint 
                        ref={printRef} 
                        receiptInfo={receiptInfo} 
                        onLoad={() => setPrintReady(true)}
                        onError={() => setPrintReady(false)}
                    />
                )}
            </div>
        </>
    );
};

export default Bill;