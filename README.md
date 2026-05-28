# Tapsyrys

> Пет-проект, не судите строго :)

B2B-платформа для управления организациями, товарами и заказами. Фронтенд написан на React + TypeScript, бэкенд — отдельный Java-сервис.

## Стек

| Технология | Назначение |
|---|---|
| React 18 + TypeScript | UI |
| Vite | Сборка |
| Tailwind CSS | Стили |
| React Router v6 | Маршрутизация |
| TanStack Query v5 | Серверное состояние / кэш |
| Zustand | Клиентское состояние |
| Axios | HTTP-клиент |
| React Leaflet | Карты |
| i18next | Мультиязычность (KZ / RU / EN) |
| react-hot-toast | Уведомления |

## Функциональность

- Аутентификация (JWT, хранение в `localStorage`)
- Роли: `ADMIN` и обычный пользователь
- Управление организациями (создание, просмотр всех, назначение пользователей)
- Каталог товаров и категорий
- Корзина и оформление заказов
- Отдельные представления заказов для магазина и поставщика
- Дашборд с аналитикой
- Переключение языка интерфейса

## Структура проекта

```
src/
├── components/     # Переиспользуемые компоненты (layout, ui, ProtectedRoute)
├── contexts/       # AuthContext
├── hooks/          # Кастомные хуки (useProducts, useOrders, useAuth…)
├── i18n/           # Локализация (kz / ru / en)
├── lib/            # Настройка axios
├── pages/          # Страницы приложения
├── services/       # API-сервисы
├── store/          # Zustand-сторы
└── types/          # TypeScript-типы
```

## Запуск локально

```bash
# 1. Клонировать репозиторий
git clone <repo-url>
cd tapsyrys-react

# 2. Установить зависимости
npm install

# 3. Настроить окружение
cp .env.example .env
# В .env указать адрес бэкенда:
# VITE_API_URL=http://localhost:8080

# 4. Запустить dev-сервер
npm run dev
```

## Переменные окружения

| Переменная | Описание | Пример |
|---|---|---|
| `VITE_API_URL` | Базовый URL бэкенд-API | `http://localhost:8080` |

## Сборка

```bash
npm run build   # собрать в dist/
npm run preview # предпросмотр production-сборки
```

## Деплой

Проект задеплоен на [Vercel](https://vercel.com). Конфигурация в [vercel.json](vercel.json).

Бэкенд (Java) хостится на Render: `https://tapsyrys-java.onrender.com`
