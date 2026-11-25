// Photos go in photos/island-1.jpg through island-6.jpg and photos/reunion.jpg.
function element                       (id        )    {
  return document.getElementById(id)     ;
}
const page = element('page');
const main = element('main');
const next = element                   ('next');
const back = element                   ('back');
let current = 1;
let historyPages           = [];
let activity = '';
let wins = '';
let wish = '';
let wishSent = false;
let reportOpen = false;
let animationDone = false;
let animationTimer = 0;
const wishKey = 'xixi-birthday-wish-v1';
try { wish = localStorage.getItem(wishKey) || ''; } catch {}
const number = (s        ) => '<b class="num">' + s + '</b>';
const title = (s        ) => '<h2>' + s + '</h2>';
const para = (s        ) => '<p>' + s + '</p>';
function delayed(lines          ) {
  return lines.map((line,i) => '<div class="reveal" style="--delay:' + (0.45 * i) + 's">' + line + '</div>').join('');
}
function form(content        , button = '确定') {
  return '<form id="answer">' + content + '<button class="primary">' + button + '</button><span id="message" class="msg" role="status"></span></form>';
}
function picture(path        , fallback        ) {
  return '<span>' + fallback + '</span><img hidden data-src="photos/' + path + '.jpg" alt="' + fallback + '">';
}
function tree(withLetter = false) {
  return '<div class="tree" aria-label="圣诞树">' + (withLetter ? '<span class="letter" id="paper"></span><span class="env">✉</span>' : '') + '</div>';
}
function content() {
  switch (current) {
    case 1: return '<div class="cover"><p class="salute">亲爱的奚曦：</p><h1>祝你20岁生日快乐</h1><div class="cake" role="img" aria-label="点着二十岁蜡烛的草莓生日蛋糕"><div class="plate"></div><div class="layer"></div><div class="icing"></div><i class="berry"></i><i class="berry b"></i><span class="candle">20</span><i class="spark">✧</i><i class="spark r">✧</i></div></div>';
    case 2: return delayed([para('我们在'), title(number('2019') + '年，' + number('9') + '月' + number('10') + '日认识彼此，'), para('陪伴彼此走过了' + number('2637') + '天。'), para('第一次认识的时候，我们还在一起踢足球！')]);
    case 3: return delayed([title('我们在一起做的最多的事情：'), para('你猜猜会是什么呢？'), para('相信你都不用猜吧哈哈哈哈') + form('<input id="activity" aria-label="我们最常做的事" required placeholder="写下你的答案">')]);
    case 4: return ['玩和平精英','和平精英','吃鸡'].includes(activity.trim()) ? title('猜对了！那就是打和平精英！') + para('我们在和平精英里：') : title('哈哈，其实我觉得我们做过最多的事情是玩和平精英！');
    case 5: return title('在和平精英里') + para('我们2020年8月9日成为了游戏好友：') + para('一共组队了 ' + number('2340') + ' 次，') + para('猜猜我们一共吃鸡了多少次？') + form('<input id="wins" inputmode="decimal" aria-label="吃鸡次数" placeholder="输入次数">');
    case 6: return title('哇塞，这都可以猜对吗？') + para('对！我们吃鸡了' + number('385') + '次！');
    case 7: return title('哈哈，猜的很接近了，') + para('我们吃鸡了' + number('385') + '次！');
    case 8: return title('每一次吃鸡，我们都在海岛不同的地方，') + para('每一个地方都有不同的回忆！') + '<div class="photos">' + [-6,4,-3,7,-5,2].map((r,i) => '<div class="photo" style="--r:'+r+'deg;--delay:'+i*1.4+'s">'+picture('island-'+(i+1),'海岛回忆 '+(i+1))+'</div>').join('')+'</div>';
    case 9:
      if (!reportOpen) return title('海岛战报总结') + '<button id="show-report" class="secondary">请点击屏幕</button>';
      return title('海岛战报总结') + '<div class="stats">' + [['你把我救起','608'],['我把你救起','778'],['我为你还击','532'],['你为我还击','349'],['我把你复活','387'],['你把我复活','385']].map(([label,n]) => para(label+'<strong>'+n+'</strong>次')).join('')+'</div>';
    case 10: return title('我们还一次灭队了'+number('83')+'次！') + para('我们就是世界上正数第一有默契的搭子！');
    case 11: return title('距离我们上一次见面，') + para('已经'+number('96')+'天了。') + '<div class="snapshot">'+picture('reunion','我们的合照')+'</div>' + para('好怀念我们一起吃烤匠，好怀念我们一起去洗浴中心玩双人成行！');
    case 12: return para('而距离我们相见只剩下'+number('17')+'天了！') + title('你有没有想我呢？') + '<div class="choices"><button class="primary" id="yes">想你了</button><button class="secondary" id="no">还好吧，不想</button></div><p class="msg" id="message" role="status"></p>';
    case 13: return title('那我们要一起做什么呢？') + (wishSent ? tree(true) : form('<textarea id="wish" required placeholder="把想一起做的事写进信里……" aria-label="想一起做的事"></textarea>','把信挂上圣诞树'));
    default: return tree(true) + title('我们圣诞节见！') + '<p class="finish">Merry Christmas, Xixi</p><a id="share" hidden target="_blank" rel="noopener">把心愿分享给我 ↗</a>';
  }
}
function allowed() {
  return (current !== 9 || reportOpen) && ![3,5,12,14].includes(current) && (current !== 13 || (wishSent && animationDone));
}
function advance() {
  if (allowed()) go(current === 6 ? 8 : current + 1);
}
function go(n        ) {
  historyPages.push(current);
  current = n;
  render();
}
function previous() {
  if (historyPages.length) { current = historyPages.pop() ; render(); }
}
function bindForm(action            ) {
  element('answer').onsubmit = e => { e.preventDefault(); action(); };
}
function render(focus = true) {
  clearTimeout(animationTimer);
  document.querySelector('.confetti')?.remove();
  reportOpen = false;
  page.innerHTML = content();
  main.scrollTop = 0;
  element('folio').textContent = String(current).padStart(2,'0') + ' / 14';
  back.hidden = historyPages.length === 0;
  next.hidden = !allowed() && current !== 14;
  next.textContent = current === 1 ? '↑　请向上滑翻页' : current === 14 ? '再看一次 ↺' : '↑　下一页';
  if (focus) page.focus({preventScroll:true});
  for (const img of page.querySelectorAll                  ('img[data-src]')) {
    img.onload = () => { img.hidden = false; (img.previousElementSibling               ).hidden = true; };
    if (img.closest('.photos')) {
      const stack = img.closest('.photos') ;
      img.onload = () => {
        img.hidden = false;
        (img.previousElementSibling               ).hidden = true;
        img.parentElement .classList.add('loaded');
        stack.classList.add('has-images');
      };
    }
    img.src = img.dataset.src ;
  }
  if (current === 1) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti'; confetti.ariaHidden = 'true';
    for (let i=0;i<42;i++) {
      const chip = document.createElement('i');
      chip.style.cssText = 'left:'+Math.random()*100+'%;background:'+['#e69a52','#c76458','#839e7c','#d7af59'][i%4]+';--d:'+Math.random()+'s;--t:'+(2+Math.random()*2)+'s;--x:'+(Math.random()*100-50)+'px';
      confetti.append(chip);
    }
    element('book').prepend(confetti);
  }
  if (current === 3) {
    const field = element                  ('activity'); field.value = activity;
    bindForm(() => { activity = field.value.trim(); if (activity) go(4); else element('message').textContent = '写下你的答案吧。'; });
  }
  if (current === 5) {
    const field = element                  ('wins'); field.value = wins;
    bindForm(() => {
      wins = field.value.trim().normalize('NFKC');
      if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(wins)) { element('message').textContent = '请输入数字猪妞。。'; return; }
      go(Number(wins) === 385 ? 6 : 7);
    });
  }
  if (current === 12) {
    element('no').onclick = () => { element('message').textContent = '不行，你必须得想！'; };
    element('yes').onclick = () => { wishSent = false; animationDone = false; go(13); };
  }
  if (current === 13 && !wishSent) {
    const field = element                     ('wish'); field.value = wish;
    bindForm(() => {
      wish = field.value.trim();
      if (!wish) { element('message').textContent = '写点什么再寄出吧。'; return; }
      try { localStorage.setItem(wishKey,wish); } catch {}
      wishSent = true; field.blur(); render();
    });
  }
  if (document.getElementById('paper')) element('paper').textContent = wish;
  if (current === 13 && wishSent && !animationDone) {
    animationTimer = window.setTimeout(() => { animationDone = true; next.hidden = false; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 3000);
  }
  if (current === 14) {
    const match = location.hostname.match(/^([\w-]+)\.github\.io$/i);
    if (match) {
      const segment = location.pathname.split('/')[1];
      const repo = !segment || /\.html$/i.test(segment) ? location.hostname : segment;
      const link = element                   ('share');
      link.href = 'https://github.com/'+match[1]+'/'+repo+'/issues/new?title='+encodeURIComponent('奚曦的圣诞心愿')+'&body='+encodeURIComponent(wish);
      link.hidden = false; link.textContent = '在 GitHub 发布我的心愿 ↗';
    }
  }
}
element('book').addEventListener('click', e => {
  if (current !== 9 || reportOpen) return;
  const target = e.target;
  if (!(target instanceof Element) || target.closest('#back, #next')) return;
  reportOpen = true;
  page.innerHTML = content();
  page.focus({preventScroll:true});
  next.hidden = false;
});
next.onclick = () => {
  if (current === 14) { historyPages = []; current = 1; render(); } else advance();
};
back.onclick = previous;
document.addEventListener('keydown', e => {
  if ((e.target               ).matches('input,textarea,button,a')) return;
  if (['ArrowDown','PageDown','ArrowUp','PageUp'].includes(e.key)) {
    e.preventDefault(); if (['ArrowDown','PageDown'].includes(e.key)) advance(); else previous();
  }
});
let startY = 0, startX = 0, fromTop = false, fromBottom = false, ignoreTouch = false;
main.addEventListener('touchstart', e => {
  startY = e.touches[0].clientY; startX = e.touches[0].clientX;
  ignoreTouch = e.touches.length !== 1 || !!(e.target               ).closest('input,textarea,button,a');
  fromTop = main.scrollTop <= 2; fromBottom = main.scrollHeight-main.clientHeight-main.scrollTop <= 2;
}, {passive:true});
main.addEventListener('touchend', e => {
  const dy = e.changedTouches[0].clientY-startY;
  if (ignoreTouch || Math.abs(dy)<55 || Math.abs(dy)<Math.abs(e.changedTouches[0].clientX-startX)) return;
  if (dy<0 && fromBottom) advance(); else if (dy>0 && fromTop) previous();
}, {passive:true});
render(false);
