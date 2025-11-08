# Azure Test - User Management with DataVerse

Цей проект демонструє інтеграцію .NET Core Web API з Angular frontend та підключенням до Microsoft DataVerse.

## Структура проекту

- **Backend/** - .NET 8 Web API з Entity Framework Core
- **Frontend/** - Angular 18 з Angular Material
- **Docker** підтримка для контейнеризації
- **GitHub Actions** для CI/CD на Azure

## Налаштування DataVerse

### 1. Створення App Registration в Azure AD

1. Перейдіть до [Azure Portal](https://portal.azure.com)
2. Оберіть "Azure Active Directory" > "App registrations" > "New registration"
3. Заповніть форму:
   - Name: `Azure Test App`
   - Supported account types: `Accounts in this organizational directory only`
4. Після створення збережіть:
   - Application (client) ID
   - Directory (tenant) ID

### 2. Створення Client Secret

1. В App Registration перейдіть до "Certificates & secrets"
2. Натисніть "New client secret"
3. Додайте опис та оберіть термін дії
4. Збережіть значення секрету (воно показується тільки один раз!)

### 3. Налаштування дозволів для DataVerse

1. В App Registration перейдіть до "API permissions"
2. Натисніть "Add a permission"
3. Оберіть "Dynamics CRM"
4. Оберіть "Delegated permissions"
5. Виберіть "user_impersonation"
6. Натисніть "Add permissions"
7. Натисніть "Grant admin consent for [your tenant]"

### 4. Оновлення конфігурації

Оновіть файл `Backend/appsettings.json`:

```json
{
  "DataVerse": {
    "ServiceUrl": "https://YOUR_ENVIRONMENT.crm.dynamics.com/",
    "ClientId": "YOUR_APP_CLIENT_ID",
    "ClientSecret": "YOUR_CLIENT_SECRET",
    "TenantId": "YOUR_TENANT_ID"
  },
  "ConnectionStrings": {
    "DataVerseConnection": "AuthType=ClientSecret;Url=https://YOUR_ENVIRONMENT.crm.dynamics.com/;ClientId=YOUR_APP_CLIENT_ID;ClientSecret=YOUR_CLIENT_SECRET;"
  }
}
```

### 5. Створення таблиці Users в DataVerse

1. Перейдіть до [Power Platform admin center](https://admin.powerplatform.microsoft.com)
2. Оберіть ваше середовище
3. Перейдіть до "Tables"
4. Створіть нову таблицю "Users" з полями:
   - Name (Text)
   - LastName (Text) 
   - Role (Choice: Administrator, User, Manager, Viewer)

## Запуск проекту

### Backend (.NET)

```bash
cd Backend
dotnet restore
dotnet run
```

API буде доступне за адресою: http://localhost:5000

### Frontend (Angular)

```bash
cd Frontend
npm install
ng serve
```

Frontend буде доступний за адресою: http://localhost:4200

### Перевірка підключення до DataVerse

Після запуску backend, перевірте підключення:
- http://localhost:5000/api/health - загальний статус
- http://localhost:5000/api/health/dataverse - статус DataVerse

## Docker

### Локальна розробка з Docker Compose

```bash
docker-compose up --build
```

### Окремі контейнери

Backend:
```bash
cd Backend
docker build -t azure-test-backend .
docker run -p 5000:8080 azure-test-backend
```

Frontend:
```bash
cd Frontend  
docker build -t azure-test-frontend .
docker run -p 4200:80 azure-test-frontend
```

## Деплой на Azure

1. Fork цей репозиторій
2. Налаштуйте GitHub Secrets:
   - `AZURE_CREDENTIALS` - Service Principal для Azure
   - `REGISTRY_LOGIN_SERVER` - URL Azure Container Registry
   - `REGISTRY_USERNAME` - ім'я користувача ACR
   - `REGISTRY_PASSWORD` - пароль ACR
3. Push до main гілки автоматично запустить деплой

## API Endpoints

- `GET /api/users` - Отримати всіх користувачів
- `GET /api/users/{id}` - Отримати користувача за ID
- `POST /api/users` - Створити користувача
- `PUT /api/users/{id}` - Оновити користувача  
- `DELETE /api/users/{id}` - Видалити користувача
- `GET /api/health` - Статус API
- `GET /api/health/dataverse` - Статус DataVerse

## Технології

**Backend:**
- .NET 8
- Entity Framework Core
- Microsoft.PowerPlatform.Dataverse.Client
- Swagger/OpenAPI

**Frontend:**
- Angular 18
- Angular Material
- TypeScript
- RxJS

**Infrastructure:**
- Docker
- Azure Container Registry
- Azure Container Instances  
- GitHub Actions