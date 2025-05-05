// import React from 'react';
// import PropTypes from 'prop-types';
// import QRCode from 'qrcode.react';
// import Button from './Button';
//
// const QRCodeGenerator = ({ value, title = 'QR Code', downloadName = 'qrcode' }) => {
//     const downloadQRCode = () => {
//         const canvas = document.getElementById("qr-code-canvas");
//         const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//         const downloadLink = document.createElement("a");
//         downloadLink.href = pngUrl;
//         downloadLink.download = `${downloadName}.png`;
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
//     };
//
//     return (
//         <div className="flex flex-col items-center">
//             {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
//             <QRCode
//                 id="qr-code-canvas"
//                 value={value}
//                 size={200}
//                 level={"H"}
//                 includeMargin={true}
//                 className="mb-4"
//             />
//             <Button variant="primary" onClick={downloadQRCode}>
//                 Download QR Code
//             </Button>
//         </div>
//     );
// };
//
// QRCodeGenerator.propTypes = {
//     value: PropTypes.string.isRequired,
//     title: PropTypes.string,
//     downloadName: PropTypes.string,
// };
//
// export default QRCodeGenerator;