import { useState, type ReactNode } from 'react'
import {
  AiBadge,
  AiNote,
  AskInput,
  Button,
  Card,
  Chip,
  Compare,
  CompareCell,
  FieldLabel,
  FieldList,
  Heading,
  Hint,
  Lead,
  List,
  ListRow,
  LiveStatus,
  Logo,
  Mark,
  PoolBar,
  Scale,
  SegmentedControl,
  Stat,
  StatGroup,
  Stepper,
  Summary,
  Tag,
  TagGroup,
  TextLink,
  Timeline,
  TrustBadge,
} from '@/shared/ui'
import s from './UiKitPage.module.scss'

// Витрина компонентов дизайн-системы (только для разработки).
// Тексты и цифры — демо-данные из макета дизайнера.

const STEPS = ['Запрос', 'Пул', 'Доля', 'Сбор', 'Сделка']

const POOL = [
  { id: 'nur', value: 4, title: 'Магазин «Нур» · 4 т' },
  { id: 'sabr', value: 3, title: 'Магазин «Сабр» · 3 т' },
  { id: 'kamol', value: 3, title: 'Магазин «Камол» · 3 т' },
  { id: 'dilshod', value: 2, title: 'Магазин «Дилшод» · 2 т' },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={s.section}>
      <h2 className={s.sectionTitle}>{title}</h2>
      <div className={s.demo}>{children}</div>
    </section>
  )
}

export function UiKitPage() {
  const [step, setStep] = useState(1)
  const [share, setShare] = useState(3)
  const [way, setWay] = useState<'truck' | 'self'>('truck')
  const [query, setQuery] = useState('Нужно 3 т муки в Фергану до 15 ноября')
  const [changed, setChanged] = useState(false)
  const [live, setLive] = useState<'active' | 'alert' | 'done'>('active')

  return (
    <main className={s.page}>
      <header className={s.header}>
        <Logo>Биржа доверия</Logo>
        <Stepper
          steps={STEPS}
          current={step}
          onSelect={setStep}
          aria-label="Шаги покупки"
        />
        <TrustBadge score={42} level="low" />
      </header>

      <Section title="Типографика">
        <Heading>
          Купите муку <Mark>вместе</Mark>
        </Heading>
        <Lead>
          Напишите как обычно говорите: товар, сколько, куда и к какому дню.
        </Lead>
        <Heading level={2}>Почему эти магазины</Heading>
      </Section>

      <Section title="Кнопки и ссылки">
        <div className={s.row}>
          <Button withArrow>Присоединиться к пулу</Button>
          <Button variant="ghost">Назад</Button>
          <Button withArrow disabled>
            К сделке
          </Button>
          <TextLink>Показать сбор пула ещё раз</TextLink>
        </div>
      </Section>

      <Section title="Поле запроса и чипы">
        <AskInput
          className={s.wide}
          label="Что нужно купить"
          value={query}
          onChange={setQuery}
          onSubmit={() => setQuery('')}
          submitLabel="Найти"
        />
        <div className={s.row}>
          <Chip dotColor="var(--flour)">Мука</Chip>
          <Chip dotColor="var(--sugar)">Сахар</Chip>
          <Chip dotColor="var(--cement)">Цемент</Chip>
        </div>
      </Section>

      <Section title="Переключатели">
        <FieldLabel>Сколько тонн муки</FieldLabel>
        <SegmentedControl
          aria-label="Сколько тонн"
          value={share}
          onChange={setShare}
          options={[
            { value: 2, label: '2 т' },
            { value: 3, label: '3 т' },
            { value: 5, label: '5 т' },
          ]}
        />
        <SegmentedControl
          aria-label="Как получите"
          value={way}
          onChange={setWay}
          options={[
            { value: 'truck', label: 'Привезут', icon: 'truck' },
            { value: 'self', label: 'Заберу сам', icon: 'box' },
          ]}
        />
        <Hint>Одна машина развезёт всех по маршруту 14 ноября.</Hint>
      </Section>

      <Section title="ИИ">
        <div className={s.row}>
          <AiBadge>ИИ понял</AiBadge>
          <AiBadge thinking>Разбираю запрос</AiBadge>
        </div>
        <AiNote
          className={s.wide}
          badge="ИИ нашёл пул"
          title="Ещё 4 магазина рядом ищут ту же муку"
          text="Вместе вам нужно 12 т, с вашими — 15 из 20. Это целая машина с мелькомбината по оптовой цене."
          reveal
        >
          <Compare>
            <CompareCell
              label="Покупать одному"
              value="16,2 млн сум"
              caption="3 т и отдельная машина"
            />
            <CompareCell
              label="В пуле"
              value="14,5 млн сум"
              caption="дешевле на 1 734 000 сум"
              highlighted
            />
          </Compare>
        </AiNote>
        <AiNote
          className={s.wide}
          badge="ИИ понял"
          title="Проверьте, всё ли верно"
        >
          <FieldList
            items={[
              { label: 'Товар', value: 'Мука высшего сорта' },
              { label: 'Сколько', value: '3 т' },
              { label: 'Куда', value: 'Фергана' },
            ]}
          />
        </AiNote>
      </Section>

      <Section title="Пул">
        <PoolBar
          className={s.wide}
          aria-label="Собрано 15 из 20 т"
          total={20}
          segments={[...POOL, { id: 'you', value: share, variant: 'you' }]}
        />
        <PoolBar
          className={s.wide}
          size="lg"
          aria-label="Собрано 12 из 20 т"
          total={20}
          segments={POOL.map((p) =>
            p.id === 'sabr' ? { ...p, variant: 'leaving' as const } : p,
          )}
        />
        <div className={s.row}>
          <LiveStatus status={live}>
            {live === 'done' ? 'Пул собран' : 'Ищем ещё 5 т'}
          </LiveStatus>
          <TextLink
            onClick={() =>
              setLive((v) =>
                v === 'active' ? 'alert' : v === 'alert' ? 'done' : 'active',
              )
            }
          >
            Сменить статус
          </TextLink>
        </div>
      </Section>

      <Section title="Карточки, теги, список">
        <Card className={s.wide}>
          <Heading level={2}>Почему эти магазины</Heading>
          <TagGroup>
            <Tag icon="grain">Та же мука</Tag>
            <Tag icon="pin">Все рядом, до 5 км</Tag>
            <Tag icon="calendar">Нужна к 15 ноября</Tag>
          </TagGroup>
          <List>
            <ListRow
              title="Магазин «Нур»"
              meta="3 км от вас"
              value="4 т"
              trailing={<TrustBadge score={81} level="high" />}
            />
            <ListRow
              title="Магазин «Барака»"
              youLabel="вы"
              meta="Фергана"
              value="3 т"
              trailing={<TrustBadge score={42} level="low" />}
            />
            <ListRow
              title="Магазин «Сабр»"
              meta="5 км от вас"
              value="выбыл"
              out
              trailing={<TrustBadge score={63} level="mid" />}
            />
          </List>
        </Card>
      </Section>

      <Section title="Деньги (island)">
        <Card variant="island" className={s.wide}>
          <Summary
            rows={[
              { label: 'Мука, 3 т по оптовой цене', value: '14 196 000 сум' },
              { label: 'Доставка, ваша часть', value: '270 000 сум' },
            ]}
            total={{ label: 'Итого', value: '14 466 000 сум' }}
          />
          <Scale
            position={47}
            startLabel="15% — новичок"
            endLabel="0% — рейтинг 90"
            aria-label="Залог 8% из возможных 15%"
          />
        </Card>
        <Card variant="island" className={s.wide}>
          <StatGroup>
            <Stat
              label="Рейтинг доверия"
              value={changed ? 48 : 42}
              delta="+6"
              previous="было 42"
              showChange={changed}
            />
            <Stat
              label="Залог в следующий раз"
              value={changed ? '7%' : '8%'}
              delta="−1%"
              previous="было 8%"
              showChange={changed}
            />
          </StatGroup>
        </Card>
        <Button variant="ghost" onClick={() => setChanged((v) => !v)}>
          {changed ? 'Сбросить' : 'Показать изменение'}
        </Button>
      </Section>

      <Section title="Этапы сделки">
        <Timeline
          items={[
            {
              status: 'done',
              title: 'Залог внесён',
              description: 'на гарантийном счёте биржи',
            },
            {
              status: 'done',
              title: 'Пул собран',
              description: '6 покупателей, 20 т, одна машина',
            },
            {
              status: 'current',
              title: 'Доставка',
              description: 'Машина приедет 14 ноября',
            },
            { status: 'pending', title: 'Оплата остатка' },
          ]}
        />
      </Section>
    </main>
  )
}
