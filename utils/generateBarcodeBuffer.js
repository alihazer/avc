// barcodeGenerator.js
import bwipjs from 'bwip-js';

export const generateBarcodeBuffer = async (data) => {
    try {
        const barcode = await bwipjs.toBuffer({
            bcid:        'code128',       // Barcode type
            text:        data,            // Barcode data
            scale:       3,               // 3x scaling factor
            height:      10,              // Bar height, in millimeters
            includetext: true,            // Show human-readable text
            textxalign:  'center',        // Align text center
        });

        // Convert buffer to base64 string
        const barcodeBase64 = barcode.toString('base64');
        return barcodeBase64;
    } catch (error) {
        console.error('Error generating barcode string:', error);
        throw error;
    }
};

