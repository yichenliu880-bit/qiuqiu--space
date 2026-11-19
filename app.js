(() => {
  'use strict';
  const photos = window.QIUQIU_PHOTOS || [];
  const gallery = document.getElementById('gallery');
  const dialog = document.getElementById('lightbox');
  const image = document.getElementById('lightbox-image');
  const filters = [...document.querySelectorAll('.filter')];
  let visible = photos;
  let currentIndex = 0;
  let opener = null;
  function render() {
    gallery.replaceChildren();
    visible.forEach((photo, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `photo-card ${photo.shape}`;
      card.setAttribute('aria-label', `放大照片：${photo.title}`);
      const frame = document.createElement('div');
      frame.className = 'photo-frame';
      const picture = document.createElement('img');
      picture.src = photo.src;
      picture.alt = photo.alt;
      picture.loading = 'lazy';
      picture.decoding = 'async';
      picture.addEventListener('error', () => {
        picture.hidden = true;
        const fallback = document.createElement('span');
        fallback.className = 'image-fallback';
        fallback.textContent = '🐾 照片暂时没有加载成功';
        frame.prepend(fallback);
      }, { once: true });
      const zoom = document.createElement('span');
      zoom.className = 'zoom-mark';
      zoom.textContent = '↗';
      zoom.setAttribute('aria-hidden', 'true');
      const tag = document.createElement('span');
      tag.className = 'photo-tag';
      tag.textContent = photo.label;
      frame.append(picture, tag, zoom);
      const caption = document.createElement('div');
      caption.className = 'photo-caption';
      const title = document.createElement('h3');
      title.textContent = photo.title;
      const note = document.createElement('p');
      note.textContent = photo.note;
      caption.append(title, note);
      card.append(frame, caption);
      card.addEventListener('click', () => openPhoto(index, card));
      gallery.append(card);
    });
    document.getElementById('album-count').textContent = `共 ${visible.length} 个可爱瞬间`;
    filters[0].querySelector('span').textContent = String(photos.length).padStart(2, '0');
  }
  function showPhoto(index) {
    currentIndex = (index + visible.length) % visible.length;
    const photo = visible[currentIndex];
    image.src = photo.src;
    image.alt = photo.alt;
    document.getElementById('lightbox-title').textContent = photo.title;
    document.getElementById('lightbox-category').textContent = photo.label;
    document.getElementById('lightbox-count').textContent = `${currentIndex + 1} / ${visible.length}`;
  }
  function openPhoto(index, card) {
    opener = card;
    showPhoto(index);
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    visible = button.dataset.filter === 'all' ? photos : photos.filter(photo => photo.category === button.dataset.filter);
    render();
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(currentIndex - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(currentIndex + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  render();
})();
