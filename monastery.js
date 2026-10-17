document.addEventListener('DOMContentLoaded', () => {

  /* ====== Элементы ====== */
  const noteNames     = document.getElementById('noteNames');
  const notePetition  = document.getElementById('notePetition');
  const submitBtn     = document.getElementById('submitNoteBtn');
  const resetBtn      = document.getElementById('resetBtn');
  const notesList     = document.getElementById('notesList');
  const prayerText    = document.getElementById('prayerText');
  const noteHint      = document.getElementById('noteHint');
  const noteCountEl   = document.getElementById('noteCount');
  const namesCountEl  = document.getElementById('namesCount');
  const icons         = document.querySelectorAll('.icon');
  const typeRadios    = document.querySelectorAll('input[name="noteType"]');

  /* ====== Состояние ====== */
  let noteCount = 0;
  let namesCount = 0;
  let currentSaint = null;
  let currentSaintName = null;

  /* ====== Иконостас ====== */
  icons.forEach(icon => {
    icon.addEventListener('click', () => {
      icons.forEach(i => i.classList.remove('active'));
      icon.classList.add('active');
      currentSaint = icon.dataset.saint;
      currentSaintName = icon.dataset.name;
    });
  });

  /* ====== Текущий род поминовения ====== */
  function getCurrentType() {
    for (const r of typeRadios) {
      if (r.checked) return r.value;
    }
    return 'health';
  }

  /* ====== Молитвы ====== */
  const prayers = {
    health: {
      title: 'Молитва о здравии',
      text: `
        <p class="rubric">Молитва ко Господу о болящих:</p>
        <p>Владыко Вседержителю, Святый Царю, наказуяй и не умерщвляяй, утверждаяй низпадающия, и возводяй низверженныя, телесныя человеков скорби исправляяй; молимся Тебе, Боже наш, яко да наведеши милость Твою на елей сей, и на помазующияся от него во Имя Твое: да будет им во исцеление души же и тела, и во очищение и изменение всякия страсти, и всякаго недуга, и язи, и всякия скверны плоти и духа. Ей, Господи, врачебную Твою силу с небесе низпосли, прикоснися телеси, угаси огневицу, укроти страсть, и всякую немощь таящуюся. Буди врач раба Твоего (имярек), воздвигни его от одра болезненнаго и от ложа озлобления цела и всесовершенна, даруй его Церкви Твоей благоугождающа и творяща волю Твою. Твое бо есть, еже миловати и спасати ны, Боже наш, и Тебе славу возсылаем, Отцу и Сыну и Святому Духу, ныне и присно, и во веки веков. Аминь.</p>
        <p class="refrain">Господи, помилуй и исцели раба Твоего.</p>
      `
    },
    repose: {
      title: 'Молитва о упокоении',
      text: `
        <p class="rubric">Заупокойная молитва:</p>
        <p>Боже духов и всякия плоти, смерть поправый и диавола упразднивый, и живот миру Твоему даровавый! Сам, Господи, упокой души усопших раб Твоих (имярек) в месте светле, в месте злачне, в месте покойне, отнюдуже отбеже болезнь, печаль и воздыхание. Всякое согрешение, содеянное ими словом или делом или помышлением, яко благий и Человеколюбец Бог прости, яко несть человек, иже жив будет и не согрешит. Ты бо еси един кроме греха, правда Твоя — правда во веки, и слово Твое — истина. Яко Ты еси Воскресение, и Живот и Покой усопших раб Твоих, Христе Боже наш, и Тебе славу возсылаем со безначальным Твоим Отцем, и Пресвятым, и Благим, и Животворящим Твоим Духом, ныне и присно и во веки веков. Аминь.</p>
        <p class="refrain">Упокой, Господи, души усопших раб Твоих.</p>
      `
    }
  };

  /* ====== Экранирование HTML ====== */
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  /* ====== Валидация ====== */
  function validate() {
    const names = noteNames.value.trim();
    if (names.length === 0) {
      noteHint.textContent = 'Укажите имена — и записка будет подана.';
      noteHint.className = 'note-hint';
      return false;
    }
    noteHint.textContent = 'Записка готова. Подайте её.';
    noteHint.className = 'note-hint ok';
    return true;
  }

  noteNames.addEventListener('input', validate);

  /* ====== Подача записки ====== */
  submitBtn.addEventListener('click', () => {
    if (!validate()) {
      noteHint.className = 'note-hint error';
      noteNames.focus();
      return;
    }

    const type = getCurrentType();
    const names = noteNames.value.trim();
    const petition = notePetition.value.trim();

    // Подсчёт имён (по запятым или по строкам)
    const namesArray = names.split(/[,\n]/).map(n => n.trim()).filter(n => n.length > 0);
    const count = namesArray.length;

    // Формируем записку
    const typeLabel = type === 'health' ? 'О здравии' : 'О упокоении';
    const typeClass = type === 'health' ? 'health' : 'repose';

    const noteHTML = `
      <div class="note-paper">
        <div class="note-header">
          <span class="note-type-badge ${typeClass}">${typeLabel}</span>
        </div>
        <div class="note-names">${escapeHtml(names)}</div>
        ${petition ? `<div class="note-petition">Прошение: ${escapeHtml(petition)}</div>` : ''}
      </div>
    `;

    // Если первая записка — убираем placeholder
    if (notesList.querySelector('.placeholder')) {
      notesList.innerHTML = '';
    }

    notesList.insertAdjacentHTML('afterbegin', noteHTML);

    noteCount++;
    namesCount += count;
    noteCountEl.textContent = noteCount;
    namesCountEl.textContent = namesCount;

    // Молитва по роду
    const data = prayers[type];
    prayerText.innerHTML = `<h3>${data.title}</h3>${data.text}`;

    // Очистка
    noteNames.value = '';
    notePetition.value = '';
    noteHint.textContent = 'Записка подана. Вознесите молитву.';
    noteHint.className = 'note-hint ok';

    // Прокрутка к запискам
    notesList.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ====== Сброс ====== */
  resetBtn.addEventListener('click', () => {
    notesList.innerHTML = '<p class="placeholder">Записки ещё не поданы.</p>';
    noteCount = 0;
    namesCount = 0;
    noteCountEl.textContent = 0;
    namesCountEl.textContent = 0;

    prayerText.innerHTML = '<p class="placeholder">Выберите род поминовения — и здесь явится молитва.</p>';

    noteNames.value = '';
    notePetition.value = '';
    noteHint.textContent = 'Укажите имена — и записка будет подана.';
    noteHint.className = 'note-hint';

    icons.forEach(i => i.classList.remove('active'));
    currentSaint = null;
    currentSaintName = null;
  });

  // Инициализация
  validate();
});