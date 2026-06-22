const navbtm =document.querySelector(".toggle-icon");
const navside=document.querySelector(".nav-list-side");
const gray=document.querySelector("main")
let open=false;
let get_right=false;
let gray_background=false;
navbtm.addEventListener("click",function(){
    if (open){
        navbtm.classList.remove("avtive")
        navside.classList.remove("open-side")
        gray.classList.remove('cover')
        get_right=false
        open=false
        gray_background=false
    }
    else{
        navbtm.classList.add("avtive")
        navside.classList.add("open-side")
        gray.classList.add("cover")
        get_right=true
        open=true
        gray_background=true
    }
})
document.addEventListener('DOMContentLoaded', () => {
  const ps = document.querySelectorAll('p[id^="p-"]');
  let currentActiveD = null;
  let currentActiveC = null;
  let currentActiveP = null;

  // پیش‌فرض: d-1, c-1 و p-1 فعال باشن
  const defaultD = document.getElementById('d-1');
  const defaultC = document.getElementById('c-1');
  const defaultP = document.getElementById('p-1');

  if (defaultD && defaultC && defaultP) {
    defaultD.classList.add('increase-width');
    defaultC.classList.add('show-content');
    defaultP.classList.add('white-text');
    currentActiveD = defaultD;
    currentActiveC = defaultC;
    currentActiveP = defaultP;
  }

  ps.forEach(p => {
    p.addEventListener('click', () => {
      const m = p.id.match(/-(\d+)$/);
      if (!m) return;

      const num = m[1];
      const targetD = document.getElementById(`d-${num}`);
      const targetC = document.getElementById(`c-${num}`);
      if (!targetD || !targetC) return;

      // اگر همین الان همین انتخاب شده، کاری نکن
      if (currentActiveD === targetD && currentActiveC === targetC && currentActiveP === p) return;

      // کلاس رو از مورد قبلی‌ها بردار
      if (currentActiveD) currentActiveD.classList.remove('increase-width');
      if (currentActiveC) currentActiveC.classList.remove('show-content');
      if (currentActiveP) currentActiveP.classList.remove('white-text');

      // اضافه کردن کلاس‌ها به موارد جدید
      targetD.classList.add('increase-width');
      targetC.classList.add('show-content');
      p.classList.add('white-text');

      // به‌روزرسانی متغیرهای فعلی
      currentActiveD = targetD;
      currentActiveC = targetC;
      currentActiveP = p;
    });
  });
});




document.addEventListener('DOMContentLoaded', () => {
  // selectors
  const pElements = Array.from(document.querySelectorAll('[id^="title-portfolio_"]')); // title-portfolio_1..7
  const navContainer = document.getElementById('navigation');
  const navElements = Array.from(
    (navContainer ? navContainer.querySelectorAll('[id^="n-"]') : document.querySelectorAll('[id^="n-"]'))
  ); // n-1..n-3

  // rowsMap: key = number (p index), value = [rowEl1, rowEl2, rowEl3]
  const rowsMap = new Map();

  // ساخت نگاشت rowها
  pElements.forEach(p => {
    const m = p.id.match(/_(\d+)$/); // گرفتن شماره از id
    if (!m) return;
    const pIndex = Number(m[1]);
    const rowArr = [];
    for (let page = 1; page <= 3; page++) {
      const row = document.getElementById(`row-${pIndex}-${page}`);
      if (row) rowArr.push(row);
    }
    if (rowArr.length) rowsMap.set(pIndex, rowArr);
  });

  // حالت فعلی
  let currentP = null;
  let currentPage = 1;

  // کلاس‌ها
  const CLASS_SELECTED_P = 'section-title--background';
  const CLASS_ACTIVE_NAV = 'sircle-number--show';
  const CLASS_ACTIVE_ROW = 'show-row';

  // کمکی
  const removeClassFromAll = (list, className) => list.forEach(el => el.classList.remove(className));

  const clearAllRowsActive = () => {
    rowsMap.forEach(rowArr => {
      rowArr.forEach(r => {
        r.classList.remove(CLASS_ACTIVE_ROW);
        r.setAttribute('aria-hidden', 'true');
      });
    });
  };

  // نمایش row
  function showRowFor(pIndex, pageIndex) {
    const rows = rowsMap.get(pIndex);

    removeClassFromAll(pElements, CLASS_SELECTED_P);
    removeClassFromAll(navElements, CLASS_ACTIVE_NAV);

    const pEl = document.getElementById(`title-portfolio_${pIndex}`);
    if (pEl) {
      pEl.classList.add(CLASS_SELECTED_P);
      pElements.forEach(pp => pp.setAttribute('aria-current', pp === pEl ? 'true' : 'false'));
    }

    if (!rows) {
      clearAllRowsActive();
      console.warn(`[gallery] هیچ 'row' ای برای title-portfolio_${pIndex} پیدا نشد.`);
      currentP = pIndex;
      currentPage = 1;
      const safeNav = document.getElementById('n-1');
      if (safeNav) safeNav.classList.add(CLASS_ACTIVE_NAV);
      return;
    }

    const safePage = Math.min(Math.max(1, pageIndex), rows.length);

    clearAllRowsActive();
    rows.forEach((r, idx) => {
      if (idx === safePage - 1) {
        r.classList.add(CLASS_ACTIVE_ROW);
        r.setAttribute('aria-hidden', 'false');
      } else {
        r.classList.remove(CLASS_ACTIVE_ROW);
        r.setAttribute('aria-hidden', 'true');
      }
    });

    const navEl = document.getElementById(`n-${safePage}`);
    if (navEl) navEl.classList.add(CLASS_ACTIVE_NAV);

    currentP = pIndex;
    currentPage = safePage;
  }

  // init پیش‌فرض
  (function initDefault() {
    const firstP = document.getElementById('title-portfolio_1') || pElements[0];
    if (!firstP) {
      console.warn('[gallery] المان title-portfolio پیدا نشد.');
      return;
    }
    const m = firstP.id.match(/_(\d+)$/);
    const firstIndex = m ? Number(m[1]) : 1;
    showRowFor(firstIndex, 1);
  })();

  // event برای pها
  pElements.forEach(p => {
    p.addEventListener('click', () => {
      const m = p.id.match(/_(\d+)$/);
      if (!m) return;
      const idx = Number(m[1]);

      if (currentP === idx && currentPage === 1) return;
      showRowFor(idx, 1);
    });

    if (!p.hasAttribute('tabindex')) p.setAttribute('tabindex', '0');
    p.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        p.click();
      }
    });
  });

  // event برای navها
  navElements.forEach(n => {
    n.addEventListener('click', () => {
      const m = n.id.match(/-(\d+)$/);
      if (!m) return;
      const pageIdx = Number(m[1]);

      const fallbackP = document.getElementById('title-portfolio_1') ? 1 : (pElements[0] ? Number((pElements[0].id.match(/_(\d+)$/) || [])[1]) : 1);
      const targetP = currentP || fallbackP;

      if (currentPage === pageIdx && currentP === targetP) return;
      showRowFor(targetP, pageIdx);
    });

    if (!n.hasAttribute('tabindex')) n.setAttribute('tabindex', '0');
    n.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        n.click();
      }
    });
  });
});

const themeBtn = document.querySelector(".change-theme");
const root = document.documentElement;
const sunIcon = document.querySelector(".sun-svg");
const moonIcon = document.querySelector(".moon-svg");

function toggleTheme() {
  if (root.classList.contains("dark-mode")) {
    // برگرد به تم روشن
    root.classList.remove("dark-mode");

    // خورشید نشون داده بشه، ماه مخفی
    moonIcon.classList.add("change-svg-icon");
    sunIcon.classList.remove("change-svg-icon");
  } else {
    // برو به تم تاریک
    root.classList.add("dark-mode");

    // ماه نشون داده بشه، خورشید مخفی
    sunIcon.classList.add("change-svg-icon");
    moonIcon.classList.remove("change-svg-icon");
  }
}

// حالت اولیه → تم روشن، خورشید دیده بشه
sunIcon.classList.remove("change-svg-icon");
moonIcon.classList.add("change-svg-icon");

themeBtn.addEventListener("click", toggleTheme);