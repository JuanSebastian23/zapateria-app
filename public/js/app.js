const fmt = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

let allProducts = [];

async function loadProducts() {
  const res = await fetch('/api/products');
  allProducts = await res.json();
  renderProducts(allProducts);
  updateCartCount();
}

function renderProducts(products) {
  const list = document.getElementById('product-list');
  const countDisplay = document.getElementById('product-count-display');
  
  if (countDisplay) {
    countDisplay.textContent = `${products.length} producto${products.length !== 1 ? 's' : ''} disponible${products.length !== 1 ? 's' : ''}`;
  }
  
  list.innerHTML = products.map(p => `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="text-muted mb-2">${p.description}</p>
          <div class="d-flex align-items-center justify-content-between mb-3">
            <p class="fw-bold mb-0" style="font-size: 1.5rem;">${fmt(p.price)}</p>
            <span class="badge" style="background: var(--gray-light); color: var(--gray-dark);">Stock: ${p.stock}</span>
          </div>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-primary" data-id="${p.id}" data-qty="1">Agregar</button>
            <a href="/cart.html" class="btn btn-outline-secondary">Ver carrito</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const productId = Number(btn.dataset.id);
      const qty = Number(btn.dataset.qty);
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty })
      });
      updateCartCount();
    });
  });
}

function filterProducts() {
  const searchText = document.getElementById('search-input').value.toLowerCase();
  const priceFilter = document.getElementById('price-filter').value;
  
  let filtered = allProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchText);
    
    let matchesPrice = true;
    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(v => {
        if (v.includes('+')) return [parseInt(v), Infinity];
        return parseInt(v);
      });
      if (Array.isArray(min)) {
        matchesPrice = p.price >= min[0];
      } else {
        matchesPrice = p.price >= min && p.price <= max;
      }
    }
    
    return matchesSearch && matchesPrice;
  });
  
  renderProducts(filtered);
}

document.getElementById('search-input').addEventListener('input', filterProducts);
document.getElementById('price-filter').addEventListener('change', filterProducts);
document.getElementById('clear-filters').addEventListener('click', () => {
  document.getElementById('search-input').value = '';
  document.getElementById('price-filter').value = 'all';
  renderProducts(allProducts);
});

async function updateCartCount() {
  const res = await fetch('/api/cart');
  const cart = await res.json();
  const count = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartCounts = document.querySelectorAll('#cart-count');
  cartCounts.forEach(el => el.textContent = String(count));
}

loadProducts();
