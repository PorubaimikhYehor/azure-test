# GitHub Secrets Configuration

Для роботи CI/CD pipeline необхідно налаштувати наступні secrets в GitHub репозиторії:

## Azure Container Registry Secrets

1. **REGISTRY_LOGIN_SERVER**
   - Приклад: `myregistry.azurecr.io`
   - Отримати: Azure Portal > Container Registry > Access keys

2. **REGISTRY_USERNAME**
   - Username для Azure Container Registry
   - Отримати: Azure Portal > Container Registry > Access keys

3. **REGISTRY_PASSWORD**
   - Password для Azure Container Registry
   - Отримати: Azure Portal > Container Registry > Access keys

## Azure Service Principal

4. **AZURE_CREDENTIALS**
   - JSON з credentials для Service Principal
   - Формат:
   ```json
   {
     "clientId": "<your-client-id>",
     "clientSecret": "<your-client-secret>",
     "subscriptionId": "<your-subscription-id>",
     "tenantId": "<your-tenant-id>"
   }
   ```

### Створення Service Principal:

```bash
# Створити Service Principal
az ad sp create-for-rbac --name "azure-test-sp" \
  --role contributor \
  --scopes /subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group> \
  --sdk-auth

# Результат використайте як AZURE_CREDENTIALS
```

## DataVerse Configuration Secrets

5. **DATAVERSE_SERVICE_URL**
   - Приклад: `https://yourenvironment.crm.dynamics.com/`

6. **DATAVERSE_CLIENT_ID**
   - Application ID з Azure AD App Registration

7. **DATAVERSE_CLIENT_SECRET**
   - Client Secret з Azure AD App Registration

8. **DATAVERSE_TENANT_ID**
   - Tenant ID з Azure AD

## Як додати secrets в GitHub:

1. Перейдіть до репозиторію на GitHub
2. Settings > Secrets and variables > Actions
3. Натисніть "New repository secret"
4. Додайте кожен secret з відповідним значенням

## Azure Resources

Перед запуском pipeline створіть:

1. **Azure Container Registry**
   ```bash
   az acr create --resource-group azure-test-rg \
     --name azuretestregistry \
     --sku Basic \
     --admin-enabled true
   ```

2. **Resource Group**
   ```bash
   az group create --name azure-test-rg --location "East US"
   ```

## Тестування локально

Перевірте Docker builds локально:

```bash
# Backend
docker build -t azure-test-backend ./Backend

# Frontend  
docker build -t azure-test-frontend ./Frontend

# Docker Compose
docker-compose up --build
```