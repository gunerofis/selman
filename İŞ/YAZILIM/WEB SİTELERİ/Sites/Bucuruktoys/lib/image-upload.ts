export async function prepareUpload(file:File):Promise<File> {
  if(file.size>8*1024*1024)throw new Error('Görsel boyutu en fazla 8 MB olabilir.');
  if(!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type))throw new Error('Geçersiz görsel biçimi.');
  const image=await createImageBitmap(file);
  try {
    const scale=Math.min(1,1600/Math.max(image.width,image.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
    const context=canvas.getContext('2d');if(!context)throw new Error('Görsel hazırlanamadı.');context.drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Görsel hazırlanamadı.')),'image/webp',0.84));
    if(blob.size>2*1024*1024)throw new Error('Görsel çok büyük; daha küçük bir görsel seçin.');
    return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.webp',{type:'image/webp'});
  }finally{image.close();}
}
