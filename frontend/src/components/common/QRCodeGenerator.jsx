import React from 'react';
import PropTypes from 'prop-types';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeGenerator = ({
                             value,
                             title = 'QR Code',
                             downloadName = 'qrcode',
                             size = 200,
                             bgColor = "#ffffff",
                             fgColor = "#000000",
                             imageSettings = null
                         }) => {
    const downloadQRCode = () => {
        const canvas = document.getElementById("qr-code-canvas");
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${downloadName}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const printQRCode = () => {
        const canvas = document.getElementById("qr-code-canvas");
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code: ${title}</title>
                    <style>
                        body {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            padding: 20px;
                            box-sizing: border-box;
                            font-family: Arial, sans-serif;
                        }
                        .container {
                            text-align: center;
                        }
                        h2 {
                            margin-bottom: 20px;
                            color: #333;
                        }
                        .qr-image {
                            margin-bottom: 20px;
                        }
                        .details {
                            margin-top: 20px;
                            text-align: left;
                            font-size: 14px;
                            color: #555;
                        }
                        @media print {
                            body {
                                padding: 0;
                            }
                            button {
                                display: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>${title}</h2>
                        <div class="qr-image">
                            <img src="${canvas.toDataURL()}" alt="QR Code" />
                        </div>
                        <div class="details">
                            <p>${value.replace(/\n/g, '<br>')}</p>
                        </div>
                        <button onclick="window.print(); window.close();" style="
                            background-color: #4F46E5; 
                            color: white; 
                            border: none; 
                            padding: 8px 16px; 
                            border-radius: 4px; 
                            cursor: pointer;
                            margin-top: 20px;
                        ">
                            Print
                        </button>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="flex flex-col items-center">
            {title && <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>}

            <div className="p-4 bg-white border border-gray-200 rounded-lg mb-6">
                <QRCodeCanvas
                    id="qr-code-canvas"
                    value={value}
                    size={size}
                    level={"H"}
                    includeMargin={true}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    imageSettings={imageSettings}
                />
            </div>

            <div className="flex flex-col space-y-4 w-full">
                <button
                    onClick={downloadQRCode}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors w-full flex justify-center items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download QR Code
                </button>

                <button
                    onClick={printQRCode}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors w-full flex justify-center items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print QR Code
                </button>
            </div>

            <p className="mt-6 text-sm text-gray-600 text-center">
                Отсканируйте QR-код для быстрого доступа к информации об инвентаре
            </p>
        </div>
    );
};

QRCodeGenerator.propTypes = {
    value: PropTypes.string.isRequired,
    title: PropTypes.string,
    downloadName: PropTypes.string,
    size: PropTypes.number,
    bgColor: PropTypes.string,
    fgColor: PropTypes.string,
    imageSettings: PropTypes.object,
};

export default QRCodeGenerator;