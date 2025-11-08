using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IDataVerseService _dataVerseService;

    public HealthController(IDataVerseService dataVerseService)
    {
        _dataVerseService = dataVerseService;
    }

    [HttpGet]
    public async Task<ActionResult> GetHealth()
    {
        var health = new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
        };

        return Ok(health);
    }

    [HttpGet("dataverse")]
    public async Task<ActionResult> CheckDataVerse()
    {
        try
        {
            var isConnected = await _dataVerseService.TestConnectionAsync();
            
            var result = new
            {
                Status = isConnected ? "Connected" : "Disconnected",
                Timestamp = DateTime.UtcNow,
                Message = isConnected ? "DataVerse connection successful" : "DataVerse connection failed"
            };

            return isConnected ? Ok(result) : BadRequest(result);
        }
        catch (Exception ex)
        {
            var errorResult = new
            {
                Status = "Error",
                Timestamp = DateTime.UtcNow,
                Message = ex.Message
            };

            return StatusCode(500, errorResult);
        }
    }
}