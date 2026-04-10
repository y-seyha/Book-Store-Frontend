import QRCode from "qrcode";

export async  function  generateQrCode(url : string){
    return await QRCode.toDataURL(url);
}
