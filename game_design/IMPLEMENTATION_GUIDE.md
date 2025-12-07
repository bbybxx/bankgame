# 🎮 Bank Game - Руководство по реализации

> **Практический справочник** для разработчиков: где найти нужную информацию в дизайн-документах и как она применяется к коду.

---

## 📚 Структура документов

| Документ | Размер | Фокус | Читать когда... |
|----------|--------|-------|-----------------|
| **`DESIGN_DOCS_README.md`** | ~2KB | Обзор всей системы | ⭐ НАЧНИТЕ ОТСЮДА |
| **`plan.md`** | ~8KB | Экраны и базовые механики | Проектируете UI |
| **`ADVANCED_SYSTEMS.md`** | ~15KB | Долги, инвестиции, карьера | Реализуете финансовую логику |
| **`SYSTEMS_REFINEMENT.md`** | ~12KB | Недельные ходы, случайные траты | Добавляете динамику |
| **`COMPLETE_DESIGN_SYSTEM.md`** | ~15KB | Архитектура и интеграция | Планируете 12-недельный план |

---

## 🚀 Фазы реализации (12 недель)

### ✅ Фаза 1: Фундамент (Недели 1-2)

**Цель:** Расширить datastore и реализовать систему ходов

#### Что делать:
1. **Расширить типы в `src/types/index.ts`:**
   - Новые интерфейсы для Loans, Investments, JobMetrics
   - Новые поля в PlayerStats (creditScore, stress, happiness, prospects, NPCs)
   
   📖 **Читать:**
   - `ADVANCED_SYSTEMS.md` → Раздел "1. Debt Management & Credit System" (структуры Loan)
   - `SYSTEMS_REFINEMENT.md` → Раздел "1. Turn Granularity System" (GameTurn, interface GameState)
   - `COMPLETE_DESIGN_SYSTEM.md` → Раздел "State Management Architecture"

2. **Реализовать в `src/engine/gameLogic.ts`:**
   - `calculateTurnInfo()` - определить текущую неделю/месяц/год
   - `executeWeeklyTurn()` - основной цикл
   - `executeMonthlyClose()` - закрытие месяца
   
   📖 **Читать:**
   - `SYSTEMS_REFINEMENT.md` → "Turn Calculator" (функция calculateTurnInfo)
   - `SYSTEMS_REFINEMENT.md` → "Weekly Turn Flow" & "Monthly Close" (основная логика)

3. **Добавить в `src/store/gameStore.ts`:**
   - Состояние для текущего хода (currentTurn: GameTurn)
   - Состояние для начисления процентов
   
   📖 **Читать:**
   - `SYSTEMS_REFINEMENT.md` → "Interest Accrual: Weekly vs Monthly"

#### Контрольный список:
- [ ] Новые типы добавлены в types/index.ts
- [ ] calculateTurnInfo() работает корректно
- [ ] executeWeeklyTurn() скелет создан
- [ ] executeMonthlyClose() скелет создан
- [ ] Проверено: ход прогрессирует правильно
- [ ] Проверено: переход на 4-ю неделю = месячное закрытие

---

### 💰 Фаза 2: Финансовые системы (Недели 3-4)

**Цель:** Долги, инвестиции, случайные траты

#### Что делать:
1. **Система долгов (`src/engine/gameLogic.ts`):**
   - `calculateLoanRate(creditScore, loanType)` - расчет ставок
   - `payEarlyOnLoan(loan, amount)` - досрочное погашение
   - `refinanceLoan(loan, newScore)` - рефинансирование
   - `processLoanDelinquency()` - просрочки
   
   📖 **Читать:**
   - `ADVANCED_SYSTEMS.md` → "1. Debt Management & Credit System" (**полностью**)
     - Структуры Loan, PayEarlyResult
     - Динамический расчет ставок
     - Feature 1-4 (Early Payment, Refinancing, Personal Loans, Delinquency)

2. **Система инвестиций (`src/engine/gameLogic.ts`):**
   - Каталог инвестиций (stocks, bonds, crypto, real estate)
   - `buyInvestment()` - покупка
   - `sellInvestment()` - продажа
   - `updateInvestmentPrices()` - волатильность
   - `accrueMonthlyDividends()` - дивиденды
   
   📖 **Читать:**
   - `ADVANCED_SYSTEMS.md` → "2. Passive Income & Investments" (**полностью**)
     - Investment интерфейс и каталог
     - Purchase Flow и Market Volatility
     - Dividend accrual

3. **Случайные еженедельные траты:**
   - `applyWeeklyRandomExpenses()` - генерация случайных трат
   - `stressExpenseMultiplier()` - множитель на основе стресса
   - `generateStressReliefPurchase()` - покупки от стресса
   
   📖 **Читать:**
   - `SYSTEMS_REFINEMENT.md` → "2. Dynamic Random Expenses" (**полностью**)
     - weeklyExpenseTable и алгоритм
     - Spiral высокого стресса
     - Coping purchases

4. **Базовые расчеты:**
   - `calculateCreditScore()` - кредитный рейтинг
   - `calculateNetWorth()` - собственный капитал
   - `calculateDebtToIncomeRatio()` - долг/доход
   
   📖 **Читать:**
   - `COMPLETE_DESIGN_SYSTEM.md` → "Key Metrics & Their Calculation"
   - `ADVANCED_SYSTEMS.md` → "Delinquency & Collection" (Credit Score factors)

#### Контрольный список:
- [ ] Система долгов работает, ставки зависят от кредита
- [ ] Инвестиции покупаются/продаются
- [ ] Цены инвестиций обновляются еженедельно
- [ ] Случайные траты генерируются
- [ ] Кредитный рейтинг пересчитывается
- [ ] Процент и дивиденды начисляются правильно

---

### 👔 Фаза 3: Карьера и производительность (Недели 5-6)

**Цель:** Метрики производительности, повышения, увольнения

#### Что делать:
1. **Метрики производительности (`src/engine/gameLogic.ts`):**
   - `calculateJobPerformance()` - расчет performance 0-100
   - `monthlyJobReview()` - ежемесячная проверка
   - `triggerPromotionEvent()` - повышение
   - `triggerLayoffEvent()` - увольнение
   
   📖 **Читать:**
   - `ADVANCED_SYSTEMS.md` → "3. Job Performance Metrics" (**полностью**)
     - JobMetrics интерфейс
     - Performance calculation formula
     - Monthly Review и Events

2. **Система репутации NPC (`src/engine/gameLogic.ts`):**
   - `updateNPCRelationships()` - обновление отношений
   - `applyReputationEffects()` - эффекты репутации
   - `triggerNPCInteraction()` - взаимодействия
   
   📖 **Читать:**
   - `ADVANCED_SYSTEMS.md` → "5. NPC Reputation System" (**полностью**)
     - NPCRelationship структура
     - NPCRegistry (Karen, Sam, Emma)
     - Reputation effects на зарплату

#### Контрольный список:
- [ ] Performance рассчитывается на основе happiness/stress
- [ ] Повышения срабатывают при performance > 75 за 3 месяца
- [ ] Увольнения срабатывают при performance < 20 или stress > 95
- [ ] Репутация NPC обновляется еженедельно
- [ ] Эффекты репутации влияют на зарплату

---

### 🎨 Фаза 4: UI и прогрессия активов (Недели 7-8)

**Цель:** Новые экраны, система ярусов активов, фиды-бэк

#### Что делать:
1. **Система ярусов активов (`src/engine/gameLogic.ts`):**
   - Каталог жилья (tier 1-5)
   - Каталог машин (tier 1-5)
   - `upgradeHousing()` - улучшение жилья
   - `updateAvailableJobsBasedOnHousing()` - эффект жилья на должности
   
   📖 **Читать:**
   - `SYSTEMS_REFINEMENT.md` → "3. Asset Tier System & Progression" (**полностью**)
     - HousingTier, VehicleTier интерфейсы
     - Housing catalog
     - Impact on career

2. **Немедленный фидбэк (`src/components/`, `src/screens/`):**
   - Toast notifications для решений
   - Визуальные эффекты изменений
   - UI для двухслойного фидбэка (немедленное + отложенное)
   
   📖 **Читать:**
   - `SYSTEMS_REFINEMENT.md` → "4. Immediate Feedback Architecture" (**полностью**)
     - PlayerDecision интерфейс
     - Decision Resolution System
     - UI Toast Feedback

3. **Новые экраны/вкладки:**
   - Assets: кнопки [Pay Early], [Refinance]
   - Marketplace: вкладка "Loans" и "Investments"
   - Profile: Job Performance display
   - Chats: Reputation status
   
   📖 **Читать:**
   - `plan.md` → Раздел "Screens" (для макета)
   - `ADVANCED_SYSTEMS.md` → UI Location комментарии в коде

#### Контрольный список:
- [ ] Assets screen показывает опции досрочного погашения
- [ ] Marketplace имеет вкладки для кредитов и инвестиций
- [ ] Profile показывает performance и job metrics
- [ ] Toast notifications работают
- [ ] Жилищные ярусы влияют на доступные работы

---

### 🚨 Фаза 5: События и механики (Недели 9-10)

**Цель:** Red Zone, банкротство, каскадные события

#### Что делать:
1. **Red Zone механика:**
   - `checkGameStatus()` - определить статус игры
   - `processRedZone()` - обработка Red Zone
   - `offerBankruptcyRecovery()` - варианты выхода
   
   📖 **Читать:**
   - `ADVANCED_SYSTEMS.md` → "4. Red Zone Crisis & Bankruptcy" (**полностью**)
     - GameStatus enum
     - checkGameStatus logic
     - Recovery options

2. **Обработка запланированных эффектов:**
   - `processScheduledEffects()` - применение отложенных последствий
   - Хранилище для scheduled events
   
   📖 **Читать:**
   - `SYSTEMS_REFINEMENT.md` → "4. Immediate Feedback Architecture" → "Decision Resolution System"

3. **Генерация событий:**
   - `generateWeeklyMinorEvents()` - мелкие события
   - `generateMonthlyMajorEvents()` - крупные события
   - Таблица вероятностей в Event System
   
   📖 **Читать:**
   - `COMPLETE_DESIGN_SYSTEM.md` → "Event System Architecture"
   - `SYSTEMS_REFINEMENT.md` → "Integration & Testing" → "Testing Cascade Scenarios"

#### Контрольный список:
- [ ] Red Zone триггерится при negative balance < -$1000
- [ ] Forced asset sales работают
- [ ] Game Over срабатывает после 3 месяцев negative net worth
- [ ] Scheduled effects обрабатываются в правильный момент
- [ ] События не превышают заявленные % шансы

---

### 🎯 Фаза 6: Полировка и баланс (Недели 11-12)

**Цель:** Балансировка, краевые случаи, оптимизация

#### Что делать:
1. **Проверка баланса:**
   - Слишком ли легко выиграть?
   - Слишком ли сложно выжить?
   - Стресс-спираль пробивается?
   
   📖 **Читать:**
   - `COMPLETE_DESIGN_SYSTEM.md` → "Success Metrics"
   - `SYSTEMS_REFINEMENT.md` → "Testing Cascade Scenarios" (2 и 3)

2. **Обработка краевых случаев:**
   - Отрицательные активы
   - Макс стресс/счастье
   - Деление на ноль в расчетах
   
   📖 **Читать:**
   - `COMPLETE_DESIGN_SYSTEM.md` → "Known Limitations & Future Work"

3. **Оптимизация:**
   - Turn execution < 500ms
   - Ленивые вычисления для больших портфелей
   
   📖 **Читать:**
   - `COMPLETE_DESIGN_SYSTEM.md` → "Success Metrics" (Performance)

#### Контрольный список:
- [ ] Полный playthrough от старта до победы/поражения
- [ ] Баланс проверен: 60% победы, 40% поражения
- [ ] Нет краевых случаев с отрицательными значениями
- [ ] Performance в норме
- [ ] Mobile responsive

---

## 🔑 Ключевые разделы по темам

### 🏦 Финансовая система

| Система | Основной раздел | Дополнение |
|---------|-----------------|-----------|
| **Долги** | ADVANCED_SYSTEMS.md § 1 | COMPLETE_DESIGN_SYSTEM.md § Key Metrics |
| **Инвестиции** | ADVANCED_SYSTEMS.md § 2 | SYSTEMS_REFINEMENT.md § Investment Updates |
| **Процент/Дивиденды** | SYSTEMS_REFINEMENT.md § Interest Accrual | ADVANCED_SYSTEMS.md § 2 |
| **Кредитный рейтинг** | ADVANCED_SYSTEMS.md § 1 (Dynamic Interest) | COMPLETE_DESIGN_SYSTEM.md § Key Metrics |
| **Red Zone** | ADVANCED_SYSTEMS.md § 4 | COMPLETE_DESIGN_SYSTEM.md § Event System |

### 💼 Карьера и NPC

| Система | Основной раздел | Дополнение |
|---------|-----------------|-----------|
| **Производительность** | ADVANCED_SYSTEMS.md § 3 | COMPLETE_DESIGN_SYSTEM.md § Key Metrics |
| **Репутация NPC** | ADVANCED_SYSTEMS.md § 5 | DESIGN_DOCS_README.md § Key Connections |
| **Повышения/Увольнения** | ADVANCED_SYSTEMS.md § 3 (Monthly Review) | SYSTEMS_REFINEMENT.md § Testing § Scenario 2 |

### 🎮 Геймплей и UX

| Система | Основной раздел | Дополнение |
|---------|-----------------|-----------|
| **Система ходов** | SYSTEMS_REFINEMENT.md § 1 | COMPLETE_DESIGN_SYSTEM.md § Game Loop |
| **Случайные траты** | SYSTEMS_REFINEMENT.md § 2 | DESIGN_DOCS_README.md § Quick Start |
| **Активные ярусы** | SYSTEMS_REFINEMENT.md § 3 | plan.md § Housing/Vehicles |
| **Фидбэк** | SYSTEMS_REFINEMENT.md § 4 | DESIGN_DOCS_README.md § Decision Feedback |
| **События** | COMPLETE_DESIGN_SYSTEM.md § Event System | SYSTEMS_REFINEMENT.md § Integration § Testing |

---

## 📊 Метрики и их назначение

Все метрики описаны в **`COMPLETE_DESIGN_SYSTEM.md` → "Key Metrics & Their Calculation"**

| Метрика | Диапазон | Главное применение | Где читать |
|---------|----------|-------------------|-----------|
| **Happiness** | 0-100 | Влияет на производительность работы | COMPLETE_DESIGN_SYSTEM.md |
| **Stress** | 0-100 | Увеличивает случайные траты, ухудшает здоровье | SYSTEMS_REFINEMENT.md § 2 |
| **Prospects** | 0-100 | Открывает вакансии | plan.md § Job Market |
| **Credit Score** | 300-850 | Определяет ставки по кредитам | ADVANCED_SYSTEMS.md § 1 |
| **Net Worth** | Any | Условие победы/поражения | ADVANCED_DESIGN.md § 4 |

---

## 🎯 Типичные вопросы "Где найти?"

### "Как должна работать система процентов?"
→ `SYSTEMS_REFINEMENT.md` → "Interest Accrual: Weekly vs Monthly" + `ADVANCED_SYSTEMS.md` § 2

### "Какие события должны происходить еженедельно?"
→ `SYSTEMS_REFINEMENT.md` → "Weekly Turn Flow" + `COMPLETE_DESIGN_SYSTEM.md` → "Event Generation Probabilities"

### "Как связаны репутация и зарплата?"
→ `ADVANCED_SYSTEMS.md` § 5 → "applyReputationEffects()" + `DESIGN_DOCS_README.md` → "System Cascades"

### "Когда срабатывает Red Zone?"
→ `ADVANCED_SYSTEMS.md` § 4 → "checkGameStatus()" + `COMPLETE_DESIGN_SYSTEM.md` → "Game Status States"

### "Как выглядит экран Assets?"
→ `plan.md` → Раздел "Assets Screen" + `ADVANCED_SYSTEMS.md` → UI Location comments

### "Как работает фидбэк на решения?"
→ `SYSTEMS_REFINEMENT.md` § 4 → "Two-Layer Feedback System" + "Decisions That Give Immediate Feedback"

### "Какие вероятности событий?"
→ `COMPLETE_DESIGN_SYSTEM.md` → "Event Generation Probabilities (Per Week)"

### "Как прогрессируют активы (жилье, машины)?"
→ `SYSTEMS_REFINEMENT.md` § 3 → "Housing Tier System" + "Housing Impact on Career"

---

## 🔀 Каскады и взаимосвязи

### Стресс-спираль
1. Высокий стресс → `SYSTEMS_REFINEMENT.md` § 2
2. Увеличивает случайные траты → `SYSTEMS_REFINEMENT.md` § 2 → "Stress-Driven Expense Spiral"
3. Плохая производительность → `ADVANCED_SYSTEMS.md` § 3
4. Снижение зарплаты → `ADVANCED_SYSTEMS.md` § 3 → "monthlyJobReview()"
5. Еще больше стресса → круг замыкается

### Путь к победе
1. Начните с работы → `plan.md` § Job Market
2. Копите сбережения → `SYSTEMS_REFINEMENT.md` § Turn Flow
3. Инвестируйте → `ADVANCED_SYSTEMS.md` § 2
4. Получайте дивиденды → `ADVANCED_SYSTEMS.md` § 2 → "Dividend accrual"
5. Пассивный доход покрывает расходы → `COMPLETE_DESIGN_SYSTEM.md` § Progression Paths

### Recovery от кризиса
1. Увольнение → `ADVANCED_SYSTEMS.md` § 3 → "triggerLayoffEvent()"
2. Red Zone → `ADVANCED_SYSTEMS.md` § 4
3. Принять bankruptcy recovery → `ADVANCED_SYSTEMS.md` § 4 → "offerBankruptcyRecovery()"
4. Найти новую работу → `plan.md` § Job Market
5. Перестроиться → `COMPLETE_DESIGN_SYSTEM.md` § Progression Paths § "Crisis & Recovery"

---

## 📋 Чек-лист перед кодированием

Перед тем как начать каждую фазу:

- [ ] Прочитал основной раздел из таблицы выше
- [ ] Понимаю структуры данных (interfaces)
- [ ] Знаю формулы расчетов
- [ ] Знаю триггеры для событий
- [ ] Знаю, когда данные сохраняются в AsyncStorage
- [ ] Знаю, какие UI элементы нужны
- [ ] Понимаю каскадные эффекты на другие системы

---

## 🆘 Быстрая справка по файлам

```
📁 src/
├── 📄 engine/gameLogic.ts
│   ├─ calculateTurnInfo()         (SYSTEMS_REFINEMENT.md)
│   ├─ executeWeeklyTurn()         (SYSTEMS_REFINEMENT.md)
│   ├─ executeMonthlyClose()       (SYSTEMS_REFINEMENT.md)
│   ├─ calculateLoanRate()         (ADVANCED_SYSTEMS.md)
│   ├─ calculateJobPerformance()   (ADVANCED_SYSTEMS.md)
│   ├─ checkGameStatus()           (ADVANCED_SYSTEMS.md)
│   └─ updateInvestmentPrices()    (ADVANCED_SYSTEMS.md)
│
├── 📄 store/gameStore.ts
│   └─ useGameStore()              (COMPLETE_DESIGN_SYSTEM.md § State)
│
├── 📄 types/index.ts
│   ├─ PlayerStats               (COMPLETE_DESIGN_SYSTEM.md § State)
│   ├─ Loan                      (ADVANCED_SYSTEMS.md § 1)
│   ├─ Investment                (ADVANCED_SYSTEMS.md § 2)
│   ├─ NPCRelationship           (ADVANCED_SYSTEMS.md § 5)
│   └─ GameTurn                  (SYSTEMS_REFINEMENT.md § 1)
│
└── 📁 components/ & screens/
    └─ Используйте plan.md для макетов
```

---

## ⚡ Быстрый старт (первые 30 минут)

1. **5 мин:** Прочитайте `DESIGN_DOCS_README.md` целиком
2. **10 мин:** Посмотрите диаграмму в `COMPLETE_DESIGN_SYSTEM.md` → "Architecture Diagram"
3. **10 мин:** Прочитайте `SYSTEMS_REFINEMENT.md` → "1. Turn Granularity System" → "Hybrid Turn System"
4. **5 мин:** Посмотрите таблицу "Implementation Priority" в `COMPLETE_DESIGN_SYSTEM.md`
5. ✅ Готовы к Фазе 1!

---

**Версия:** 1.0  
**Статус:** Готово для реализации  
**Последнее обновление:** 6 декабря 2025 года
