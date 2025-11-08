using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Extensions.Configuration;

namespace Backend.Services;

public interface IDataVerseService
{
    Task<ServiceClient> GetServiceClientAsync();
    Task<bool> TestConnectionAsync();
}

public class DataVerseService : IDataVerseService
{
    private readonly IConfiguration _configuration;
    private ServiceClient? _serviceClient;

    public DataVerseService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task<ServiceClient> GetServiceClientAsync()
    {
        if (_serviceClient == null)
        {
            var connectionString = _configuration.GetConnectionString("DataVerseConnection");
            
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("DataVerse connection string is not configured");
            }

            _serviceClient = new ServiceClient(connectionString);
            
            if (!_serviceClient.IsReady)
            {
                throw new InvalidOperationException($"DataVerse connection failed. Check your connection string and credentials.");
            }
        }

        return Task.FromResult(_serviceClient);
    }

    public async Task<bool> TestConnectionAsync()
    {
        try
        {
            var client = await GetServiceClientAsync();
            return client.IsReady;
        }
        catch
        {
            return false;
        }
    }

    public void Dispose()
    {
        _serviceClient?.Dispose();
    }
}