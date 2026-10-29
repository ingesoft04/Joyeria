if(location.hostname.startsWith('test-')){
  const banner=document.createElement('div');
  banner.className='test-environment-banner';
  banner.setAttribute('role','status');
  banner.textContent='Entorno de prueba · Los cambios aquí aún no están en producción';
  document.body.prepend(banner);
}
