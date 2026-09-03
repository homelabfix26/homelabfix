const DATA = [
  {
    id:'finance', icon:'💰', title:'Finance Calculators',
    desc:'Kredyty, raty, oszczędności, budżet i podstawowe decyzje finansowe.',
    calculators:[
      {
        id:'loan-payment', name:'Rata kredytu', short:'Miesięczna rata z oprocentowania i czasu spłaty.',
        formula:'R = P × r / (1 - (1 + r)^-n)',
        fields:[
          ['amount','Kwota kredytu',300000,'zł'],
          ['annualRate','Oprocentowanie roczne',7.5,'%'],
          ['years','Okres spłaty',25,'lat']
        ],
        calc:v=>{
          const n=v.years*12, r=v.annualRate/100/12;
          const payment=r===0?v.amount/n:v.amount*r/(1-Math.pow(1+r,-n));
          const total=payment*n, interest=total-v.amount;
          return out(payment,'zł / mies.',`Rata: ${money(payment)} zł<br>Łączna spłata: ${money(total)} zł<br>Odsetki: ${money(interest)} zł`);
        }
      },
      {
        id:'compound-interest', name:'Procent składany', short:'Wartość końcowa kapitału z dopłatami.',
        formula:'FV = P(1+r)^n + PMT × ((1+r)^n - 1) / r',
        fields:[
          ['start','Kapitał początkowy',10000,'zł'],
          ['monthly','Dopłata miesięczna',500,'zł'],
          ['annualRate','Zwrot roczny',6,'%'],
          ['years','Okres',10,'lat']
        ],
        calc:v=>{
          const n=v.years*12, r=v.annualRate/100/12;
          const fv=v.start*Math.pow(1+r,n)+v.monthly*((Math.pow(1+r,n)-1)/r);
          const paid=v.start+v.monthly*n;
          return out(fv,'zł',`Wpłaty razem: ${money(paid)} zł<br>Zysk orientacyjny: ${money(fv-paid)} zł`);
        }
      },
      {
        id:'budget', name:'Budżet miesięczny', short:'Szybki podział dochodu i kosztów.',
        formula:'Saldo = dochód - koszty stałe - koszty zmienne - oszczędności',
        fields:[
          ['income','Dochód miesięczny',8000,'zł'],
          ['fixed','Koszty stałe',3500,'zł'],
          ['variable','Koszty zmienne',1800,'zł'],
          ['saving','Oszczędności',1000,'zł']
        ],
        calc:v=>{
          const balance=v.income-v.fixed-v.variable-v.saving;
          return out(balance,'zł',`Pozostaje: ${money(balance)} zł<br>Udział kosztów: ${((v.fixed+v.variable)/v.income*100).toFixed(1)}% dochodu`);
        }
      }
    ]
  },
  {
    id:'business', icon:'📊', title:'Business Calculators',
    desc:'Marże, stawki roboczogodziny, wyceny i próg rentowności.',
    calculators:[
      {
        id:'profit-margin', name:'Marża i narzut', short:'Oblicz cenę sprzedaży, marżę i zysk.',
        formula:'Cena = koszt / (1 - marża)',
        fields:[
          ['cost','Koszt',1000,'zł'],
          ['margin','Docelowa marża',30,'%']
        ],
        calc:v=>{
          const price=v.cost/(1-v.margin/100), profit=price-v.cost, markup=profit/v.cost*100;
          return out(price,'zł',`Zysk: ${money(profit)} zł<br>Narzut na koszt: ${markup.toFixed(1)}%`);
        }
      },
      {
        id:'hourly-rate', name:'Stawka roboczogodziny', short:'Minimalna stawka przy kosztach i czasie pracy.',
        formula:'Stawka = (koszty + zysk) / godziny fakturowane',
        fields:[
          ['costs','Miesięczne koszty firmy',6500,'zł'],
          ['salary','Docelowy dochód',8000,'zł'],
          ['hours','Godziny fakturowane',120,'h'],
          ['tax','Bufor podatki/ZUS',25,'%']
        ],
        calc:v=>{
          const required=(v.costs+v.salary)*(1+v.tax/100);
          const rate=required/v.hours;
          return out(rate,'zł/h',`Miesięczny przychód wymagany: ${money(required)} zł<br>Godziny: ${v.hours} h`);
        }
      },
      {
        id:'break-even', name:'Próg rentowności', short:'Ile sztuk/usług trzeba sprzedać.',
        formula:'BEP = koszty stałe / (cena - koszt zmienny)',
        fields:[
          ['fixed','Koszty stałe',5000,'zł'],
          ['price','Cena sprzedaży',250,'zł'],
          ['unit','Koszt jednostkowy',120,'zł']
        ],
        calc:v=>{
          const margin=v.price-v.unit;
          const bep=margin>0?Math.ceil(v.fixed/margin):0;
          return out(bep,'szt.',`Marża jednostkowa: ${money(margin)} zł<br>Próg: ${bep} szt.`);
        }
      }
    ]
  },
  {
    id:'construction', icon:'🏗️', title:'Construction Calculators',
    desc:'Beton, farba, płytki, dach, fundamenty i materiały budowlane.',
    calculators:[
      {
        id:'concrete-volume', name:'Beton — objętość', short:'Ławy, płyty, stopy fundamentowe.',
        formula:'V = długość × szerokość × wysokość',
        fields:[
          ['length','Długość',6,'m'],
          ['width','Szerokość',0.4,'m'],
          ['height','Wysokość / grubość',0.3,'m'],
          ['waste','Zapas',10,'%']
        ],
        calc:v=>{
          const base=v.length*v.width*v.height, total=base*(1+v.waste/100);
          return out(total,'m³',`Bez zapasu: ${base.toFixed(3)} m³<br>Z zapasem ${v.waste}%: ${total.toFixed(3)} m³`);
        }
      },
      {
        id:'paint', name:'Farba — ilość litrów', short:'Powierzchnia, warstwy i wydajność farby.',
        formula:'Litry = powierzchnia × warstwy / wydajność',
        fields:[
          ['area','Powierzchnia',45,'m²'],
          ['coats','Liczba warstw',2,''],
          ['coverage','Wydajność',10,'m²/l'],
          ['waste','Zapas',10,'%']
        ],
        calc:v=>{
          const liters=(v.area*v.coats/v.coverage)*(1+v.waste/100);
          return out(liters,'l',`Podstawowo: ${(v.area*v.coats/v.coverage).toFixed(2)} l<br>Z zapasem: ${liters.toFixed(2)} l`);
        }
      },
      {
        id:'tiles', name:'Płytki — ilość', short:'Metraż płytek z fugą i zapasem.',
        formula:'szt. = powierzchnia / powierzchnia płytki',
        fields:[
          ['area','Powierzchnia',18,'m²'],
          ['tileW','Szerokość płytki',0.6,'m'],
          ['tileH','Długość płytki',0.6,'m'],
          ['waste','Zapas',12,'%']
        ],
        calc:v=>{
          const one=v.tileW*v.tileH;
          const pcs=Math.ceil((v.area/one)*(1+v.waste/100));
          return out(pcs,'szt.',`Jedna płytka: ${one.toFixed(3)} m²<br>Ilość z zapasem: ${pcs} szt.`);
        }
      },
      {
        id:'roof-area', name:'Powierzchnia dachu dwuspadowego', short:'Orientacyjna powierzchnia połaci.',
        formula:'A = długość kalenicy × długość krokwi × 2',
        fields:[
          ['ridge','Długość kalenicy',8,'m'],
          ['rafter','Długość krokwi',5,'m'],
          ['waste','Zapas',10,'%']
        ],
        calc:v=>{
          const a=v.ridge*v.rafter*2, total=a*(1+v.waste/100);
          return out(total,'m²',`Powierzchnia: ${a.toFixed(2)} m²<br>Z zapasem: ${total.toFixed(2)} m²`);
        }
      }
    ]
  },
  {
    id:'carpentry', icon:'🪵', title:'Carpentry & Joinery Calculators',
    desc:'Deski, płyty, rozkrój, fronty, szafki i stolarka warsztatowa.',
    calculators:[
      {
        id:'boards', name:'Ilość desek', short:'Taras, elewacja lub podłoga z desek.',
        formula:'szt. = powierzchnia / (szerokość × długość deski)',
        fields:[
          ['area','Powierzchnia',24,'m²'],
          ['boardW','Szerokość deski',0.145,'m'],
          ['boardL','Długość deski',4,'m'],
          ['waste','Zapas',10,'%']
        ],
        calc:v=>{
          const one=v.boardW*v.boardL, pcs=Math.ceil((v.area/one)*(1+v.waste/100));
          return out(pcs,'szt.',`Jedna deska: ${one.toFixed(3)} m²<br>Ilość z zapasem: ${pcs} szt.`);
        }
      },
      {
        id:'sheet-cut', name:'Rozkrój płyty — ilość elementów', short:'Ile elementów mieści się na płycie.',
        formula:'szt. = floor(szerokość płyty / szerokość elementu) × floor(długość płyty / długość elementu)',
        fields:[
          ['sheetW','Szerokość płyty',1250,'mm'],
          ['sheetL','Długość płyty',2500,'mm'],
          ['partW','Szerokość elementu',300,'mm'],
          ['partL','Długość elementu',600,'mm']
        ],
        calc:v=>{
          const across=Math.floor(v.sheetW/v.partW), along=Math.floor(v.sheetL/v.partL), pcs=across*along;
          return out(pcs,'szt.',`W poprzek: ${across} szt.<br>Wzdłuż: ${along} szt.<br>Razem: ${pcs} szt. bez optymalizacji obrotu.`);
        }
      },
      {
        id:'cabinet-doors', name:'Fronty szafki', short:'Szerokość frontu przy luzach.',
        formula:'front = (szerokość korpusu - luz łączny) / liczba frontów',
        fields:[
          ['cabinetW','Szerokość korpusu',800,'mm'],
          ['doors','Liczba frontów',2,''],
          ['gap','Luz łączny',6,'mm']
        ],
        calc:v=>{
          const w=(v.cabinetW-v.gap)/v.doors;
          return out(w,'mm / front',`(${v.cabinetW} - ${v.gap}) / ${v.doors} = ${w.toFixed(1)} mm`);
        }
      }
    ]
  },
  {
    id:'manufacturing', icon:'⚙️', title:'Manufacturing Calculators',
    desc:'Masa stali, rury, arkusze, spawanie i podstawy produkcji.',
    calculators:[
      {
        id:'steel-plate-weight', name:'Masa blachy stalowej', short:'Waga blachy z wymiarów i grubości.',
        formula:'masa = długość × szerokość × grubość × gęstość',
        fields:[
          ['length','Długość',2,'m'],
          ['width','Szerokość',1,'m'],
          ['thick','Grubość',8,'mm'],
          ['density','Gęstość',7850,'kg/m³']
        ],
        calc:v=>{
          const mass=v.length*v.width*(v.thick/1000)*v.density;
          return out(mass,'kg',`Objętość: ${(v.length*v.width*(v.thick/1000)).toFixed(4)} m³<br>Masa: ${mass.toFixed(2)} kg`);
        }
      },
      {
        id:'pipe-weight', name:'Masa rury stalowej', short:'Rura okrągła — masa orientacyjna.',
        formula:'A = π/4 × (D² - d²), masa = A × L × ρ',
        fields:[
          ['od','Średnica zewnętrzna',60.3,'mm'],
          ['wall','Grubość ścianki',3.2,'mm'],
          ['length','Długość',6,'m'],
          ['density','Gęstość',7850,'kg/m³']
        ],
        calc:v=>{
          const D=v.od/1000, d=(v.od-2*v.wall)/1000;
          const area=Math.PI/4*(D*D-d*d), mass=area*v.length*v.density;
          return out(mass,'kg',`Pole przekroju: ${(area*1e6).toFixed(1)} mm²<br>Masa: ${mass.toFixed(2)} kg`);
        }
      },
      {
        id:'welding-wire', name:'Drut spawalniczy', short:'Orientacyjne zużycie na długości spoiny.',
        formula:'masa = długość × przekrój spoiny × gęstość × współczynnik',
        fields:[
          ['length','Długość spoiny',10,'m'],
          ['leg','A spoina pachwinowa',5,'mm'],
          ['factor','Współczynnik strat',1.15,'']
        ],
        calc:v=>{
          const area=(v.leg*v.leg/2)/1e6;
          const mass=v.length*area*7850*v.factor;
          return out(mass,'kg',`Pole przekroju ≈ ${(v.leg*v.leg/2).toFixed(1)} mm²<br>Zużycie orientacyjne: ${mass.toFixed(2)} kg`);
        }
      }
    ]
  },
  {
    id:'lifting', icon:'🏗️', title:'Lifting & Rigging Calculators',
    desc:'Naciski, zawiesia, kąty i podstawowa kontrola podnoszenia.',
    calculators:[
      {
        id:'ground-pressure', name:'Nacisk na podłoże', short:'Podkład pod podporę dźwigu lub urządzenia.',
        formula:'p = siła / powierzchnia',
        fields:[
          ['load','Obciążenie na podporę',12,'t'],
          ['matL','Długość podkładu',1.2,'m'],
          ['matW','Szerokość podkładu',1.2,'m']
        ],
        calc:v=>{
          const area=v.matL*v.matW;
          const tm2=v.load/area;
          const kpa=tm2*9.80665;
          return out(tm2,'t/m²',`Powierzchnia: ${area.toFixed(2)} m²<br>Nacisk: ${tm2.toFixed(2)} t/m² ≈ ${kpa.toFixed(1)} kPa`);
        }
      },
      {
        id:'sling-angle', name:'Naprężenie w zawiesiu', short:'Dwie gałęzie zawiesia i kąt od pionu.',
        formula:'T = W / (2 × cos α)',
        fields:[
          ['load','Ciężar ładunku',4,'t'],
          ['angle','Kąt od pionu',30,'°']
        ],
        calc:v=>{
          const rad=v.angle*Math.PI/180;
          const tension=v.load/(2*Math.cos(rad));
          return out(tension,'t / gałąź',`Współczynnik kąta: ${(1/Math.cos(rad)).toFixed(3)}<br>Naprężenie jednej gałęzi: ${tension.toFixed(2)} t`);
        }
      },
      {
        id:'crane-capacity', name:'Wykorzystanie udźwigu', short:'Procent wykorzystania z tabeli udźwigu.',
        formula:'% = obciążenie całkowite / udźwig z tabeli × 100',
        fields:[
          ['load','Ładunek',8,'t'],
          ['hook','Hak/osprzęt',0.5,'t'],
          ['capacity','Udźwig z tabeli',12,'t']
        ],
        calc:v=>{
          const total=v.load+v.hook;
          const percent=total/v.capacity*100;
          return out(percent,'%',`Łączne obciążenie: ${total.toFixed(2)} t<br>Wykorzystanie: ${percent.toFixed(1)}%`);
        }
      }
    ]
  },
  {
    id:'electrical', icon:'⚡', title:'Electrical Calculators',
    desc:'Prąd, spadek napięcia, moc, fotowoltaika i obciążenia.',
    calculators:[
      {
        id:'current', name:'Prąd z mocy', short:'Jednofazowo lub uproszczone 3-fazowo.',
        formula:'I 1F = P/U, I 3F = P/(√3 × U × cosφ)',
        fields:[
          ['power','Moc',3000,'W'],
          ['voltage','Napięcie',230,'V'],
          ['pf','cosφ',1,'']
        ],
        calc:v=>{
          const i=v.power/(v.voltage*v.pf);
          return out(i,'A',`Prąd orientacyjny: ${v.power} / (${v.voltage} × ${v.pf}) = ${i.toFixed(2)} A`);
        }
      },
      {
        id:'voltage-drop', name:'Spadek napięcia', short:'Uproszczony kalkulator przewodu miedzianego.',
        formula:'ΔU = 2 × L × I × ρ / S',
        fields:[
          ['length','Długość przewodu',25,'m'],
          ['current','Prąd',16,'A'],
          ['section','Przekrój',2.5,'mm²'],
          ['voltage','Napięcie',230,'V']
        ],
        calc:v=>{
          const rho=0.0175;
          const du=2*v.length*v.current*rho/v.section;
          const pct=du/v.voltage*100;
          return out(du,'V',`Spadek: ${du.toFixed(2)} V<br>Udział: ${pct.toFixed(2)}%`);
        }
      },
      {
        id:'solar', name:'Off-grid solar', short:'Panele i pojemność akumulatora orientacyjnie.',
        formula:'PV = zużycie dzienne / godziny słońca',
        fields:[
          ['daily','Zużycie dzienne',4,'kWh'],
          ['sun','Godziny pełnego słońca',4,'h'],
          ['autonomy','Autonomia',2,'dni'],
          ['batteryV','Napięcie baterii',24,'V']
        ],
        calc:v=>{
          const pv=v.daily/v.sun*1000;
          const battAh=(v.daily*1000*v.autonomy)/v.batteryV;
          return out(pv,'W PV',`Minimalna moc PV: ${pv.toFixed(0)} W<br>Pojemność baterii: ${battAh.toFixed(0)} Ah przy ${v.batteryV} V`);
        }
      }
    ]
  },
  {
    id:'conversion', icon:'🔄', title:'Conversion Calculators',
    desc:'Długość, powierzchnia, objętość, masa, temperatura i ciśnienie.',
    calculators:[
      {
        id:'length-converter', name:'Konwerter długości', short:'Metry, centymetry, milimetry i cale.',
        formula:'1 m = 100 cm = 1000 mm = 39.3701 in',
        fields:[
          ['value','Wartość',1,'m'],
          ['unit','Jednostka: 1=m, 2=cm, 3=mm, 4=cal',1,'']
        ],
        calc:v=>{
          const meters = v.unit===2?v.value/100:v.unit===3?v.value/1000:v.unit===4?v.value*0.0254:v.value;
          return out(meters,'m',`${meters.toFixed(4)} m<br>${(meters*100).toFixed(2)} cm<br>${(meters*1000).toFixed(1)} mm<br>${(meters/0.0254).toFixed(3)} cal`);
        }
      },
      {
        id:'area-converter', name:'Konwerter powierzchni', short:'m², cm², ary i hektary.',
        formula:'1 ha = 10 000 m², 1 ar = 100 m²',
        fields:[
          ['sqm','Powierzchnia',1000,'m²']
        ],
        calc:v=>out(v.sqm,'m²',`${(v.sqm/100).toFixed(3)} ar<br>${(v.sqm/10000).toFixed(4)} ha<br>${(v.sqm*10000).toFixed(0)} cm²`)
      },
      {
        id:'temperature', name:'Temperatura', short:'Celsjusz na Fahrenheit i Kelvin.',
        formula:'F = C × 9/5 + 32, K = C + 273.15',
        fields:[
          ['c','Temperatura',20,'°C']
        ],
        calc:v=>out(v.c,'°C',`${(v.c*9/5+32).toFixed(1)} °F<br>${(v.c+273.15).toFixed(2)} K`)
      }
    ]
  }
];

let currentCategory = DATA[0].id;
let currentCalculator = DATA[0].calculators[0].id;
let listMode = 'category';

const $ = s => document.querySelector(s);
const money = n => Number(n).toLocaleString('pl-PL',{maximumFractionDigits:2});
const out = (value, unit, steps) => ({ value, unit, steps });

function allCalculators(){
  return DATA.flatMap(cat => cat.calculators.map(calc => ({...calc, categoryId:cat.id, categoryTitle:cat.title, categoryIcon:cat.icon})));
}

function findCalc(id){
  return allCalculators().find(c => c.id === id) || allCalculators()[0];
}

function findCat(id){
  return DATA.find(c => c.id === id) || DATA[0];
}

function renderHeaderStats(){
  $('#statCategories').textContent = DATA.length;
  $('#statCalculators').textContent = allCalculators().length;
}

function renderCategories(){
  const grid = $('#categoryGrid');
  grid.innerHTML = DATA.map(cat => `
    <article class="category-card ${cat.id===currentCategory?'active':''}" data-cat="${cat.id}">
      <div class="category-icon">${cat.icon}</div>
      <h3>${cat.title}</h3>
      <p>${cat.desc}</p>
      <small>${cat.calculators.length} calculators</small>
    </article>
  `).join('');
  grid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => selectCategory(card.dataset.cat, true));
  });
}

function renderSelect(){
  $('#categorySelect').innerHTML = [
    `<option value="all">Wszystkie kategorie</option>`,
    ...DATA.map(cat => `<option value="${cat.id}" ${cat.id===currentCategory?'selected':''}>${cat.icon} ${cat.title}</option>`)
  ].join('');
}

function renderList(items=null){
  const cat = findCat(currentCategory);
  const list = items || (listMode === 'all' ? allCalculators() : cat.calculators.map(c=>({...c,categoryId:cat.id,categoryTitle:cat.title,categoryIcon:cat.icon})));
  $('#listCount').textContent = `${list.length} narzędzi`;
  $('#calculatorList').innerHTML = list.map(calc => `
    <button class="calc-row ${calc.id===currentCalculator?'active':''}" data-calc="${calc.id}">
      <strong>${calc.categoryIcon || cat.icon} ${calc.name}</strong>
      <span>${calc.short}</span>
    </button>
  `).join('');
  $('#calculatorList').querySelectorAll('.calc-row').forEach(btn => {
    btn.addEventListener('click', () => selectCalculator(btn.dataset.calc));
  });
}

function renderPanel(){
  const calc = findCalc(currentCalculator);
  const cat = findCat(calc.categoryId);
  currentCategory = cat.id;
  $('#workspaceTitle').textContent = cat.title;
  $('#workspaceText').textContent = cat.desc;
  $('#calculatorPanel').innerHTML = `
    <div class="calc-meta">
      <span class="tag">${cat.icon} ${cat.title}</span>
      <span class="tag warn">Estimated result</span>
    </div>
    <h2>${calc.name}</h2>
    <p style="color:#667385;line-height:1.65">${calc.short}</p>
    <div class="formula">${calc.formula}</div>
    <div class="fields">
      ${calc.fields.map(f => `
        <div class="field">
          <label for="field_${f[0]}">${f[1]} ${f[3] ? `<span style="color:#667385">[${f[3]}]</span>` : ''}</label>
          <input type="number" step="any" id="field_${f[0]}" value="${f[2]}" />
        </div>
      `).join('')}
    </div>
    <div class="result-box">
      <span>Result</span>
      <strong id="resultValue">—</strong>
      <div class="steps" id="resultSteps"></div>
    </div>
    <div class="related">
      <strong>Related calculator categories</strong>
      <div class="related-buttons">
        ${DATA.filter(c=>c.id!==cat.id).slice(0,4).map(c=>`<button data-related="${c.id}">${c.icon} ${c.title}</button>`).join('')}
      </div>
    </div>
  `;
  calc.fields.forEach(f => $('#field_'+f[0]).addEventListener('input', calculate));
  document.querySelectorAll('[data-related]').forEach(b => b.addEventListener('click', () => selectCategory(b.dataset.related, true)));
  calculate();
}

function calculate(){
  const calc = findCalc(currentCalculator);
  const values = {};
  calc.fields.forEach(f => {
    values[f[0]] = parseFloat(String($('#field_'+f[0]).value).replace(',','.')) || 0;
  });
  const r = calc.calc(values);
  const isNum = typeof r.value === 'number' && Number.isFinite(r.value);
  $('#resultValue').textContent = `${isNum ? Number(r.value).toLocaleString('pl-PL',{maximumFractionDigits:3}) : r.value} ${r.unit || ''}`;
  $('#resultSteps').innerHTML = r.steps;
}

function selectCategory(id, jump=false){
  currentCategory = id === 'all' ? DATA[0].id : id;
  const cat = findCat(currentCategory);
  currentCalculator = cat.calculators[0].id;
  listMode = 'category';
  renderCategories();
  renderSelect();
  renderList();
  renderPanel();
  if(jump) location.hash = 'calculators';
}

function selectCalculator(id){
  currentCalculator = id;
  const calc = findCalc(id);
  currentCategory = calc.categoryId;
  renderCategories();
  renderSelect();
  renderList();
  renderPanel();
}

function search(q){
  q = q.toLowerCase().trim();
  if(!q){
    listMode='category';
    renderList();
    return;
  }
  const results = allCalculators().filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.short.toLowerCase().includes(q) ||
    c.categoryTitle.toLowerCase().includes(q) ||
    c.formula.toLowerCase().includes(q)
  );
  listMode='search';
  renderList(results);
  if(results.length){
    currentCalculator = results[0].id;
    renderPanel();
  } else {
    $('#calculatorList').innerHTML = `<p style="color:#667385;line-height:1.6;padding:8px">Brak wyników. Spróbuj: beton, farba, kabel, rata, marża, deski, stal.</p>`;
  }
  location.hash = 'calculators';
}

function renderPopular(){
  const ids = ['concrete-volume','voltage-drop','boards','loan-payment','steel-plate-weight','sling-angle'];
  $('#popularGrid').innerHTML = ids.map(id => {
    const c = findCalc(id);
    return `<article class="popular-card" data-calc="${c.id}"><b>${c.categoryIcon} ${c.name}</b><p>${c.short}</p></article>`;
  }).join('');
  document.querySelectorAll('.popular-card').forEach(card => card.addEventListener('click', () => {
    selectCalculator(card.dataset.calc);
    location.hash = 'calculators';
  }));
}

function init(){
  renderHeaderStats();
  renderCategories();
  renderSelect();
  renderList();
  renderPanel();
  renderPopular();

  $('#categorySelect').addEventListener('change', e => {
    if(e.target.value === 'all'){
      listMode = 'all';
      renderList(allCalculators());
      return;
    }
    selectCategory(e.target.value, false);
  });

  $('#showAll').addEventListener('click', () => {
    listMode='all';
    renderList(allCalculators());
  });

  $('#searchForm').addEventListener('submit', e => {
    e.preventDefault();
    search($('#searchInput').value);
  });

  $('#menuToggle').addEventListener('click', () => $('#mainNav').classList.toggle('open'));
  $('#mainNav').querySelectorAll('a').forEach(a => a.addEventListener('click', () => $('#mainNav').classList.remove('open')));
}

init();
