/* PowerFit — Open Food Facts API Integration */

function injectNutritionModal() {
  if (document.getElementById('nutrition-modal')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="nutrition-modal" class="nutr-overlay" role="dialog" aria-modal="true">
      <div class="nutr-card">
        <button class="nutr-close" id="nutr-close" aria-label="Mbyll">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div id="nutr-body"></div>
      </div>
    </div>
  `);
  document.getElementById('nutr-close').addEventListener('click', closeNutritionModal);
  document.getElementById('nutrition-modal').addEventListener('click', function(e) {
    if (e.target === this) closeNutritionModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNutritionModal();
  });
}

function closeNutritionModal() {
  var m = document.getElementById('nutrition-modal');
  if (m) m.classList.remove('open');
}

var VALID_GRADES = ['a', 'b', 'c', 'd', 'e'];

function gradeColor(g) {
  return { a:'#22c55e', b:'#84cc16', c:'#eab308', d:'#f97316', e:'#ef4444' }[g] || '#555';
}

function nutrRow(label, val, unit) {
  if (val === undefined || val === null || val === '') return '';
  var num = parseFloat(val);
  if (isNaN(num)) return '';
  return '<tr><td>' + label + '</td><td><strong>' + num.toFixed(1) + '</strong> ' + unit + '</td></tr>';
}

function fetchWithTimeout(url, ms) {
  var controller = new AbortController();
  var timer = setTimeout(function() { controller.abort(); }, ms);
  return fetch(url, { signal: controller.signal }).finally(function() { clearTimeout(timer); });
}

function showNutrition(productId) {
  injectNutritionModal();

  var product = null;
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === productId) { product = PRODUCTS[i]; break; }
  }
  if (!product) return;

  var modal = document.getElementById('nutrition-modal');
  var body  = document.getElementById('nutr-body');

  body.innerHTML =
    '<div class="nutr-header">' +
      '<div class="nutr-emoji">' + product.emoji + '</div>' +
      '<div><div class="nutr-title">' + product.name + '</div></div>' +
    '</div>' +
    '<div class="nutr-loading"><div class="nutr-spinner"></div><div>Duke kërkuar vlerat ushqyese...</div></div>';

  modal.classList.add('open');

  var term = encodeURIComponent(product.apiSearch || product.name);
  var url  = 'https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + term +
             '&json=true&page_size=8&fields=product_name,nutriments,nutrition_grades,brands';

  fetchWithTimeout(url, 8000)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      /* Find first product with meaningful nutriments */
      var found = null;
      var products = data.products || [];
      for (var i = 0; i < products.length; i++) {
        var n = products[i].nutriments;
        if (n && (n['energy-kcal_100g'] || n['proteins_100g'] || n['fat_100g'])) {
          found = products[i];
          break;
        }
      }

      if (!found) {
        body.innerHTML =
          '<div class="nutr-header"><div class="nutr-emoji">' + product.emoji + '</div>' +
          '<div><div class="nutr-title">' + product.name + '</div></div></div>' +
          '<div class="nutr-error">' +
          '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
          '<p>Nuk u gjetën të dhëna ushqyese për këtë produkt.</p></div>';
        return;
      }

      var n     = found.nutriments || {};
      var g     = (found.nutrition_grades || '').toLowerCase().trim();
      var grade = VALID_GRADES.indexOf(g) !== -1 ? g : null;
      var brand = found.brands ? '<div class="nutr-brand">' + found.brands.split(',')[0].trim() + '</div>' : '';

      var rows =
        nutrRow('Kalori', n['energy-kcal_100g'], 'kcal') +
        nutrRow('Proteina', n['proteins_100g'], 'g') +
        nutrRow('Karbohidrate', n['carbohydrates_100g'], 'g') +
        nutrRow('— Sheqerna', n['sugars_100g'], 'g') +
        nutrRow('Yndyrna', n['fat_100g'], 'g') +
        nutrRow('— Të ngopura', n['saturated-fat_100g'], 'g') +
        nutrRow('Fibra', n['fiber_100g'], 'g') +
        nutrRow('Kripë', n['salt_100g'], 'g');

      if (!rows) {
        body.innerHTML =
          '<div class="nutr-header"><div class="nutr-emoji">' + product.emoji + '</div>' +
          '<div><div class="nutr-title">' + product.name + '</div></div></div>' +
          '<div class="nutr-error"><p>Të dhënat ushqyese nuk janë të disponueshme për këtë produkt.</p></div>';
        return;
      }

      body.innerHTML =
        '<div class="nutr-header">' +
          '<div class="nutr-emoji">' + product.emoji + '</div>' +
          '<div>' +
            '<div class="nutr-title">' + product.name + '</div>' +
            brand +
            '<div class="nutr-source">Burimi: Open Food Facts API</div>' +
          '</div>' +
          (grade ? '<div class="nutr-grade" style="background:' + gradeColor(grade) + '">' + grade.toUpperCase() + '</div>' : '') +
        '</div>' +
        '<div class="nutr-per">Për 100g / 100ml</div>' +
        '<table class="nutr-table"><tbody>' + rows + '</tbody></table>' +
        '<div class="nutr-disclaimer">Të dhënat janë orientuese nga Open Food Facts. Vlerat mund të ndryshojnë sipas brendit.</div>';
    })
    .catch(function(err) {
      var msg = err && err.name === 'AbortError'
        ? 'Kërkesa mori shumë kohë. Provo sërish.'
        : 'API-ja nuk u përgjigj. Kontrollo internetin dhe provo sërish.';
      body.innerHTML =
        '<div class="nutr-header"><div class="nutr-emoji">' + product.emoji + '</div>' +
        '<div><div class="nutr-title">' + product.name + '</div></div></div>' +
        '<div class="nutr-error"><p>' + msg + '</p>' +
        '<button onclick="showNutrition(' + productId + ')" style="margin-top:12px;padding:8px 20px;background:var(--orange);color:#000;border:none;border-radius:3px;font-family:var(--font-condensed);font-weight:700;letter-spacing:0.1em;cursor:pointer;">Provo Sërish</button>' +
        '</div>';
    });
}
